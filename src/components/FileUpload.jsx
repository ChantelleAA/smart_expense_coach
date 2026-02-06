// FileUpload.jsx - File upload component with CSV and PDF support

import { useState, useRef } from 'react';
import { parseCSV } from '../utils/csvParser';
import { extractTextFromPDF, validatePDFExtraction, parseTransactionsFromPDF } from '../utils/pdfParser';

export default function FileUpload({ onTransactionsUploaded, compact = false }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [parseResult, setParseResult] = useState(null);
  const fileInputRef = useRef(null);

  function handleDragOver(e) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setIsDragging(false);
  }

  async function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await processFile(files[0]);
    }
  }

  async function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      await processFile(files[0]);
    }
  }

  async function processFile(file) {
    setIsProcessing(true);
    setError(null);
    setParseResult(null);

    try {
      const fileType = file.name.toLowerCase();

      if (fileType.endsWith('.csv')) {
        await processCSV(file);
      } else if (fileType.endsWith('.pdf')) {
        await processPDF(file);
      } else {
        throw new Error('Unsupported file type. Please upload a CSV or PDF file.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  }

  async function processCSV(file) {
    try {
      const result = await parseCSV(file);
      
      if (!result.success || result.transactions.length === 0) {
        throw new Error('No transactions found in CSV file. Please check the file format.');
      }

      setParseResult({
        type: 'csv',
        transactions: result.transactions,
        count: result.transactions.length,
        errors: result.errors
      });

      // Auto-upload if successful
      onTransactionsUploaded(result.transactions);
      
    } catch (err) {
      throw new Error(`CSV parsing error: ${err.message}`);
    }
  }

  async function processPDF(file) {
    try {
      const extraction = await extractTextFromPDF(file);
      const validation = validatePDFExtraction(extraction);

      if (!validation.valid) {
        throw new Error(validation.message);
      }

      const result = parseTransactionsFromPDF(extraction.text);

      if (!result.success || result.transactions.length === 0) {
        throw new Error(
          'Could not parse transactions from this PDF. PDF bank statements vary widely in format. For best results, please export a CSV file from your bank instead.'
        );
      }

      setParseResult({
        type: 'pdf',
        transactions: result.transactions,
        count: result.transactions.length,
        errors: result.errors,
        totalLines: result.totalLines
      });

      // Show preview and let user confirm
      // For now, auto-upload
      onTransactionsUploaded(result.transactions);

    } catch (err) {
      throw new Error(err.message);
    }
  }

  if (compact) {
    return (
      <div className="bg-white rounded-lg border-2 border-dashed border-warmGray-300 p-6 text-center">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.pdf"
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="btn-primary"
        >
          {isProcessing ? 'Processing...' : 'Upload file'}
        </button>
        <p className="mt-2 text-sm text-warmGray-600">
          CSV or PDF bank statement
        </p>
        {error && (
          <div className="mt-4 p-3 bg-terracotta-50 border border-terracotta-200 rounded-lg text-sm text-terracotta-800">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`card transition-all duration-300 ${
          isDragging ? 'drag-active scale-105' : ''
        } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <div className="text-center py-12">
          <div className="mb-6">
            <svg
              className="mx-auto h-16 w-16 text-warmGray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          <h3 className="text-2xl font-display font-semibold text-warmGray-900 mb-2">
            Upload your bank statement
          </h3>
          
          <p className="text-warmGray-600 mb-6 max-w-md mx-auto">
            Drag and drop your file here, or click to browse. Your data stays completely private
            on your device.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="btn-primary min-w-[200px]"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Choose file'
              )}
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-warmGray-200">
            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-sage-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-warmGray-900">CSV recommended</p>
                  <p className="text-xs text-warmGray-600">Most reliable format with full transaction details</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-warmGray-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-warmGray-900">PDF (text-based only)</p>
                  <p className="text-xs text-warmGray-600">Works if your PDF contains selectable text</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="card bg-terracotta-50 border-terracotta-200 animate-slide-up">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-terracotta-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-terracotta-900">Upload error</h3>
              <p className="mt-1 text-sm text-terracotta-800">{error}</p>
              <div className="mt-3">
                <button
                  onClick={() => setError(null)}
                  className="text-sm text-terracotta-700 hover:text-terracotta-900 font-medium"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Display */}
      {parseResult && !error && (
        <div className="card bg-sage-50 border-sage-200 animate-slide-up">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-sage-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-sage-900">Successfully parsed</h3>
              <p className="mt-1 text-sm text-sage-800">
                Found {parseResult.count} transactions in your {parseResult.type.toUpperCase()} file.
                {parseResult.errors && parseResult.errors.length > 0 && (
                  <span className="block mt-1 text-xs">
                    ({parseResult.errors.length} rows skipped due to parsing errors)
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Info Panel */}
      <div className="card bg-warmGray-50">
        <h4 className="font-display font-semibold text-warmGray-900 mb-3">
          How to get your bank statement
        </h4>
        <ol className="space-y-2 text-sm text-warmGray-700">
          <li className="flex items-start">
            <span className="font-medium text-warmGray-900 mr-2">1.</span>
            Log into your online banking
          </li>
          <li className="flex items-start">
            <span className="font-medium text-warmGray-900 mr-2">2.</span>
            Look for "Export" or "Download transactions"
          </li>
          <li className="flex items-start">
            <span className="font-medium text-warmGray-900 mr-2">3.</span>
            Choose CSV format (recommended) or PDF
          </li>
          <li className="flex items-start">
            <span className="font-medium text-warmGray-900 mr-2">4.</span>
            Select your date range and download
          </li>
        </ol>
      </div>
    </div>
  );
}
