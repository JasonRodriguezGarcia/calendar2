import pool from '../db-pg.js';

export async function getNewEventFormData() {
    try {
        const usuarios = await pool.query(`SELECT * from erroak.usuarios ORDER BY nombre_apellidos`)
        console.log("usuarios: ", usuarios.rows)
        if (!usuarios.rows.length)
            return {result: "Error. No hay datos en Usuarios"}

        const espacios = await pool.query(`SELECT * from erroak.espacios ORDER BY descripcion`)
        console.log("espacios: ", espacios.rows)
        if (!espacios.rows.length)
            return {result: "Error. No hay datos en Espacios"}

        const programas = await pool.query(`SELECT * from erroak.programas ORDER BY descripcion`)
        console.log("programas: ", programas.rows)
        if (!programas.rows.length)
            return {result: "Error. No hay datos en Programas"}

        return {usuarios: usuarios.rows, espacios: espacios.rows, programas: programas.rows}

    } catch (err) {
        console.error('Error:', err.message);
        throw err;
    }
}

export async function postEvento(evento) {
    console.log("imprimo evento: ", evento)
    
    try {
        const { event_id, usuario_id, espacio_id, programa_id, start, end, observaciones, color, repetible } = evento
        if (!repetible) {            
            const existsEvento = await pool.query(`SELECT EXISTS (SELECT 1 FROM erroak.eventos WHERE event_id = $1);`, [event_id])
            console.log("imprimo existsEvento en postEvento: ", existsEvento.rows[0].exists)
            if (existsEvento.rows[0].exists)
                return {result: "Evento ya existente"} // Prácticamente imposible

            // Si el espacio está ocupado en algún rango de start o end, devolver espacio ocupado
            const existsEspacio = await pool.query(`SELECT EXISTS (SELECT 1 FROM erroak.eventos WHERE espacio_id = $1 
                AND start < $3 AND "end" > $2);`,
                [espacio_id, start, end])
            console.log("imprimo existsEvento en postEvento: ", existsEspacio.rows[0].exists)
            if (existsEspacio.rows[0].exists)
                return {result: "Espacio ya existente"} // Espacio ocupado en cualquiera de las horas entre start y end
        }

        const result = await pool.query(`
            INSERT INTO erroak.eventos
            (event_id, usuario_id, espacio_id, programa_id, start, "end", observaciones, color, repetible)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING event_id;`, 
            [event_id, usuario_id, espacio_id, programa_id, start, end, observaciones, color, repetible])
        console.log("Evento cread: ", result)
        return {success: true, message: "OK", id: result.rows[0].event_id}

    } catch (err) {
        console.error('Error:', err.message);
        throw err;
    }
}

export async function deleteEvento(event_id) {
    console.log("imprimo evento deleteEvento: ", event_id)
    try {
        const existsEvento = await pool.query(`SELECT EXISTS (SELECT 1 FROM erroak.eventos WHERE event_id = $1);`, [event_id])
        console.log("imprimo existsEvento deleteEvento: ", existsEvento.rows[0].exists)
        if (!existsEvento.rows[0].exists)
            return {result: "Evento event_id NO existente"}

        const result = await pool.query(`
            DELETE FROM erroak.eventos
	        WHERE event_id = $1;`, 
            [event_id])
        console.log("Evento borrado: ", result)
        return {success: true, message: "OK", id: event_id}

    } catch (err) {
        console.error('Error:', err.message);
        throw err;
    }
}

export async function putEvento(event_ID, event) {
    const {event_id, usuario_id, espacio_id, programa_id, start, end, observaciones, color, repetible} = event
    console.log("imprimo evento putEvento: ", event)
    try {
        if (!repetible) {
            const existsEvento = await pool.query(`SELECT EXISTS (SELECT 1 FROM erroak.eventos WHERE event_id = $1);`, [event_ID])
            console.log("imprimo existsEvento putEvento: ", existsEvento.rows[0].exists)
            if (!existsEvento.rows[0].exists)
                return {result: "Evento event_id NO existente"}

            // Si el espacio está ocupado en algún rango de start o end, devolver espacio ocupado
            const existsEspacio = await pool.query(`SELECT EXISTS (SELECT 1 FROM erroak.eventos WHERE event_id <> $1 AND espacio_id = $2
                AND start < $4 AND "end" > $3);`,
                [event_ID, espacio_id, start, end])
            console.log("imprimo existsEvento en postEvento: ", existsEspacio.rows[0].exists)
            if (existsEspacio.rows[0].exists)
                return {result: "Espacio ya existente"} // Espacio ocupado en cualquiera de las horas entre start y end
        }

        const result = await pool.query(`
            UPDATE erroak.eventos
            SET usuario_id = $1, espacio_id = $2, programa_id = $3, start = $4, "end" = $5, observaciones = $6, color = $7, repetible = $8
	        WHERE event_id = $9;`, 
            [usuario_id, espacio_id, programa_id, start, end, observaciones, color, repetible, event_ID])
        console.log("Evento modificado: ", result)
        return {success: true, message: "OK", id: event_ID}

    } catch (err) {
        console.error('Error:', err.message);
        throw err;
    }
}

export async function getEventos(startDate, endDate) {
    console.log("imprimo startDate-endDate: ", startDate, endDate)
    try {
        const result = await pool.query(`
            SELECT * FROM erroak.eventos
            WHERE start >= $1
            AND start <= $2
            ORDER BY start ASC;`, 
            [startDate, endDate])
        console.log("imprimo result getEventos: ", result)
        return result.rows;

    } catch (err) {
        console.error('Error al obtener eventos:', err.message);
        throw err;
    }
}

export async function getEventosUsuario(user, startDate, endDate) {
    console.log("imprimo user-startDate-endDate: ", user, startDate, endDate)
    try {
        const result = await pool.query(`
            SELECT * FROM erroak.eventos
            WHERE usuario_id = $1
            AND start >= $2
            AND start <= $3
            ORDER BY start ASC;`, 
            [user, startDate, endDate])
        console.log("imprimo result getEventos: ", result)
        return result.rows;

    } catch (err) {
        console.error('Error al obtener eventos:', err.message);
        throw err;
    }
}
