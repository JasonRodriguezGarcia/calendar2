SELECT * FROM erroak.usuarios

DELETE FROM erroak.usuarios WHERE email = 'pepe@pepe.com'
UPDATE erroak.usuarios set activo=true WHERE email = 'pepe2@pepe.com'

SELECT * FROM erroak.centros
INSERT INTO erroak.centros (centro)
VALUES 
	('MARTUTENE 12'), 
	('MARTUTENE 30'),
	('EXTERIOR')

SELECT * FROM erroak.usuarios p
INNER JOIN erroak.centros c
ON p.centro_id = c.centro_id
INNER JOIN erroak.turnos t
ON p.turno_id = t.turno_id

SELECT * FROM erroak.turnos
INSERT INTO erroak.turnos (turno, horario)
VALUES
('MAÑANA', '0800-1400'),
('TARDE', '1400-1900')