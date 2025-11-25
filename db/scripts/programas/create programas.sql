-- Table: erroak.programas

-- DROP TABLE IF EXISTS erroak.programas;

CREATE TABLE IF NOT EXISTS erroak.programas
(
    programa_id integer NOT NULL,
    descripcion character varying(30) COLLATE pg_catalog."default",
    CONSTRAINT programas_pkey PRIMARY KEY (programa_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS erroak.programas
    OWNER to postgres;

COMMENT ON TABLE erroak.programas
    IS 'programa_id se crea a mano';