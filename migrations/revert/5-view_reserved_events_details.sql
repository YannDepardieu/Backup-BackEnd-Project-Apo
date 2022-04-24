-- Revert starry-night:5-view_reserved_events_details from pg

BEGIN;

-- XXX Add DDLs here.
DROP VIEW view_reserved_events_details;

COMMIT;
