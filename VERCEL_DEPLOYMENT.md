# Vercel Deployment Guide

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel CLI
1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. In the project directory, run:
   ```bash
   vercel
   ```

3. Follow the prompts to configure your project

### Option 2: Deploy via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your Git repository or drag and drop the project folder
4. Vercel will automatically detect it's a Create React App project
5. Click "Deploy"

## Important Configuration

The project includes a `vercel.json` file that ensures:
- React Router works correctly with client-side routing
- All routes are properly handled
- Build process is optimized

## Environment Variables

No environment variables are required for this project.

## Build Process

Vercel will automatically:
1. Install dependencies (`npm install`)
2. Build the project (`npm run build`)
3. Deploy the `build` folder

## Routes

The application includes the following routes:
- `/` - Main pricing calculator
- `/contact-sales` - Contact sales form
- `/labs` - Available labs page

All routes are handled by React Router and will work correctly on Vercel.

## Troubleshooting

If you encounter issues:
1. Ensure `vercel.json` is in the root directory
2. Check that all dependencies are in `package.json`
3. Verify the build process works locally with `npm run build`

## Custom Domain

After deployment, you can add a custom domain in the Vercel dashboard under Project Settings > Domains.
