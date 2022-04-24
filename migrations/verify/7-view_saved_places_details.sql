-- Verify starry-night:7-view_saved_places_details on pg

BEGIN;

-- XXX Add verifications here.

SELECT * FROM view_saved_places_details WHERE false;

ROLLBACK;
