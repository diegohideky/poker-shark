import { google } from "googleapis";

let client = null;
let auth = null;

export function getAuth() {
  if (auth) {
    return auth;
  }

  auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return auth;
}

export async function getClient() {
  if (client) {
      return client;
  }

  auth = getAuth();

  client = await auth.getClient();

  return client;
}

export async function getSheets() {
  if (client) {
    return client;
  }

  client = await getClient();

  const googleSheets = google.sheets({ version: "v4", auth: client });

  return googleSheets;
}

export async function getSheetData() {
  const sheets = await getSheets();

  const { data } = await sheets.spreadsheets.values.get({
    auth: getAuth(),
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: "Estatísticas!C3:E25"
  });

  return data?.values || [];
}