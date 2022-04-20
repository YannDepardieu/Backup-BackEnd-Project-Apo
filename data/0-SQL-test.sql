-- Using both DISTINCT and ORDER BY in json_agg

WITH cte AS (SELECT DISTINCT * FROM test)
SELECT json_agg(cte.* ORDER BY index) FROM cte GROUP BY tag;

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


--
BEGIN;
CREATE DOMAIN posint AS INT CHECK (VALUE > 0);
COMMIT;

BEGIN;
-- Ici le domain n'est pas nécessaire car il n'est utilisé qu'une seule fois.
-- Cette utilisation à un but pédagogique
CREATE DOMAIN slug AS TEXT CHECK( VALUE ~ '^[^-][a-zA-Z0-9-]+[^-]*$');
ALTER TABLE "post" ALTER COLUMN "slug" TYPE slug;

ALTER TABLE "category" ADD CONSTRAINT route_check CHECK (route ~ '^\/[a-zA-Z\/]*[^\/]*$');
COMMIT;


BEGIN;
ALTER TABLE package ADD CONSTRAINT dates_order CHECK(request_time < delivered_time);
-- On créé un nouveau domaine (comme un nouveau type) à partir d'un type existant
-- Le domaine doit bien sûr être créé avant son utilisation
-- Un seul champ value possible
CREATE DOMAIN posint AS INT CHECK(VALUE > 0 AND VALUE < 60000);

ALTER TABLE package
    ALTER COLUMN width TYPE posint,
    ALTER COLUMN depth TYPE posint,
    ALTER COLUMN height TYPE posint,
    ALTER COLUMN worth TYPE posint;
COMMIT;



BEGIN;
-- XXX Add DDLs here.
CREATE DOMAIN text_plate AS TEXT CHECK(
    -- plaque d'immatriculation moderne et française
    -- lettres à proscrire : I O U et les combinaisons WW et SS
    -- pour les chiffres, la seule combinaison interdite est 000
    VALUE ~ '^(?!WW|SS)[A-HJ-NP-TV-Z]{2}-(?!000)\d{3}-[A-HJ-NP-TV-Z]{2}(?<!SS)$'
);
ALTER TABLE expedition ALTER COLUMN vehicle_plate TYPE text_plate;

CREATE DOMAIN text_postal AS TEXT CHECK(
    -- règle complète : (58180|34280|20600|20620)|^(?!00|96|99)(?!20[3-9])\d{5}(?<![12]80)$
    -- On ignore les chaînes qui commencent par 00, 96 et 99
    -- On ignore les chaîne commençant par 204,205, 206, 207,208,209
    -- On ignore les chaînes qui terminent par 180 ou 280
    -- On autorise 58180, 34280, 20600, 20620
    --! On va découper pour plus de lisibilité et de facilité de maintenance :
    -- codes postaux très particuliers
    VALUE ~ '^(58180|34280|20600|20620|20300)$'
    OR (
        -- règle générale
        VALUE ~ '^(?!00|96|99)\d{5}$'
        -- exceptions générales
        AND VALUE ~ '^\d{5}(?<![12]80)$'
        -- on ajoute la corse
        AND VALUE ~ '^(?!20[3-9])\d{5}$'
        -- on pourrait ajouter la Bretagne, les DOM, ...
    )
);
ALTER TABLE place ALTER COLUMN postal_code TYPE text_postal;

COMMIT;




BEGIN;

CREATE FUNCTION insert_package(json)
RETURNS package AS $$
	INSERT INTO package (serial_number, content_description, weight,
	 height, worth, sender_id, recipient_id, width, depth)
	VALUES(
		$1->>'serial_number',
		$1->>'content_description',
		($1->>'weight')::float,
		($1->>'height')::int,
		($1->>'worth')::int,
		($1->>'sender_id')::int,
		($1->>'recipient_id')::int,
		($1->>'width')::int,
		($1->>'depth')::int
	) RETURNING *;
$$ LANGUAGE SQL STRICT;

-- création nouvel enregistrement dans expedition
CREATE FUNCTION insert_expedition(json) RETURNS int AS $$
	INSERT INTO expedition(driver_name, vehicle_plate)
	VALUES(
		$1->>'driver_name',
		$1->>'vehicle_plate'
	) RETURNING id;
$$ LANGUAGE SQL STRICT;

-- création d'une nouvelle expédition ET mise à jour des packages
-- de cette expedition
CREATE FUNCTION add_expedition(json) RETURNS int AS $$
	UPDATE package
	SET expedition_id=(SELECT insert_expedition($1))
	WHERE id = ANY(
		SELECT UNNEST(
			(SELECT * FROM json_to_record($1) AS x(packages int[]))
		)
	) RETURNING expedition_id;
$$ LANGUAGE SQL STRICT;


COMMIT;