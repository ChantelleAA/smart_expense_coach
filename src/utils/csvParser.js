// csvParser.js - Parse CSV bank statements with intelligent column detection

import Papa from 'papaparse';
import { parseISO, parse, isValid } from 'date-fns';

// Common column name patterns
const DATE_PATTERNS = [
  'date', 'transaction date', 'posting date', 'trans date', 
  'value date', 'trans. date', 'dated', 'transaction_date'
];

const DESCRIPTION_PATTERNS = [
  'description', 'details', 'merchant', 'payee', 'narrative',
  'transaction details', 'trans description', 'memo', 'particulars'
];

const DEBIT_PATTERNS = [
  'debit', 'debits', 'withdrawal', 'withdrawals', 'spent',
  'debit amount', 'money out', 'payment'
];

const CREDIT_PATTERNS = [
  'credit', 'credits', 'deposit', 'deposits', 'received',
  'credit amount', 'money in', 'incoming'
];

const AMOUNT_PATTERNS = [
  'amount', 'transaction amount', 'value', 'total',
  'trans amount', 'transaction_amount'
];

const BALANCE_PATTERNS = [
  'balance', 'closing balance', 'running balance', 'account balance'
];

// Date format patterns to try
const DATE_FORMATS = [
  'yyyy-MM-dd',
  'MM/dd/yyyy',
  'dd/MM/yyyy',
  'yyyy/MM/dd',
  'dd-MM-yyyy',
  'MM-dd-yyyy',
  'dd MMM yyyy',
  'MMM dd, yyyy',
  'dd/MM/yy',
  'MM/dd/yy',
];

