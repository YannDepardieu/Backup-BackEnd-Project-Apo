-- Revert starry-night:7-view_saved_places_details from pg

BEGIN;

-- XXX Add DDLs here.

DROP VIEW view_saved_places_details;

COMMIT;
