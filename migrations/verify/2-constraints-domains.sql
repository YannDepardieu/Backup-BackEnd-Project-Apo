-- Verify starry-night:2-constraints-domains on pg

BEGIN;

-- XXX Add verifications here.
INSERT INTO "user" ("firstname", "lastname", "email", "password", "role", "notification")
VALUES ('Hermione', 'Granger', 'hermione@hogwarts.com', 'doso9_è=+}l%ù', 'admin', true);

INSERT INTO "user" ("firstname", "lastname", "email", "password", "role", "notification")
VALUES ('Tom', 'Riddle', 'tom.riddle@hogwarts.com', '65fdfze**$"=)à)à', 'user', false);

INSERT INTO "user" ("firstname", "lastname", "email", "password", "role", "notification")
VALUES ('Potter', 'Griffindor', 'potter+gryffindor@hogwarts.com', 'gzefbuij&&²"#', 'admin', false);

INSERT INTO "user" ("firstname", "lastname", "email", "password", "role", "notification")
VALUES ('Harry', 'Potter', 'harry.potter@hogwarts.eu.com', '(è_5651.46==+*ùd', 'user', true);



ROLLBACK;
