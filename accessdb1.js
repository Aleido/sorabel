var mysql = require('mysql');

var con = mysql.createConnection({
  host: "stag-svm-ai-acc-stag-m-0.stag-svm-ai-acc-stag-m.default.svc.cluster.local",
  user: "guest",
  password: "3bccba45b8189496b768338ccce44e37",
  database: "soraya_ai_accuracy"
});

con.connect(function(err) {
  if (err) throw err;
  var sql = `SELECT od.order_public_id, 
  date_add(order_created_time_utc, interval 7 hour) AS 'Order create Date WIB', 
  phone_number, mp.city, mp.province, 
  otp.name AS 'order status name', 
  pmt.name AS 'payment method',
  coalesce((od.points_used*1000)+od.discount) AS 'total discount',
  IF (od.total_cart>=250000, coalesce(od.total_cart-((od.points_used*1000)+od.discount)), COALESCE(od.total_cart+od.shipping_cost-((od.points_used*1000)+od.discount)))AS 'Grand Total'
  FROM soraya_ai_accuracy.order od 
  LEFT JOIN soraya_ai_accuracy.member mb ON od.member_entity_id=mb.entity_id
  LEFT JOIN soraya_ai_accuracy.member_profile mp ON mb.profile_entity_id=mp.entity_id
  LEFT JOIN soraya_ai_accuracy.order_status_type otp ON od.status_id=otp.id
  LEFT JOIN soraya_ai_accuracy.payment_method_type pmt ON od.payment_method_id=pmt.id
  WHERE mb.is_verified=1 
  AND mp.province IN ('DKI Jakarta','Banten','Jawa Barat')
  AND date_add(od.order_created_time_utc, interval 7 hour) between '2019/3/10' and '2019/3/25'
  ORDER BY date_add(od.order_created_time_utc, interval 7 hour) ASC`; 
  con.query(sql, function (err, result){
      if (err) throw err;
      console.log(result);
  });
});