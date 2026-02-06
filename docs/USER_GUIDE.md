# User Guide: Smart Expense Coach

Welcome! This guide will help you get the most out of Smart Expense Coach.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Uploading Your Data](#uploading-your-data)
3. [Understanding Your Dashboard](#understanding-your-dashboard)
4. [Working with Categories](#working-with-categories)
5. [Reading Your Insights](#reading-your-insights)
6. [Privacy & Data Management](#privacy--data-management)
7. [Tips for Best Results](#tips-for-best-results)

## Getting Started

Smart Expense Coach helps you understand your spending patterns by analyzing your bank statements locally on your device. Think of it as a thoughtful friend who helps you see patterns you might have missed.

### What You'll Need

- A bank statement from your bank (CSV or PDF format)
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- About 5 minutes

### What You Won't Need

- ❌ No account creation
- ❌ No passwords
- ❌ No credit card
- ❌ No personal information

## Uploading Your Data

### Step 1: Get Your Bank Statement

Most banks let you download your transaction history:

1. **Log into your online banking**
2. **Find the export option**. Look for:
   - "Export transactions"
   - "Download statement"
   - "Transaction history"
   - Usually in account details or statements section

3. **Choose CSV format** (recommended)
   - Some banks call it "Excel" or "Spreadsheet"
   - This is the most reliable format

4. **Select your date range**
   - Start with 1-3 months for best insights
   - You can always upload more later

5. **Download the file**

### Step 2: Upload to Smart Expense Coach

1. **Drag and drop** your file onto the upload area, or
2. **Click "Choose file"** and select your downloaded statement

The app will automatically:
- Detect the file format
- Find transaction columns (date, description, amount)
- Parse and categorize your transactions

### What If Upload Fails?

**If you see an error:**

- **For CSV**: The app couldn't find required columns
  - Solution: Make sure your CSV has date, description, and amount columns
  - Try a different date range or download option from your bank

- **For PDF**: The app couldn't extract text
  - Solution: Your PDF might be a scanned image
  - Download a CSV instead (much more reliable)

**Still having trouble?**
- Check the example CSV files in the `docs/` folder
- Try with a small date range first (1 month)

## Understanding Your Dashboard

Once your data is loaded, you'll see several tabs:

### Overview Tab

Shows your spending story at a glance:

- **Summary cards**: Total transactions, amount spent, and income
- **Key pattern**: The most interesting pattern discovered
- **Gentle suggestion**: A thoughtful reflection (not a command!)
- **Positive note**: Something good about your financial behavior
- **Charts**: Visual representations of your spending

### Insights Tab

Behavioral patterns discovered in your data:

- **Day-of-week patterns**: Do you spend more on Fridays?
- **Time-of-day habits**: Late-night purchases adding up?
- **Small purchase totals**: Those $5 coffees in perspective
- **Subscription detection**: Recurring charges you might forget about
- **Category balance**: Where your money actually goes

**Remember**: These are observations, not judgments!

### Transactions Tab

A detailed list of all transactions:

- **Search**: Find specific merchants or dates
- **Filter by category**: Focus on one type of spending
- **Sort**: By date, amount, or description
- **Edit categories**: Click any category badge to change it

### Categories Tab

Deep dive into each spending category:

- See total and percentage per category
- Average transaction size
- Number of purchases
- Largest single purchase

## Working with Categories

The app automatically categorizes transactions into:

- **🏠 Essentials**: Groceries, utilities, healthcare, rent
- **✨ Lifestyle**: Dining, entertainment, fitness, personal care
- **🚀 Convenience**: Delivery, rides, quick purchases
- **💫 Impulse**: Unplanned or spontaneous purchases
- **🔄 Subscriptions**: Recurring monthly charges
- **💰 Income**: Salary, refunds, deposits
- **↔️ Transfers**: Moving money between accounts

### Changing Categories

Click any category badge in the transaction list to change it. The app will remember your choice and apply it to similar transactions in the future.

**Why categorize?**
Better categories lead to better insights. The app learns from your corrections.

## Reading Your Insights

Insights are written to be:

- **Observational**: "You tend to..." not "You should..."
- **Understanding**: Context about why patterns happen
- **Non-judgmental**: No guilt, shame, or pressure
- **Actionable**: You can reflect on them, or not

### Example Insights

**Late-night spending**: 
> "About 18% of your purchases happen late at night. This is a common pattern when decision-making energy is lower."

**Notice**:
- ✅ States the fact (18%)
- ✅ Provides context (energy is lower)
- ✅ Normalizes it (common pattern)
- ❌ Doesn't say "stop doing this"

**Small purchases**: 
> "Your 45 small purchases (under $10) total $287.50. That's about $72 per week in small conveniences."

**Notice**:
- ✅ Shows the math
- ✅ Breaks it down (per week)
- ✅ Neutral term (conveniences)
- ❌ Doesn't judge or command

## Privacy & Data Management

### Where Is Your Data?

Your transaction data is stored:

- **In your browser**: Using IndexedDB or localStorage
- **On your device**: Never sent to any server
- **Under your control**: Delete anytime

### Clearing Your Data

Click "Clear all data" in the header to delete everything:

- All transactions
- All categories
- All settings
- Cannot be undone

**When to clear data:**
- You're done reviewing
- Using a shared computer
- Want to start fresh

### Using on Different Devices

Since data is local:
- Each device has its own data
- Upload files separately to each device
- Or export/import CSV to transfer

### Privacy Promise

Smart Expense Coach:
- ✅ Never sends data to servers
- ✅ Never uses tracking or analytics
- ✅ Never shares data with anyone
- ✅ Never requires login or account
- ✅ Is completely open source (verify it!)

## Tips for Best Results

### Getting Better Insights

1. **Upload 2-3 months of data**
   - More transactions = better pattern detection
   - At least 50-100 transactions recommended

2. **Review and correct categories**
   - The app learns from your corrections
   - Better categories = better insights

3. **Use regularly**
   - Upload new statements monthly
   - Track how patterns change over time

### Understanding Your Patterns

1. **Look for "why" not just "what"**
   - Don't just see that you spent $200 on delivery
   - Notice that it happens during busy work weeks

2. **Be curious, not critical**
   - Patterns reveal your life circumstances
   - High delivery might mean you're busy and stressed
   - That's information, not failure

3. **Use insights as starting points**
   - An insight about weekend spending might prompt:
     - "Am I decompressing from the work week?"
     - "Is this how I want to spend free time?"
     - "What need is this meeting?"

### Working with the Tool

1. **Export your insights**
   - Save as markdown for journaling
   - Reference when reviewing next month

2. **Try the example files**
   - Found in `docs/` folder
   - Good for testing features

3. **Adjust categories thoughtfully**
   - Is that coffee "convenience" or "lifestyle"?
   - There's no wrong answer - just your perspective

## Frequently Asked Questions

### Why are some transactions uncategorized?

The app uses keyword matching. Unusual merchant names might not match any category. Just click the badge to categorize manually.

### Can I change the categories?

Not yet, but you can reassign transactions. Future versions might allow custom categories.

### Why is the insight different from last time?

Insights are generated from patterns in your current data. Different time periods show different patterns.

### Can I connect to my bank directly?

No - this would require sending data to a server, breaking the privacy promise. Manual upload keeps you in control.

### Does this replace a budget?

No. This tool helps you understand patterns, not create budgets or track spending limits.

### Is my data really private?

Yes. You can verify by:
1. Check browser network tab - no outgoing requests
2. Review the source code (it's open source)
3. Disconnect from internet - app still works

### Can I use this for business expenses?

Sure! Upload any CSV with transaction data. The insights work for business spending too.

---

## Need Help?

- **Check the README.md** for technical details
- **Review example CSV files** in `docs/`
- **Open an issue on GitHub** if you find bugs

Remember: This tool is here to help you understand yourself, not judge you. Use it in whatever way serves you best.
