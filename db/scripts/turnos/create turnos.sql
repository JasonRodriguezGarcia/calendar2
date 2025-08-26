-- Table: erroak.turnos

-- DROP TABLE IF EXISTS erroak.turnos;

CREATE TABLE IF NOT EXISTS erroak.turnos
(
    turno_id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    turno character varying(50) COLLATE pg_catalog."default" NOT NULL,
    horario character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT turnos_pkey PRIMARY KEY (turno_id),
    CONSTRAINT turnos_unico UNIQUE (turno_id, turno)
        INCLUDE(turno_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS erroak.turnos
    OWNER to postgres;