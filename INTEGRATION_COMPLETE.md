# 🦷 Dental Website - Google Sheets Appointment Integration

## What's New?

Your dental appointment booking form is now fully integrated with your Google Sheet! When customers submit the appointment form, the data automatically appears in your Google Sheet in real-time.

### ✨ Features Implemented

- ✅ **Live Form Submission** - Data sent directly to Google Sheet
- ✅ **Form Validation** - Email format, required fields, date validation
- ✅ **Error Handling** - User-friendly error messages
- ✅ **Loading States** - Visual feedback during submission
- ✅ **Timestamp Tracking** - Automatic timestamp for each submission
- ✅ **Vercel Ready** - Fully configured for serverless deployment
- ✅ **Production Secure** - Error messages don't leak sensitive info in production
- ✅ **CORS Enabled** - Works across different domains

### 📊 Data Collected

Your Google Sheet will have the following columns:
1. **Timestamp** - When the appointment was submitted
2. **Name** - Patient's full name
3. **Phone** - Contact phone number
4. **Email** - Patient's email address
5. **Preferred Date** - Requested appointment date
6. **Message** - Optional additional notes/concerns

---

## 🚀 Quick Start (Complete These Steps)

### Step 1: Create Google Service Account (5 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (name it "Dental Appointments" or similar)
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **Service Account**
5. Fill in the service account details and click **Create and Continue**
6. Click **Continue** → **Done**
7. Go to the **Keys** tab of your service account
8. Click **Add Key** → **Create new key** → **JSON**
9. **A JSON file will download** - Keep this safe!

### Step 2: Share Google Sheet with Service Account

1. Open your appointment sheet: https://docs.google.com/spreadsheets/d/13UQuqN9mfMrjepQPyPCaN2AW6FKzh1b73k3nlhpSI7o/edit?usp=sharing
2. Click **Share** button (top right)
3. From the JSON file you downloaded, find the `client_email` field (looks like: `your-app@your-project.iam.gserviceaccount.com`)
4. Copy and paste it in the Share dialog
5. Give it **Editor** access
6. Click **Share**

### Step 3: Set Up Sheet Structure

1. Click on your Google Sheet to open it
2. Ensure you have a sheet tab named **"Appointments"** (or change `SHEET_NAME` in `api/submitAppointment.ts`)
3. Add headers in the first row:
   - A1: Timestamp
   - B1: Name
   - C1: Phone
   - D1: Email
   - E1: Preferred Date
   - F1: Message

### Step 4: Configure Local Environment

1. In your project root, create a file called `.env.local`:

```bash
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"your-project-id",...entire JSON content here...}'
```

**Important**: The JSON should be on a single line with all content included.

### Step 5: Install Dependencies

```bash
npm install
```

Or with bun:

```bash
bun install
```

### Step 6: Test Locally

```bash
npm run dev
```

1. Open http://localhost:5173
2. Scroll to "Schedule Your Appointment"
3. Fill out the form and submit
4. You should see a success message
5. Check your Google Sheet - the data should appear!

---

## 📤 Deploy to Vercel

### Prerequisites
- Code pushed to GitHub
- Vercel account (free at vercel.com)
- Google Service Account JSON credentials

### Deployment Steps

1. **Commit Your Changes**

```bash
git add .
git commit -m "Add Google Sheets appointment integration"
git push origin main
```

2. **Import to Vercel**

