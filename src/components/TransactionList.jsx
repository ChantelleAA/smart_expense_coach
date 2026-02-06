// TransactionList.jsx - Display and manage transactions

import { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { CATEGORIES } from '../utils/categorizer';

export default function TransactionList({ transactions, onCategoryChange }) {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAndSorted = useMemo(() => {
    let filtered = [...transactions];

    // Apply category filter
    if (filter !== 'all') {
      filtered = filtered.filter(tx => tx.category === filter);
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(tx =>
        tx.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'description':
          comparison = a.description.localeCompare(b.description);
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [transactions, filter, sortBy, sortOrder, searchTerm]);

  const debits = filteredAndSorted.filter(tx => tx.type === 'debit');
  const credits = filteredAndSorted.filter(tx => tx.type === 'credit');
  const totalDebits = debits.reduce((sum, tx) => sum + tx.amount, 0);
  const totalCredits = credits.reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="card bg-white">
          <div className="text-sm text-warmGray-600 mb-1">Total Transactions</div>
          <div className="text-2xl font-display font-semibold text-warmGray-900">
            {filteredAndSorted.length}
          </div>
        </div>
        
        <div className="card bg-terracotta-50">
          <div className="text-sm text-terracotta-700 mb-1">Total Spent</div>
          <div className="text-2xl font-display font-semibold text-terracotta-900">
            ${totalDebits.toFixed(2)}
          </div>
        </div>
        
        <div className="card bg-sage-50">
          <div className="text-sm text-sage-700 mb-1">Total Income</div>
          <div className="text-2xl font-display font-semibold text-sage-900">
            ${totalCredits.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card space-y-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">All Categories</option>
            {Object.values(CATEGORIES).map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order);
            }}
            className="input-field"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
            <option value="description-asc">A-Z</option>
          </select>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-warmGray-200">
            <thead className="bg-warmGray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-warmGray-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-warmGray-700 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-warmGray-700 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-warmGray-700 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-warmGray-100">
              {filteredAndSorted.map((tx, index) => (
                <TransactionRow
                  key={tx.id || index}
                  transaction={tx}
                  onCategoryChange={onCategoryChange}
                />
              ))}
            </tbody>
          </table>

          {filteredAndSorted.length === 0 && (
            <div className="text-center py-12 text-warmGray-500">
              No transactions found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TransactionRow({ transaction, onCategoryChange }) {
  const [isEditing, setIsEditing] = useState(false);

  const category = CATEGORIES[transaction.category] || CATEGORIES.OTHER;

  return (
    <tr className="hover:bg-warmGray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-warmGray-900">
        {format(parseISO(transaction.date), 'MMM dd, yyyy')}
      </td>
      
      <td className="px-6 py-4 text-sm text-warmGray-900">
        <div className="max-w-md truncate" title={transaction.description}>
          {transaction.description}
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {isEditing ? (
          <select
            value={transaction.category}
            onChange={(e) => {
              onCategoryChange(transaction.id, e.target.value);
              setIsEditing(false);
            }}
            onBlur={() => setIsEditing(false)}
            autoFocus
            className="input-field py-1 text-sm"
          >
            {Object.values(CATEGORIES).map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="badge hover:opacity-80 transition-opacity cursor-pointer"
            style={{ backgroundColor: `${category.color}20`, color: category.color }}
          >
            {category.icon} {category.name}
          </button>
        )}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-mono">
        <span className={transaction.type === 'debit' ? 'text-terracotta-700' : 'text-sage-700'}>
          {transaction.type === 'debit' ? '-' : '+'}${transaction.amount.toFixed(2)}
        </span>
      </td>
    </tr>
  );
}
