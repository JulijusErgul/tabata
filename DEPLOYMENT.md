# GitHub Pages Deployment Guide

This guide will help you deploy your Tabata Timer app to GitHub Pages.

## Prerequisites

1. **GitHub Account**: Make sure you have a GitHub account
2. **Repository**: Your project should be pushed to a GitHub repository
3. **Repository Name**: The repository should be named `mitt-projekt` (or update the baseHref in angular.json)

## Step-by-Step Deployment

### 1. Push Your Code to GitHub

First, commit and push all your changes:

```bash
# Add all files
git add .

# Commit changes
git commit -m "Add Tabata Timer with GitHub Pages deployment"

# Push to GitHub
git push origin master
```

### 2. Enable GitHub Pages

1. Go to your GitHub repository
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select **GitHub Actions**
5. This will enable automatic deployment

### 3. Automatic Deployment

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will automatically:
- Build your Angular app for GitHub Pages
- Deploy it to the `gh-pages` branch
- Make it available at `https://yourusername.github.io/mitt-projekt/`

### 4. Manual Deployment (Alternative)

If you prefer manual deployment:

```bash
# Build for GitHub Pages
npm run build:github-pages

# Deploy using angular-cli-ghpages
npm run deploy
```

### 5. Verify Deployment

After deployment (automatic or manual):
1. Go to your repository settings
2. Navigate to **Pages** section
3. You should see a green checkmark indicating successful deployment
4. Click on the provided URL to view your live app

## Configuration Details

### Base Href
The app is configured with `baseHref: "/mitt-projekt/"` in the GitHub Pages build configuration. If your repository has a different name, update this in `angular.json`.

### Build Configuration
- **Production build** with optimizations
- **Output hashing** for cache busting
- **Proper asset paths** for GitHub Pages

## Troubleshooting

### Common Issues

1. **404 Errors**: Make sure the baseHref matches your repository name
2. **Build Failures**: Check that all dependencies are installed
3. **Styling Issues**: Ensure Material Design CSS is properly loaded

### Debugging

1. Check GitHub Actions logs for build errors
2. Verify the `gh-pages` branch contains the built files
3. Test locally with `npm run build:github-pages`

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to your repository root with your domain
2. Configure DNS settings with your domain provider
3. Update the baseHref in `angular.json` to `/` (root)

## Security

- The deployment uses `GITHUB_TOKEN` for authentication
- No sensitive data is exposed in the build
- All dependencies are from trusted sources

## Performance

The deployed app is optimized for:
- **Fast loading**: Minified and compressed assets
- **Caching**: Proper cache headers and file hashing
- **Mobile**: Responsive design for all devices

Your Tabata Timer will be live at: `https://yourusername.github.io/mitt-projekt/` 
