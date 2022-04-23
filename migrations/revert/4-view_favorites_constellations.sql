-- Revert starry-night:4-view_favorites_constellations from pg

BEGIN;

-- XXX Add DDLs here.
DROP VIEW view_favorites_constellations;

COMMIT;
