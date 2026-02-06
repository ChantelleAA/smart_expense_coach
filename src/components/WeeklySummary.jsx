// WeeklySummary.jsx - Display weekly summary with key insights

export default function WeeklySummary({ summary }) {
  if (!summary) return null;

  return (
    <div className="card bg-gradient-to-br from-sage-50 to-warmGray-50 border-sage-200 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-display font-bold text-warmGray-900 mb-1">
          Your Spending Story
        </h2>
        <p className="text-warmGray-600">
          A gentle look at your recent patterns
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white bg-opacity-60 rounded-lg p-4">
          <div className="text-sm text-warmGray-600 mb-1">Transactions</div>
          <div className="text-2xl font-display font-semibold text-warmGray-900">
            {summary.transactionCount}
          </div>
        </div>
        
        <div className="bg-white bg-opacity-60 rounded-lg p-4">
          <div className="text-sm text-warmGray-600 mb-1">Total Spent</div>
          <div className="text-2xl font-display font-semibold text-warmGray-900">
            ${summary.totalSpent}
          </div>
        </div>
        
        <div className="bg-white bg-opacity-60 rounded-lg p-4">
          <div className="text-sm text-warmGray-600 mb-1">Avg. per Transaction</div>
          <div className="text-2xl font-display font-semibold text-warmGray-900">
            ${summary.avgTransaction}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Key Pattern */}
        {summary.keyInsight && (
          <div className="bg-white bg-opacity-80 rounded-lg p-5">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">🔍</div>
              <div>
                <h3 className="font-display font-semibold text-warmGray-900 mb-1">
                  Key Pattern
                </h3>
                <p className="text-warmGray-700 leading-relaxed">
                  {summary.keyInsight.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Gentle Suggestion */}
        {summary.suggestion && (
          <div className="bg-white bg-opacity-80 rounded-lg p-5">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">💭</div>
              <div>
                <h3 className="font-display font-semibold text-warmGray-900 mb-1">
                  A Thought
                </h3>
                <p className="text-warmGray-700 leading-relaxed">
                  {summary.suggestion.text}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Positive Note */}
        {summary.positive && (
          <div className="bg-white bg-opacity-80 rounded-lg p-5">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">✨</div>
              <div>
                <h3 className="font-display font-semibold text-warmGray-900 mb-1">
                  Something Good
                </h3>
                <p className="text-warmGray-700 leading-relaxed">
                  {summary.positive}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
