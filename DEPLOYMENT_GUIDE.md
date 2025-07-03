# IRIS-AI Enterprise Platform - Deployment Guide

## 🚀 Quick Deployment to Vercel

### Prerequisites
- Node.js 18+ installed
- Git repository
- Vercel account (free tier available)

### 1. Prepare Your Project

```bash
# Clone or navigate to your project
cd aiden-enterprise

# Install dependencies
npm install

# Test build locally
npm run build
```

### 2. Deploy to Vercel

#### Option A: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# For production deployment
vercel --prod
```

#### Option B: GitHub Integration
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure settings (see below)

### 3. Environment Variables

Set these in your Vercel dashboard under Settings > Environment Variables:

#### Required Variables
```
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
NEXT_PUBLIC_APP_NAME=IRIS-AI Enterprise
NEXT_PUBLIC_APP_DESCRIPTION=Advanced AI-driven defense and healthcare automation platform
NEXT_PUBLIC_APP_VERSION=2.1.0
```

#### Optional Variables
```
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
OPENAI_API_KEY=your_openai_api_key
```

### 4. Vercel Configuration

The project includes a `vercel.json` file with:
- ✅ **Security Headers**: XSS protection, CSRF prevention
- ✅ **Performance**: Optimized caching and compression
- ✅ **Enterprise Features**: CORS, redirects, rewrites
- ✅ **Function Timeout**: 30-second API timeout
- ✅ **Clean URLs**: SEO-friendly routing

## 🔧 Troubleshooting

### Account Suspended Error
If you see "Your account has been suspended", this means:
1. The current Vercel account has billing issues
2. **Solution**: Create a new Vercel account or add payment method

### Build Failures
Common build issues and solutions:

#### TypeScript Errors
```bash
# The build is configured to ignore TypeScript errors
# But you can fix them with:
npm run type-check
```

#### Missing Dependencies
```bash
# Install missing packages
npm install
```

#### Memory Issues
```bash
# Increase Node memory for large builds
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### Performance Optimization
The project is already optimized with:
- ✅ **35 Static Pages** generated
- ✅ **Code Splitting** for optimal loading
- ✅ **Image Optimization** with WebP/AVIF
- ✅ **Compression** enabled
- ✅ **Caching** headers configured

## 📊 Deployment Results

### Build Stats
- **Total Pages**: 35 static pages
- **Bundle Size**: ~438 KB first load
- **API Routes**: 17 serverless functions
- **Build Time**: ~30 seconds
- **Deployment Time**: ~60 seconds

### Performance Metrics
- **Lighthouse Score**: 90+ (expected)
- **First Contentful Paint**: <2s
- **Time to Interactive**: <3s
- **Cumulative Layout Shift**: <0.1

## 🌐 Custom Domain Setup

### 1. Add Domain in Vercel
1. Go to your project dashboard
2. Click "Domains"
3. Add your custom domain

### 2. Configure DNS
Point your domain to Vercel:
```
A Record: 76.76.19.61
CNAME: cname.vercel-dns.com
```

### 3. SSL Certificate
Vercel automatically provisions SSL certificates for all domains.

## 🔐 Security Features

### Headers Configured
- **X-Frame-Options**: DENY
- **X-Content-Type-Options**: nosniff
- **Referrer-Policy**: strict-origin-when-cross-origin
- **Permissions-Policy**: Restricted camera/microphone
- **X-XSS-Protection**: Enabled
- **Strict-Transport-Security**: 1 year

### CORS Configuration
API routes are configured with proper CORS headers for secure cross-origin requests.

## 🚀 Alternative Deployment Options

### 1. Netlify
```bash
# Build command
npm run build

# Publish directory
out/

# Environment variables
# Same as Vercel configuration
```

### 2. GitHub Pages
```bash
# Add to package.json
"homepage": "https://yourusername.github.io/iris-ai-enterprise",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d out"
}
```

### 3. AWS Amplify
```bash
# Build settings
build:
  commands:
    - npm run build
  artifacts:
    baseDirectory: out
    files:
      - '**/*'
```

## 📈 Monitoring & Analytics

### Built-in Analytics
- **User Engagement**: Tour completion rates
- **Performance**: Page load times
- **Feature Usage**: Component interaction tracking
- **Error Tracking**: Automatic error boundaries

### Third-party Integration
- **Google Analytics**: Ready for GA4 integration
- **Mixpanel**: User behavior tracking
- **Sentry**: Error monitoring
- **LogRocket**: Session replay

## 🔄 Continuous Deployment

### GitHub Actions
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🎯 Production Checklist

### Before Deployment
- [ ] Test build locally (`npm run build`)
- [ ] Check all environment variables
- [ ] Verify API endpoints work
- [ ] Test responsive design
- [ ] Validate performance metrics

### After Deployment
- [ ] Test all major features
- [ ] Verify SSL certificate
- [ ] Check analytics setup
- [ ] Test error handling
- [ ] Validate security headers

## 📞 Support

For deployment issues:
1. Check the [Vercel Documentation](https://vercel.com/docs)
2. Review build logs in Vercel dashboard
3. Test locally with `npm run build` and `npm run start`
4. Check GitHub Issues for known problems

---

**🎉 Your IRIS-AI Enterprise platform is now ready for production deployment!** 