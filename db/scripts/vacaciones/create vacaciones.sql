-- Table: erroak.vacaciones

-- DROP TABLE IF EXISTS erroak.vacaciones;

CREATE TABLE IF NOT EXISTS erroak.vacaciones
(
    event_id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    start timestamp with time zone NOT NULL,
    "end" timestamp with time zone NOT NULL,
    cell_color character varying(20) COLLATE pg_catalog."default",
    usuario_id integer,
    CONSTRAINT vacaciones_pk PRIMARY KEY (event_id),
    CONSTRAINT usuario_id_fk FOREIGN KEY (usuario_id)
        REFERENCES erroak.usuarios (usuario_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS erroak.vacaciones
    OWNER to postgres;