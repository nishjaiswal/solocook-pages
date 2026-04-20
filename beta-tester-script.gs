/**
 * SoloCook — beta-tester submission handler.
 *
 * Deployed as a Google Apps Script Web App. Receives form POSTs from
 * betatest.html, appends a row to the bound Google Sheet, and (optionally)
 * emails you a notification so you don't have to keep the sheet open.
 *
 * Setup is in betatest-setup.md next to this file.
 */

// ─── Config ────────────────────────────────────────────────────────────
// If you want an email every time a tester signs up, put your address
// here. Leave as "" to disable notifications (sheet still updates).
const NOTIFY_EMAIL = "google.pronounce276@passmail.com";

// Sheet column order — don't change without migrating existing rows.
const COLUMNS = [
  "submittedAt", "email", "name", "platform", "note", "userAgent"
];
// ────────────────────────────────────────────────────────────────────────


/**
 * Web App POST handler. Called by the form on betatest.html.
 */
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || "{}");
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Ensure header row exists.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(COLUMNS);
      sheet.setFrozenRows(1);
      const header = sheet.getRange(1, 1, 1, COLUMNS.length);
      header.setFontWeight("bold").setBackground("#EDE5D4");
    }

    // Append the new submission.
    const row = COLUMNS.map(k => String(body[k] ?? ""));
    sheet.appendRow(row);

    // Optional notification email.
    if (NOTIFY_EMAIL) {
      const subject = `SoloCook beta signup: ${body.email || "(no email)"}`;
      const lines = [
        `Email:      ${body.email || "—"}`,
        `Name:       ${body.name || "—"}`,
        `Platform:   ${body.platform || "—"}`,
        `Note:       ${body.note || "—"}`,
        ``,
        `User-Agent: ${body.userAgent || "—"}`,
        `Time:       ${body.submittedAt || new Date().toISOString()}`,
      ];
      MailApp.sendEmail(NOTIFY_EMAIL, subject, lines.join("\n"));
    }

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}


/**
 * GET handler — lets you visit the URL in a browser to confirm the
 * deployment is live. Doesn't leak submission data.
 */
function doGet() {
  return ContentService.createTextOutput(
    "SoloCook beta endpoint is live. POST JSON to submit.")
    .setMimeType(ContentService.MimeType.TEXT);
}
