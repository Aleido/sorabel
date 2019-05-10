var ccsv = require('./createcsv');
var psn = require('./teleg');

exports.sql1=function(con){

  var GoogleSpreadsheet = require('google-spreadsheet');
  var creds = require('./client_secret.json');

  // Create a document object using the ID of the spreadsheet - Order Detail Data.
  var doc = new GoogleSpreadsheet('1zzKdfULR3VUU56hGPHZ-IblsqZReJhMhA76lxL66kZQ'); // Detail Order Data Spreadsheet

  var sqlresult=null;
  var hasil =[];
  con.connect(function(err) {
    console.log('run query1');
    if (err) throw err;
    var sql = `SELECT od.order_public_id, 
    date_format(date_add(od.order_created_time_utc, interval 7 hour),'%d-%M-%Y') AS 'Order create Date WIB',
    phone_number, mp.city, mp.province, 
    otp.name AS 'order status name', pmt.name AS 'payment method',
    coalesce((od.points_used*1000)+od.discount) AS 'total discount',
    #od.total_cart,
    #od.shipping_cost,
    @grandtotal := IF (od.total_cart>=250000, 
       coalesce(od.total_cart-((od.points_used*1000)+od.discount)), 
       COALESCE(od.total_cart+od.shipping_cost-((od.points_used*1000)+od.discount)))AS 'Grand Total'
    FROM soraya_ai_accuracy.order od 
    LEFT JOIN soraya_ai_accuracy.member mb ON od.member_entity_id=mb.entity_id
    LEFT JOIN soraya_ai_accuracy.member_profile mp ON mb.profile_entity_id=mp.entity_id
    LEFT JOIN soraya_ai_accuracy.order_status_type otp ON od.status_id=otp.id
    LEFT JOIN soraya_ai_accuracy.payment_method_type pmt ON od.payment_method_id=pmt.id
    WHERE mb.is_verified=1 
    AND mp.province IN ('DKI Jakarta','Banten','Jawa Barat')
    AND date_add(od.order_created_time_utc, interval 7 hour) between '2019/3/10' and '2019/3/25'
    ORDER BY date_add(od.order_created_time_utc, interval 7 hour) ASC, @grandtotal DESC`; 
    
    con.query(sql, function (err, result){
        if (err)  throw err;
        sqlresult=result;
        setvalue(result);
        console.log(result.length);
        //console.log(result);
        //setvalue(result);
       ccsv.createcsv(result,'order_detail_data.csv');
      });      
  });
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

    psn.telegram('Querying process of "Order Data Detail" already finished and it was uploaded to https://docs.google.com/spreadsheets/d/1zzKdfULR3VUU56hGPHZ-IblsqZReJhMhA76lxL66kZQ');
    
}
