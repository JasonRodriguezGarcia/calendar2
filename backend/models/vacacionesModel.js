import pool from '../db-pg.js';

export async function postVacacion(vacacion) {
    console.log("imprimo vacacion: ", vacacion)
    try {
        const { event_id, start, end, cellColor, usuario_id } = vacacion
        const existsVacacion = await pool.query(`SELECT EXISTS (SELECT 1 FROM erroak.vacaciones WHERE event_id = $1);`, [event_id])
        console.log("imprimo existsVacacion: ", existsVacacion.rows[0].exists)
        if (existsVacacion.rows[0].exists)
            return {result: "Vacacion ya existente"}

        const result = await pool.query(`
            INSERT INTO erroak.vacaciones(
            event_id, start, "end", cell_color, usuario_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING event_id;`, 
            [event_id, start, end, cellColor, usuario_id])
        console.log("vacacion creada: ", result)
        return {success: true, message: "OK", id: result.rows[0].event_id}

    } catch (err) {
        console.error('Error:', err.message);
        throw err;
    }
}

export async function deleteVacacion(event_id) {
    console.log("imprimo vacacion deleteVacacion: ", event_id)
    try {
        const existsVacacion = await pool.query(`SELECT EXISTS (SELECT 1 FROM erroak.vacaciones WHERE event_id = $1);`, [event_id])
        console.log("imprimo existsVacacion deleteVacacion: ", existsVacacion.rows[0].exists)
        if (!existsVacacion.rows[0].exists)
            return {result: "Vacacion event_id NO existente"}

        const result = await pool.query(`
            DELETE FROM erroak.vacaciones
	        WHERE event_id = $1;`, 
            [event_id])
        console.log("vacacion borrada: ", result)
        return {success: true, message: "OK", id: event_id}

    } catch (err) {
        console.error('Error:', err.message);
        throw err;
    }
}


export async function getVacaciones(user, startDate, endDate, all) {
    console.log("imprimo user-year-month: ", user, startDate, endDate, all)
    try {
        let query = ''
        let fields = []
        if (all === 'all') {
            query =`
            SELECT * FROM erroak.vacaciones
            WHERE start >= $1
            AND start <= $2
            ORDER BY start ASC;`
            fields.push(startDate, endDate)
        } else {
            query =`
            SELECT * FROM erroak.vacaciones
            WHERE usuario_id = $1 
            AND start >= $2
            AND start <= $3
            ORDER BY start ASC;`
            fields.push(user, startDate, endDate)
        }
        const result = await pool.query(
            query,
            fields)
        console.log("imprimo result getVacaciones: ", result)
        return result.rows;

    } catch (err) {
        console.error('Error al obtener vacaciones:', err.message);
        throw err;
    }
}

export async function getVacacionesCount(user, year) {
    console.log("imprimo getVacacionesCount user-year: ", user, year)
    try {
        const result = await pool.query(`
            SELECT COUNT(*) FROM erroak.vacaciones
            WHERE usuario_id = $1 
            AND DATE_PART('year', start) = $2;`, 
            [user, year])
        console.log("imprimo result getVacacionesCount: ", result)
        return result.rows[0];

    } catch (err) {
        console.error('Error al obtener vacacionesCunt:', err.message);
        throw err;
    }
}

