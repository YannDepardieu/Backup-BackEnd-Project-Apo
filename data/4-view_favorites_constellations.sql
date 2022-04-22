CREATE VIEW view_favorites_constellations AS
    SELECT *
    FROM view_constellations_with_attributes
    JOIN favorite_constellation
    ON constellation.id = favorite_constellation.constellation_id;