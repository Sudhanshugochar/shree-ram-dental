import { VercelRequest, VercelResponse } from "@vercel/node";

// Import google-auth-library and sheets API
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { google } = require("googleapis");

const GOOGLE_SHEET_ID = "13UQuqN9mfMrjepQPyPCaN2AW6FKzh1b73k3nlhpSI7o";
const SHEET_NAME = "Sheet1"; // Change this to your sheet name

interface AppointmentData {
  name: string;
  phone: string;
  email: string;
  date: string;
  message: string;
}

// CORS headers configuration
const corsHeaders = {
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  "Access-Control-Allow-Headers":
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
};

// Helper function to validate input data
function validateFormData(data: AppointmentData): { valid: boolean; error?: string } {
  const { name, phone, email, date } = data;

  if (!name || !name.trim()) {
    return { valid: false, error: "Name is required" };
  }

  if (!phone || !phone.trim()) {
    return { valid: false, error: "Phone number is required" };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return { valid: false, error: "Valid email address is required" };
  }

  if (!date) {
    return { valid: false, error: "Preferred date is required" };
  }

  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return { valid: false, error: "Invalid date format" };
  }

  // Validate that date is not in the past
  const appointmentDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (appointmentDate < today) {
    return { valid: false, error: "Appointment date cannot be in the past" };
  }

  return { valid: true };
}

// Helper function to get Google Sheets API client
async function getGoogleSheetsClient() {
  try {
    // Parse credentials from environment variable
    const credentialsJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    
    if (!credentialsJson) {
      throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY environment variable not set");
    }

    const credentials = JSON.parse(credentialsJson);

    if (!credentials.type || credentials.type !== "service_account") {
      throw new Error("Invalid Google Service Account credentials");
    }

    const auth = new google.auth.GoogleAuth({
      credentials: credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    return google.sheets({ version: "v4", auth });
  } catch (error) {
    console.error("Failed to initialize Google Sheets client:", error);
    throw new Error("Failed to initialize Google Sheets API");
  }
}

// Helper function to append data to Google Sheet
async function appendToSheet(
  sheets: any,
  values: string[]
): Promise<boolean> {
  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_SHEET_ID,
      range: `${SHEET_NAME}!A:F`, // 6 columns: Timestamp, Name, Phone, Email, Date, Message
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [values],
      },
    });

    console.log("Data appended successfully:", response.data);
    return true;
  } catch (error) {
    console.error("Error appending to sheet:", error);
    throw error;
  }
}

// Main API handler
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Add CORS headers to response
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
    return res.status(405).json({ 
      success: false,
      error: "Method not allowed. Use POST request." 
    });
  }

  try {
    const body = req.body as AppointmentData;

    // Validate input data
    const validation = validateFormData(body);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error || "Validation failed",
      });
    }

    const { name, phone, email, date, message } = body;
    const timestamp = new Date().toLocaleString();

    // Initialize Google Sheets client
    const sheets = await getGoogleSheetsClient();

    // Append data to sheet
    const success = await appendToSheet(sheets, [
      timestamp, // Column A: Timestamp
      name.trim(), // Column B: Name
      phone.trim(), // Column C: Phone
      email.trim(), // Column D: Email
      date, // Column E: Preferred Date
      message ? message.trim() : "", // Column F: Message (optional)
    ]);

    if (success) {
      return res.status(200).json({
        success: true,
        message: "Appointment submitted successfully. We'll contact you soon!",
        data: {
          name,
          email,
          date,
          timestamp,
        },
      });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("API Error:", errorMessage);

    // Return different error based on environment
    if (errorMessage.includes("GOOGLE_SERVICE_ACCOUNT_KEY")) {
      return res.status(500).json({
        success: false,
        error: "Server configuration error. Please contact the administrator.",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
      });
    }

    if (errorMessage.includes("Permission denied") || errorMessage.includes("403")) {
      return res.status(500).json({
        success: false,
        error: "Unable to access the appointment sheet. Please try again later.",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
      });
    }

    return res.status(500).json({
      success: false,
      error: "Failed to submit appointment. Please try again later.",
      details:
        process.env.NODE_ENV === "development"
          ? errorMessage
          : undefined,
    });
  }
}
