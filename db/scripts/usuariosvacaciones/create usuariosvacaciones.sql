-- Table: erroak.usuariosvacaciones

-- DROP TABLE IF EXISTS erroak.usuariosvacaciones;

CREATE TABLE IF NOT EXISTS erroak.usuariosvacaciones
(
    usuario_id integer NOT NULL,
    ano integer NOT NULL,
    dias integer NOT NULL,
    CONSTRAINT usuariosvacaciones_pkey PRIMARY KEY (usuario_id, ano)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS erroak.usuariosvacaciones
    OWNER to postgres;
-- Index: idx_usuarioid_ano

-- DROP INDEX IF EXISTS erroak.idx_usuarioid_ano;

CREATE UNIQUE INDEX IF NOT EXISTS idx_usuarioid_ano
    ON erroak.usuariosvacaciones USING btree
    (usuario_id ASC NULLS LAST, ano ASC NULLS LAST)
    TABLESPACE pg_default; -- ojo quitar (deduplicate_items=False) o =True