-- Verify starry-night:5-view_reserved_events_details on pg

BEGIN;

-- XXX Add verifications here.
SELECT * FROM view_reserved_events_details WHERE false;

ROLLBACK;
