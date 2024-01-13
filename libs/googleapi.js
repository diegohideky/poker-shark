import { google } from "googleapis";

let client = null;
let auth = null;

export async function getSheets() {
  client = await getClient();

  const googleSheets = google.sheets({ version: "v4", auth: client });

  return googleSheets;
}

export async function getSheetData(range) {
  const credentials = {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.split(String.raw`\n`).join('\n'),
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const client = await auth.getClient();

  const sheets = await google.sheets({ version: "v4", auth: client });

  const result = await sheets.spreadsheets?.values?.get({
    auth,
    spreadsheetId: process.env.SPREADSHEET_ID,
    range
  });

  return result?.data?.values || [];
}