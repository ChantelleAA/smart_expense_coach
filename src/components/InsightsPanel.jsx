// InsightsPanel.jsx - Display behavioral insights

import { exportInsights } from '../utils/insightEngine';

export default function InsightsPanel({ insights, transactions }) {
  function handleExportInsights() {
    const exported = exportInsights(insights, null);
    
    const blob = new Blob([exported.markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense-insights-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  if (!insights || insights.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-warmGray-500">
          <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <p className="text-lg font-display mb-2">Not enough data yet</p>
          <p className="text-sm">Upload more transactions to see insights about your spending patterns</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="section-title">Your Spending Insights</h2>
          <p className="section-subtitle">
            Observations about your patterns, not judgments about your choices
          </p>
        </div>
        
        <button
          onClick={handleExportInsights}
          className="btn-secondary flex items-center space-x-2"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Export</span>
        </button>
      </div>

      {/* Insights Grid */}
      <div className="grid gap-6">
        {insights.map((insight, index) => (
          <InsightCard key={index} insight={insight} index={index} />
        ))}
      </div>

      {/* Context Note */}
      <div className="card bg-warmGray-50 border-warmGray-200">
        <div className="flex items-start space-x-3">
          <svg className="h-5 w-5 text-warmGray-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-warmGray-700">
            <p className="font-medium mb-1">About these insights</p>
            <p>
              These observations are generated from patterns in your transaction data. They're meant 
              to help you understand your spending behavior, not to tell you what to do. Your choices 
              are your own, and every spending pattern tells a story about your life and priorities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InsightCard({ insight, index }) {
  const toneColors = {
    observational: 'bg-warmGray-50 border-warmGray-200',
    gentle: 'bg-sage-50 border-sage-200',
    informative: 'bg-warmGray-50 border-warmGray-200',
    neutral: 'bg-warmGray-50 border-warmGray-200',
    understanding: 'bg-terracotta-50 border-terracotta-200',
    positive: 'bg-sage-50 border-sage-200'
  };

  const toneIcons = {
    observational: '👁️',
    gentle: '💭',
    informative: '📊',
    neutral: '📌',
    understanding: '💙',
    positive: '✨'
  };

  const bgColor = toneColors[insight.tone] || toneColors.neutral;
  const icon = toneIcons[insight.tone] || '💡';

  return (
    <div
      className={`card ${bgColor} animate-fade-in`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start space-x-4">
        <div className="text-3xl flex-shrink-0">{icon}</div>
        
        <div className="flex-1">
          <h3 className="text-lg font-display font-semibold text-warmGray-900 mb-2">
            {insight.title}
          </h3>
          
          <p className="text-warmGray-700 leading-relaxed">
            {insight.message}
          </p>

          {insight.data && insight.type === 'subscriptions' && insight.data.items && (
            <div className="mt-4 pt-4 border-t border-warmGray-200">
              <p className="text-sm font-medium text-warmGray-700 mb-2">Detected subscriptions:</p>
              <ul className="space-y-1">
                {insight.data.items.slice(0, 5).map((item, i) => (
                  <li key={i} className="text-sm text-warmGray-600 flex justify-between">
                    <span>{item.description}</span>
                    <span className="font-mono">${item.avgAmount.toFixed(2)}/mo</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
