ALTER TABLE "user"
    ADD CONSTRAINT email_check
    CHECK (email ~ '^[a-z0-9]+[.+-]?[a-z0-9]+(?:@)(([a-z0-9]+\.[a-z]+\.[a-z]+)|([a-z0-9]+\.[a-z]+))$')
    ADD CONSTRAINT role_check
    CHECK (role ~ '(^user$)|(^admin$)');

CREATE DOMAIN lat_range AS REAL CHECK (VALUE >= -90 AND VALUE <= 90);
CREATE DOMAIN long_range AS REAL CHECK (VALUE >= -180 AND VALUE <= 180);

ALTER TABLE ""

                arrayLatLong[0] >= -90 &&
                arrayLatLong[0] <= 90 &&
                arrayLatLong[1] >= -180 &&
                arrayLatLong[1] <= 180