# Vercel Deployment Guide - Google Sheets Integration

Follow these steps to deploy your dental website with Google Sheets integration to Vercel.

## Prerequisites

- GitHub account with your code pushed
- Vercel account (free at vercel.com)
- Google Service Account JSON credentials (from Google Cloud Console)

## Step-by-Step Deployment

### 1. Prepare Your Code

Make sure you have committed all changes:

```bash
cd "c:\Users\sudha\OneDrive\Desktop\Dental website\radiant-smile-studio"
git add .
git commit -m "Add Google Sheets integration for appointments"
git push origin main
```

### 2. Connect to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Select your GitHub repository
4. Click **Import**

### 3. Configure Environment Variables

After selecting your project, Vercel will show a **Configure** section:

1. Look for **Environment Variables** section
2. Add a new variable:
   - **Name**: `GOOGLE_SERVICE_ACCOUNT_KEY`
   - **Value**: Copy and paste the ENTIRE JSON content from your Google Service Account key file

   **IMPORTANT**: 
   - The JSON should be formatted as a single line (no line breaks)
   - Make sure to include all the content between the first `{` and last `}`

3. Click **Add** to save the variable
4. Click **Deploy**

### 4. Wait for Deployment

- Vercel will automatically build and deploy your project
- You'll see a deployment URL once complete
- The API routes will be automatically deployed as serverless functions

### 5. Verify Deployment

1. Visit your deployed site
2. Navigate to the "Schedule Your Appointment" section
3. Fill out the form and submit
4. Check your Google Sheet - data should appear within seconds
5. Check your browser's Network tab (DevTools) if you encounter any issues

## Environment Variable Format

Your `GOOGLE_SERVICE_ACCOUNT_KEY` should look like this (all in one line):

```
{"type":"service_account","project_id":"your-project","private_key_id":"xxx","private_key":"-----BEGIN PRIVATE KEY-----\nYourPrivateKeyHere\n-----END PRIVATE KEY-----\n","client_email":"xxx@xxx.iam.gserviceaccount.com","client_id":"xxx","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/xxx%40xxx.iam.gserviceaccount.com"}
```

## Common Issues & Solutions

### Issue: "Invalid or missing GOOGLE_SERVICE_ACCOUNT_KEY"

**Solution**:
- Check that the environment variable is properly set in Vercel dashboard
- Copy the entire JSON content without line breaks
- Ensure there are no extra quotes or formatting issues
- In Vercel dashboard, you might need to copy as multi-line and it will handle conversion

### Issue: "Permission denied" when trying to write to sheet

**Solution**:
- Go to your Google Sheet
- Click **Share**
- Add the service account email (from your JSON file) with **Editor** access
- Wait a few minutes for Google to sync permissions

### Issue: Data not appearing in Google Sheet

**Solution**:
- Check that the sheet is named "Appointments" (or update `SHEET_NAME` in `api/submitAppointment.ts`)
- Verify headers exist in the first row
- Check Vercel Function logs:
  1. Go to your Vercel project
  2. Click **Deployments**
  3. Click the latest deployment
  4. Go to **Logs** tab
  5. Look for errors from the API function

### Issue: 404 error when submitting form

**Solution**:
- Make sure your code changes are pushed to GitHub
- Verify the API file is at `api/submitAppointment.ts`
- Redeploy if needed:
  1. Go to Vercel dashboard
  2. Click your project
  3. Click **Redeploy** (or push new code to trigger auto-deploy)

### Issue: CORS errors in browser console

**Solution**:
- The API already has CORS headers configured
- Try clearing browser cache and reloading
- Check the Network tab in DevTools to see the actual error response

## Monitoring Your Deployment

### View Logs

1. Go to Vercel Dashboard → Your Project
2. Click **Deployments**
3. Click the deployment you want to check
4. Go to **Logs** tab
5. Look for any errors from the API function

### View Analytics

1. Click **Analytics** tab
2. Monitor API performance and error rates

## Local Testing Before Deployment

To test locally first:

```bash
# Create .env.local file with your credentials
# (See GOOGLE_SHEETS_SETUP.md for format)

# Install dependencies
npm install

# Run development server
npm run dev

# Test the form at http://localhost:5173
```

## Rollback

If something goes wrong:

1. Go to Vercel Dashboard → Your Project
2. Click **Deployments**
3. Find a previous working deployment
4. Click the three dots menu
5. Click **Promote to Production**

## Success Indicators

- Form submits without errors
- Success message appears
- Data appears in Google Sheet within 5 seconds
- No errors in Vercel logs

## Need Help?

- Check the **Logs** tab in Vercel for error messages
- Review browser Network tab (DevTools) to see API responses
- Verify environment variables are set correctly
- Make sure service account has access to the Google Sheet

---

Once you complete these steps, your dental website will be live with a working appointment booking system connected to your Google Sheet!
