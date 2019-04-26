SELECT 
date_add(mb.date_registered_utc, interval 7 hour) AS 'Order create Date WIB',
COUNT(mb.date_registered_utc) AS 'total member',
SUM(CASE WHEN mb.is_verified=1 THEN 1 ELSE 0 END) AS 'verified member',
SUM(CASE WHEN mb.is_verified=1 AND mbp.province = 'Jawa Tengah' THEN 1 ELSE 0 END) AS 'verified member Jawa Tengah',
SUM(CASE WHEN mb.is_verified=1 AND mbp.city = 'Kota Medan' THEN 1 ELSE 0 END) AS 'verified member Kota Medan',
SUM(CASE WHEN mb.is_reseller=0 THEN 1 ELSE 0 END) AS 'Non Reseller Member',
ROUND(AVG(mb.points),2) AS 'Average Points each member',
MAX(year(curdate())-year(mbp.date_of_birth)) AS 'oldest age',
MIN(year(curdate())-year(mbp.date_of_birth)) AS 'youngest age'

FROM soraya_ai_accuracy.member mb 
LEFT JOIN soraya_ai_accuracy.member_profile mbp ON mb.profile_entity_id=mbp.entity_id

GROUP BY date_add(mb.date_registered_utc, interval 7 hour) ASC WITH rollup