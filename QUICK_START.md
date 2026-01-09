# Quick Start Guide - Google Sheets Integration

## What's Been Set Up

Your appointment form is now connected to your Google Sheet with these features:
- ✅ Form validation (email format, required fields)
- ✅ Error handling and user feedback
- ✅ Loading states during submission
- ✅ CORS support for cross-origin requests
- ✅ Vercel serverless function ready to deploy
- ✅ Timestamp tracking for each submission

## Files Created/Modified

1. **api/submitAppointment.ts** - Vercel serverless function that writes to Google Sheets
2. **src/components/AppointmentSection.tsx** - Updated form with API integration
3. **GOOGLE_SHEETS_SETUP.md** - Detailed setup instructions
4. **.env.example** - Environment variable template
5. **vercel.json** - Vercel configuration
6. **VERCEL_DEPLOYMENT.md** - Deployment guide

## Quick Setup (5 minutes)

### 1. Get Google Service Account (2 min)

```
Google Cloud Console → Create Service Account → Download JSON Key
```

Share your Google Sheet with the service account email from the JSON file.

### 2. Add to Environment (1 min)

Create `.env.local` in your project root:

```
GOOGLE_SERVICE_ACCOUNT_KEY='[YOUR ENTIRE JSON CREDENTIALS HERE]'
```

### 3. Install Dependencies (1 min)

```bash
npm install
```

### 4. Test Locally (1 min)

```bash
npm run dev
```

Visit http://localhost:5173, go to "Schedule Your Appointment", and test the form.

## Deploy to Vercel (3 steps)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add Google Sheets integration"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to vercel.com/new
   - Select your GitHub repo
   - Add environment variable: `GOOGLE_SERVICE_ACCOUNT_KEY`

3. **Deploy**
   - Click Deploy
   - Your site is now live!

## Data Flow

```
User Form → Frontend API Call → Vercel Serverless Function
           ↓
        Google Sheets API ↓ 
        Your Google Sheet
```

## Columns in Google Sheet

| Timestamp | Name | Phone | Email | Preferred Date | Message |
|-----------|------|-------|-------|----------------|---------|
| Auto | User input | User input | User input | User input | Optional |

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Invalid credentials" | Check `.env.local` file format, should be single line JSON |
| Data not in sheet | Verify sheet is named "Appointments", verify service account has Editor access |
| 404 API error | Check `api/submitAppointment.ts` file exists |
| Form won't submit | Check browser console for specific error message |

## Next Steps

1. Read **GOOGLE_SHEETS_SETUP.md** for detailed setup
2. Read **VERCEL_DEPLOYMENT.md** for deployment details
3. Test locally with `npm run dev`
4. Deploy to Vercel when ready

## Support

- Check **GOOGLE_SHEETS_SETUP.md** for Google Sheets setup help
- Check **VERCEL_DEPLOYMENT.md** for deployment troubleshooting
- Check browser DevTools → Network tab to see API requests/responses
- Check Vercel dashboard → Logs for server-side errors

---

You're all set! Your appointment system is ready to go live! 🚀
