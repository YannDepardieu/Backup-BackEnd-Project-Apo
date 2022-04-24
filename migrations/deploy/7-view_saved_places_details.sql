-- Deploy starry-night:7-view_saved_places_details to pg

BEGIN;

-- XXX Add DDLs here.

CREATE VIEW view_saved_places_details AS
    SELECT
        place.id,
        place.name,
        place.address,
        place.latitude,
        place.longitude,
        save_place.user_id,
        save_place.place_id
    FROM "place"
    JOIN save_place
    ON place.id = save_place.place_id;

--! Equivalent  à :

CREATE VIEW view_saved_places_details AS
    SELECT
        place.id,
        place.name,
        place.address,
        place.latitude,
        place.longitude,
        save_place.user_id,
        save_place.place_id
	FROM "place", (
		SELECT * FROM save_place
	) AS save_place
    WHERE place.id = save_place.place_id

COMMIT;
