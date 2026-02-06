// categorizer.js - Intelligent transaction categorization engine

export const CATEGORIES = {
  ESSENTIALS: {
    id: 'essentials',
    name: 'Essentials',
    description: 'Groceries, utilities, healthcare, and other necessities',
    color: '#5C715C',
    icon: '🏠'
  },
  LIFESTYLE: {
    id: 'lifestyle',
    name: 'Lifestyle',
    description: 'Dining, entertainment, hobbies, and personal care',
    color: '#C96846',
    icon: '✨'
  },
  CONVENIENCE: {
    id: 'convenience',
    name: 'Convenience',
    description: 'Food delivery, taxis, quick purchases',
    color: '#7A8E7A',
    icon: '🚀'
  },
  IMPULSE: {
    id: 'impulse',
    name: 'Impulse',
    description: 'Unplanned purchases and spontaneous spending',
    color: '#DC8B73',
    icon: '💫'
  },
  SUBSCRIPTIONS: {
    id: 'subscriptions',
    name: 'Subscriptions',
    description: 'Recurring monthly or annual charges',
    color: '#A1B0A1',
    icon: '🔄'
  },
  INCOME: {
    id: 'income',
    name: 'Income',
    description: 'Salary, refunds, and other income',
    color: '#495949',
    icon: '💰'
  },
  TRANSFERS: {
    id: 'transfers',
    name: 'Transfers',
    description: 'Money moved between accounts',
    color: '#78716C',
    icon: '↔️'
  },
  OTHER: {
    id: 'other',
    name: 'Other',
    description: 'Uncategorized transactions',
    color: '#A8A29E',
    icon: '📦'
  }
};

// Keyword-based rules for categorization
const CATEGORIZATION_RULES = {
  essentials: [
    // Groceries
    'grocery', 'supermarket', 'whole foods', 'trader joe', 'safeway', 'kroger',
    'walmart', 'target', 'aldi', 'lidl', 'tesco', 'sainsbury', 'asda',
    'market', 'food store', 'coop',
    
    // Utilities
    'electric', 'electricity', 'gas company', 'water', 'utilities',
    'power company', 'energy', 'utility payment',
    
    // Healthcare
    'pharmacy', 'cvs', 'walgreens', 'medical', 'doctor', 'hospital',
    'clinic', 'health', 'dental', 'optician', 'prescription',
    
    // Insurance
    'insurance', 'premium',
    
    // Rent/Mortgage
    'rent', 'mortgage', 'landlord', 'property management',
  ],

  lifestyle: [
    // Dining
    'restaurant', 'cafe', 'coffee', 'starbucks', 'bar', 'pub',
    'dining', 'bistro', 'eatery', 'grill', 'kitchen', 'pizza',
    
    // Entertainment
    'cinema', 'movie', 'theater', 'theatre', 'concert', 'spotify',
    'netflix', 'hulu', 'disney', 'entertainment', 'gaming', 'steam',
    
    // Fitness
    'gym', 'fitness', 'yoga', 'sports', 'athletic',
    
    // Personal care
    'salon', 'barber', 'spa', 'beauty', 'cosmetic',
  ],

  convenience: [
    // Food delivery
    'uber eats', 'doordash', 'grubhub', 'deliveroo', 'just eat',
    'delivery', 'takeaway', 'takeout',
    
    // Transportation
    'uber', 'lyft', 'taxi', 'cab', 'transit', 'parking',
    'gas station', 'fuel', 'petrol',
    
    // Quick shopping
    '7-eleven', 'convenience store', 'corner store', 'bodega',
  ],

  impulse: [
    // Online shopping
    'amazon', 'ebay', 'etsy', 'asos', 'zara', 'h&m', 'online',
    
    // Retail
    'clothing', 'fashion', 'shoes', 'accessories', 'boutique',
    'mall', 'department store',
    
    // Electronics
    'electronics', 'apple store', 'best buy',
    
    // Books, games, hobbies
    'bookstore', 'books', 'hobby', 'toys',
  ],

  subscriptions: [
    'subscription', 'monthly', 'annual fee', 'membership',
    'netflix', 'spotify', 'amazon prime', 'youtube premium',
    'icloud', 'google one', 'dropbox', 'adobe', 'microsoft',
    'patreon', 'substack', 'medium',
  ],

  income: [
    'salary', 'payroll', 'deposit', 'direct deposit', 'payment received',
    'refund', 'reimbursement', 'transfer in', 'interest',
  ],

  transfers: [
    'transfer', 'atm withdrawal', 'cash withdrawal', 'zelle', 'venmo',
    'paypal transfer', 'account transfer', 'wire transfer',
  ]
};

