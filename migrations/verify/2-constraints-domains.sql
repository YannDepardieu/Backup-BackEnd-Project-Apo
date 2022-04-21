-- Verify starry-night:2-constraints-domains on pg

BEGIN;

-- XXX Add verifications here.
INSERT INTO "user" ("firstname", "lastname", "email", "password", "role", "notification") VALUES
    ('Hermione', 'Granger', 'hermione@hogwarts.com', 'doso9_è=+}l%ù', 'admin', true),
    ('Tom', 'Riddle', 'tom.riddle@hogwarts.com', '65fdfze**$"=)à)à', 'user', false),
    ('Potter', 'Griffindor', 'potter+gryffindor@hogwarts.com', 'gzefbuij&&²"#', 'admin', false),
    ('Harry', 'Potter', 'harry.potter@hogwarts.eu.com', '(è_5651.46==+*ùd', 'user', true);

INSERT INTO "place" ("name", "address", "latitude", "longitude") VALUES
    ('Chez Yvette', '34 rue du four, 66300 Flamanville', 3.523, -3.523),
    ('Maison', 'Montpellier', -30.5698498, 50.16165158),
    ('Colline du Marais', 'Valence', -89, 179),
    ('Puy du Fou', 'Bézier', 89, -179);

INSERT INTO "event" ("name", "event_datetime", "latitude", "longitude", "recall_datetime") VALUES
    ('Apéro de Jean', NOW() + '10 days'::interval, 3.523, -3.523, NOW() + '9 days 21 hours'::interval),
    ('Anniversaire de Marcel', NOW() + '20 days'::interval, -30.5698498, 50.16165158, NOW() + '19 days 22 hours'::interval),
    ('Soirée de Chloé', NOW() + '15 days'::interval, -89, 179, NOW() + '14 days 23 hours'::interval),
    ('Réveillon', NOW() + '28 days'::interval, 89, -179, NOW() + '27 days 10 hours'::interval);

INSERT INTO "planet" ("id", "name", "img_url") VALUES
    (100, 'Vulcain', '/img/2-ter.png'),
    (101, 'Asgard', '/img/mars.jpeg'),
    (102, 'Alderaan', '/img/3jup.jpg'),
    (103, 'Tatoine', '/img/sat-3.svg');

ROLLBACK;
