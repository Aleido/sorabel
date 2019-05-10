var ccsv = require('./createcsv');
var psn = require('./teleg');

exports.sql3=function(con){
  
  var GoogleSpreadsheet = require('google-spreadsheet');
  var creds = require('./client_secret.json');

  // Create a document object using the ID of the spreadsheet - Order Detail Data.
  var doc = new GoogleSpreadsheet('1JjjEkxv8m8AfGgwKsQWTE1Y9NOe0G2IH9HEn5URhN7Q'); // Member Analytics Spreadsheet


  var sqlresult=null;
  var hasil =[];
  con.connect(function(err) {
    console.log('run query3');
    if (err) throw err;
    var sql = `SELECT 
    date_format(date_add(mb.date_registered_utc, interval 7 hour),'%d-%M-%Y') AS 'Member create date ',
    COUNT(mb.date_registered_utc) AS 'total member',
    SUM(CASE WHEN mb.is_verified=1 THEN 1 ELSE 0 END) AS 'verified member',
    SUM(CASE WHEN mb.is_verified=1 AND mbp.province = 'Jawa Tengah' THEN 1 ELSE 0 END) AS 'verified member Jawa Tengah',
    SUM(CASE WHEN mb.is_verified=1 AND mbp.city = 'Kota Medan' THEN 1 ELSE 0 END) AS 'verified member Kota Medan',
    SUM(CASE WHEN mb.is_reseller=0 THEN 1 ELSE 0 END) AS 'Non Reseller Member',
    ROUND(AVG(mb.points),2) AS 'Average Points each member',
    ROUND(AVG(DATEDIFF(curdate(),mbp.date_of_birth)/365),3) AS 'Average age',
    MAX(ROUND(DATEDIFF(curdate(),mbp.date_of_birth)/365,3)) AS 'Oldest age',
    MIN(ROUND(DATEDIFF(curdate(),mbp.date_of_birth)/365,3)) AS 'Youngest age'
    FROM soraya_ai_accuracy.member mb 
    LEFT JOIN soraya_ai_accuracy.member_profile mbp ON mb.profile_entity_id=mbp.entity_id
    GROUP BY date(date_add(mb.date_registered_utc, interval 7 hour)) ASC`; 
    con.query(sql, function (err, result){
        if (err) throw err;
        sqlresult=result;
        console.log(result.length);
        setvalue(result); // save and ensure for querying process already done and ready to exported into spreadsheet
        ccsv.createcsv(result,'member_analytics.csv');
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
            setTimeout((function() {  
              return process.exit(22);
                 }), 10000);
    });
    }

      psn.telegram('Querying process of "Member Analytics" already finished and it was uploaded to https://docs.google.com/spreadsheets/d/1JjjEkxv8m8AfGgwKsQWTE1Y9NOe0G2IH9HEn5URhN7Q');


}