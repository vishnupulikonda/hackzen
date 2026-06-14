// ============================================================
// HACKZEN - Google Apps Script
// Steps:
// 1. Go to sheets.google.com → create new sheet
// 2. Extensions → Apps Script → delete old code → paste this
// 3. Save → Deploy → New Deployment
//    - Type: Web App
//    - Execute as: Me
//    - Who has access: Anyone
// 4. Click Deploy → Copy the Web App URL
// 5. Paste the URL in index.html where it says: YOUR_WEBAPP_URL_HERE
// ============================================================

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Auto-create headers on first submission
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Full Name",
        "Email",
        "Phone",
        "Year of Study",
        "Branch",
        "Institution",
        "City",
        "Pincode",
        "Hackathon Experience",
        "Team Name",
        "Team Members",
        "UTR / Transaction ID"
      ]);

      // Style header row
      var headerRange = sheet.getRange(1, 1, 1, 13);
      headerRange.setBackground("#673ab7");
      headerRange.setFontColor("#ffffff");
      headerRange.setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date().toLocaleString("en-IN"),
      data.name        || "",
      data.email       || "",
      data.phone       || "",
      data.year        || "",
      data.branch      || "",
      data.institution || "",
      data.city        || "",
      data.pincode     || "",
      data.hackathon_exp || "",
      data.teamname    || "",
      data.members     || "",
      data.utr         || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Registration saved!" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function - run this manually to verify sheet connection
function testSetup() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  Logger.log("Sheet name: " + sheet.getName());
  Logger.log("Connected successfully!");
}
