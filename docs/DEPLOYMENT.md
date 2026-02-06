# Deployment Guide for Smart Expense Coach

This guide will help you deploy Smart Expense Coach to GitHub Pages.

## Prerequisites

- A GitHub account
- Git installed on your computer
- Node.js 18+ installed

## Step 1: Fork or Clone the Repository

### Option A: Fork (Recommended for contributing)
1. Go to the repository on GitHub
2. Click the "Fork" button in the top right
3. Clone your fork:
```bash
git clone https://github.com/YOUR-USERNAME/smart-expense-coach.git
cd smart-expense-coach
```

### Option B: Clone directly
```bash
git clone https://github.com/original-author/smart-expense-coach.git
cd smart-expense-coach
```

## Step 2: Update Configuration

Edit `vite.config.js` and update the `base` path to match your repository name:

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/smart-expense-coach/', // Change this to match your repo name
  // ...
})
```

If your repository is named differently (e.g., `my-expense-app`), use:
```javascript
base: '/my-expense-app/',
```

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Test Locally

Before deploying, test that everything works:

```bash
# Start development server
npm run dev

# Build for production and preview
npm run build
npm run preview
```

Visit the URLs shown in the terminal to test the app.

## Step 5: Deploy to GitHub Pages

### First-time Setup

1. Install gh-pages (if not already in package.json):
```bash
npm install --save-dev gh-pages
```

2. Ensure the deploy script is in `package.json`:
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

### Deploy

```bash
npm run deploy
```

This will:
- Build the production bundle
- Create/update the `gh-pages` branch
- Push the built files to GitHub

## Step 6: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings"
3. Scroll down to "Pages" in the left sidebar
4. Under "Source", select:
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)`
5. Click "Save"

## Step 7: Access Your Deployed App

After a few minutes, your app will be live at:

```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
```

For example:
```
https://johndoe.github.io/smart-expense-coach/
```

## Troubleshooting

### Issue: 404 Error or Blank Page

**Problem**: The base path in vite.config.js doesn't match your repository name.

**Solution**: 
1. Update `vite.config.js` with the correct base path
2. Run `npm run deploy` again

### Issue: Assets not loading (CSS/JS)

**Problem**: Same as above - base path mismatch.

**Solution**: 
1. Check browser console for 404 errors
2. Verify the base path matches your repo name exactly
3. Redeploy

### Issue: Changes not appearing

**Problem**: Browser cache or GitHub Pages cache.

**Solution**:
1. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
2. Wait a few minutes for GitHub Pages to rebuild
3. Check the deployment status in your repo's "Actions" tab

### Issue: Build fails locally

**Problem**: Missing dependencies or Node version mismatch.

**Solution**:
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Ensure you're using Node 18+: `node --version`

## Updating Your Deployment

Whenever you make changes:

```bash
# Make your changes
git add .
git commit -m "Description of changes"
git push origin main  # or master

# Deploy the new version
npm run deploy
```

## Custom Domain (Optional)

To use a custom domain like `expense-coach.com`:

1. Add a `CNAME` file to the `public/` directory with your domain:
```
expense-coach.com
```

2. Configure your domain's DNS:
   - Add a CNAME record pointing to `YOUR-USERNAME.github.io`
   - Or add A records pointing to GitHub's IPs

3. In GitHub repo settings > Pages:
   - Enter your custom domain
   - Enable "Enforce HTTPS"

See [GitHub's custom domain guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site) for details.

## Security Considerations

Since this is a privacy-focused app:

1. ✅ No backend or API keys needed
2. ✅ All processing is client-side
3. ✅ No environment variables to configure
4. ✅ No secrets to protect

The static deployment on GitHub Pages is perfect for this use case.

## Performance Tips

The app is already optimized, but you can:

1. Check bundle size:
```bash
npm run build
```

2. Analyze the build:
```bash
npm install --save-dev rollup-plugin-visualizer
# Add to vite.config.js if needed
```

3. The app uses code-splitting and lazy loading automatically via Vite

## Support

If you encounter issues:

1. Check the browser console for errors
2. Verify all CSV examples work locally
3. Check GitHub Actions for build errors
4. Open an issue on GitHub with details

---

**You're all set!** Your privacy-first expense coach is now live and accessible to anyone with the URL.
