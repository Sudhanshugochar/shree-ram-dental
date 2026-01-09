# Vercel Deployment Setup Guide

## Quick Start

1. **Push the code to GitHub** ✅ (Already done)
   - Repository: https://github.com/Sudhanshugochar/shree-ram-dental.git

2. **Deploy to Vercel**
   - Go to https://vercel.com/new
   - Import the GitHub repository
   - Click "Deploy"

3. **Set Environment Variables in Vercel Dashboard**
   - Project Settings → Environment Variables
   - Add the following variables:

   ```
   GOOGLE_SERVICE_ACCOUNT_KEY = <your complete JSON service account key>
   ```

   This is the full JSON key from Google Cloud Console, formatted as a single line.

## How It Works

### Local Development
- The appointment form submits to `/api/submitAppointment`
- During local dev (`npm run dev`), Vite's built-in API plugin intercepts the request and handles it locally
- This allows testing without deploying to Vercel

### Vercel Production
- The same endpoint `/api/submitAppointment` is served by the serverless function in `/api/submitAppointment.ts`
- Vercel automatically converts TypeScript serverless functions to handlers
- Environment variables from Vercel dashboard are injected at runtime

## Files Modified

### 1. **api/submitAppointment.ts** (Serverless Function)
- Vercel will execute this automatically for `/api/submitAppointment` requests
- Sheet name: `Sheet1`
- Spreadsheet ID: `13UQuqN9mfMrjepQPyPCaN2AW6FKzh1b73k3nlhpSI7o`

### 2. **vite.config.ts** (Development Server)
- Contains embedded API plugin for local development
- The plugin only runs during `npm run dev`
- On Vercel, this file is ignored; only the serverless `/api` folder is used

### 3. **.env.local** (Local Environment Variables)
- Contains your Google Service Account Key
- **DO NOT COMMIT THIS FILE** (it's in .gitignore)
- Create this locally by copying `.env.example` and filling in your credentials

### 4. **vercel.json** (Vercel Configuration)
- Specifies build and output directories
- Maps environment variables

## Testing Appointment Form

### Locally
1. Run `npm run dev`
2. Open http://localhost:8080
3. Navigate to "Schedule Your Appointment" section
4. Fill in the form and submit
5. Check your Google Sheet for the entry

### On Vercel
1. Deploy to Vercel
2. Add `GOOGLE_SERVICE_ACCOUNT_KEY` to environment variables
3. Visit your Vercel deployment URL
4. Fill in the form and submit
5. Check your Google Sheet for the entry

## Features

✅ Full-stack appointment booking system
✅ Google Sheets integration for data storage
✅ Client-side form validation
✅ Server-side form validation
✅ CORS enabled
✅ Date format support (DD-MM-YYYY and YYYY-MM-DD)
✅ Past date validation
✅ Error handling and user feedback
✅ Works on both local dev and Vercel production

## Troubleshooting

### Error: "GOOGLE_SERVICE_ACCOUNT_KEY not set"
- Make sure you added the environment variable to Vercel dashboard

### Error: "Unable to parse range: Sheet1!A:F"
- Check that your Google Sheet has a sheet named "Sheet1"
- Or update the SHEET_NAME constant in `api/submitAppointment.ts`

### Error: "Private key unsupported"
- Ensure your GOOGLE_SERVICE_ACCOUNT_KEY is the complete, valid JSON key from Google Cloud
- It should include the full private key with proper formatting

## Service Account Permissions

The Google Service Account needs access to:
- Google Sheets API (enabled)
- Owner or Editor role for the spreadsheet with ID: `13UQuqN9mfMrjepQPyPCaN2AW6FKzh1b73k3nlhpSI7o`

Make sure the service account email (`dental-service@linen-epigram-422103.iam.gserviceaccount.com`) has been added as an editor to the Google Sheet.