// Patterns that suggest impulse spending
const IMPULSE_PATTERNS = {
  lateNight: (date) => {
    const hour = new Date(date).getHours();
    return hour >= 22 || hour <= 2; // 10pm - 2am
  },
  weekend: (date) => {
    const day = new Date(date).getDay();
    return day === 0 || day === 6;
  },
  smallFrequent: (amount) => {
    return amount < 20;
  }
};

export function categorizeTransaction(transaction, userOverrides = {}) {
  const description = transaction.description.toLowerCase();
  
  // Check user overrides first
  const overrideKey = createOverrideKey(transaction.description);
  if (userOverrides[overrideKey]) {
    return userOverrides[overrideKey];
  }

  // Income check (credits are often income)
  if (transaction.type === 'credit') {
    for (const keyword of CATEGORIZATION_RULES.income) {
      if (description.includes(keyword)) {
        return CATEGORIES.INCOME.id;
      }
    }
  }

  // Check each category's rules
  for (const [categoryId, keywords] of Object.entries(CATEGORIZATION_RULES)) {
    for (const keyword of keywords) {
      if (description.includes(keyword)) {
        return categoryId;
      }
    }
  }

  // Impulse detection based on patterns
  if (transaction.type === 'debit') {
    const isLateNight = IMPULSE_PATTERNS.lateNight(transaction.date);
    const isSmallAmount = IMPULSE_PATTERNS.smallFrequent(transaction.amount);
    
    if (isLateNight && isSmallAmount) {
      return CATEGORIES.IMPULSE.id;
    }
  }

  // Default to OTHER
  return CATEGORIES.OTHER.id;
}

export function categorizeTransactions(transactions, userOverrides = {}) {
  return transactions.map(transaction => ({
    ...transaction,
    category: transaction.userCategory || categorizeTransaction(transaction, userOverrides),
    autoCategory: categorizeTransaction(transaction, userOverrides)
  }));
}

export function createOverrideKey(description) {
  // Create a normalized key for storing user overrides
  return description.toLowerCase().trim().substring(0, 50);
}

export function getCategoryStats(transactions) {
  const stats = {};
  
  Object.values(CATEGORIES).forEach(category => {
    stats[category.id] = {
      ...category,
      count: 0,
      total: 0,
      transactions: []
    };
  });

  transactions.forEach(tx => {
    const categoryId = tx.category || CATEGORIES.OTHER.id;
    if (stats[categoryId]) {
      stats[categoryId].count++;
      stats[categoryId].total += tx.amount;
      stats[categoryId].transactions.push(tx);
    }
  });

  return Object.values(stats).filter(s => s.count > 0);
}

export function detectRecurringTransactions(transactions) {
  // Group by similar descriptions
  const groups = {};
  
  transactions.forEach(tx => {
    // Normalize description (remove numbers, dates)
    const normalized = tx.description
      .replace(/\d+/g, '')
      .replace(/[^\w\s]/g, '')
      .trim()
      .toLowerCase()
      .substring(0, 30);

    if (!groups[normalized]) {
      groups[normalized] = [];
    }
    groups[normalized].push(tx);
  });

  // Find groups with multiple transactions
  const recurring = [];
  
  Object.entries(groups).forEach(([key, txs]) => {
    if (txs.length >= 2) {
      // Check if amounts are similar (within 10%)
      const amounts = txs.map(t => t.amount);
      const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
      const variance = amounts.every(amt => 
        Math.abs(amt - avgAmount) / avgAmount < 0.1
      );

      if (variance) {
        recurring.push({
          description: txs[0].description,
          frequency: txs.length,
          avgAmount,
          transactions: txs,
          category: txs[0].category
        });
      }
    }
  });

  return recurring.sort((a, b) => b.avgAmount - a.avgAmount);
}

export function getMerchantFrequency(transactions) {
  const merchants = {};
  
  transactions.forEach(tx => {
    const merchant = tx.description.split(/[-–]/)[0].trim().substring(0, 30);
    
    if (!merchants[merchant]) {
      merchants[merchant] = {
        name: merchant,
        count: 0,
        total: 0,
        category: tx.category
      };
    }
    
    merchants[merchant].count++;
    merchants[merchant].total += tx.amount;
  });

  return Object.values(merchants)
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);
}
