-- Table: erroak.eventos

-- DROP TABLE IF EXISTS erroak.eventos;

CREATE TABLE IF NOT EXISTS erroak.eventos
(
    event_id bigint NOT NULL,
    usuario_id integer NOT NULL,
    espacio_id integer NOT NULL,
    programa_id integer NOT NULL,
    start timestamp with time zone,
    "end" timestamp with time zone,
    observaciones character varying(255) COLLATE pg_catalog."default",
    color character varying(20) COLLATE pg_catalog."default",
    repetible boolean DEFAULT false,
    CONSTRAINT eventos_pkey PRIMARY KEY (event_id),
    CONSTRAINT espacio_id_fk FOREIGN KEY (espacio_id)
        REFERENCES erroak.espacios (espacio_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID,
    CONSTRAINT programa_id_fk FOREIGN KEY (programa_id)
        REFERENCES erroak.programas (programa_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID,
    CONSTRAINT usuario_id_fk FOREIGN KEY (usuario_id)
        REFERENCES erroak.usuarios (usuario_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS erroak.eventos
    OWNER to postgres;
-- Index: idx_eventos_espacio_start_end

-- DROP INDEX IF EXISTS erroak.idx_eventos_espacio_start_end;

CREATE INDEX IF NOT EXISTS idx_eventos_espacio_start_end
    ON erroak.eventos USING btree
    (espacio_id ASC NULLS LAST, start ASC NULLS LAST, "end" ASC NULLS LAST)
    WITH (deduplicate_items=True)
    TABLESPACE pg_default;

COMMENT ON INDEX erroak.idx_eventos_espacio_start_end
    IS 'Usado en /eventos para buscar si un evento está duplicado.';