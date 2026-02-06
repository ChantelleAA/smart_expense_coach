// Charts.jsx - Visual data representations

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { format, parseISO, getDay, startOfWeek, endOfWeek } from 'date-fns';
import { CATEGORIES } from '../utils/categorizer';

export default function Charts({ transactions, categoryStats }) {
  const debits = transactions.filter(tx => tx.type === 'debit');

  // Category distribution data
  const categoryData = useMemo(() => {
    return categoryStats
      .filter(stat => stat.id !== CATEGORIES.INCOME.id && stat.id !== CATEGORIES.TRANSFERS.id && stat.total > 0)
      .map(stat => ({
        name: stat.name,
        value: stat.total,
        color: stat.color
      }))
      .sort((a, b) => b.value - a.value);
  }, [categoryStats]);

  // Daily spending trend
  const dailyData = useMemo(() => {
    const byDate = {};
    
    debits.forEach(tx => {
      const date = format(parseISO(tx.date), 'MMM dd');
      if (!byDate[date]) {
        byDate[date] = 0;
      }
      byDate[date] += tx.amount;
    });

    return Object.entries(byDate)
      .map(([date, amount]) => ({
        date,
        amount: parseFloat(amount.toFixed(2))
      }))
      .slice(-30); // Last 30 entries
  }, [debits]);

  // Day of week distribution
  const dayOfWeekData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const byDay = Array(7).fill(0);

    debits.forEach(tx => {
      const day = getDay(parseISO(tx.date));
      byDay[day] += tx.amount;
    });

    return days.map((name, index) => ({
      name,
      amount: parseFloat(byDay[index].toFixed(2))
    }));
  }, [debits]);

  if (debits.length === 0) {
    return (
      <div className="card text-center py-12 text-warmGray-500">
        No spending data to display
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Distribution */}
      <div className="card">
        <h3 className="text-xl font-display font-semibold text-warmGray-900 mb-6">
          Spending by Category
        </h3>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend / Details */}
          <div className="flex flex-col justify-center space-y-3">
            {categoryData.map((cat, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-sm text-warmGray-700">{cat.name}</span>
                </div>
                <span className="text-sm font-mono font-medium text-warmGray-900">
                  ${cat.value.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Trend */}
      <div className="card">
        <h3 className="text-xl font-display font-semibold text-warmGray-900 mb-6">
          Daily Spending Trend
        </h3>
        
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#78716C', fontSize: 12 }}
              stroke="#D6D3D1"
            />
            <YAxis
              tick={{ fill: '#78716C', fontSize: 12 }}
              stroke="#D6D3D1"
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              formatter={(value) => [`$${value}`, 'Spent']}
              contentStyle={{
                backgroundColor: '#FAFAF9',
                border: '1px solid #E7E5E4',
                borderRadius: '8px'
              }}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#5C715C"
              strokeWidth={2}
              dot={{ fill: '#5C715C', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Day of Week Pattern */}
      <div className="card">
        <h3 className="text-xl font-display font-semibold text-warmGray-900 mb-6">
          Spending by Day of Week
        </h3>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dayOfWeekData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#78716C', fontSize: 12 }}
              stroke="#D6D3D1"
            />
            <YAxis
              tick={{ fill: '#78716C', fontSize: 12 }}
              stroke="#D6D3D1"
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              formatter={(value) => [`$${value}`, 'Total']}
              contentStyle={{
                backgroundColor: '#FAFAF9',
                border: '1px solid #E7E5E4',
                borderRadius: '8px'
              }}
            />
            <Bar
              dataKey="amount"
              fill="#C96846"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>

        <p className="mt-4 text-sm text-warmGray-600 text-center">
          Understanding when you spend can reveal patterns tied to your weekly rhythm
        </p>
      </div>
    </div>
  );
}