export function parseCSV(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false, // Keep as strings for better control
      complete: (results) => {
        try {
          const parsed = processCSVData(results.data, results.meta.fields);
          resolve(parsed);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}

function processCSVData(rows, headers) {
  // Detect column mappings
  const mapping = detectColumns(headers);
  
  if (!mapping.date || !mapping.description) {
    throw new Error('Could not detect date and description columns. Please map columns manually.');
  }

  // Parse transactions
  const transactions = [];
  const errors = [];

  rows.forEach((row, index) => {
    try {
      const transaction = parseTransaction(row, mapping);
      if (transaction) {
        transactions.push(transaction);
      }
    } catch (error) {
      errors.push({ row: index + 1, error: error.message });
    }
  });

  return {
    transactions,
    mapping,
    errors,
    headers,
    success: transactions.length > 0
  };
}

function detectColumns(headers) {
  const mapping = {};
  
  const normalizedHeaders = headers.map(h => 
    h ? h.toLowerCase().trim() : ''
  );

  // Find date column
  mapping.date = findColumn(normalizedHeaders, DATE_PATTERNS);
  
  // Find description column
  mapping.description = findColumn(normalizedHeaders, DESCRIPTION_PATTERNS);
  
  // Find amount columns
  mapping.debit = findColumn(normalizedHeaders, DEBIT_PATTERNS);
  mapping.credit = findColumn(normalizedHeaders, CREDIT_PATTERNS);
  mapping.amount = findColumn(normalizedHeaders, AMOUNT_PATTERNS);
  
  // Find balance column (optional)
  mapping.balance = findColumn(normalizedHeaders, BALANCE_PATTERNS);

  return mapping;
}

function findColumn(headers, patterns) {
  for (const pattern of patterns) {
    const index = headers.findIndex(h => h === pattern || h.includes(pattern));
    if (index !== -1) {
      return headers[index];
    }
  }
  return null;
}

function parseTransaction(row, mapping) {
  const dateStr = row[mapping.date];
  if (!dateStr) return null;

  // Parse date
  const date = parseDate(dateStr);
  if (!date) {
    throw new Error(`Invalid date format: ${dateStr}`);
  }

  // Parse amount
  let amount = 0;
  let isDebit = false;

  if (mapping.amount) {
    // Single amount column
    const amountStr = row[mapping.amount];
    const parsed = parseAmount(amountStr);
    amount = Math.abs(parsed);
    isDebit = parsed < 0;
  } else if (mapping.debit || mapping.credit) {
    // Separate debit/credit columns
    const debitStr = mapping.debit ? row[mapping.debit] : '';
    const creditStr = mapping.credit ? row[mapping.credit] : '';
    
    const debit = parseAmount(debitStr);
    const credit = parseAmount(creditStr);
    
    if (debit !== 0) {
      amount = Math.abs(debit);
      isDebit = true;
    } else if (credit !== 0) {
      amount = Math.abs(credit);
      isDebit = false;
    }
  }

  if (amount === 0) return null; // Skip zero-amount transactions

  // Get description
  const description = row[mapping.description] || 'Unknown transaction';

  // Get balance (optional)
  const balance = mapping.balance ? parseAmount(row[mapping.balance]) : null;

  return {
    id: generateId(),
    date: date.toISOString(),
    description: description.trim(),
    amount,
    type: isDebit ? 'debit' : 'credit',
    balance,
    category: null, // Will be set by categorizer
    userCategory: null,
    originalRow: row
  };
}

function parseDate(dateStr) {
  if (!dateStr) return null;

  // Try ISO format first
  const isoDate = parseISO(dateStr);
  if (isValid(isoDate)) return isoDate;

  // Try various formats
  for (const format of DATE_FORMATS) {
    try {
      const parsed = parse(dateStr, format, new Date());
      if (isValid(parsed)) return parsed;
    } catch (e) {
      // Continue to next format
    }
  }

  return null;
}

function parseAmount(amountStr) {
  if (!amountStr || amountStr.toString().trim() === '') return 0;

  // Remove currency symbols and commas
  const cleaned = amountStr.toString()
    .replace(/[$£€¥₹,\s]/g, '')
    .replace(/[()]/g, '') // Remove parentheses
    .trim();

  // Check if it's a negative number (parentheses often indicate negative)
  const isNegative = amountStr.toString().includes('(') && amountStr.toString().includes(')');

  const number = parseFloat(cleaned);
  
  if (isNaN(number)) return 0;
  
  return isNegative ? -Math.abs(number) : number;
}

function generateId() {
  return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function detectColumnMapping(headers, sampleRows) {
  const normalizedHeaders = headers.map(h => 
    h ? h.toLowerCase().trim() : ''
  );

  const suggestions = {
    date: findColumn(normalizedHeaders, DATE_PATTERNS),
    description: findColumn(normalizedHeaders, DESCRIPTION_PATTERNS),
    debit: findColumn(normalizedHeaders, DEBIT_PATTERNS),
    credit: findColumn(normalizedHeaders, CREDIT_PATTERNS),
    amount: findColumn(normalizedHeaders, AMOUNT_PATTERNS),
    balance: findColumn(normalizedHeaders, BALANCE_PATTERNS)
  };

  return {
    headers,
    suggestions,
    needsManualMapping: !suggestions.date || !suggestions.description
  };
}

export function parseWithMapping(rows, headers, userMapping) {
  const mapping = {
    date: headers[userMapping.dateColumn],
    description: headers[userMapping.descriptionColumn],
    debit: userMapping.debitColumn !== null ? headers[userMapping.debitColumn] : null,
    credit: userMapping.creditColumn !== null ? headers[userMapping.creditColumn] : null,
    amount: userMapping.amountColumn !== null ? headers[userMapping.amountColumn] : null,
    balance: userMapping.balanceColumn !== null ? headers[userMapping.balanceColumn] : null
  };

  const transactions = [];
  const errors = [];

  rows.forEach((row, index) => {
    try {
      const transaction = parseTransaction(row, mapping);
      if (transaction) {
        transactions.push(transaction);
      }
    } catch (error) {
      errors.push({ row: index + 1, error: error.message });
    }
  });

  return {
    transactions,
    mapping,
    errors,
    success: transactions.length > 0
  };
}
