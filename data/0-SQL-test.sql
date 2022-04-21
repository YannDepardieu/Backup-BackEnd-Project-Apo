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

--!--------------------------------------------------------------------------------


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

--!--------------------------------------------------------------------------------
----------------------- VIEWS ------------------------------------------------------------------
--!--------------------------------------------------------------------------------


-- XXX Add DDLs here.
CREATE VIEW post_with_category AS
SELECT post.*, category.label AS category
FROM post
JOIN category ON category.id=post.category_id;

--!--------------------------------------------------------------------------------

CREATE VIEW identified_visitor AS
    SELECT *,
        (validity_start <= now() AND validity_end >= now()) AS valid_ticket, -- Boolean
        ((SELECT COUNT(*) FROM booking WHERE visitor_id=visitor.id) < 3) AS can_book -- Boolean
    FROM visitor;


CREATE VIEW opened_events AS
SELECT
    "event".*,
    -- on calcule l'heure de fermeture
    opening_hour + open_duration AS closing_hour,
    (
        -- l'attraction est ouverte sur une journée
        now() > current_date + opening_hour
        AND now() < current_date + opening_hour + open_duration

    OR
        -- l'attraction (nocturne) est ouverte sur 2 jours
        now() > current_date - '24 hours'::interval + opening_hour
        AND now() < current_date - '24 hours'::interval + opening_hour + open_duration
    ) AS "open"
FROM "event"
WHERE "event".id NOT IN (
    -- on exclut les attractions ayant un incident ouvert
    SELECT DISTINCT event_id FROM incident
    WHERE close_date IS NULL
);


CREATE VIEW detailed_incident AS
    SELECT
        incident.*,
        -- pour la lisibilité de l'interface web, on ajoute le nom de l'attraction à la liste des incidents
        (SELECT public_name FROM event WHERE id=incident.event_id) AS event_name
    FROM incident
    WHERE close_date IS NULL
    ORDER BY open_date;

CREATE VIEW detailed_incident AS
SELECT
    incident.*,
    (SELECT public_name FROM event WHERE id=incident.event_id) AS event_name,
	case
		when count(comment.*) > 0
		then
			array_agg(json_build_object('text', comment.text, 'date', comment.date) ORDER BY comment.date DESC)
		else
			'{}'
		end
	AS comments
FROM incident
-- ce JOIN par la gauche pour ne pas zapper les incidents n'ayant pas de commentaires
LEFT JOIN comment ON comment.incident_id=incident.id
WHERE close_date IS NULL
GROUP BY incident.id
ORDER BY open_date;


CREATE VIEW incident_events AS
SELECT id, public_name AS name, opening_hour, opening_hour+open_duration AS closing_hour FROM "event"
WHERE id NOT IN (
    SELECT event_id FROM incident WHERE close_date IS NULL
) ORDER BY id;

--!--------------------------------------------------------------------------------
----------------------- FUNCTIONS ------------------------------------------------------------------
--!--------------------------------------------------------------------------------

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

-- Utilisation des fonctions


SELECT * FROM insert_package('{
	"serial_number":"12349",
 	"content_description":"taser",
	"weight":0.350,
	"height":50,
	"worth":98,
	"sender_id":2,
	"recipient_id":1,
	"width":100,
	"depth":50}
');

SELECT * FROM add_expedition('{
	"driver_name": "Nico",
	"vehicle_plate":"NN-123-CC",
	"packages": [4, 5]
}') AS id;

------ TEST direct dans PG admin

SELECT UNNEST(
	(
		SELECT *
		FROM json_to_record('{
			"driver_name": "Nico",
			"vehicle_plate":"NN-123-CC",
			"packages": [4, 5]
		}')
		AS x(packages int[])
	)
)

--!--------------------------------------------------------------------------------