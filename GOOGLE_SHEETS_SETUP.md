# Google Sheets Integration Setup Guide

This guide will help you set up Google Sheets integration for your dental appointment form.

## Step 1: Create a Google Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use an existing one)
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **Service Account**
5. Fill in the service account details and click **Create and Continue**
6. Click **Continue** through the optional steps
7. Go to the **Keys** tab of your service account
8. Click **Add Key** → **Create new key** → **JSON**
9. A JSON file will download - this is your credentials file

## Step 2: Share Your Google Sheet

1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/13UQuqN9mfMrjepQPyPCaN2AW6FKzh1b73k3nlhpSI7o/edit?usp=sharing
2. Click **Share** (top right)
3. Copy the service account email from the JSON file (looks like: `your-app@your-project.iam.gserviceaccount.com`)
4. Paste it in the Share dialog and give it **Editor** access
5. Click **Share**

## Step 3: Set Up Sheet Structure

1. Open your Google Sheet
2. Make sure you have a sheet named "Appointments" (or update the `SHEET_NAME` variable in `api/submitAppointment.ts`)
3. Add headers in the first row:
   - A1: Timestamp
   - B1: Name
   - C1: Phone
   - D1: Email
   - E1: Preferred Date
   - F1: Message

## Step 4: Local Environment Setup

1. Create a `.env.local` file in your project root:

```bash
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"your-project","private_key_id":"xxx","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"your-app@your-project.iam.gserviceaccount.com","client_id":"xxx","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/..."}'
```

**Important**: Copy the entire JSON credentials file content as a single-line string.

## Step 5: Install Dependencies

Run the following command to install required packages:

```bash
npm install googleapis google-auth-library @vercel/node
```

Or if using bun:

```bash
bun add googleapis google-auth-library @vercel/node
```

## Step 6: Local Testing

1. Start your development server:

```bash
npm run dev
```

2. Navigate to the Appointment section on your website
3. Fill out the form and submit
4. Check your Google Sheet - the data should appear automatically

## Step 7: Deploy to Vercel

1. Push your code to GitHub:

```bash
git add .
git commit -m "Add Google Sheets integration"
git push origin main
```

2. Go to [Vercel Dashboard](https://vercel.com)
3. Import your repository
4. In the **Environment Variables** section, add:
   - **Name**: `GOOGLE_SERVICE_ACCOUNT_KEY`
   - **Value**: Paste the entire JSON credentials file content (as a single line)
5. Click **Deploy**

## Troubleshooting

### Error: "Invalid or missing GOOGLE_SERVICE_ACCOUNT_KEY"
- Check that your `.env` variable is properly formatted
- The JSON should be a single line without line breaks
- If copied from the JSON file, ensure all escape sequences are correct

### Error: "Permission denied"
- Make sure you shared the Google Sheet with the service account email
- The service account email must have Editor access

### Data not appearing in Google Sheet
- Verify the sheet name matches `SHEET_NAME` in the API file
- Check that headers are in the first row
- Review the browser console for any error messages
- Check Vercel logs in your deployment dashboard

### CORS Issues
- The API already has CORS headers configured
- If you still experience issues, check the browser Network tab in DevTools

## Support

For more information:
- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Vercel Functions Documentation](https://vercel.com/docs/functions/serverless-functions)
