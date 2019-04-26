var mysql = require('mysql');

var con = mysql.createConnection({
  host: "stag-svm-ai-acc-stag-m-0.stag-svm-ai-acc-stag-m.default.svc.cluster.local",
  user: "guest",
  password: "3bccba45b8189496b768338ccce44e37",
  database: "soraya_ai_accuracy"
});

con.connect(function(err) {
  if (err) throw err;
  var sql = `SELECT date_add(order_created_time_utc, interval 7 hour) AS 'Order create Date WIB', 
  SUM(CASE WHEN od.status_id IN (3,4) THEN 1 ELSE 0 END) AS 'processed',
  SUM(CASE WHEN od.status_id = 5 THEN 1 ELSE 0 END) AS 'cancelled',
  SUM(CASE WHEN od.payment_method_id IN (2,4) THEN 1 ELSE 0 END) AS 'Payment method BANK TRANSFER',
  SUM(CASE WHEN od.payment_method_id = 3 THEN 1 ELSE 0 END) AS 'Payment method OTHERS',
  SUM(CASE WHEN mp.province = 'Jawa Tengah' THEN 1 ELSE 0 END) AS 'shipped to JAWA TENGAH',
  SUM(od.points_used) AS 'Total Point Discount',
  MAX(od.discount) AS 'Highest Voucher Discount',
  ROUND(AVG(od.total_cart),1) AS 'Average chart Value',
  coalesce((od.points_used*1000)+od.discount) AS 'total discount',
  SUM(IF (od.total_cart>=250000, COALESCE(od.total_cart-((od.points_used*1000)+od.discount)), COALESCE(od.total_cart+od.shipping_cost-((od.points_used*1000)+od.discount))))AS 'Grand Total'
  
  FROM soraya_ai_accuracy.order od 
  LEFT JOIN soraya_ai_accuracy.member mb ON od.member_entity_id=mb.entity_id
  LEFT JOIN soraya_ai_accuracy.member_profile mp ON mb.profile_entity_id=mp.entity_id
  WHERE mb.is_reseller=0 
  AND date_add(od.order_created_time_utc, interval 7 hour) >= '2019/3/5'
  GROUP BY date_add(od.order_created_time_utc, interval 7 hour) ASC with rollup`; 
  con.query(sql, function (err, result){
      if (err) throw err;
      console.log(result);
  });
});