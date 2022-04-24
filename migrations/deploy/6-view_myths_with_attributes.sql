-- Deploy starry-night:6-view_myths_with_attributes to pg

BEGIN;

-- XXX Add DDLs here.
CREATE VIEW view_myths_with_attributes AS
    SELECT
        myth.id, myth.origin, myth.img_url, myth.legend,
        (
            SELECT json_build_object(
                'id', constellation.id, 'name', constellation.name, 'latin_name', constellation.latin_name,
                'scientific_name', constellation.scientific_name, 'img_url', constellation.img_url,
                'history', constellation.history, 'spotting', constellation.spotting
            ) AS constellation
            FROM "constellation" WHERE constellation.id = myth.constellation_id
        ),
        (
            SELECT json_build_object('id', planet.id, 'name', planet.name, 'img_url', planet.img_url) AS planet
            FROM planet WHERE planet.id = myth.planet_id
        ),
        (
            SELECT json_build_object(
                'id', star.id, 'letter', star.letter, 'name', star.name, 'tradition_name', star.traditional_name,
                'tradition', star.tradition, 'img_url', star.img_url, 'constellation_id', star.constellation_id
            ) AS star
            FROM star WHERE star.id = myth.star_id
        )
    FROM "myth"
    WHERE LENGTH(legend) > 0;

COMMIT;