- Go to [vercel.com/new](https://vercel.com/new)
- Select your GitHub repository
- Click **Import**

3. **Add Environment Variable**

In the "Environment Variables" section during setup:

- **Name**: `GOOGLE_SERVICE_ACCOUNT_KEY`
- **Value**: Copy and paste the **entire JSON content** from your downloaded credentials file

4. **Deploy**

Click **Deploy** and wait for the build to complete.

5. **Test Your Live Site**

- Visit your deployed Vercel URL
- Navigate to "Schedule Your Appointment"
- Submit the form
- Check your Google Sheet for the new entry

---

## 📁 Files Created/Modified

### New Files:
- **`api/submitAppointment.ts`** - Vercel serverless function handling form submissions
- **`GOOGLE_SHEETS_SETUP.md`** - Detailed Google Sheets setup guide
- **`VERCEL_DEPLOYMENT.md`** - Detailed Vercel deployment guide
- **`QUICK_START.md`** - Quick reference guide
- **`.env.example`** - Template for environment variables
- **`vercel.json`** - Vercel configuration

### Modified Files:
- **`src/components/AppointmentSection.tsx`** - Updated with API integration, loading states, error handling
- **`package.json`** - Added required dependencies (googleapis, google-auth-library, @vercel/node)

---

## 🔍 How It Works

```
┌─────────────────────────────────────────────────┐
│  User fills form on your website                │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│  Form validates data                            │
│  - Email format check                           │
│  - Required fields check                        │
│  - Date not in past check                       │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│  Form submits to /api/submitAppointment         │
│  (POST request with form data)                  │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│  Vercel Serverless Function                     │
│  - Validates input                              │
│  - Authenticates with Google                    │
│  - Appends data to Google Sheet                 │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│  Google Sheets API                              │
│  - Adds new row to "Appointments" sheet         │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│  Success Response Sent Back                     │
│  - User sees success message                    │
│  - Form clears                                  │
└─────────────────────────────────────────────────┘
```

---

## ❓ Troubleshooting

### "Invalid or missing GOOGLE_SERVICE_ACCOUNT_KEY"

**Cause**: Environment variable not set correctly
**Solution**:
- Check `.env.local` file has the complete JSON
- JSON should be on a single line
- Copy directly from the downloaded credentials file

### "Permission denied" error

**Cause**: Service account doesn't have access to the sheet
**Solution**:
- Go to your Google Sheet
- Click **Share**
- Add the service account email with **Editor** access
- Wait a few seconds for permissions to sync

### Data not appearing in Google Sheet

**Cause**: Sheet configuration issue
**Solution**:
- Verify sheet is named "Appointments" exactly
- Check first row has headers
- Make sure service account was given access
- Check Vercel logs for error messages

### 404 error on form submission

**Cause**: API route not found
**Solution**:
- Verify `api/submitAppointment.ts` file exists
- Make sure you pushed the code to GitHub
- Redeploy on Vercel if changes were made

### Form shows spinning loader but never completes

**Cause**: API request hanging
**Solution**:
- Check browser console for errors (F12 → Console)
- Check Vercel function logs
- Verify environment variable is set in Vercel
- Try refreshing the page

---

## 📊 Monitoring Your Appointments

### View Submissions
1. Open your Google Sheet
2. New entries appear in real-time
3. You can sort, filter, or add formulas

### Check Vercel Logs
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click **Deployments**
4. Click the latest deployment
5. Go to **Logs** tab to see all API requests

### Monitor API Performance
1. In Vercel project, click **Analytics** tab
2. View request counts, response times, errors

---

## 🔐 Security Notes

- ✅ Email validation prevents invalid entries
- ✅ Date validation prevents past dates
- ✅ Error messages don't leak sensitive info in production
- ✅ All communication is HTTPS
- ✅ Service account has minimal permissions (Sheets API only)
- ✅ **Never** share `.env.local` file - it's gitignored
- ✅ **Never** commit credentials to GitHub

### Best Practices

1. Keep your Google Service Account credentials safe
2. Don't share the `.env.local` file
3. Regularly review who has access to your Google Sheet
4. Monitor Vercel logs for any errors
5. Test form submission periodically

---

## 🎯 Next Steps

1. **Complete Step-by-Step Setup Above** ⬆️
2. **Test Locally** with `npm run dev`
3. **Deploy to Vercel** following the deployment steps
4. **Monitor** your Google Sheet for appointments
5. **Share** your website with dental patients!

---

## 📖 Detailed Guides

For more detailed information, see:
- **QUICK_START.md** - 5-minute quick reference
- **GOOGLE_SHEETS_SETUP.md** - Detailed Google Sheets setup
- **VERCEL_DEPLOYMENT.md** - Detailed Vercel deployment with troubleshooting
- **api/submitAppointment.ts** - Code comments explaining the implementation

---

## ✅ Success Checklist

Before considering this complete, verify:

- [ ] Google Service Account created
- [ ] Sheet shared with service account
- [ ] Sheet structure has headers in row 1
- [ ] `.env.local` file created with credentials
- [ ] `npm install` completed successfully
- [ ] Local test successful (`npm run dev`)
- [ ] Code pushed to GitHub
- [ ] Deployed to Vercel
- [ ] Environment variable added to Vercel
- [ ] Live site form submits successfully
- [ ] Data appears in Google Sheet within 5 seconds

---

## 🆘 Need Help?

1. Check the detailed guides above
2. Review browser console (F12) for error messages
3. Check Vercel function logs in dashboard
4. Verify all setup steps completed
5. Ensure environment variable is set correctly in Vercel

---

**Your appointment system is now live! 🎉**

Patients can now book appointments directly from your website, and the data goes straight to your Google Sheet for easy management.

Good luck with your dental practice! 🦷✨
