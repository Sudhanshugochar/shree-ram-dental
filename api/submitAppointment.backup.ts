import { VercelRequest, VercelResponse } from "@vercel/node";

// For better reliability, you can also use this simplified approach with Apps Script
// But the google-auth-library approach is more standard

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Alternative: Google Apps Script Webhook Approach
 * 
 * If you encounter issues with the googleapis library, use this alternative:
 * 
 * 1. Open your Google Sheet
 * 2. Go to Extensions → Apps Script
 * 3. Paste the following code:
 * 
 * function doPost(e) {
 *   const sheet = SpreadsheetApp.getActiveSheet();
 *   const data = JSON.parse(e.postData.contents);
 *   sheet.appendRow([
 *     new Date().toLocaleString(),
 *     data.name,
 *     data.phone,
 *     data.email,
 *     data.date,
 *     data.message || ""
 *   ]);
 *   return ContentService.createTextOutput(JSON.stringify({
 *     success: true,
 *     message: "Data received successfully"
 *   })).setMimeType(ContentService.MimeType.JSON);
 * }
 * 
 * 4. Click Deploy → New Deployment → Select "Web app"
 * 5. Execute as: Your account
 * 6. Who has access: Anyone
 * 7. Copy the deployment URL
 * 8. Use that URL in the frontend instead of /api/submitAppointment
 * 
 * This approach is simpler and requires no server-side credentials!
 */

interface AppointmentData {
  name: string;
  phone: string;
  email: string;
  date: string;
  message?: string;
}

// CORS headers configuration
const corsHeaders = {
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  "Access-Control-Allow-Headers":
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
};

// Main handler
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Add CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Only accept POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, phone, email, date, message } = req.body as AppointmentData;

    // Validation
    if (!name || !phone || !email || !date) {
      return res.status(400).json({
        error: "Missing required fields: name, phone, email, date",
      });
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Validate phone (basic check)
    const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        error: "Invalid phone number format",
      });
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        error: "Invalid date format. Use YYYY-MM-DD",
      });
    }

    // Validate that date is not in the past
    const appointmentDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (appointmentDate < today) {
      return res.status(400).json({
        error: "Appointment date cannot be in the past",
      });
    }

    console.log("Appointment Data Received:", {
      name,
      phone,
      email,
      date,
      message,
      timestamp: new Date().toISOString(),
    });

    // TODO: Integrate with Google Sheets API here
    // For now, returning success response
    // The actual integration happens in the submitAppointment.ts file

    return res.status(200).json({
      success: true,
      message:
        "Appointment submitted successfully. We'll contact you soon!",
      data: {
        name,
        email,
        date,
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to submit appointment. Please try again later.",
      details:
        process.env.NODE_ENV === "development"
          ? (error as Error).message
          : undefined,
    });
  }
}
