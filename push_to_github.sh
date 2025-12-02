#!/bin/bash
# Git Setup and Push Script for Student Project Tracker

echo "🚀 Starting Git Setup..."

# Step 1: Initialize Git
echo "📦 Step 1: Initializing Git..."
git init

# Step 2: Set branch to main
echo "🌿 Step 2: Setting branch to 'main'..."
git branch -M main

# Step 3: Add all files
echo "➕ Step 3: Adding all files (respecting .gitignore)..."
git add .

# Step 4: Show status
echo "📊 Step 4: Checking status..."
git status

# Step 5: Create commit
echo "💾 Step 5: Creating initial commit..."
git commit -m "Initial commit: full project upload"

# Step 6: Add remote
echo "🔗 Step 6: Adding remote repository..."
git remote add origin https://github.com/aryanchaturvedi1180/student-project-tracker.git

# Step 7: Verify remote
echo "✅ Step 7: Verifying remote connection..."
git remote -v

# Step 8: Push to GitHub
echo "🚀 Step 8: Pushing to GitHub..."
echo "⚠️  Note: You may need to authenticate with GitHub"
git push -u origin main

echo ""
echo "✅ Done! Check your repository at:"
echo "   https://github.com/aryanchaturvedi1180/student-project-tracker"
