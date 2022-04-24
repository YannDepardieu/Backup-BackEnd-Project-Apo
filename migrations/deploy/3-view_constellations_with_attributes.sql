-- Deploy starry-night:3-view_constellations_with_attributes.sql to pg

BEGIN;

-- XXX Add DDLs here.

CREATE VIEW view_constellations_with_attributes AS
    SELECT
        constellation.id,
        constellation.name as name,
        constellation.latin_name as latin_name,
        constellation.scientific_name as scientific_name,
        constellation.img_url as img_url,
        constellation.history as history,
        constellation.spotting as spotting,
        star.stars, myth.myths, galaxy.galaxies
    FROM "constellation"
    CROSS JOIN LATERAL (
        SELECT jsonb_agg( json_build_object(
            'id', myth.id, 'img_url', myth.img_url, 'origin', myth.origin, 'legend', myth.legend
        )) AS myths
        FROM myth WHERE constellation.id = myth.constellation_id
    ) AS myth
    CROSS JOIN LATERAL (
        SELECT jsonb_agg(json_build_object(
            'id', star.id, 'letter', star.letter, 'traditional_name', star.traditional_name,
            'tradition', star.tradition, 'name', star.name, 'img_url', star.img_url
        )) AS stars
        FROM star WHERE constellation.id = star.constellation_id
    ) AS star
    CROSS JOIN LATERAL (
        SELECT jsonb_agg(json_build_object(
            'id', galaxy.id, 'scientific_name', galaxy.scientific_name,  'traditional_name',
            galaxy.traditional_name, 'name', galaxy.name, 'img_url', galaxy.img_url
        )) AS galaxies
        FROM galaxy WHERE constellation.id = galaxy.constellation_id
    ) AS galaxy
    GROUP BY constellation.id, star.stars, myth.myths, galaxy.galaxies
    ORDER BY constellation.id;

--! Equivalent à :

-- CREATE VIEW view_constellations_with_attributes AS
--     SELECT
--         constellation.id,
--         constellation.name as name,
--         constellation.latin_name as latin_name,
--         constellation.scientific_name as scientific_name,
--         constellation.img_url as img_url,
--         constellation.history as history,
--         constellation.spotting as spotting,
--         (SELECT array_agg(json_build_object(
--             'id', myth.id, 'img_url', myth.img_url, 'origin', myth.origin, 'legend', myth.legend
--         )) AS myths FROM myth WHERE constellation.id = myth.constellation_id),
--         (SELECT array_agg(json_build_object(
--             'id', star.id, 'letter', star.letter, 'traditional_name', star.traditional_name,
--             'tradition', star.tradition, 'name', star.name, 'img_url', star.img_url
--         )) AS stars FROM star WHERE constellation.id = star.constellation_id),
--         (SELECT array_agg(json_build_object(
--             'id', galaxy.id, 'scientific_name', galaxy.scientific_name,  'traditional_name',
--             galaxy.traditional_name, 'name', galaxy.name, 'img_url', galaxy.img_url
--         )) AS galaxies FROM galaxy WHERE constellation.id = galaxy.constellation_id)
--     FROM "constellation"
--     GROUP BY constellation.id
--     ORDER BY constellation.id;


COMMIT;
