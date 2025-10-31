# How to Push Code to GitHub

The code is ready and committed locally. Now you need to push it to GitHub.

## Current Status
- ✓ All files are created
- ✓ Git repository initialized
- ✓ Files committed locally
- ✓ Remote configured: https://github.com/LMW-Labs/inventory-app.git
- ⏳ Needs to be pushed to GitHub

## Option 1: Push Using GitHub CLI (Recommended)

If you have GitHub CLI installed:

```bash
cd /home/info/mydevbook/inventory-vercel

# Login to GitHub (if not already logged in)
gh auth login

# Push to GitHub
git push -u origin main
```

## Option 2: Push Using Personal Access Token

1. **Create a Personal Access Token:**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Give it a name: "Inventory App Deploy"
   - Select scopes: `repo` (full control of private repositories)
   - Click "Generate token"
   - **Copy the token** (you won't see it again!)

2. **Push using the token:**
```bash
cd /home/info/mydevbook/inventory-vercel

# Push with token authentication
git push https://YOUR_TOKEN@github.com/LMW-Labs/inventory-app.git main
```

Replace `YOUR_TOKEN` with the token you copied.

## Option 3: Push Using SSH

1. **Set up SSH key (if not already done):**
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "info@lmwlabs.faith"

# Copy public key
cat ~/.ssh/id_ed25519.pub
```

2. **Add SSH key to GitHub:**
   - Go to: https://github.com/settings/keys
   - Click "New SSH key"
   - Paste your public key
   - Click "Add SSH key"

3. **Change remote URL and push:**
```bash
cd /home/info/mydevbook/inventory-vercel

# Change remote to SSH
git remote set-url origin git@github.com:LMW-Labs/inventory-app.git

# Push
git push -u origin main
```

## Option 4: Push from GitHub Desktop

1. Download GitHub Desktop: https://desktop.github.com
2. File → Add Local Repository
3. Select: `/home/info/mydevbook/inventory-vercel`
4. Click "Publish repository"

## Option 5: Manual Upload (If Git Push Fails)

1. Go to: https://github.com/LMW-Labs/inventory-app
2. Click "uploading an existing file"
3. Drag and drop all files from `/home/info/mydevbook/inventory-vercel/`
4. Click "Commit changes"

**Note:** This is less ideal but works as a fallback.

## After Successful Push

You'll see output like:
```
Enumerating objects: 12, done.
Counting objects: 100% (12/12), done.
Delta compression using up to 8 threads
Compressing objects: 100% (10/10), done.
Writing objects: 100% (12/12), 15.24 KiB | 3.81 MiB/s, done.
Total 12 (delta 0), reused 0 (delta 0)
To https://github.com/LMW-Labs/inventory-app.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

**Then proceed to deploy on Vercel!**

## Verify Push Succeeded

Visit: https://github.com/LMW-Labs/inventory-app

You should see all your files:
- api/index.py
- public/index.html
- public/styles.css
- public/script.js
- vercel.json
- requirements.txt
- README.md
- etc.

## Next Steps After Push

1. ✓ Code pushed to GitHub
2. → Go to [vercel.com](https://vercel.com)
3. → Import the repository
4. → Add Postgres database
5. → Deploy
6. → Initialize database tables
7. → Share URL with team

See [QUICKSTART.md](QUICKSTART.md) for Vercel deployment steps.

---

**Need help?** The most common issue is authentication. Use Option 1 (GitHub CLI) or Option 2 (Personal Access Token) for easiest setup.
