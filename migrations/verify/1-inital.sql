-- Verify starry-night:1-inital on pg

BEGIN;

SELECT * FROM "user" WHERE false; 
SELECT * FROM "place" WHERE false;  
SELECT * FROM "event" WHERE false;  
SELECT * FROM "planet" WHERE false; 
SELECT * FROM "constellation" WHERE false; 
SELECT * FROM "galaxy" WHERE false; 
SELECT * FROM "star" WHERE false; 
SELECT * FROM "myth" WHERE false;  
SELECT * FROM "reserve_event" WHERE false; 
SELECT * FROM "save_place" WHERE false; 
SELECT * FROM "favorite_constellation" WHERE false; 
SELECT * FROM "prefer_planet" WHERE false; 

ROLLBACK;
