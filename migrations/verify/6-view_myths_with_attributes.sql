-- Verify starry-night:6-view_myths_with_attributes on pg

BEGIN;

-- XXX Add verifications here.
SELECT * FROM view_myths_with_attributes WHERE false;

ROLLBACK;
