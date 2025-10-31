# Inventory Cycle Count Web Application

A mobile-friendly web application for performing inventory cycle counts using barcode scanning. Accessible from anywhere on any phone with a web browser.

**Live App:** `https://your-app.vercel.app` (after deployment)

## Features

- Upload inventory spreadsheets (Excel or CSV)
- Real-time barcode scanning using phone camera
- Manual barcode entry option
- Instant validation against inventory database
- Track shortages, overages, and wrong locations
- Real-time statistics dashboard
- Export detailed discrepancy reports to Excel
- Works on iOS and Android
- No app installation required
- Always up-to-date (cloud-hosted)

## Quick Start

### For Users (After Deployment)

1. Open the app URL on your phone: `https://your-app.vercel.app`
2. Upload your inventory spreadsheet
3. Grant camera permissions
4. Start scanning barcodes
5. Export reports when done

### For Developers (Deployment)

See [DEPLOY.md](DEPLOY.md) for complete deployment instructions.

**Quick deploy:**
1. Push this repo to GitHub
2. Connect to Vercel
3. Add Vercel Postgres database
4. Deploy
5. Initialize database tables

## How It Works

### Upload Spreadsheet
Upload an Excel or CSV file with these columns:
- **Instrument Number** - Unique instrument identifier
- **Manufacturer's Serial** - Manufacturer's serial number
- **Description** - Item description
- **Location** - Expected location code

### Scan Barcodes
Use your phone's camera to scan barcodes. The app automatically:
1. Detects and reads the barcode
2. Checks against **both** Instrument Number and Manufacturer's Serial
3. Shows instant feedback (match/no match)
4. Displays expected location
5. Records the scan

### View Results
Real-time statistics show:
- Total inventory items
- Items scanned
- Shortages (items not found)
- Overages (extra items found)
- Wrong locations (items in wrong place)

### Export Report
Generate an Excel report with:
- Summary statistics
- List of shortages
- List of overages
- List of wrong location items

## Technology Stack

**Frontend:**
- HTML5/CSS3/JavaScript
- jsQR library for barcode scanning
- Responsive mobile-first design
- Progressive Web App features

**Backend:**
- Python Flask serverless functions
- Vercel hosting platform
- Vercel Postgres database
- Pandas for spreadsheet parsing
- OpenPyXL for Excel export

**Infrastructure:**
- Vercel (hosting, serverless, database)
- GitHub (version control)
- HTTPS enabled by default
- Auto-scaling serverless architecture

## Project Structure

```
inventory-vercel/
├── api/
│   └── index.py          # Flask API serverless function
├── public/
│   ├── index.html        # Main web interface
│   ├── styles.css        # Responsive styling
│   └── script.js         # Barcode scanning logic
├── vercel.json           # Vercel configuration
├── requirements.txt      # Python dependencies
├── DEPLOY.md            # Deployment guide
└── README.md            # This file
```

## API Endpoints

- `POST /api/upload` - Upload inventory spreadsheet
- `POST /api/scan` - Process barcode scan
- `GET /api/stats` - Get current statistics
- `GET /api/export` - Download Excel report
- `POST /api/reset` - Reset scan data
- `POST /api/init` - Initialize database (one-time)

## Database Schema

**inventory table:**
- `id` - Primary key
- `instrument_number` - Instrument identifier
- `manufacturer_serial` - Manufacturer's serial number
- `description` - Item description
- `location` - Expected location
- `created_at` - Timestamp

**scans table:**
- `id` - Primary key
- `barcode` - Scanned barcode
- `matched` - Boolean (found in inventory)
- `inventory_id` - Foreign key to inventory
- `expected_location` - Location from inventory
- `actual_location` - Location where found
- `status` - Scan status (CORRECT_LOCATION, WRONG_LOCATION, OVERAGE, etc.)
- `scanned_at` - Timestamp

## Development

### Local Testing (Optional)

You can test locally before deploying:

```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variable for local database
export POSTGRES_URL="your-local-postgres-url"

# Run Flask locally
python api/index.py

# Serve frontend (in another terminal)
cd public
python -m http.server 8000
```

### Making Changes

1. Edit code locally
2. Test changes
3. Commit to git:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```
4. Vercel auto-deploys on push to main branch

## Browser Support

**Recommended:**
- Chrome (Android/iOS)
- Safari (iOS)
- Firefox (Android/iOS)
- Edge (Android)

**Requirements:**
- Modern browser (ES6+ JavaScript)
- Camera access for barcode scanning
- HTTPS (provided by Vercel automatically)

## Security

**Current implementation:**
- Publicly accessible (anyone with URL)
- No authentication
- Data isolated per deployment
- HTTPS encryption
- Secure database connection

**For production:**
- Consider adding authentication
- Use environment variables for secrets
- Regular data backups
- Monitor for unusual activity

## Performance

**Optimizations:**
- Serverless functions (auto-scaling)
- Efficient database queries
- Client-side barcode detection
- Minimal external dependencies
- Optimized for mobile bandwidth

**Limitations:**
- Free tier: 100GB bandwidth/month
- Serverless function timeout: 10s (upgradeable)
- File upload size: 4.5MB (upgradeable)
- Database: 60 compute hours/month on free tier

## Troubleshooting

**Camera not working:**
- Ensure HTTPS (Vercel provides this)
- Grant camera permissions
- Try different browser
- Check if camera is in use by another app

**Upload fails:**
- Check file format (.xlsx, .xls, .csv)
- Verify column names match exactly
- Ensure file size under 4.5MB
- Check for corrupted file

**Database errors:**
- Verify Postgres database is created in Vercel
- Check environment variables are set
- Run `/api/init` endpoint once
- Check Vercel logs for details

**See [DEPLOY.md](DEPLOY.md) for more troubleshooting tips.**

## Future Enhancements

Potential features to add:
- User authentication
- Multi-user/multi-location support
- Offline mode with sync
- Photo capture for discrepancies
- Historical reporting
- Email notifications
- Mobile app (PWA install)
- Barcode printing
- Integration with ERP systems
- Advanced analytics

## Contributing

This is an internal tool for LMW Labs. For changes:
1. Create a new branch
2. Make changes
3. Test thoroughly
4. Create pull request
5. Review and merge
6. Vercel auto-deploys

## License

Internal use only - LMW Labs

## Support

For issues or questions:
- Check deployment logs in Vercel
- Review browser console for errors
- See DEPLOY.md troubleshooting section
- Contact IT administrator

---

**GitHub:** https://github.com/LMW-Labs/inventory-app

**Deployed on:** [Vercel](https://vercel.com)
