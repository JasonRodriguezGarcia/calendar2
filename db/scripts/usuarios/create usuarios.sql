-- Table: erroak.usuarios

-- DROP TABLE IF EXISTS erroak.usuarios;

CREATE TABLE IF NOT EXISTS erroak.usuarios
(
    usuario_id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    email character varying(50) COLLATE pg_catalog."default" NOT NULL,
    password character varying(15) COLLATE pg_catalog."default" NOT NULL DEFAULT 'defecto'::character varying,
    nombre_apellidos character varying(50) COLLATE pg_catalog."default" NOT NULL,
    movil character varying(9) COLLATE pg_catalog."default",
    extension character varying(3) COLLATE pg_catalog."default",
    centro_id integer NOT NULL,
    llave boolean,
    alarma boolean,
    turno_id integer NOT NULL,
    activo boolean DEFAULT true,
    CONSTRAINT usuarios_pkey PRIMARY KEY (usuario_id),
    CONSTRAINT email_unico UNIQUE (email),
    CONSTRAINT nombre_apellidos_unico UNIQUE (nombre_apellidos),
    CONSTRAINT centro_id_fk FOREIGN KEY (centro_id)
        REFERENCES erroak.centros (centro_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT turno_id_fk FOREIGN KEY (turno_id)
        REFERENCES erroak.turnos (turno_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS erroak.usuarios
    OWNER to postgres;