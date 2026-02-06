// CategoryManager.jsx - View and manage spending by category

import { CATEGORIES } from '../utils/categorizer';

export default function CategoryManager({ categoryStats, transactions }) {
  const debits = transactions.filter(tx => tx.type === 'debit');
  const totalSpent = debits.reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="section-title">Spending by Category</h2>
        <p className="section-subtitle">
          See where your money goes and what it tells you about your priorities
        </p>
      </div>

      <div className="grid gap-4">
        {categoryStats
          .filter(stat => stat.id !== CATEGORIES.INCOME.id && stat.id !== CATEGORIES.TRANSFERS.id)
          .sort((a, b) => b.total - a.total)
          .map((stat, index) => (
            <CategoryCard
              key={stat.id}
              stat={stat}
              totalSpent={totalSpent}
              index={index}
            />
          ))}
      </div>

      {/* Category Descriptions */}
      <div className="card bg-warmGray-50">
        <h3 className="font-display font-semibold text-warmGray-900 mb-4">
          Understanding Categories
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {Object.values(CATEGORIES)
            .filter(cat => cat.id !== CATEGORIES.INCOME.id && cat.id !== CATEGORIES.TRANSFERS.id)
            .map(cat => (
              <div key={cat.id} className="flex items-start space-x-3">
                <div className="text-2xl">{cat.icon}</div>
                <div>
                  <div className="font-medium text-warmGray-900">{cat.name}</div>
                  <div className="text-sm text-warmGray-600">{cat.description}</div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function CategoryCard({ stat, totalSpent, index }) {
  const percentage = totalSpent > 0 ? (stat.total / totalSpent * 100) : 0;
  const avgTransaction = stat.total / stat.count;

  return (
    <div
      className="card hover:shadow-lg transition-all duration-300 animate-slide-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{stat.icon}</div>
          <div>
            <h3 className="font-display font-semibold text-lg text-warmGray-900">
              {stat.name}
            </h3>
            <p className="text-sm text-warmGray-600">{stat.count} transactions</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-display font-bold text-warmGray-900">
            ${stat.total.toFixed(2)}
          </div>
          <div className="text-sm text-warmGray-600">
            {percentage.toFixed(1)}% of total
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="h-2 bg-warmGray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: stat.color
            }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-warmGray-600 mb-1">Avg. per transaction</div>
          <div className="font-mono font-medium text-warmGray-900">
            ${avgTransaction.toFixed(2)}
          </div>
        </div>
        
        <div>
          <div className="text-warmGray-600 mb-1">Largest purchase</div>
          <div className="font-mono font-medium text-warmGray-900">
            ${Math.max(...stat.transactions.map(t => t.amount)).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
