var ccsv = require('./createcsv');
var psn = require('./teleg');

exports.sql2=function(con){
  
  var GoogleSpreadsheet = require('google-spreadsheet');
  var creds = require('./client_secret.json');

  // Create a document object using the ID of the spreadsheet - Order Detail Data.
  var doc = new GoogleSpreadsheet('1ciluAlzjv68KE96SNU256UO2ONkEj7ZRsxPeAuR-gDY'); // Order Analytics Spreadsheet

  
  var sqlresult=null;
  var hasil =[];
  /*con.connect(function(err) {
    console.log('run query2');
    if (err) throw err;*/
    var sql = `SELECT 
    date_format(date_add(od.order_created_time_utc, interval 7 hour),'%d-%M-%Y') AS 'Order create Date WIB',
    #date_add(order_created_time_utc, interval 7 hour) AS 'Order create Date WIB', 
    SUM(CASE WHEN od.status_id IN (3,4) THEN 1 ELSE 0 END) AS 'processed',
    SUM(CASE WHEN od.status_id = 5 THEN 1 ELSE 0 END) AS 'cancelled',
    SUM(CASE WHEN od.payment_method_id IN (2,4) THEN 1 ELSE 0 END) AS 'Payment method BANK TRANSFER',
    SUM(CASE WHEN od.payment_method_id = 3 THEN 1 ELSE 0 END) AS 'Payment method OTHERS',
    SUM(CASE WHEN mp.province = 'Jawa Tengah' THEN 1 ELSE 0 END) AS 'shipped to JAWA TENGAH',
    SUM(od.points_used) AS 'Total Point Discount',
    MAX(od.discount) AS 'Highest Voucher Discount',
    ROUND(AVG(od.total_cart),1) AS 'Average chart Value',
    coalesce((od.points_used*1000)+od.discount) AS 'total discount',
    SUM(IF (od.total_cart>=250000, 
       COALESCE(od.total_cart-((od.points_used*1000)+od.discount)), 
       COALESCE(od.total_cart+od.shipping_cost-((od.points_used*1000)+od.discount))))AS 'Grand Total'
    FROM soraya_ai_accuracy.order od 
    LEFT JOIN soraya_ai_accuracy.member mb ON od.member_entity_id=mb.entity_id
    LEFT JOIN soraya_ai_accuracy.member_profile mp ON mb.profile_entity_id=mp.entity_id
    WHERE mb.is_reseller=0 
    AND date_add(od.order_created_time_utc, interval 7 hour) >= '2019/3/5'
    GROUP BY date(date_add(od.order_created_time_utc, interval 7 hour)) ASC`; 
    
    con.query(sql, function (err, result){
        if (err) throw err;
        sqlresult=result;
        setvalue(result);
        console.log(result.length);
        ccsv.createcsv(result,'order_analytics.csv');
    });
  //});

      function setvalue(value){
      hasil=value;  // temporary variable
      console.log('number of data',hasil.length);
    
      var dataheader = Object.keys(hasil[0])  
      console.log('uploadss');
      doc.useServiceAccountAuth(creds, function (err) {
      doc.addWorksheet({headers: dataheader}, function(addWorksheetErr, newSheet) {
      if (addWorksheetErr) console.error(addWorksheetErr);
      else {
      hasil.forEach((data) => {
      newSheet.addRow(data, function(addRowErr, row) {
      //console.log(data,row) // for collumn
          });
        });
      }
    });
    });
    }
  
    psn.telegram('Querying process of "Order Analytics" already finished and it was uploaded to https://docs.google.com/spreadsheets/d/1ciluAlzjv68KE96SNU256UO2ONkEj7ZRsxPeAuR-gDY');
  
}
