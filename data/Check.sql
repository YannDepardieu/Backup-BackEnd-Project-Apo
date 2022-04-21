ALTER TABLE "user"
    ADD CONSTRAINT email_check
    CHECK (email ~ '^[a-z0-9]+[.+-]?[a-z0-9]+(?:@)(([a-z0-9]+\.[a-z]+\.[a-z]+)|([a-z0-9]+\.[a-z]+))$')
    ADD CONSTRAINT role_check
    CHECK (role ~ '(^user$)|(^admin$)');

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
    CHECK (event_datetime ~ VALUE >= NOW())
    ADD CONSTRAINT recall_datetime_check
    CHECK (recall_datetime ~ VALUE <= event_datetime);