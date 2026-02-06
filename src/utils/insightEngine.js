// insightEngine.js - Generate thoughtful, non-judgmental spending insights

import { format, parseISO, getDay, getHours, differenceInDays, startOfWeek, endOfWeek } from 'date-fns';
import { CATEGORIES, detectRecurringTransactions } from './categorizer';

export function generateInsights(transactions) {
  if (!transactions || transactions.length === 0) {
    return [];
  }

  const insights = [];

  // Only analyze debits for spending patterns
  const debits = transactions.filter(tx => tx.type === 'debit');

  // Generate various insights
  insights.push(...analyzeDayOfWeekPatterns(debits));
  insights.push(...analyzeTimeOfDayPatterns(debits));
  insights.push(...analyzeSmallPurchases(debits));
  insights.push(...analyzeSubscriptions(transactions));
  insights.push(...analyzeMonthlyPatterns(debits));
  insights.push(...analyzeConvenienceSpending(debits));
  insights.push(...analyzeCategoryBalance(debits));
  insights.push(...analyzeWeekendVsWeekday(debits));

  // Sort by priority and return top insights
  return insights
    .filter(i => i.confidence > 0.5)
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 8);
}

function analyzeDayOfWeekPatterns(transactions) {
  const insights = [];
  const byDay = {};

  transactions.forEach(tx => {
    const day = getDay(parseISO(tx.date));
    if (!byDay[day]) byDay[day] = { count: 0, total: 0 };
    byDay[day].count++;
    byDay[day].total += tx.amount;
  });

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const avgCount = Object.values(byDay).reduce((sum, d) => sum + d.count, 0) / 7;

  Object.entries(byDay).forEach(([dayNum, data]) => {
    if (data.count > avgCount * 1.5) {
      const dayName = days[parseInt(dayNum)];
      insights.push({
        type: 'day_pattern',
        category: 'behavioral',
        title: `${dayName} spending spike`,
        message: `You tend to spend more on ${dayName}s. This might be when you have more free time or energy for shopping.`,
        tone: 'observational',
        data: { day: dayName, count: data.count, total: data.total },
        priority: 7,
        confidence: 0.7
      });
    }
  });

  return insights;
}

function analyzeTimeOfDayPatterns(transactions) {
  const insights = [];
  const lateNight = transactions.filter(tx => {
    const hour = getHours(parseISO(tx.date));
    return hour >= 22 || hour <= 2;
  });

  if (lateNight.length > transactions.length * 0.15) {
    const total = lateNight.reduce((sum, tx) => sum + tx.amount, 0);
    insights.push({
      type: 'time_pattern',
      category: 'behavioral',
      title: 'Late-night spending',
      message: `About ${Math.round(lateNight.length / transactions.length * 100)}% of your purchases happen late at night. This is a common pattern when decision-making energy is lower.`,
      tone: 'gentle',
      data: { count: lateNight.length, total },
      priority: 8,
      confidence: 0.75
    });
  }

  return insights;
}

function analyzeSmallPurchases(transactions) {
  const insights = [];
  const smallPurchases = transactions.filter(tx => tx.amount < 10);

  if (smallPurchases.length > 10) {
    const total = smallPurchases.reduce((sum, tx) => sum + tx.amount, 0);
    const avgPerWeek = total / (transactions.length / 7);

    insights.push({
      type: 'small_purchases',
      category: 'accumulation',
      title: 'Small purchases add up',
      message: `Your ${smallPurchases.length} small purchases (under $10) total $${total.toFixed(2)}. That's about $${avgPerWeek.toFixed(2)} per week in small conveniences.`,
      tone: 'informative',
      data: { count: smallPurchases.length, total, avgPerWeek },
      priority: 6,
      confidence: 0.8
    });
  }

  return insights;
}

function analyzeSubscriptions(transactions) {
  const insights = [];
  const recurring = detectRecurringTransactions(transactions);
  
  const subscriptions = recurring.filter(r => 
    r.category === CATEGORIES.SUBSCRIPTIONS.id || r.frequency >= 2
  );

  if (subscriptions.length > 0) {
    const totalMonthly = subscriptions.reduce((sum, sub) => sum + sub.avgAmount, 0);
    
    insights.push({
      type: 'subscriptions',
      category: 'recurring',
      title: 'Recurring subscriptions',
      message: `You have ${subscriptions.length} recurring charges totaling about $${totalMonthly.toFixed(2)} per month. These automatic payments can be easy to forget about.`,
      tone: 'neutral',
      data: { count: subscriptions.length, total: totalMonthly, items: subscriptions },
      priority: 9,
      confidence: 0.9
    });
  }

  return insights;
}

