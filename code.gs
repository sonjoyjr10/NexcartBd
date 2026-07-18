function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var orderSheet = ss.getSheetByName("Orders") || ss.insertSheet("Orders");
    var stockSheet = ss.getSheetByName("Stock");
    
    // ১. প্রথম রো খালি থাকলে সিরিয়াল অনুযায়ী হেডার তৈরি করুন
    if (orderSheet.getLastRow() === 0) {
      orderSheet.appendRow([
        "Date", "Product Name", "Customer ID", "Name", "Phone", 
        "Address", "District", "Post Code", "Quantity", "Price", 
        "Note", "Delivery", "Payment", "Total Price", "Status"
      ]);
    }
    
    // ২. অটোমেটিক NXC সিরিয়াল কাস্টমার আইডি জেনারেট করা
    var nextRow = orderSheet.getLastRow() + 1;
    var idNumber = nextRow - 1; // ১ম অর্ডারের জন্য ১
    var customerId = "NXC" + String(idNumber).padStart(8, '0'); // NXC00000001
    
    var orderDate = new Date();
    
    // ৩. অর্ডারের ডাটা শিটে অ্যাপেন্ড করা
    orderSheet.appendRow([
      orderDate,
      data.productName,
      customerId,
      data.name,
      data.phone,
      data.address,
      data.district,
      data.postCode,
      data.quantity,
      data.price,
      data.note,
      data.delivery,
      data.payment,
      data.totalPrice,
      "Pending" // ডিফল্ট স্ট্যাটাস
    ]);
    
    // ৪. অটো স্টক ম্যানেজমেন্ট (অর্ডার আসলে স্টক বিয়োগ হবে)
    if (stockSheet) {
      updateStock(stockSheet, data.productName, -Math.abs(data.quantity));
    }
    
    // ৫. প্রফেশনাল PDF ইনভয়েস জেনারেট করা
    var invoiceBlob = generatePDFInvoice(customerId, data, orderDate);
    
    // ৬. কাস্টমার এবং শপ অ্যাডমিন উভয়কে ইমেইল অ্যালার্ট পাঠানো
    sendInvoicesToUsers(data, customerId, invoiceBlob);
    
    return ContentService.createTextOutput(JSON.stringify({"status": "success", "customerId": customerId}))
                         .setMimeType(ContentService.MimeType.JSON);
                         
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": error.toString()}))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}

// ৫. স্টক কমানো বা বাড়ানোর সাব-ফাংশন
function updateStock(sheet, productName, changeAmount) {
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0].toString().toLowerCase() === productName.toString().toLowerCase()) {
      var currentStock = Number(data[i][1]);
      sheet.getRange(i + 1, 2).setValue(currentStock + changeAmount);
      break;
    }
  }
}

// ৬. রিয়েল-টাইম স্টক রিটার্ন (Orders শিটে সরাসরি 'Return' স্ট্যাটাস টাইপ করলে স্টক বেড়ে যাবে)
function onEdit(e) {
  var range = e.range;
  var sheet = range.getSheet();
  
  // Orders শিটের ১৫ নম্বর কলাম (Status) এডিট হচ্ছে কিনা চেক করুন
  if (sheet.getName() === "Orders" && range.getColumn() === 15) {
    var newValue = e.value;
    var oldValue = e.oldValue;
    
    // স্ট্যাটাস পরিবর্তন হয়ে "Return" হলে
    if (newValue === "Return" && oldValue !== "Return") {
      var row = range.getRow();
      var productName = sheet.getRange(row, 2).getValue();
      var quantity = Number(sheet.getRange(row, 9).getValue());
      
      var stockSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Stock");
      if (stockSheet) {
        updateStock(stockSheet, productName, Math.abs(quantity)); // স্টক রিস্টোর হবে
      }
    }
  }
}

