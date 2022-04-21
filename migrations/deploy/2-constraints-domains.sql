-- Deploy starry-night:2-constraints-domains to pg

BEGIN;

-- XXX Add DDLs here.
ALTER TABLE "user"
    ADD CONSTRAINT email_check
    CHECK (email ~ '^[a-z0-9]+[.+-]?[a-z0-9]+(?:@)(([a-z0-9]+\.[a-z]+\.[a-z]+)|([a-z0-9]+\.[a-z]+))$'),
    ADD CONSTRAINT role_check
    CHECK (role ~ '(^user$)|(^admin$)'),
    ADD CONSTRAINT password_check
    CHECK (password ~ '^[a-zA-Z0-9²&é~"#{(|è`\\ç^à@)=}~ø$*ù%µ£°+§!/:.;?,><_-]{8,100}$');

CREATE DOMAIN lat_range AS REAL CHECK (VALUE >= -90 AND VALUE <= 90);
CREATE DOMAIN long_range AS REAL CHECK (VALUE >= -180 AND VALUE <= 180);

ALTER TABLE "place"
    ALTER COLUMN latitude TYPE lat_range,
    ALTER COLUMN longitude TYPE long_range;

ALTER TABLE "event"
    ALTER COLUMN latitude TYPE lat_range,
    ALTER COLUMN longitude TYPE long_range;

ALTER TABLE "event"
    ADD CONSTRAINT event_datetime_check
    CHECK (event_datetime >= NOW()),
    ADD CONSTRAINT recall_datetime_check
    CHECK (recall_datetime <= event_datetime);

CREATE DOMAIN img_syntax AS TEXT CHECK (VALUE ~ '^\/img\/[a-z0-9_-]+\.((jpg)|(jpeg)|(png)|(svg))$');

ALTER TABLE "planet" ALTER COLUMN img_url TYPE img_syntax;
ALTER TABLE "constellation" ALTER COLUMN img_url TYPE img_syntax;
ALTER TABLE "galaxy" ALTER COLUMN img_url TYPE img_syntax;
ALTER TABLE "star" ALTER COLUMN img_url TYPE img_syntax;
ALTER TABLE "myth" ALTER COLUMN img_url TYPE img_syntax;


COMMIT;
