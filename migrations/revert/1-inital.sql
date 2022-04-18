-- Revert starry-night:1-inital from pg

BEGIN;

DROP TABLE "user", "place", "event", "planet", "constellation", "galaxy", "star", "myth", "reserve_event", "save_place", "favorite_constellation", "prefer_planet";

COMMIT;