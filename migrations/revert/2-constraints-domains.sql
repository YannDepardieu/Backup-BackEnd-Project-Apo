-- Revert starry-night:2-constraints-domains from pg

BEGIN;

-- XXX Add DDLs here.
ALTER TABLE "user"
    DROP CONSTRAINT email_check,
    DROP CONSTRAINT role_check,
    DROP CONSTRAINT password_check;

ALTER TABLE "place"
    ALTER COLUMN latitude TYPE REAL,
    ALTER COLUMN longitude TYPE REAL;

ALTER TABLE "event"
    ALTER COLUMN latitude TYPE REAL,
    ALTER COLUMN longitude TYPE REAL;

DROP DOMAIN lat_range;
DROP DOMAIN long_range;

ALTER TABLE "event"
    DROP CONSTRAINT event_datetime_check,
    DROP CONSTRAINT recall_datetime_check;

ALTER TABLE "planet" ALTER COLUMN img_url TYPE TEXT;
ALTER TABLE "constellation" ALTER COLUMN img_url TYPE TEXT;
ALTER TABLE "galaxy" ALTER COLUMN img_url TYPE TEXT;
ALTER TABLE "star" ALTER COLUMN img_url TYPE TEXT;
ALTER TABLE "myth" ALTER COLUMN img_url TYPE TEXT;

DROP DOMAIN img_syntax;


COMMIT;
