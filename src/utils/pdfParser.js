// pdfParser.js - Extract and parse transactions from text-based PDF bank statements

import * as pdfjsLib from 'pdfjs-dist';

// Set worker path (will be handled by Vite)
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export async function extractTextFromPDF(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    const pages = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      pages.push(pageText);
      fullText += pageText + '\n';
    }

    return {
      text: fullText,
      pages,
      numPages: pdf.numPages,
      success: true
    };
  } catch (error) {
    console.error('PDF extraction error:', error);
    return {
      text: '',
      pages: [],
      numPages: 0,
      success: false,
      error: error.message
    };
  }
}

export function detectPDFFormat(text) {
  const lines = text.split('\n').filter(line => line.trim());
  
  // Check if this looks like a bank statement
  const hasDatePattern = /\d{1,2}[-/]\d{1,2}[-/]\d{2,4}/.test(text);
  const hasAmountPattern = /\d+\.\d{2}/.test(text);
  const hasCommonBankTerms = /(transaction|balance|debit|credit|deposit|withdrawal)/i.test(text);

  if (!hasDatePattern || !hasAmountPattern) {
    return {
      isValid: false,
      message: 'This PDF does not appear to contain transaction data. Please use a CSV file instead.'
    };
  }

  // Try to detect date and amount formats
  const dateFormats = detectDateFormat(text);
  const amountFormat = detectAmountFormat(text);

  return {
    isValid: hasDatePattern && hasAmountPattern && hasCommonBankTerms,
    dateFormats,
    amountFormat,
    sampleLines: lines.slice(0, 20)
  };
}

function detectDateFormat(text) {
  const formats = [];
  
  // DD/MM/YYYY or DD-MM-YYYY
  if (/\d{2}[/-]\d{2}[/-]\d{4}/.test(text)) {
    formats.push('DD/MM/YYYY or DD-MM-YYYY');
  }
  
  // MM/DD/YYYY or MM-DD-YYYY
  if (/\d{2}[/-]\d{2}[/-]\d{4}/.test(text)) {
    formats.push('MM/DD/YYYY or MM-DD-YYYY');
  }
  
  // YYYY-MM-DD
  if (/\d{4}-\d{2}-\d{2}/.test(text)) {
    formats.push('YYYY-MM-DD');
  }

  return formats.length > 0 ? formats : ['Unknown'];
}

function detectAmountFormat(text) {
  // Check for comma vs period as decimal separator
  if (/\d{1,3},\d{3}\.\d{2}/.test(text)) {
    return 'US format (1,234.56)';
  }
  if (/\d{1,3}\.\d{3},\d{2}/.test(text)) {
    return 'European format (1.234,56)';
  }
  return 'Standard (123.45)';
}

export function parseTransactionsFromPDF(text, userConfig = {}) {
  const lines = text.split('\n').filter(line => line.trim());
  const transactions = [];
  const errors = [];

  // Common PDF transaction patterns
  // Format: DATE DESCRIPTION DEBIT CREDIT BALANCE
  const patterns = [
    // DD/MM/YYYY Description 123.45
    /(\d{2}[-/]\d{2}[-/]\d{4})\s+(.+?)\s+([\d,]+\.\d{2})/g,
    // DD MMM YYYY Description 123.45
    /(\d{2}\s+[A-Z][a-z]{2}\s+\d{4})\s+(.+?)\s+([\d,]+\.\d{2})/g,
  ];

  lines.forEach((line, index) => {
    try {
      const transaction = parseTransactionLine(line, userConfig);
      if (transaction) {
        transactions.push({
          ...transaction,
          id: `pdf_tx_${Date.now()}_${index}`
        });
      }
    } catch (error) {
      errors.push({ line: index + 1, text: line, error: error.message });
    }
  });

  return {
    transactions,
    errors,
    success: transactions.length > 0,
    totalLines: lines.length,
    parsedLines: transactions.length
  };
}

function parseTransactionLine(line, config) {
  // This is a simplified parser - real PDFs vary widely
  // Users should prefer CSV for reliability
  
  const parts = line.trim().split(/\s+/);
  if (parts.length < 3) return null;

  // Try to find a date
  const datePattern = /\d{2}[-/]\d{2}[-/]\d{4}|\d{2}\s+[A-Z][a-z]{2}\s+\d{4}/;
  const dateMatch = line.match(datePattern);
  if (!dateMatch) return null;

  const dateStr = dateMatch[0];
  
  // Try to find amounts (last 2-3 numbers are usually amounts)
  const amountPattern = /[\d,]+\.\d{2}/g;
  const amounts = line.match(amountPattern);
  if (!amounts || amounts.length === 0) return null;

  // Extract description (between date and amounts)
  const afterDate = line.substring(dateMatch.index + dateStr.length);
  const firstAmount = amounts[0];
  const amountIndex = afterDate.indexOf(firstAmount);
  const description = afterDate.substring(0, amountIndex).trim();

  if (!description) return null;

  // Parse the amount
  const amount = parseFloat(amounts[0].replace(/,/g, ''));
  
  // Determine if debit or credit (this is tricky without context)
  // Usually, if there are two amounts, first is debit, second is balance
  // If one amount, it could be either
  const isDebit = amounts.length === 1 ? true : amount > 0;

  return {
    date: new Date(dateStr).toISOString(),
    description: description.substring(0, 100), // Limit length
    amount: Math.abs(amount),
    type: isDebit ? 'debit' : 'credit',
    category: null,
    userCategory: null,
    source: 'pdf'
  };
}

export function validatePDFExtraction(result) {
  if (!result.success) {
    return {
      valid: false,
      message: 'Failed to extract text from PDF. This might be a scanned document. Please use a CSV file for best results.'
    };
  }

  if (result.text.length < 100) {
    return {
      valid: false,
      message: 'PDF appears to be empty or contains very little text. Please ensure this is a text-based PDF, not a scanned image.'
    };
  }

  const formatCheck = detectPDFFormat(result.text);
  
  if (!formatCheck.isValid) {
    return {
      valid: false,
      message: formatCheck.message || 'PDF format not recognized. CSV files are recommended for reliable parsing.'
    };
  }

  return {
    valid: true,
    formatInfo: formatCheck
  };
}
