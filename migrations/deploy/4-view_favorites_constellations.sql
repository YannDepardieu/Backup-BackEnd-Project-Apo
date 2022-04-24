-- Deploy starry-night:4-view_favorites_constellations to pg

BEGIN;

-- XXX Add DDLs here.*

CREATE VIEW view_favorites_constellations AS
	SELECT
		constellation.id,
		constellation.name as name,
		constellation.latin_name as latin_name,
		constellation.scientific_name as scientific_name,
		constellation.img_url as img_url,
		constellation.history as history,
		constellation.spotting as spotting,
		(SELECT array_agg(json_build_object(
			'id', myth.id, 'img_url', myth.img_url, 'origin', myth.origin, 'legend', myth.legend
		)) AS myths FROM myth WHERE constellation.id = myth.constellation_id),
		(SELECT array_agg(json_build_object(
			'id', star.id, 'letter', star.letter, 'traditional_name', star.traditional_name,
			'tradition', star.tradition, 'name', star.name, 'img_url', star.img_url
		)) AS stars FROM star WHERE constellation.id = star.constellation_id),
		(SELECT array_agg(json_build_object(
			'id', galaxy.id, 'scientific_name', galaxy.scientific_name,  'traditional_name',
			galaxy.traditional_name, 'name', galaxy.name, 'img_url', galaxy.img_url
		)) AS galaxies FROM galaxy WHERE constellation.id = galaxy.constellation_id),
		favorite_constellation.user_id
	FROM constellation
	JOIN favorite_constellation
	ON constellation.id = favorite_constellation.constellation_id
	GROUP BY constellation.id, favorite_constellation.user_id
	ORDER BY constellation.id;

--! Equivalent à :

-- CREATE VIEW view_favorites_constellations AS
    -- SELECT
    --     constellation.id,
    --     constellation.name as name,
    --     constellation.latin_name as latin_name,
    --     constellation.scientific_name as scientific_name,
    --     constellation.img_url as img_url,
    --     constellation.history as history,
    --     constellation.spotting as spotting,
    --     star.stars, myth.myths, galaxy.galaxies,
	-- 	favorite_constellation.user_id
    -- FROM "constellation"
    -- CROSS JOIN LATERAL (
    --     SELECT jsonb_agg( json_build_object(
    --         'id', myth.id, 'img_url', myth.img_url, 'origin', myth.origin, 'legend', myth.legend
    --     )) AS myths
    --     FROM myth WHERE constellation.id = myth.constellation_id
    -- ) AS myth
    -- CROSS JOIN LATERAL (
    --     SELECT jsonb_agg(json_build_object(
    --         'id', star.id, 'letter', star.letter, 'traditional_name', star.traditional_name,
    --         'tradition', star.tradition, 'name', star.name, 'img_url', star.img_url
    --     )) AS stars
    --     FROM star WHERE constellation.id = star.constellation_id
    -- ) AS star
    -- CROSS JOIN LATERAL (
    --     SELECT jsonb_agg(json_build_object(
    --         'id', galaxy.id, 'scientific_name', galaxy.scientific_name,  'traditional_name',
    --         galaxy.traditional_name, 'name', galaxy.name, 'img_url', galaxy.img_url
    --     )) AS galaxies
    --     FROM galaxy WHERE constellation.id = galaxy.constellation_id
    -- ) AS galaxy
    -- JOIN favorite_constellation
    -- ON constellation.id = favorite_constellation.constellation_id
    -- GROUP BY constellation.id, star.stars, myth.myths, galaxy.galaxies, favorite_constellation.user_id
    -- ORDER BY constellation.id;

COMMIT;

--! More or less equivalent : Version without JOIN. Here I've put the VIEW inside the request that should be in
--! the Model Constellation to show what I should change in the Model when calling the VIEW. Indeed, in this
--! VIEW unlike the others above, we need to UNNEST the users_ids

    -- SELECT * FROM (
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
    --         )) AS galaxies FROM galaxy WHERE constellation.id = galaxy.constellation_id),
    --         (SELECT array_agg(user_id) AS users_ids FROM favorite_constellation WHERE constellation.id = constellation_id)
    --     FROM "constellation"
    --     GROUP BY constellation.id
    --     ORDER BY constellation.id
    -- ) AS view_favorites_constellations
    -- WHERE 3 = ANY (SELECT UNNEST (users_ids));