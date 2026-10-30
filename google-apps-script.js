const SHEET_NAME = "Leads";
const REQUIRED_FIELDS = ["name", "phone", "interest", "message", "createdAt"];

function doPost(event) {
  const payload = JSON.parse(event.postData.contents || "{}");
  if (!REQUIRED_FIELDS.every((field) => String(payload[field] || "").trim())) {
    return jsonResponse({ ok: false, error: "Thiếu dữ liệu bắt buộc." });
  }

  const sheet = getSheet();
  sheet.appendRow([
    new Date(payload.createdAt),
    cleanCell(payload.name),
    cleanCell(payload.phone),
    cleanCell(payload.interest),
    cleanCell(payload.message)
  ]);
  return jsonResponse({ ok: true });
}

function doGet() {
  const sheet = getSheet();
  const rows = sheet.getDataRange().getValues();
  rows.shift();
  return jsonResponse(rows.reverse().map((row) => ({
    createdAt: row[0],
    name: row[1],
    phone: row[2],
    interest: row[3],
    message: row[4]
  })));
}

function getSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Thời gian", "Họ tên", "Điện thoại", "Nhu cầu", "Lời nhắn"]);
  }
  return sheet;
}

function cleanCell(value) {
  return String(value || "").trim().slice(0, 1000);
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
