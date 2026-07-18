/* ==========================================
Code.gs (PART-1)
========================================== */

const USERS_SHEET = "Users";
const ORDERS_SHEET = "Orders";

function doPost(e){

  try{

    const data = JSON.parse(e.postData.contents);

    const action = data.action;

    switch(action){

      case "register":
        return output(registerUser(data));

      case "login":
        return output(loginUser(data));

      case "placeOrder":
        return output(placeOrder(data));

      case "track":
        return output(trackOrder(data));

      case "myOrders":
        return output(getMyOrders(data));

      case "uploadAvatar":
        return output(uploadAvatar(data));

      default:
        return output({
          success:false,
          message:"Invalid Action"
        });

    }

  }catch(err){

    return output({
      success:false,
      message:err.toString()
    });

  }

}

function doGet(){

  return ContentService
  .createTextOutput("NexCart API Running");

}

function output(obj){

  return ContentService
  .createTextOutput(JSON.stringify(obj))
  .setMimeType(ContentService.MimeType.JSON);

}

function getSheet(name){

  return SpreadsheetApp
  .getActiveSpreadsheet()
  .getSheetByName(name);

}

function generateCustomerId(){

  return "NXC-"+Utilities.getUuid().substring(0,8).toUpperCase();

}

function generateOrderId(){

  return "ORD-"+new Date().getTime();

}

/* ===========================
REGISTER
=========================== */

function registerUser(data){

  const sheet=getSheet(USERS_SHEET);

  const values=sheet.getDataRange().getValues();

  for(let i=1;i<values.length;i++){

    if(values[i][2]==data.phone){

      return{

        success:false,
        message:"Phone Already Exists"

      };

    }

  }

  const customerId=generateCustomerId();

  sheet.appendRow([

    customerId,

    data.name,

    data.phone,

    data.password,

    "",

    new Date()

  ]);

  return{

    success:true,
    customerId:customerId

  };

}

/* ===========================
LOGIN
=========================== */

function loginUser(data){

  const sheet=getSheet(USERS_SHEET);

  const values=sheet.getDataRange().getValues();

  for(let i=1;i<values.length;i++){

    if(

      values[i][2]==data.phone &&

      values[i][3]==data.password

    ){

      return{

        success:true,

        user:{

          customerId:values[i][0],

          name:values[i][1],

          phone:values[i][2],

          avatar:values[i][4]

        }

      };

    }

  }

  return{

    success:false,

    message:"Invalid Login"

  };

}

/* ===========================
PLACE ORDER
=========================== */

function placeOrder(data){

  const sheet=getSheet(ORDERS_SHEET);

  const orderId=generateOrderId();

  data.items.forEach(function(item){

    sheet.appendRow([

      orderId,

      data.customerId,

      data.customer,

      data.phone,

      item.id,

      item.name,

      item.qty,

      item.price,

      item.qty*item.price,

      "Pending",

      new Date()

    ]);

  });

  return{

    success:true,

    orderId:orderId

  };

}
/* ==========================================
Code.gs (PART-2)
========================================== */

/* ===========================
TRACK ORDER
=========================== */

function trackOrder(data){

  const sheet=getSheet(ORDERS_SHEET);

  const values=sheet.getDataRange().getValues();

  for(let i=values.length-1;i>=1;i--){

    if(

      values[i][0]==data.keyword ||

      values[i][3]==data.keyword ||

      values[i][1]==data.keyword

    ){

      return{

        success:true,

        order:{

          orderId:values[i][0],

          customerId:values[i][1],

          customer:values[i][2],

          phone:values[i][3],

          product:values[i][5],

          qty:values[i][6],

          price:values[i][8],

          status:values[i][9],

          date:Utilities.formatDate(
            new Date(values[i][10]),
            Session.getScriptTimeZone(),
            "dd MMM yyyy hh:mm a"
          )

        }

      };

    }

  }

  return{

    success:false,

    message:"Order Not Found"

  };

}

/* ===========================
MY ORDERS
=========================== */

function getMyOrders(data){

  const sheet=getSheet(ORDERS_SHEET);

  const values=sheet.getDataRange().getValues();

  let orders=[];

  for(let i=1;i<values.length;i++){

    if(values[i][1]==data.customerId){

      orders.push({

        orderId:values[i][0],

        customerId:values[i][1],

        customer:values[i][2],

        phone:values[i][3],

        product:values[i][5],

        qty:values[i][6],

        price:values[i][8],

        status:values[i][9],

        date:Utilities.formatDate(

          new Date(values[i][10]),

          Session.getScriptTimeZone(),

          "dd MMM yyyy hh:mm a"

        )

      });

    }

  }

  return{

    success:true,

    orders:orders

  };

}

/* ===========================
UPLOAD AVATAR
=========================== */

function uploadAvatar(data){

  const folder=DriveApp.getRootFolder();

  const base64=data.image.split(",")[1];

  const blob=Utilities.newBlob(

    Utilities.base64Decode(base64),

    "image/png",

    data.customerId+".png"

  );

  const file=folder.createFile(blob);

  file.setSharing(

    DriveApp.Access.ANYONE,

    DriveApp.Permission.VIEW

  );

  const url=

  "https://drive.google.com/uc?export=view&id="+

  file.getId();

  const sheet=getSheet(USERS_SHEET);

  const values=sheet.getDataRange().getValues();

  for(let i=1;i<values.length;i++){

    if(values[i][0]==data.customerId){

      sheet.getRange(i+1,5).setValue(url);

      break;

    }

  }

  return{

    success:true,

    url:url

  };

}

/* ===========================
UTILITY
=========================== */

function clearOrders(){

  const sheet=getSheet(ORDERS_SHEET);

  const lastRow=sheet.getLastRow();

  if(lastRow>1){

    sheet.deleteRows(2,lastRow-1);

  }

}

function clearUsers(){

  const sheet=getSheet(USERS_SHEET);

  const lastRow=sheet.getLastRow();

  if(lastRow>1){

    sheet.deleteRows(2,lastRow-1);

  }

}

function testAPI(){

  Logger.log({

    success:true,

    message:"API Working Successfully"

  });

}