function analyzeMonthlyPatterns(transactions) {
  const insights = [];
  
  if (transactions.length < 30) return insights;

  // Group by first half vs second half of month
  const firstHalf = transactions.filter(tx => {
    const date = parseISO(tx.date);
    return date.getDate() <= 15;
  });

  const secondHalf = transactions.filter(tx => {
    const date = parseISO(tx.date);
    return date.getDate() > 15;
  });

  const firstHalfAvg = firstHalf.reduce((sum, tx) => sum + tx.amount, 0) / firstHalf.length;
  const secondHalfAvg = secondHalf.reduce((sum, tx) => sum + tx.amount, 0) / secondHalf.length;

  if (secondHalfAvg < firstHalfAvg * 0.6) {
    insights.push({
      type: 'monthly_pattern',
      category: 'temporal',
      title: 'Month-end tightening',
      message: `Your spending tends to decrease in the second half of the month. This suggests you're naturally adjusting as you track your budget mentally.`,
      tone: 'positive',
      data: { firstHalf: firstHalfAvg, secondHalf: secondHalfAvg },
      priority: 7,
      confidence: 0.7
    });
  } else if (secondHalfAvg > firstHalfAvg * 1.4) {
    insights.push({
      type: 'monthly_pattern',
      category: 'temporal',
      title: 'Month-end spending increase',
      message: `You tend to spend more in the second half of the month. This is common as bills and planned expenses often cluster later in the month.`,
      tone: 'observational',
      data: { firstHalf: firstHalfAvg, secondHalf: secondHalfAvg },
      priority: 7,
      confidence: 0.7
    });
  }

  return insights;
}

function analyzeConvenienceSpending(transactions) {
  const insights = [];
  const convenience = transactions.filter(tx => tx.category === CATEGORIES.CONVENIENCE.id);

  if (convenience.length > 0) {
    const total = convenience.reduce((sum, tx) => sum + tx.amount, 0);
    const avgPerTransaction = total / convenience.length;

    if (total > 100) {
      insights.push({
        type: 'convenience',
        category: 'behavioral',
        title: 'Convenience spending',
        message: `You spent $${total.toFixed(2)} on convenience services like delivery and quick transport. These save time when energy is low.`,
        tone: 'understanding',
        data: { count: convenience.length, total, avg: avgPerTransaction },
        priority: 6,
        confidence: 0.75
      });
    }
  }

  return insights;
}

function analyzeCategoryBalance(transactions) {
  const insights = [];
  const byCategory = {};

  transactions.forEach(tx => {
    if (!byCategory[tx.category]) {
      byCategory[tx.category] = { count: 0, total: 0 };
    }
    byCategory[tx.category].count++;
    byCategory[tx.category].total += tx.amount;
  });

  const total = Object.values(byCategory).reduce((sum, cat) => sum + cat.total, 0);
  
  Object.entries(byCategory).forEach(([catId, data]) => {
    const percentage = (data.total / total) * 100;
    
    if (catId === CATEGORIES.ESSENTIALS.id && percentage < 30) {
      insights.push({
        type: 'category_balance',
        category: 'observation',
        title: 'Low essential spending',
        message: `Only ${percentage.toFixed(0)}% of your spending went to essentials. You might be effectively managing these costs, or some essentials might be categorized differently.`,
        tone: 'neutral',
        data: { category: catId, percentage },
        priority: 5,
        confidence: 0.6
      });
    }

    if (catId === CATEGORIES.LIFESTYLE.id && percentage > 40) {
      insights.push({
        type: 'category_balance',
        category: 'observation',
        title: 'Lifestyle focus',
        message: `About ${percentage.toFixed(0)}% of your spending supports your lifestyle and personal enjoyment. This reflects your current priorities.`,
        tone: 'neutral',
        data: { category: catId, percentage },
        priority: 6,
        confidence: 0.7
      });
    }
  });

  return insights;
}

function analyzeWeekendVsWeekday(transactions) {
  const insights = [];
  
  const weekend = transactions.filter(tx => {
    const day = getDay(parseISO(tx.date));
    return day === 0 || day === 6;
  });

  const weekday = transactions.filter(tx => {
    const day = getDay(parseISO(tx.date));
    return day >= 1 && day <= 5;
  });

  if (weekend.length === 0 || weekday.length === 0) return insights;

  const weekendAvg = weekend.reduce((sum, tx) => sum + tx.amount, 0) / weekend.length;
  const weekdayAvg = weekday.reduce((sum, tx) => sum + tx.amount, 0) / weekday.length;

  if (weekendAvg > weekdayAvg * 1.5) {
    insights.push({
      type: 'weekend_pattern',
      category: 'temporal',
      title: 'Weekend spending spike',
      message: `Your weekend spending averages $${weekendAvg.toFixed(2)} per transaction, compared to $${weekdayAvg.toFixed(2)} on weekdays. Weekends are your time to enjoy.`,
      tone: 'positive',
      data: { weekend: weekendAvg, weekday: weekdayAvg },
      priority: 7,
      confidence: 0.75
    });
  }

  return insights;
}

