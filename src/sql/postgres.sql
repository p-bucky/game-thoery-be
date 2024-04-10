CREATE TABLE IF NOT EXISTS opinions (
	id bigserial PRIMARY KEY,
    opinion_id varchar(40) UNIQUE,
    description varchar(1000),
    is_active boolean NOT NULL DEFAULT TRUE,
	created_at timestamp NOT NULL DEFAULT now(),
	updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rooms (
	id bigserial PRIMARY KEY,
    person_id uuid NOT NULL,
    opinion_id varchar(40),
    code varchar(100) UNIQUE,
    player_one uuid DEFAULT NULL,
    player_two uuid DEFAULT NULL,
    is_active boolean NOT NULL DEFAULT TRUE,
	created_at timestamp NOT NULL DEFAULT now(),
	updated_at timestamp NOT NULL DEFAULT now(),
	FOREIGN KEY (opinion_id) REFERENCES opinions (opinion_id)
);

CREATE TABLE IF NOT EXISTS game (
    id bigserial PRIMARY KEY,
    room_code varchar(100),
    grid JSON,
    is_completed boolean DEFAULT NULL,
    is_active boolean NOT NULL DEFAULT TRUE,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now(),
    FOREIGN KEY (room_code) REFERENCES rooms (code)
);


DROP TABLE IF EXISTS "public"."user_sessions";
CREATE TABLE "public"."user_sessions" (
    "sid" varchar NOT NULL,
    "sess" json NOT NULL,
    "expire" timestamp NOT NULL,
    PRIMARY KEY ("sid")
);