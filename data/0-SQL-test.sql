-- Using both DISTINCT and ORDER BY in json_agg

WITH cte AS (SELECT DISTINCT * FROM test)
SELECT json_agg(cte.* ORDER BY index) FROM cte GROUP BY tag;

SELECT
    myth.id, myth.origin, myth.img_url, myth.constellation_id, myth.star_id, myth.planet_id, myth.legend,
    jsonb_build_object(
        'id', constellation.id, 'name', constellation.name, 'latin_name', constellation.latin_name,
        'scientific_name', constellation.scientific_name, 'img_url', constellation.img_url,
        'history', constellation.history, 'spotting', constellation.spotting
    )AS constellation,
    jsonb_build_object('id', planet.id, 'name', planet.name, 'img_url', planet.img_url) AS planet,
    jsonb_build_object(
        'id', star.id, 'letter', star.letter, 'name', star.name, 'tradition_name', star.traditional_name,
        'tradition', star.tradition, 'img_url', star.img_url, 'constellation_id', star.constellation_id
    ) AS star
FROM "myth"
JOIN "constellation" ON constellation.id = myth.constellation_id
LEFT JOIN planet ON planet.id = myth.planet_id
LEFT JOIN star ON star.id = myth.star_id
WHERE myth.id >= (
    SELECT random()*(max(myth.id)-min(myth.id)) + min(myth.id) FROM "myth"
)
AND LENGTH(legend) > 0
ORDER BY myth.id
LIMIT 1;


SELECT
    myth.id, myth.origin, myth.img_url, myth.constellation_id, myth.star_id, myth.planet_id, myth.legend,
    json_build_object(
        'id', constellation.id, 'name', constellation.name, 'latin_name', constellation.latin_name,
        'scientific_name', constellation.scientific_name, 'img_url', constellation.img_url,
        'history', constellation.history, 'spotting', constellation.spotting
    )AS constellation,
    json_build_object('id', planet.id, 'name', planet.name, 'img_url', planet.img_url) AS planet,
    json_build_object(
        'id', star.id, 'letter', star.letter, 'name', star.name, 'tradition_name', star.traditional_name,
        'tradition', star.tradition, 'img_url', star.img_url, 'constellation_id', star.constellation_id
    ) AS star
FROM "myth"
JOIN "constellation" ON constellation.id = myth.constellation_id
LEFT JOIN planet ON planet.id = myth.planet_id
LEFT JOIN star ON star.id = myth.star_id
WHERE myth.id >= (
    SELECT random()*(max(myth.id)-min(myth.id)) + min(myth.id) FROM "myth"
)
AND LENGTH(legend) > 0
ORDER BY myth.id
LIMIT 1;