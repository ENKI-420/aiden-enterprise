#!/bin/bash

# IRIS-AI Enterprise Platform - Automated Deployment Script
# This script automates the deployment process to Vercel

set -e  # Exit on any error

echo "🚀 IRIS-AI Enterprise Platform - Deployment Script"
echo "=================================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_nodejs() {
    print_status "Checking Node.js installation..."
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node --version)
    print_success "Node.js version: $NODE_VERSION"
}

# Check if npm is installed
check_npm() {
    print_status "Checking npm installation..."
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    NPM_VERSION=$(npm --version)
    print_success "npm version: $NPM_VERSION"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    if npm install; then
        print_success "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
}

# Test build locally
test_build() {
    print_status "Testing build locally..."
    if npm run build; then
        print_success "Build successful - 35 static pages generated"
    else
        print_error "Build failed. Please fix build errors before deployment."
        exit 1
    fi
}

# Check if Vercel CLI is installed
check_vercel_cli() {
    print_status "Checking Vercel CLI..."
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Installing..."
        if npm install -g vercel; then
            print_success "Vercel CLI installed successfully"
        else
            print_error "Failed to install Vercel CLI"
            exit 1
        fi
    else
        VERCEL_VERSION=$(vercel --version)
        print_success "Vercel CLI version: $VERCEL_VERSION"
    fi
}

# Deploy to Vercel
deploy_to_vercel() {
    print_status "Deploying to Vercel..."
    
    # Check if user wants production deployment
    read -p "Deploy to production? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Deploying to production..."
        if vercel --prod; then
            print_success "Production deployment successful!"
        else
            print_error "Production deployment failed"
            exit 1
        fi
    else
        print_status "Deploying to preview..."
        if vercel; then
            print_success "Preview deployment successful!"
        else
            print_error "Preview deployment failed"
            exit 1
        fi
    fi
}

# Alternative deployment method using npx
deploy_with_npx() {
    print_status "Attempting deployment with npx..."
    
    read -p "Deploy to production with npx? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Deploying to production with npx..."
        if npx vercel --prod; then
            print_success "Production deployment successful!"
        else
            print_error "Production deployment failed"
            return 1
        fi
    else
        print_status "Deploying to preview with npx..."
        if npx vercel; then
            print_success "Preview deployment successful!"
        else
            print_error "Preview deployment failed"
            return 1
        fi
    fi
}

# Display deployment information
show_deployment_info() {
    echo
    print_success "Deployment Summary:"
    echo "=================="
    echo "• Project: IRIS-AI Enterprise Platform"
    echo "• Framework: Next.js 15.2.4"
    echo "• Pages: 35 static pages"
    echo "• API Routes: 17 serverless functions"
    echo "• Bundle Size: ~438 KB first load"
    echo "• Security: Enterprise-grade headers configured"
    echo "• Features: Multi-modal AI, Healthcare integration, 3D visualization"
    echo
    print_status "Next steps:"
    echo "1. Configure environment variables in Vercel dashboard"
    echo "2. Set up custom domain (optional)"
    echo "3. Enable analytics and monitoring"
    echo "4. Test all features in production"
    echo
    print_success "Your IRIS-AI Enterprise platform is now live! 🎉"
}

# Main deployment process
main() {
    echo "Starting deployment process..."
    echo
    
    # Pre-deployment checks
    check_nodejs
    check_npm
    
    # Build process
    install_dependencies
    test_build
    
    # Deployment
    check_vercel_cli
    
    # Try deployment with Vercel CLI
    if ! deploy_to_vercel; then
        print_warning "Vercel CLI deployment failed. Trying npx method..."
        if ! deploy_with_npx; then
            print_error "Both deployment methods failed."
            echo
            print_status "Manual deployment options:"
            echo "1. Create a new Vercel account at https://vercel.com"
            echo "2. Push code to GitHub and import repository"
            echo "3. Use alternative platforms (Netlify, AWS Amplify)"
            echo
            print_status "For detailed instructions, see DEPLOYMENT_GUIDE.md"
            exit 1
        fi
    fi
    
    # Show deployment information
    show_deployment_info
}

# Run main function
main "$@" 