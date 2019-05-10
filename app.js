var db1 = require('./akses1');
var db2 = require('./akses2');
var db3 = require('./akses3');
var psn = require('./teleg');  // access telegram function
var mysql = require('mysql');
var schedule = require('node-schedule');

var con = mysql.createConnection({
  host: "stag-svm-ai-acc-stag-m-0.stag-svm-ai-acc-stag-m.default.svc.cluster.local",
  user: "guest",
  password: "3bccba45b8189496b768338ccce44e37",
  database: "soraya_ai_accuracy"
});


console.log('System worker is running');
psn.telegram('Worker Querying Bot is running');


console.log('run on scheduler every 4 hour');
var j = schedule.scheduleJob('* */4 * * *', function()
{
db1.sql1(con);
console.log('execute Order Detail Data SQL');

setTimeout(function(){
  db2.sql2(con)
  console.log('execute Order Analytics SQL');
},20000); // 20 seconds as delay process 


setTimeout(function(){
  db3.sql3(con)
  console.log('execute Member Analytics SQL');
},5000); // 20 seconds as delay process 

});

