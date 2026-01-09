@echo off
REM QUICK SETUP BATCH FILE FOR WINDOWS

echo.
echo ====== GOOGLE SHEETS INTEGRATION SETUP ======
echo.

REM Step 1: Install Dependencies
echo Step 1: Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed
    pause
    exit /b 1
)
echo.
echo OK: Dependencies installed
echo.

REM Step 2: Create .env.local
echo Step 2: Creating .env.local file...
echo GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"YOUR_PROJECT_ID","private_key_id":"YOUR_KEY_ID","private_key":"-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n","client_email":"your-service@your-project.iam.gserviceaccount.com","client_id":"YOUR_CLIENT_ID","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/your-service%%40your-project.iam.gserviceaccount.com"}' > .env.local
echo.
echo OK: .env.local created
echo IMPORTANT: Edit .env.local with your Google Service Account credentials!
echo.

REM Step 3: Show next steps
echo.
echo ====== NEXT STEPS ======
echo.
echo 1. Edit .env.local file with your Google credentials
echo    (Replace YOUR_PROJECT_ID, YOUR_KEY_ID, YOUR_PRIVATE_KEY, etc.)
echo.
echo 2. Start development server:
echo    npm run dev
echo.
echo 3. Test at http://localhost:5173
echo.
echo 4. Deploy to Vercel:
echo    - git add .
echo    - git commit -m "Add Google Sheets integration"
echo    - git push origin main
echo    - Go to vercel.com/new
echo    - Import your GitHub repo
echo    - Add GOOGLE_SERVICE_ACCOUNT_KEY environment variable
echo    - Deploy
echo.
echo 5. Read the detailed guides:
echo    - QUICK_START.md
echo    - GOOGLE_SHEETS_SETUP.md
echo    - VERCEL_DEPLOYMENT.md
echo.
echo ====== SETUP COMPLETE ======
echo.
pause
