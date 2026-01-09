#!/bin/bash
# QUICK SETUP COMMANDS - Copy and run each command in sequence

# ====== STEP 1: Install Dependencies ======
echo "Installing dependencies..."
npm install
# or: bun install

# ====== STEP 2: Create .env.local ======
echo "Creating .env.local file..."
cat > .env.local << 'EOF'
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"YOUR_PROJECT_ID","private_key_id":"YOUR_KEY_ID","private_key":"-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n","client_email":"your-service@your-project.iam.gserviceaccount.com","client_id":"YOUR_CLIENT_ID","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/your-service%40your-project.iam.gserviceaccount.com"}'
EOF
echo "✓ .env.local created - EDIT IT with your Google credentials!"

# ====== STEP 3: Test Locally ======
echo "Starting development server..."
npm run dev
# Open http://localhost:5173
# Test the appointment form!

# ====== STEP 4: Commit Code ======
# (Run these separately)
# git add .
# git commit -m "Add Google Sheets integration"
# git push origin main

# ====== STEP 5: Deploy to Vercel ======
# 1. Go to vercel.com/new
# 2. Import your GitHub repo
# 3. Add environment variable GOOGLE_SERVICE_ACCOUNT_KEY
# 4. Copy entire JSON from your service account credentials file
# 5. Click Deploy

echo "Setup complete! Follow the steps above to complete deployment."
