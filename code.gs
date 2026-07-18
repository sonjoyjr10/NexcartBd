/**
 * Nexcart PRO - Backend code.gs
 */

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var data = JSON.parse(e.postData.contents);
  
  // Registration logic
  if (data.action === "registerUser") {
    var sheet = ss.getSheetByName("Users") || ss.insertSheet("Users");
    sheet.appendRow([new Date(), data.name, data.phone, data.password]);
    return ContentService.createTextOutput("Success");
  }
  
  // Order logic
  if (data.action === "createOrder") {
    var sheet = ss.getSheetByName("Orders") || ss.insertSheet("Orders");
    sheet.appendRow([new Date(), data.name, data.phone, data.productName, data.price]);
    return ContentService.createTextOutput("Success");
  }
}
