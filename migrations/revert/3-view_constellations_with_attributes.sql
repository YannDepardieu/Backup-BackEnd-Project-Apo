-- Revert starry-night:3-view_constellations_with_attributes.sql from pg

BEGIN;

-- XXX Add DDLs here.
DROP VIEW view_constellations_with_attributes;

COMMIT;
