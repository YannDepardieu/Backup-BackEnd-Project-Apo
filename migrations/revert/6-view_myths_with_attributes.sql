-- Revert starry-night:6-view_myths_with_attributes from pg

BEGIN;

-- XXX Add DDLs here.
DROP VIEW view_myths_with_attributes;

COMMIT;
