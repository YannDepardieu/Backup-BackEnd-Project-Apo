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
ORDER BY constellation.id;
--
--
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
WHERE constellation.id=$1
GROUP BY constellation.id, star.stars, myth.myths, galaxy.galaxies
ORDER BY constellation.id;
--
--
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
FROM constellation
JOIN favorite_constellation
ON constellation.id = favorite_constellation.constellation_id
WHERE favorite_constellation.user_id = $1
GROUP BY constellation.id
ORDER BY constellation.id;

SELECT *
FROM constellation
JOIN favorite_constellation
ON constellation.id = favorite_constellation.constellation_id
WHERE favorite_constellation.user_id = $1
AND favorite_constellation.constellation_id = $2;

SELECT constellation.id FROM constellation
JOIN favorite_constellation
ON constellation.id = favorite_constellation.constellation_id
WHERE favorite_constellation.user_id = $1
AND constellation.id = $2

SELECT *, event.id FROM "event"
JOIN reserve_event
ON event.id = reserve_event.event_id
WHERE reserve_event.user_id = $1;

SELECT *, event.id FROM "event"
JOIN reserve_event
ON event.id = reserve_event.event_id
WHERE reserve_event.user_id = $1
AND event.id = $2;

DELETE FROM "event"
WHERE event.id = (
    SELECT event.id FROM "event"
    JOIN reserve_event
    ON event.id = reserve_event.event_id
    WHERE reserve_event.user_id = $1
    AND event.id = $2
)
RETURNING *;


SELECT
    myth.id, myth.origin, myth.img_url, myth.legend,
    (
        SELECT json_build_object(
            'id', constellation.id, 'name', constellation.name, 'latin_name', constellation.latin_name,
            'scientific_name', constellation.scientific_name, 'img_url', constellation.img_url,
            'history', constellation.history, 'spotting', constellation.spotting
        )AS constellation
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
WHERE myth.id >= (
    SELECT random()*(max(myth.id)-min(myth.id)) + min(myth.id) FROM "myth"
)
AND LENGTH(legend) > 0
ORDER BY myth.id
LIMIT 1;


SELECT
    myth.id, myth.origin, myth.img_url, myth.legend,
    (
        SELECT json_build_object(
            'id', constellation.id, 'name', constellation.name, 'latin_name', constellation.latin_name,
            'scientific_name', constellation.scientific_name, 'img_url', constellation.img_url,
            'history', constellation.history, 'spotting', constellation.spotting
        )AS constellation
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
WHERE myth.id = $1
AND LENGTH(legend) > 0;


SELECT place.id, place.name, place.address, place.latitude, place.longitude FROM "place"
JOIN save_place
ON place.id = save_place.place_id
WHERE save_place.user_id = $1;

SELECT place.id, place.name, place.address, place.latitude, place.longitude FROM "place"
JOIN save_place
ON place.id = save_place.place_id
WHERE save_place.user_id = $1
AND place.id = $2;

DELETE FROM "place"
    WHERE place.id = (
        SELECT place.id FROM "place"
        JOIN save_place
        ON place.id = save_place.place_id
        WHERE save_place.user_id = $1
        AND place.id = $2
    )
RETURNING *;