-- Table: erroak.personas

DROP TABLE IF EXISTS erroak.personas;

CREATE TABLE IF NOT EXISTS erroak.personas
(
    persona_id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    email character varying(50) COLLATE pg_catalog."default" NOT NULL,
    password character varying(15) COLLATE pg_catalog."default" NOT NULL DEFAULT 'defecto'::character varying,
    nombre_apellidos character varying(50) COLLATE pg_catalog."default" NOT NULL,
    movil character varying(9) COLLATE pg_catalog."default",
    extension character varying(3) COLLATE pg_catalog."default",
    centro integer NOT NULL,
    llave boolean,
    alarma boolean,
    turno integer,
    CONSTRAINT personas_pkey PRIMARY KEY (persona_id),
    CONSTRAINT email_unico UNIQUE (email),
    CONSTRAINT nombre_apellidos_unico UNIQUE (nombre_apellidos)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS erroak.personas
    OWNER to postgres;