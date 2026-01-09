import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { google } from "googleapis";
import dotenv from "dotenv";

// Load environment variables for local development
dotenv.config({ path: ".env.local" });

const GOOGLE_SHEET_ID = "13UQuqN9mfMrjepQPyPCaN2AW6FKzh1b73k3nlhpSI7o";
const SHEET_NAME = "Sheet1";

// API Plugin for local development (won't run on Vercel)
function apiPlugin() {
  return {
    name: "api-plugin",
    configureServer(server: any) {
      return () => {
        server.middlewares.use("/api/submitAppointment", async (req: any, res: any) => {
          if (req.method === "OPTIONS") {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            res.setHeader("Access-Control-Allow-Headers", "Content-Type");
            res.writeHead(200);
            res.end();
            return;
          }

          if (req.method !== "POST") {
            res.writeHead(405, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Method not allowed" }));
            return;
          }

          let body = "";
          req.on("data", (chunk: any) => (body += chunk));
          req.on("end", async () => {
            try {
              const formData = JSON.parse(body);
              console.log("Received form data:", formData);
              
              // Validate date format
              const dateRegexDDMMYYYY = /^\d{2}-\d{2}-\d{4}$/;
              const dateRegexYYYYMMDD = /^\d{4}-\d{2}-\d{2}$/;
              if (!dateRegexDDMMYYYY.test(formData.date) && !dateRegexYYYYMMDD.test(formData.date)) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, error: "Invalid date format" }));
                return;
              }

              const credentialsJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
              if (!credentialsJson) throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY not set");
              
              const credentials = JSON.parse(credentialsJson);
              const auth = new google.auth.GoogleAuth({
                credentials: credentials,
                scopes: ["https://www.googleapis.com/auth/spreadsheets"],
              });
              
              const sheets = google.sheets({ version: "v4", auth });
              const timestamp = new Date().toLocaleString();

              console.log("Appending data to sheet...");
              await sheets.spreadsheets.values.append({
                spreadsheetId: GOOGLE_SHEET_ID,
                range: `${SHEET_NAME}!A:F`,
                valueInputOption: "RAW",
                insertDataOption: "INSERT_ROWS",
                requestBody: {
                  values: [[timestamp, formData.name.trim(), formData.phone.trim(), formData.email.trim(), formData.date, formData.message?.trim() || ""]],
                },
              });

              console.log("Data appended successfully");
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({
                success: true,
                message: "Appointment submitted successfully. We'll contact you soon!",
                data: { name: formData.name, email: formData.email, date: formData.date, timestamp },
              }));
            } catch (error) {
              console.error("API Error:", error);
              const errorMsg = error instanceof Error ? error.message : String(error);
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ success: false, error: "Failed to submit appointment: " + errorMsg }));
            }
          });
        });
      };
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), apiPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
