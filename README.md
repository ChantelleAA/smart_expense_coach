# Smart Expense Coach

A privacy-first web application that helps you understand your spending patterns through gentle, non-judgmental insights. Built entirely with client-side technology—your data never leaves your device.

## 🌟 What is This?

Smart Expense Coach analyzes your bank statements locally in your browser to help you understand **why** you spend money the way you do. It's not a budgeting app or financial advisor—it's more like a thoughtful friend who helps you recognize patterns in your behavior.

### Key Features

- **Privacy-First**: All processing happens in your browser.
- **Behavioral Insights**: Discover patterns like late-night spending, weekend splurges, or convenience habits
- **Auto-Categorization**: Intelligent categorization with learning from your manual corrections
- **Visual Analytics**: Clean charts showing spending trends and category breakdowns
- **Weekly Summaries**: Thoughtful reflections on your spending patterns
- **Export Options**: Download insights as markdown or export categorized data

## 🔒 Privacy Commitment

**Your financial data is yours alone.**

- ✅ All data processing happens in your browser
- ✅ Nothing is sent to any server, ever
- ✅ Data is stored locally using IndexedDB/localStorage
- ✅ No tracking, no analytics, no third-party scripts
- ✅ No user accounts or authentication required
- ✅ Open source—verify it yourself

## 📁 Supported File Formats

### CSV Files (Recommended)
The most reliable format. Most banks allow you to export transactions as CSV.

**How to get a CSV:**
1. Log into your online banking
2. Find "Export" or "Download transactions"
3. Choose CSV format
4. Select your date range
5. Download and upload to Smart Expense Coach

### PDF Files (Text-based only)
Works for PDFs with selectable text. **Does not support scanned PDFs or images.**

**Important:** If PDF extraction fails, the app will recommend using CSV instead.

## 🚀 Getting Started

### For Users

1. Visit the deployed app: [GitHub Pages URL]
2. Upload your bank statement (CSV recommended)
3. Review auto-categorized transactions
4. Explore insights and patterns
5. Adjust categories as needed

### For Developers

#### Prerequisites
- Node.js 18+ and npm

#### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/smart-expense-coach.git
cd smart-expense-coach

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

#### Project Structure

```
smart-expense-coach/
├── src/
│   ├── components/          # React components
│   │   ├── FileUpload.jsx   # File upload with drag-and-drop
│   │   ├── TransactionList.jsx
│   │   ├── InsightsPanel.jsx
│   │   ├── WeeklySummary.jsx
│   │   ├── CategoryManager.jsx
│   │   ├── Charts.jsx
│   │   └── PrivacyBanner.jsx
│   ├── utils/               # Core utilities
│   │   ├── csvParser.js     # CSV parsing with auto-detection
│   │   ├── pdfParser.js     # PDF text extraction
│   │   ├── categorizer.js   # Transaction categorization
│   │   ├── insightEngine.js # Pattern detection & insights
│   │   └── storage.js       # Local storage management
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── docs/                    # Example files
│   └── example-transactions.csv
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎨 Design Philosophy

### Calm & Reflective
- Warm, neutral color palette (cream, sage, terracotta)
- Editorial typography (Crimson Pro + Inter)
- Generous whitespace
- Subtle, purposeful animations

### Non-Judgmental Language
The app uses observational language that helps you understand patterns without creating guilt or pressure:

❌ **Don't say:** "You're overspending on food delivery"  
✅ **Do say:** "You tend to use delivery services more on busy weekdays. This is common when energy is low."

### Privacy-Forward Design
Every interaction reinforces that data stays local:
- Clear privacy messaging throughout
- "Clear all data" button always accessible
- No hidden processes or background uploads

## 📊 How It Works

### 1. File Upload
- Drag-and-drop or file picker
- Automatic column detection for CSV
- Text extraction and validation for PDF

### 2. Parsing & Normalization
- Detects date formats, amount columns, descriptions
- Handles various CSV structures
- Normalizes into unified transaction schema

### 3. Categorization
- Keyword-based rules engine
- Categories: Essentials, Lifestyle, Convenience, Impulse, Subscriptions
- Learns from your manual corrections
- Detects recurring transactions

### 4. Insight Generation
Pattern detection for:
- Day-of-week spending habits
- Time-of-day patterns (e.g., late-night purchases)
- Small purchases that add up
- Subscription detection and totals
- Monthly spending curves
- Convenience spending during busy periods
- Category balance analysis

### 5. Weekly Summary
Generates a thoughtful summary with:
- One key pattern discovered
- One gentle suggestion (phrased as reflection)
- One positive observation

## 🛠️ Technology Stack

- **Frontend**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (heavily customized)
- **Charts**: Recharts
- **CSV Parsing**: PapaParse
- **PDF Parsing**: PDF.js
- **Date Handling**: date-fns
- **Storage**: IndexedDB with localStorage fallback

## 🌐 Deployment to GitHub Pages

### One-time Setup

1. Update `vite.config.js` with your repository name:

```javascript
export default defineConfig({
  base: '/your-repo-name/',  // Update this
  // ...
})
```

2. Install gh-pages:

```bash
npm install --save-dev gh-pages
```

### Deploy

```bash
npm run deploy
```

This will:
1. Build the production bundle
2. Deploy to the `gh-pages` branch
3. Your app will be live at: `https://yourusername.github.io/your-repo-name/`

### GitHub Pages Settings

1. Go to your repository settings
2. Navigate to "Pages"
3. Source: Deploy from branch
4. Branch: `gh-pages` / `root`
5. Save

## 📝 Example CSV Format

The app handles various CSV formats automatically. Here's a simple example:

```csv
Date,Description,Amount
2024-01-15,Whole Foods Market,-87.32
2024-01-16,Netflix,-15.99
2024-01-16,Uber Ride,-18.50
2024-01-17,Direct Deposit,2500.00
```

More example files are available in the `/docs` folder.

## 🎯 What This App Is NOT

- ❌ Not a budgeting tool (no budget creation or tracking)
- ❌ Not financial advice (no recommendations about saving or investing)
- ❌ Not connected to your bank (manual file upload only)
- ❌ Not a forecasting tool (no predictions about future spending)
- ❌ Not a bill tracker (no reminders or alerts)

## 🤝 Contributing

Contributions are welcome! This is a privacy-focused tool, so please ensure:

1. No network requests except for loading app resources
2. No external analytics or tracking
3. All processing remains client-side
4. Maintain the calm, non-judgmental tone in copy

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

Built with the philosophy that financial awareness should be:
- **Private** - Your data is yours
- **Thoughtful** - Insights, not instructions
- **Kind** - Understanding, not judgmental
- **Empowering** - Knowledge without pressure

---

**Note**: This app does not provide financial advice. It helps you understand patterns in your spending behavior. For financial planning, consult a licensed financial advisor.
