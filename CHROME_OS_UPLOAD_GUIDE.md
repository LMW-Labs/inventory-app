# Chrome OS Upload Guide - Create Files One by One

Since Chrome OS doesn't support folder uploads, create each file individually on GitHub.

## Order of Files to Create (from easiest to hardest):

### 1. Create `requirements.txt`
- Go to: https://github.com/LMW-Labs/inventory-app
- Click "Add file" → "Create new file"
- Name: `requirements.txt`
- Content:
```
Flask==3.0.0
flask-cors==4.0.0
pandas==2.1.4
openpyxl==3.1.2
psycopg2-binary==2.9.9
```
- Click "Commit new file"

### 2. Create `.gitignore`
- Click "Add file" → "Create new file"
- Name: `.gitignore`
- Copy content from: `/home/info/mydevbook/inventory-vercel/.gitignore`
- Click "Commit new file"

### 3. Create `vercel.json`
- Click "Add file" → "Create new file"
- Name: `vercel.json`
- Content:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "api/index.py"
    },
    {
      "src": "/(.*)",
      "dest": "/public/$1"
    }
  ]
}
```
- Click "Commit new file"

### 4. Create `api/index.py` (THE MOST IMPORTANT FILE!)
- Click "Add file" → "Create new file"
- Name: `api/index.py` (typing the `/` creates the folder!)
- Open this file on your computer: `/home/info/mydevbook/inventory-vercel/api/index.py`
- Select all (Ctrl+A) and copy
- Paste into GitHub
- Click "Commit new file"

### 5. Create `public/index.html`
- Click "Add file" → "Create new file"
- Name: `public/index.html`
- Open: `/home/info/mydevbook/inventory-vercel/public/index.html`
- Copy all content and paste
- Click "Commit new file"

### 6. Create `public/styles.css`
- Click "Add file" → "Create new file"
- Name: `public/styles.css`
- Open: `/home/info/mydevbook/inventory-vercel/public/styles.css`
- Copy all and paste
- Click "Commit new file"

### 7. Create `public/script.js`
- Click "Add file" → "Create new file"
- Name: `public/script.js`
- Open: `/home/info/mydevbook/inventory-vercel/public/script.js`
- Copy all and paste
- Click "Commit new file"

### 8. Create `README.md` (Optional but nice)
- Click "Add file" → "Create new file"
- Name: `README.md`
- Open: `/home/info/mydevbook/inventory-vercel/README.md`
- Copy and paste
- Click "Commit new file"

## Required Files for Vercel to Work:

### MUST HAVE (Vercel won't work without these):
1. ✓ `api/index.py` - Backend code
2. ✓ `public/index.html` - Frontend
3. ✓ `public/styles.css` - Styling
4. ✓ `public/script.js` - JavaScript
5. ✓ `vercel.json` - Configuration
6. ✓ `requirements.txt` - Python packages

### NICE TO HAVE (Optional):
- `README.md` - Documentation
- `.gitignore` - Git ignore rules
- Other .md files

## After Uploading Required Files:

**You're ready to deploy to Vercel!**

1. Go to: https://vercel.com/new
2. Import: LMW-Labs/inventory-app
3. Add Postgres database (Storage tab)
4. Deploy!
5. Initialize database: `POST /api/init`

---

## Shortcut: Use File Upload on Each File

Instead of copy-paste, you can also:
1. Click "Add file" → "Upload files"
2. Upload ONE file at a time
3. Before committing, edit the path to include folder:
   - Change `index.py` to `api/index.py`
   - Change `index.html` to `public/index.html`

This creates the folder structure!

---

Total time: 10-15 minutes for all files
