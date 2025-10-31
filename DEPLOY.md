# Deploy Inventory App to Vercel

## Quick Deploy Guide

This guide will help you deploy the inventory cycle count application to Vercel so anyone can access it from their phones anywhere.

### Prerequisites

- GitHub account (you have this)
- Vercel account (you have this)
- GitHub repo: `https://github.com/LMW-Labs/inventory-app`

## Step-by-Step Deployment

### 1. Push Code to GitHub

First, copy all files from `inventory-vercel` folder to your GitHub repository:

```bash
cd /home/info/mydevbook/inventory-vercel

# Initialize git if not already done
git init

# Add your GitHub repository as remote
git remote add origin https://github.com/LMW-Labs/inventory-app.git

# Add all files
git add .

# Commit
git commit -m "Initial Vercel deployment setup"

# Push to GitHub
git push -u origin main
```

**Important files that should be in your repo:**
- `api/index.py` - Backend API
- `public/index.html` - Frontend HTML
- `public/styles.css` - Styling
- `public/script.js` - JavaScript logic
- `vercel.json` - Vercel configuration
- `requirements.txt` - Python dependencies
- `DEPLOY.md` - This file

### 2. Set Up Vercel Project

1. Go to [vercel.com](https://vercel.com) and log in
2. Click "Add New..." → "Project"
3. Import your GitHub repository: `LMW-Labs/inventory-app`
4. Vercel will auto-detect the settings
5. **DO NOT DEPLOY YET** - we need to add the database first

### 3. Add Vercel Postgres Database

**This is the most important step!**

1. In your Vercel project dashboard, go to the "Storage" tab
2. Click "Create Database"
3. Select "Postgres"
4. Choose a name (e.g., "inventory-db")
5. Select a region close to your users
6. Click "Create"
7. Wait for the database to be created
8. Vercel will automatically add the `POSTGRES_URL` environment variable to your project

### 4. Deploy the Application

1. Go back to your project settings
2. Click "Deployments" tab
3. Click "Deploy" or trigger a new deployment
4. Wait for deployment to complete (2-3 minutes)
5. You'll get a URL like: `https://inventory-app-xxx.vercel.app`

### 5. Initialize the Database (One-Time)

After first deployment, you need to create the database tables:

**Option A: Using Browser**
1. Open your deployed URL: `https://your-app.vercel.app`
2. Open browser console (F12)
3. Run this JavaScript command:
```javascript
fetch('/api/init', {method: 'POST'})
  .then(r => r.json())
  .then(d => console.log(d))
```

**Option B: Using curl**
```bash
curl -X POST https://your-app.vercel.app/api/init
```

You should see: `{"success": true, "message": "Database initialized successfully"}`

### 6. Test the Application

1. Open your Vercel URL on your phone
2. Upload the `email.xlsx` file (you'll need to transfer it to your phone or access from cloud storage)
3. Grant camera permissions when prompted
4. Start scanning barcodes!

### 7. Share with Your Team

Simply share the Vercel URL with anyone who needs to use the app:
- `https://your-app.vercel.app`

They can:
- Open it on any phone (iOS or Android)
- Works in any modern browser (Chrome, Safari, Firefox, Edge)
- No installation required
- Always uses the latest version

## Environment Variables

Vercel automatically sets these when you create the Postgres database:
- `POSTGRES_URL` - Database connection string
- `POSTGRES_PRISMA_URL` - Alternative connection URL
- `POSTGRES_URL_NON_POOLING` - Direct connection

**You don't need to manually configure these!**

## Custom Domain (Optional)

If you want a custom domain like `inventory.yourcompany.com`:

1. Go to your Vercel project → "Settings" → "Domains"
2. Add your custom domain
3. Follow Vercel's DNS configuration instructions
4. Wait for SSL certificate to be issued (automatic)

## Updating the App

To deploy updates:

```bash
cd /home/info/mydevbook/inventory-vercel

# Make your changes to the code

git add .
git commit -m "Description of changes"
git push

# Vercel automatically deploys when you push to main branch!
```

## Troubleshooting

### Database Connection Errors

If you see database errors:
1. Check that Postgres database is created in Vercel
2. Verify `POSTGRES_URL` environment variable exists
3. Re-deploy the app
4. Run the `/api/init` endpoint again

### Camera Not Working

- Ensure you're using HTTPS (Vercel provides this automatically)
- Grant camera permissions in browser
- Try in Chrome or Safari (best compatibility)
- Some browsers block camera on HTTP (Vercel uses HTTPS so this won't be an issue)

### Upload Fails

- Check file size (Vercel has a 4.5MB limit for serverless functions)
- For larger files, you may need to upgrade Vercel plan or split the upload
- Verify the Excel file has correct column names:
  - `Instrument Number`
  - `Manufacturer's Serial`
  - `Description`
  - `Location`

### App is Slow

- Free tier has some limitations
- Consider upgrading to Vercel Pro for better performance
- Database queries are optimized but large inventories (10,000+ items) may need optimization

## Database Management

### View Database Data

1. Go to Vercel project → "Storage" → Your Postgres database
2. Click "Data" tab
3. You can run SQL queries directly:

```sql
-- View all inventory
SELECT * FROM inventory LIMIT 100;

-- View all scans
SELECT * FROM scans ORDER BY scanned_at DESC LIMIT 100;

-- View statistics
SELECT
    (SELECT COUNT(*) FROM inventory) as total_items,
    (SELECT COUNT(*) FROM scans WHERE matched = true) as scanned_items,
    (SELECT COUNT(*) FROM scans WHERE status = 'OVERAGE') as overages,
    (SELECT COUNT(*) FROM scans WHERE status = 'WRONG_LOCATION') as wrong_locations;
```

### Backup Database

Vercel provides automatic backups on paid plans. For manual backup:

1. Go to Storage → Your Database → "Data" tab
2. Export data using SQL:
```sql
COPY inventory TO STDOUT WITH CSV HEADER;
COPY scans TO STDOUT WITH CSV HEADER;
```

### Reset Everything

To clear all data and start fresh:

1. Use the "Reset Scan Data" button in the app (keeps inventory)
2. Or manually clear everything:
```sql
DELETE FROM scans;
DELETE FROM inventory;
```

## Security Notes

**Current Setup:**
- App is publicly accessible (anyone with URL can use it)
- No authentication required
- Database is secure and isolated

**For Production Use (Recommended):**

1. **Add Authentication** - Use Vercel's built-in auth or add a simple password
2. **Restrict Access** - Use Vercel's IP allowlist feature
3. **Add Rate Limiting** - Prevent abuse of the API
4. **Regular Backups** - Export data regularly

### Adding Simple Password Protection (Optional)

If you want to add basic password protection, let me know and I can add:
- Login page
- Password in environment variables
- Session management

## Monitoring

View app usage and errors:
1. Vercel Dashboard → Your Project → "Analytics"
2. See real-time logs in "Deployments" → Click deployment → "Logs"
3. Monitor function execution time and errors

## Costs

**Free Tier includes:**
- Unlimited deployments
- 100GB bandwidth/month
- Serverless function executions
- Basic Postgres database (60 hours compute/month)

**If you need more:**
- Vercel Pro: $20/month (better performance, more resources)
- Postgres Pro: More database capacity

For your use case, **free tier should be sufficient** unless you have very high usage.

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors (F12)
3. Verify database is created and connected
4. Make sure `/api/init` was called once

## Next Steps After Deployment

1. Test thoroughly with sample data
2. Upload your actual inventory spreadsheet
3. Train team members on how to use it
4. Share the URL with everyone who needs access
5. Set up regular exports/backups of scan data

---

**Your app will be live at:** `https://inventory-app-xxx.vercel.app`

**GitHub repo:** `https://github.com/LMW-Labs/inventory-app`

**Ready to deploy!** 🚀
