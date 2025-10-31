# Quick Start - Deploy in 10 Minutes

## Prerequisites
- [x] GitHub account
- [x] Vercel account
- [x] GitHub repo: `https://github.com/LMW-Labs/inventory-app`

## Step 1: Push Code to GitHub (2 minutes)

```bash
cd /home/info/mydevbook/inventory-vercel

# Run the deployment script
./deploy-to-github.sh
```

Or manually:
```bash
git init
git branch -M main
git remote add origin https://github.com/LMW-Labs/inventory-app.git
git add .
git commit -m "Initial Vercel deployment"
git push -u origin main
```

## Step 2: Deploy to Vercel (5 minutes)

1. **Go to Vercel:** https://vercel.com/login
2. **Click:** "Add New..." → "Project"
3. **Import:** Select `LMW-Labs/inventory-app` from your repositories
4. **Configure:** Leave all settings as default (Vercel auto-detects everything)
5. **WAIT - Don't deploy yet!**

## Step 3: Add Database (2 minutes)

1. In the project import screen, look for "Storage" or go to project settings after import
2. **OR** after creating the project, click "Storage" tab
3. Click "Create Database"
4. Select **"Postgres"**
5. Name it: `inventory-db`
6. Choose closest region
7. Click "Create"
8. Wait for database creation (~30 seconds)

**Vercel automatically adds `POSTGRES_URL` environment variable**

## Step 4: Deploy (1 minute)

1. Click "Deploy" button
2. Wait 2-3 minutes for deployment
3. You'll get a URL like: `https://inventory-app-abc123.vercel.app`

## Step 5: Initialize Database (30 seconds)

**One-time setup** - Create the database tables:

Open your browser to:
```
https://your-app.vercel.app
```

Open browser console (Press F12), then run:
```javascript
fetch('/api/init', {method: 'POST'})
  .then(r => r.json())
  .then(d => console.log(d))
```

You should see:
```json
{"success": true, "message": "Database initialized successfully"}
```

## Step 6: Test It! (2 minutes)

1. **Open on phone:** `https://your-app.vercel.app`
2. **Upload spreadsheet:** Use your `email.xlsx` file
3. **Grant camera access** when prompted
4. **Scan a barcode** or enter manually
5. **Check statistics** update in real-time
6. **Export report** to verify it works

## Done! Share with Team

Give this URL to anyone who needs to use the app:
```
https://your-app.vercel.app
```

They can use it immediately from any phone!

---

## Common Issues

### "Cannot find module" error
- Make sure `requirements.txt` is in the root
- Redeploy from Vercel dashboard

### Database connection error
- Ensure Postgres database is created
- Check environment variables: Settings → Environment Variables
- Should have `POSTGRES_URL` set
- Re-run `/api/init` endpoint

### Camera not working
- HTTPS is required (Vercel provides this automatically ✓)
- Grant camera permissions in browser
- Try Chrome or Safari

### Can't push to GitHub
- Check you have write access to the repo
- Make sure you're authenticated with GitHub
- Try: `git push --set-upstream origin main`

---

## What You Get

**Free Tier (No Credit Card Required):**
- ✓ Unlimited deployments
- ✓ HTTPS (SSL) automatically
- ✓ 100GB bandwidth/month
- ✓ Serverless functions
- ✓ Postgres database (60 hours/month)
- ✓ Auto-scaling
- ✓ Real-time logs

**This is FREE and perfect for your use case!**

---

## Your App URLs

| What | URL |
|------|-----|
| GitHub Repo | https://github.com/LMW-Labs/inventory-app |
| Live App | https://your-app.vercel.app |
| Vercel Dashboard | https://vercel.com/dashboard |
| Database | Vercel → Your Project → Storage |

---

## Next Time You Need Changes

1. Edit files locally
2. Commit: `git add . && git commit -m "changes"`
3. Push: `git push`
4. **Vercel auto-deploys!** (No manual deploy needed)

---

## Need Help?

See detailed guides:
- **[DEPLOY.md](DEPLOY.md)** - Full deployment guide
- **[README.md](README.md)** - App documentation

---

**Total Time: ~10 minutes**

**Cost: $0 (Free tier)**

**Result: Professional web app accessible worldwide** 🚀