// ৭. প্রফেশনাল HTML-to-PDF ইনভয়েস ডিজাইন
function generatePDFInvoice(customerId, data, date) {
  var formattedDate = Utilities.formatDate(date, Session.getScriptTimeZone(), "dd-MM-yyyy");
  
  var htmlContent = `
    <html>
    <head>
      <style>
        body { font-family: 'Helvetica', Arial, sans-serif; color: #1e293b; padding: 30px; line-height: 1.6; }
        .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; }
        .invoice-header { display: flex; justify-content: space-between; border-bottom: 2px solid #0052e0; padding-bottom: 20px; margin-bottom: 30px; }
        .company-name { font-size: 28px; color: #0052e0; font-weight: bold; }
        .invoice-title { font-size: 24px; text-transform: uppercase; font-weight: bold; text-align: right; }
        .grid-container { width: 100%; margin-bottom: 30px; }
        .grid-container td { vertical-align: top; width: 50%; }
        .section-header { font-weight: bold; font-size: 14px; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; margin-bottom: 10px; }
        .item-table { width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 30px; }
        .item-table th { background-color: #0052e0; color: #ffffff; padding: 12px; text-align: left; font-size: 13px; font-weight: bold; }
        .item-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
        .item-table .total-row { font-weight: bold; font-size: 15px; color: #0052e0; }
        .footer-text { text-align: center; font-size: 11px; color: #64748b; margin-top: 50px; }
      </style>
    </head>
    <body>
      <div class="invoice-box">
        <table style="width: 100%; margin-bottom: 20px;">
          <tr>
            <td>
              <span class="company-name">${data.websiteName}</span><br>
              <span style="font-size: 12px; color: #64748b;">Premium Express E-Commerce</span>
            </td>
            <td align="right">
              <span class="invoice-title">Official Invoice</span><br>
              <span style="font-size: 12px;">Invoice #: <strong>${customerId}</strong></span><br>
              <span style="font-size: 12px;">Date: ${formattedDate}</span>
            </td>
          </tr>
        </table>
        
        <table class="grid-container">
          <tr>
            <td>
              <div class="section-header">Billing Information</div>
              <strong>Name:</strong> ${data.name}<br>
              <strong>Phone:</strong> ${data.phone}<br>
              <strong>Address:</strong> ${data.address}, ${data.district}<br>
              <strong>Post Code:</strong> ${data.postCode}<br>
              <strong>Email:</strong> ${data.email}
            </td>
            <td align="right">
              <div class="section-header">Order Summary</div>
              <strong>Shipping:</strong> ${data.delivery}<br>
              <strong>Payment Method:</strong> ${data.payment.toUpperCase()}<br>
              <strong>Order Status:</strong> Pending
            </td>
          </tr>
        </table>
        
        <table class="item-table">
          <thead>
            <tr>
              <th>Product Details</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th align="right">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${data.productName}</td>
              <td>${data.quantity}</td>
              <td>৳ ${data.price}</td>
              <td align="right">৳ ${data.price * data.quantity}</td>
            </tr>
            <tr class="total-row">
              <td colspan="2"></td>
              <td>Grand Total:</td>
              <td align="right">৳ ${data.totalPrice}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="footer-text">
          Thank you for shopping with ${data.websiteName}! If you have any questions regarding this invoice, please reach out to our team.
        </div>
      </div>
    </body>
    </html>
  `;
  
  var htmlBlob = HtmlService.createHtmlOutput(htmlContent).getAs('blob');
  htmlBlob.setName("Invoice_" + customerId + ".pdf");
  return htmlBlob;
}

// ৮. ডুয়াল ইমেইল অ্যালার্ট (কাস্টমার ও শপ ওনার উভয়কে ইমেইল পাঠানো)
function sendInvoicesToUsers(data, customerId, invoiceBlob) {
  var adminEmail = data.adminEmail; // config.js থেকে রিসিভকৃত ইমেইল
  var customerEmail = data.email;
  
  var subject = "Order Confirmation: " + customerId + " - " + data.websiteName;
  var body = `💡 Hello ${data.name},\n\n` +
             `Thank you for placing your order with ${data.websiteName}.\n` +
             `We have successfully received your request, and our team is already preparing it for delivery!\n\n` +
             `Order Details:\n` +
             `- Order ID: ${customerId}\n` +
             `- Item: ${data.productName} x ${data.quantity}\n` +
             `- Total Bill: ৳ ${data.totalPrice}\n\n` +
             `Please find your official PDF Invoice attached to this email.\n\n` +
             `Best regards,\n` +
             `Customer Support, ${data.websiteName}`;
  
  // কাস্টমারকে ইনভয়েস পাঠানো
  if (customerEmail) {
    try {
      MailApp.sendEmail({
        to: customerEmail,
        subject: subject,
        body: body,
        attachments: [invoiceBlob]
      });
    } catch(err) {
      Logger.log("Customer email fail: " + err.toString());
    }
  }

  // অ্যাডমিন/শপ ওনারকে অর্ডারের নোটিফিকেশন কপি পাঠানো
  if (adminEmail) {
    try {
      MailApp.sendEmail({
        to: adminEmail,
        subject: "NEW ORDER INCOMING! ID: " + customerId,
        body: `Hello Admin,\n\nA new order has been submitted.\n\n` +
              `Customer Name: ${data.name}\n` +
              `Phone Number: ${data.phone}\n` +
              `Address: ${data.address}, ${data.district}\n` +
              `Total Amount: ৳ ${data.totalPrice}\n` +
              `Details are in the attached PDF invoice.`,
        attachments: [invoiceBlob]
      });
    } catch(err) {
      Logger.log("Admin email fail: " + err.toString());
    }
  }
}