export function generateWeeklySummary(transactions, insights) {
  if (!transactions || transactions.length === 0) {
    return null;
  }

  const debits = transactions.filter(tx => tx.type === 'debit');
  const totalSpent = debits.reduce((sum, tx) => sum + tx.amount, 0);
  const avgTransaction = totalSpent / debits.length;

  // Pick key insight
  const keyInsight = insights.find(i => i.priority >= 7) || insights[0];

  // Generate a gentle suggestion based on patterns
  const suggestion = generateSuggestion(insights, debits);

  // Find a positive observation
  const positive = generatePositiveObservation(transactions, debits);

  return {
    period: 'This period',
    totalSpent: totalSpent.toFixed(2),
    transactionCount: debits.length,
    avgTransaction: avgTransaction.toFixed(2),
    keyInsight,
    suggestion,
    positive,
    generatedAt: new Date().toISOString()
  };
}

function generateSuggestion(insights, transactions) {
  // Find the most relevant insight to base suggestion on
  const lateNightInsight = insights.find(i => i.type === 'time_pattern');
  const smallPurchaseInsight = insights.find(i => i.type === 'small_purchases');
  const convenienceInsight = insights.find(i => i.type === 'convenience');

  if (lateNightInsight) {
    return {
      text: "Consider setting a gentle reminder before late-night shopping hours. This isn't about restriction—just creating a moment to check in with yourself.",
      type: 'reflection'
    };
  }

  if (smallPurchaseInsight) {
    return {
      text: "You might enjoy tracking your small purchases for a week to see which ones bring genuine value versus which are automatic habits.",
      type: 'experiment'
    };
  }

  if (convenienceInsight) {
    return {
      text: "Convenience spending often peaks during busy or stressful periods. This is a natural response to limited energy.",
      type: 'understanding'
    };
  }

  return {
    text: "Your spending patterns tell a story about your current lifestyle and priorities. There's valuable information here.",
    type: 'observation'
  };
}

function generatePositiveObservation(transactions, debits) {
  const categories = {};
  debits.forEach(tx => {
    if (!categories[tx.category]) categories[tx.category] = 0;
    categories[tx.category] += tx.amount;
  });

  const essentialsTotal = categories[CATEGORIES.ESSENTIALS.id] || 0;
  const total = Object.values(categories).reduce((sum, amt) => sum + amt, 0);

  if (essentialsTotal / total > 0.5) {
    return "Most of your spending is going toward essentials. You're covering your core needs.";
  }

  if (transactions.some(tx => tx.type === 'credit')) {
    return "You had income or refunds this period, which helps balance your spending.";
  }

  const recurring = debits.filter(tx => tx.category === CATEGORIES.SUBSCRIPTIONS.id);
  if (recurring.length < 3) {
    return "You're keeping subscription services relatively minimal.";
  }

  return "You're engaging with your finances by reviewing this summary. That's a positive step.";
}

export function exportInsights(insights, summary) {
  const markdown = generateMarkdownReport(insights, summary);
  return {
    markdown,
    text: markdown.replace(/[#*]/g, '')
  };
}

function generateMarkdownReport(insights, summary) {
  let report = `# Smart Expense Coach - Insights Report\n\n`;
  report += `Generated: ${format(new Date(), 'MMMM d, yyyy')}\n\n`;

  if (summary) {
    report += `## Summary\n\n`;
    report += `- Total transactions: ${summary.transactionCount}\n`;
    report += `- Total spent: $${summary.totalSpent}\n`;
    report += `- Average per transaction: $${summary.avgTransaction}\n\n`;
  }

  report += `## Key Insights\n\n`;

  insights.forEach((insight, i) => {
    report += `### ${i + 1}. ${insight.title}\n\n`;
    report += `${insight.message}\n\n`;
  });

  if (summary?.suggestion) {
    report += `## Reflection\n\n`;
    report += `${summary.suggestion.text}\n\n`;
  }

  if (summary?.positive) {
    report += `## Positive Note\n\n`;
    report += `${summary.positive}\n\n`;
  }

  report += `---\n\n`;
  report += `*This report was generated locally on your device. Your data never left your browser.*\n`;

  return report;
}
