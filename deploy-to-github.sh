#!/bin/bash

echo "================================================"
echo "Deploy Inventory App to GitHub/Vercel"
echo "================================================"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "Error: git is not installed"
    exit 1
fi

# Initialize git if needed
if [ ! -d .git ]; then
    echo "Initializing git repository..."
    git init
    git branch -M main
fi

# Add remote if not exists
if ! git remote | grep -q origin; then
    echo "Adding GitHub remote..."
    git remote add origin https://github.com/LMW-Labs/inventory-app.git
fi

echo "Current status:"
git status

echo ""
echo "Adding files..."
git add .

echo ""
read -p "Enter commit message (or press Enter for default): " commit_msg
if [ -z "$commit_msg" ]; then
    commit_msg="Update inventory app for Vercel deployment"
fi

echo "Committing changes..."
git commit -m "$commit_msg"

echo ""
echo "Pushing to GitHub..."
git push -u origin main

echo ""
echo "================================================"
echo "Code pushed to GitHub!"
echo "================================================"
echo ""
echo "Next steps:"
echo "1. Go to https://vercel.com"
echo "2. Import your repository: LMW-Labs/inventory-app"
echo "3. Create a Postgres database in Storage tab"
echo "4. Deploy the project"
echo "5. Visit your deployed URL"
echo "6. Initialize database: POST request to /api/init"
echo ""
echo "See DEPLOY.md for detailed instructions"
echo "================================================"
