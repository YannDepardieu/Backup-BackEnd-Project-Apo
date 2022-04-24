-- Deploy starry-night:5-view_reserved_events_details to pg

BEGIN;

-- XXX Add DDLs here.
CREATE VIEW view_reserved_events_details AS
	SELECT
        event.id,
        event.name,
        event.event_datetime,
        event.latitude,
        event.longitude,
        event.recall_datetime,
        reserve_event.event_id,
        reserve_event.user_id
    FROM "event"
	JOIN reserve_event
	ON event.id = reserve_event.event_id;

--! Equivalent à :

-- SELECT
-- 	event.id,
-- 	event.name,
-- 	event.event_datetime,
-- 	event.latitude,
-- 	event.longitude,
-- 	event.recall_datetime,
-- 	reserve_event.event_id,
-- 	reserve_event.user_id
-- FROM "event", (
-- SELECT * FROM reserve_event
-- ) AS reserve_event
-- WHERE event.id = reserve_event.event_id

COMMIT;

