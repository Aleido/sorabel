var db1 = require('./akses1');
var db2 = require('./akses2');
var db3 = require('./akses3');
var mysql = require('mysql');
var schedule = require('node-schedule');

var con = mysql.createConnection({
  host: "stag-svm-ai-acc-stag-m-0.stag-svm-ai-acc-stag-m.default.svc.cluster.local",
  user: "guest",
  password: "3bccba45b8189496b768338ccce44e37",
  database: "soraya_ai_accuracy"
});

console.log('run on scheduler every 4 hour');
var j = schedule.scheduleJob('* */4 * * *', function(){
  
db1.sql1(con)
console.log('execute Order Detail Data SQL');

db2.sql2(con)
console.log('execute Order Analytics SQL');

db3.sql3(con)
console.log('execute Member Analytics SQL');
})