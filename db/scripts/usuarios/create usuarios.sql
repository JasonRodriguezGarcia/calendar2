-- Table: erroak.usuarios

-- DROP TABLE IF EXISTS erroak.usuarios;

CREATE TABLE IF NOT EXISTS erroak.usuarios
(
    usuario_id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    email character varying(50) COLLATE pg_catalog."default" NOT NULL,
    password character(60) COLLATE pg_catalog."default" NOT NULL DEFAULT 'defecto'::character varying,
    nombre_apellidos character varying(50) COLLATE pg_catalog."default" NOT NULL,
    movil character varying(9) COLLATE pg_catalog."default",
    extension character varying(3) COLLATE pg_catalog."default",
    centro_id integer NOT NULL,
    llave boolean,
    alarma boolean,
    turno_id integer NOT NULL,
    activo boolean DEFAULT true,
    color character varying(20) COLLATE pg_catalog."default",
    tarde_invierno integer,
    observaciones character varying(255) COLLATE pg_catalog."default",
    lenguaje_id integer NOT NULL DEFAULT 0,
    role character varying(10) COLLATE pg_catalog."default" NOT NULL DEFAULT 'user'::character varying,
    CONSTRAINT usuarios_pkey PRIMARY KEY (usuario_id),
    CONSTRAINT email_unico UNIQUE (email),
    CONSTRAINT nombre_apellidos_unico UNIQUE (nombre_apellidos),
    CONSTRAINT centro_id_fk FOREIGN KEY (centro_id)
        REFERENCES erroak.centros (centro_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION,
    CONSTRAINT turno_id_fk FOREIGN KEY (turno_id)
        REFERENCES erroak.turnos (turno_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS erroak.usuarios
    OWNER to postgres;
-- Index: idx_email

-- DROP INDEX IF EXISTS erroak.idx_email;

CREATE UNIQUE INDEX IF NOT EXISTS idx_email
    ON erroak.usuarios USING btree
    (email COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (deduplicate_items=False)
    TABLESPACE pg_default;
-- Index: idx_email_usuario_id

-- DROP INDEX IF EXISTS erroak.idx_email_usuario_id;

CREATE UNIQUE INDEX IF NOT EXISTS idx_email_usuario_id
    ON erroak.usuarios USING btree
    (email COLLATE pg_catalog."default" ASC NULLS LAST, usuario_id ASC NULLS LAST)
    WITH (deduplicate_items=False)
    TABLESPACE pg_default;
-- Index: idx_listado_tardes_invierno

-- DROP INDEX IF EXISTS erroak.idx_listado_tardes_invierno;

CREATE UNIQUE INDEX IF NOT EXISTS idx_listado_tardes_invierno
    ON erroak.usuarios USING btree
    (tarde_invierno ASC NULLS LAST, usuario_id ASC NULLS LAST)
    WITH (deduplicate_items=False)
    TABLESPACE pg_default;
-- Index: idx_nombre_apellidos

-- DROP INDEX IF EXISTS erroak.idx_nombre_apellidos;

CREATE UNIQUE INDEX IF NOT EXISTS idx_nombre_apellidos
    ON erroak.usuarios USING btree
    (nombre_apellidos COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (deduplicate_items=False)
    TABLESPACE pg_default;