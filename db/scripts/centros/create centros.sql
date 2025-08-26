-- Table: erroak.centros

-- DROP TABLE IF EXISTS erroak.centros;

CREATE TABLE IF NOT EXISTS erroak.centros
(
    centro_id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    centro character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT centros_pkey PRIMARY KEY (centro_id),
    CONSTRAINT centro_unico UNIQUE (centro)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS erroak.centros
    OWNER to postgres;