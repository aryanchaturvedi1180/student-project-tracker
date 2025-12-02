# 🚀 Git Setup & Push to GitHub - Step by Step Guide

## Repository URL
```
https://github.com/aryanchaturvedi1180/student-project-tracker.git
```

## 📋 Complete Git Commands

Run these commands **one by one** in your terminal from the project root directory:

### Step 1: Navigate to Project Directory
```bash
cd "/Users/aryanchaturvedi/Desktop/PROJECTS/Monitoring App"
```

### Step 2: Initialize Git (if not already initialized)
```bash
git init
```

### Step 3: Set Default Branch to 'main'
```bash
git branch -M main
```

### Step 4: Add All Files (respecting .gitignore)
```bash
git add .
```

### Step 5: Verify What Will Be Committed
```bash
git status
```
*This shows you what files will be committed. Verify that `node_modules`, `.env`, and `.DS_Store` are NOT listed.*

### Step 6: Create Initial Commit
```bash
git commit -m "Initial commit: full project upload"
```

### Step 7: Add Remote Repository
```bash
git remote add origin https://github.com/aryanchaturvedi1180/student-project-tracker.git
```

### Step 8: Verify Remote Connection
```bash
git remote -v
```
*Should show your repository URL twice (fetch and push)*

### Step 9: Push to GitHub
```bash
git push -u origin main
```

## ✅ Success!

After Step 9, you should see:
```
Enumerating objects: X, done.
Counting objects: 100% (X/X), done.
Writing objects: 100% (X/X), done.
To https://github.com/aryanchaturvedi1180/student-project-tracker.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

## 🔧 Troubleshooting

### If Git is Already Initialized
If you see "Reinitialized existing Git repository", that's fine. Continue with the steps.

### If Remote Already Exists
If you get "fatal: remote origin already exists", run:
```bash
git remote remove origin
git remote add origin https://github.com/aryanchaturvedi1180/student-project-tracker.git
```

### If You Need to Authenticate
GitHub may ask for credentials. Use:
- **Personal Access Token** (recommended) instead of password
- Or set up SSH keys for passwordless authentication

### If Push is Rejected
If you get "failed to push some refs", the repository might have existing content. Use:
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

## 📝 Quick Copy-Paste (All Commands at Once)

```bash
cd "/Users/aryanchaturvedi/Desktop/PROJECTS/Monitoring App"
git init
git branch -M main
git add .
git status
git commit -m "Initial commit: full project upload"
git remote add origin https://github.com/aryanchaturvedi1180/student-project-tracker.git
git remote -v
git push -u origin main
```

## 🎯 What Gets Ignored (Already in .gitignore)

✅ `node_modules/` - Dependencies (not tracked)
✅ `.env` - Environment variables (not tracked)
✅ `.DS_Store` - macOS system files (not tracked)
✅ `dist/`, `build/` - Build outputs (not tracked)
✅ `*.log` - Log files (not tracked)

## 📦 Files That WILL Be Pushed

- ✅ All source code (`.js`, `.jsx`, `.json`, etc.)
- ✅ Configuration files (`package.json`, `vite.config.js`, etc.)
- ✅ Documentation (`README.md`, etc.)
- ✅ `.gitignore` file itself

---

**After pushing, verify on GitHub:**
1. Go to: https://github.com/aryanchaturvedi1180/student-project-tracker
2. Check that all your files are there
3. Verify `node_modules` and `.env` are NOT visible

