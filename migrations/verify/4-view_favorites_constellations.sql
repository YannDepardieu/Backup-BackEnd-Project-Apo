-- Verify starry-night:4-view_favorites_constellations on pg

BEGIN;

-- XXX Add verifications here.
SELECT * FROM view_favorites_constellations WHERE false;

ROLLBACK;
