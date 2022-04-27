-- To test and work on views with models queries, all in one. You can put it in Pgadmin like that

---------------------------------------------------------------------------------------------
                        --! CONSTELLATION
---------------------------------------------------------------------------------------------

SELECT * FROM (
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
    ORDER BY constellation.id
) AS foo;


SELECT * FROM (
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
        )) AS galaxies FROM galaxy WHERE constellation.id = galaxy.constellation_id)
    FROM "constellation"
    GROUP BY constellation.id
    ORDER BY constellation.id
) AS foo
WHERE id=2;

---------------------------------------------------------------------------------------------
                        --! FAVORITE CONSTELLATION
---------------------------------------------------------------------------------------------
SELECT * FROM (
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
	ORDER BY constellation.id
) AS foo
WHERE user_id = 3;

-- Same result but different query

SELECT * FROM (
    SELECT
        constellation.id,
        constellation.name as name,
        constellation.latin_name as latin_name,
        constellation.scientific_name as scientific_name,
        constellation.img_url as img_url,
        constellation.history as history,
        constellation.spotting as spotting,
        star.stars, myth.myths, galaxy.galaxies,
		favorite_constellation.user_id
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
    JOIN favorite_constellation
    ON constellation.id = favorite_constellation.constellation_id
    GROUP BY constellation.id, star.stars, myth.myths, galaxy.galaxies, favorite_constellation.user_id
    ORDER BY constellation.id
) AS foo
WHERE user_id = 3;

---------------------------------------------------------------------------------------------
                        --! EVENT
---------------------------------------------------------------------------------------------
SELECT * FROM (
	SELECT
        event.id,
        event.name,
        event.event_datetime,
        event.latitude,
        event.longitude,
        event.recall_datetime,
        reserve_event.event_id,
        reserve_event.user_id
    FROM "event"
	JOIN reserve_event
	ON event.id = reserve_event.event_id
) AS foo
WHERE user_id = 2;


SELECT * FROM (
    SELECT
        event.id,
        event.name,
        event.event_datetime,
        event.latitude,
        event.longitude,
        event.recall_datetime,
        reserve_event.event_id,
        reserve_event.user_id
    FROM "event", (
    SELECT * FROM reserve_event
    ) AS reserve_event
    WHERE event.id = reserve_event.event_id
) AS foo
WHERE user_id = 2 AND event_id = 4;

---------------------------------------------------------------------------------------------
                        --! MYTHS
---------------------------------------------------------------------------------------------

SELECT * FROM (
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
    WHERE LENGTH(legend) > 0
) AS foo
WHERE id >= (
    SELECT random()*(max(myth.id)-min(myth.id)) + min(myth.id) FROM "myth"
)
ORDER BY id LIMIT 1;



SELECT * FROM (
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
    WHERE LENGTH(legend) > 0
) AS foo
WHERE id = 1;

---------------------------------------------------------------------------------------------
                        --! PLACES
---------------------------------------------------------------------------------------------
SELECT * FROM (
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
    ON place.id = save_place.place_id
) AS foo
WHERE user_id = 11;


SELECT * FROM (
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
) AS foo
WHERE user_id = 11 AND place_id = 20;