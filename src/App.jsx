// App.jsx - Main application component

import { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import TransactionList from './components/TransactionList';
import CategoryManager from './components/CategoryManager';
import InsightsPanel from './components/InsightsPanel';
import WeeklySummary from './components/WeeklySummary';
import Charts from './components/Charts';
import PrivacyBanner from './components/PrivacyBanner';
import storage from './utils/storage';
import { categorizeTransactions, getCategoryStats } from './utils/categorizer';
import { generateInsights, generateWeeklySummary } from './utils/insightEngine';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [categoryOverrides, setCategoryOverrides] = useState({});
  const [insights, setInsights] = useState([]);
  const [summary, setSummary] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Generate insights when transactions change
  useEffect(() => {
    if (transactions.length > 0) {
      const newInsights = generateInsights(transactions);
      setInsights(newInsights);
      
      const newSummary = generateWeeklySummary(transactions, newInsights);
      setSummary(newSummary);
    }
  }, [transactions]);

  async function loadData() {
    try {
      const loadedTransactions = await storage.loadTransactions();
      const loadedOverrides = storage.loadCategoryOverrides();
      
      setCategoryOverrides(loadedOverrides);
      
      if (loadedTransactions.length > 0) {
        const categorized = categorizeTransactions(loadedTransactions, loadedOverrides);
        setTransactions(categorized);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleTransactionsUploaded(newTransactions) {
    const categorized = categorizeTransactions(newTransactions, categoryOverrides);
    setTransactions(categorized);
    await storage.saveTransactions(categorized);
  }

  async function handleCategoryChange(transactionId, newCategory) {
    const updated = transactions.map(tx => {
      if (tx.id === transactionId) {
        return { ...tx, userCategory: newCategory, category: newCategory };
      }
      return tx;
    });

    setTransactions(updated);
    await storage.saveTransactions(updated);

    // Update overrides
    const transaction = transactions.find(tx => tx.id === transactionId);
    if (transaction) {
      const overrideKey = transaction.description.toLowerCase().trim().substring(0, 50);
      const newOverrides = { ...categoryOverrides, [overrideKey]: newCategory };
      setCategoryOverrides(newOverrides);
      storage.saveCategoryOverrides(newOverrides);
    }
  }

  async function handleClearData() {
    if (confirm('Are you sure you want to delete all your data? This cannot be undone.')) {
      await storage.clearAll();
      setTransactions([]);
      setCategoryOverrides({});
      setInsights([]);
      setSummary(null);
    }
  }

  const categoryStats = getCategoryStats(transactions);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="animate-pulse text-warmGray-600 text-lg font-display">
          Loading your data...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <PrivacyBanner />
      
      {/* Header */}
      <header className="bg-white border-b border-warmGray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-display font-bold text-warmGray-900 mb-1">
                Smart Expense Coach
              </h1>
              <p className="text-warmGray-600">
                Understand your spending patterns with thoughtful, private insights
              </p>
            </div>
            
            {transactions.length > 0 && (
              <button
                onClick={handleClearData}
                className="px-4 py-2 text-sm text-warmGray-600 hover:text-warmGray-900 transition-colors"
              >
                Clear all data
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {transactions.length === 0 ? (
          <div className="animate-fade-in">
            <FileUpload onTransactionsUploaded={handleTransactionsUploaded} />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Navigation Tabs */}
            <nav className="flex space-x-4 border-b border-warmGray-200">
              {['overview', 'insights', 'transactions', 'categories'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 text-sm font-medium capitalize transition-all ${
                    activeTab === tab
                      ? 'border-b-2 border-sage-600 text-sage-700'
                      : 'text-warmGray-600 hover:text-warmGray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>

            {/* Tab Content */}
            <div className="animate-fade-in">
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {summary && <WeeklySummary summary={summary} />}
                  <Charts transactions={transactions} categoryStats={categoryStats} />
                </div>
              )}

              {activeTab === 'insights' && (
                <InsightsPanel insights={insights} transactions={transactions} />
              )}

              {activeTab === 'transactions' && (
                <TransactionList
                  transactions={transactions}
                  onCategoryChange={handleCategoryChange}
                />
              )}

              {activeTab === 'categories' && (
                <CategoryManager
                  categoryStats={categoryStats}
                  transactions={transactions}
                />
              )}
            </div>

            {/* Upload More Data */}
            <div className="mt-12 pt-8 border-t border-warmGray-200">
              <h3 className="text-lg font-display font-semibold text-warmGray-900 mb-4">
                Add more transactions
              </h3>
              <FileUpload onTransactionsUploaded={handleTransactionsUploaded} compact />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-warmGray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-warmGray-600">
            <p className="mb-2">
              All your data stays on your device. Nothing is sent to any server.
            </p>
            <p className="text-xs">
              Smart Expense Coach &middot; Privacy-first expense insights &middot; Open source
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
