-- Verify starry-night:3-view_constellations_with_attributes.sql on pg

BEGIN;

-- XXX Add verifications here.
SELECT * FROM view_constellations_with_attributes WHERE false;

ROLLBACK;
