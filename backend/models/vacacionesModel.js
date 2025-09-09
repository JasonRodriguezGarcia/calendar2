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


export async function getVacaciones(user, year, month, all) {
    console.log("imprimo user-year-month: ", user, year, month, all)
    try {
        let query = ''
        let fields = []
        if (all === 'all') {
            query =`
            SELECT * FROM erroak.vacaciones
            WHERE start >= $1
            AND start <= $2
            ORDER BY start ASC;`
            fields.push(year, month)
        } else {
            query =`
            SELECT * FROM erroak.vacaciones
            WHERE usuario_id = $1 
            AND start >= $2
            AND start <= $3
            ORDER BY start ASC;`
            fields.push(user, year, month)
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


// export async function getUsuarios() {
//     try {
//         const result = await pool.query("SELECT * FROM erroak.usuarios;");
//         return result.rows;

//     } catch (err) {
//         console.error('Error:', err.message);
//         throw err;
//     }
// }

// export async function postLogin(loginDetails) {
//     try {
//         const { useremail , password } = loginDetails
//         // habría que desencriptar password/token, esto para más adelante
//         const result = await pool.query("SELECT * FROM erroak.usuarios WHERE email = $1 AND password = $2;", [useremail, password]);
//         console.log("result: ", result)
//         if (result.rows.length > 0) 
//             return result.rows
//         else
//             return ({result: "No encontrado"})

//     } catch (err) {
//         console.error('Error en postLogin:', err.message);
//         throw err;
//     }
// }

// export async function postUsuario(usuario) {
//     try {
//         const { email, password, nombre_apellidos, movil, extension, centro_id, llave, alarma, turno_id } = usuario
//         const existsEmail = await pool.query(`SELECT EXISTS (SELECT 1 FROM erroak.usuarios WHERE email = $1);`, [email])
//         console.log("imprimo exists: ", existsEmail.rows[0].exists)
//         if (existsEmail.rows[0].exists)
//             return {result: "Email ya existente"}

//         const existsNombre_Apellidos = await pool.query(`SELECT EXISTS (SELECT 1 FROM erroak.usuarios WHERE nombre_apellidos = $1);`, [nombre_apellidos])
//         console.log("imprimo exists: ", existsNombre_Apellidos.rows[0].exists)
//         if (existsNombre_Apellidos.rows[0].exists)
//             return {result: "Nombre y apellidos ya existente"}

//         const result = await pool.query(`INSERT INTO erroak.usuarios
//             (email, password, nombre_apellidos, movil, extension, centro_id, llave, alarma, turno_id)
//             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
//             RETURNING usuario_id;`, 
//             [email, password, nombre_apellidos, movil, extension, centro_id, llave, alarma, turno_id])
//         console.log("usuario creado: ", result)
//         return {success: true, message: "OK", id: result.rows[0].usuario_id}

//     } catch (err) {
//         console.error('Error:', err.message);
//         throw err;
//     }
// }

// export async function getSignUpFormData() {
//     try {
//         const centros = await pool.query(`SELECT * from erroak.centros ORDER BY centro`)
//         console.log("centros: ", centros.rows)
//         if (!centros.rows.length)
//             return {result: "Error. No hay datos en Centros"}
//         const turnos = await pool.query(`SELECT * from erroak.turnos ORDER BY turno`)
//         console.log("turnos: ", turnos.rows)
//         if (!turnos.rows.length)
//             return {result: "Error. No hay datos en Turnos"}

//         // return {success: true, message: "OK"}

//         return {centros: centros.rows, turnos: turnos.rows}

//     } catch (err) {
//         console.error('Error:', err.message);
//         throw err;
//     }
// }

// export async function getUsuario(id) {
//     try {
//         // habría que desencriptar password/token, esto para más adelante
//         //
//         const result = await pool.query("SELECT * FROM erroak.usuarios WHERE usuario_id = $1", [id]);
//         console.log("result getUsuario: ", result)
//         if (result.rows.length > 0) {
//             console.log("Usuario encontrado en getUsuario: ", result.rows[0])
//             return result.rows[0]
//             // return result.rows[0]
//         }
//         else
//             return ({result: "No encontrado"})

//     } catch (err) {
//         console.error('Error en getUsuario:', err.message);
//         throw err;
//     }
// }

// export async function putUsuario(id, updatedUser) {
//     try {
//         // habría que desencriptar password/token, esto para más adelante
//         //
//         // UPDATE erroak.usuarios set activo=true WHERE email = 'pepe2@pepe.com'
//         const {
//             email, password, nombre_apellidos, movil, extension, centro_id, llave, alarma, turno_id
//         } = updatedUser

//         const existsEmail = await pool.query(`SELECT EXISTS (SELECT 1 FROM erroak.usuarios WHERE email = $1 AND usuario_id != $2);`, [email, id])
//         console.log("imprimo exists1: ", existsEmail.rows[0].exists)
//         if (existsEmail.rows[0].exists)
//             return {result: "Email ya existente"}

//         const result = await pool.query(
//             `UPDATE erroak.usuarios SET
//                 email = $1, password = $2, nombre_apellidos = $3, movil = $4, extension = $5, centro_id = $6,
//                 llave = $7, alarma = $8, turno_id = $9
//             WHERE usuario_id = $10
//             RETURNING *`,
//             [email, password, nombre_apellidos, movil, extension, centro_id, llave, alarma, turno_id, parseInt(id)]
//         )
//         console.log("result: ", result.command)
//         if (result.rows.length > 0) {
//             console.log("Usuario encontrado y actualizado: ", result.rows[0])
//             // return result.rows
//             return result.rows[0]  // retornamos el usuario actualizado
//         }
//         else
//             return ({result: "No encontrado"})

//     } catch (err) {
//         console.error('Error en putUsuario:', err.message);
//         throw err;
//     }
// }

// export async function getHolidays(id, ano) {
//     try {
//         // habría que desencriptar password/token, esto para más adelante
//         //
//         const result = await pool.query("SELECT * FROM erroak.usuariosvacaciones WHERE usuario_id = $1 AND ano = $2", [id, ano]);
//         console.log("result getHolidays: ", result)

//         // hay que devolver los días de vacaciones y la cuenta de días de vacaciones usados
//         if (result.rows.length > 0) {
//             console.log("Usuario encontrado en getHolidays: ", result.rows[0])
//             return result.rows[0]
//             // return result.rows[0]
//         }
//         else
//             return ({result: "No encontrado"})

//   } catch (err) {
//     console.error('Error en getHolidays:', err.message);
//     throw err;
//   }
// }



// *****************************************
// export async function getVotos() {
//   try {
//     const result = await pool.query("SELECT * FROM eurovision.votos;");
//     return result.rows;
//     //return result.rows[0].total;

//   } catch (err) {
//     console.error('Error:', err.message);
//     throw err;
//   }
// }

// export async function getActuacionesRanking(selectRanking) {
//     try {
//         const selectedQuery = 
//             selectRanking   ? `SELECT a.nombre_artista, a.code_pais, a.titulo_cancion, a.id, SUM(v.voto) as nota FROM eurovision.votos v RIGHT JOIN eurovision.actuaciones a ON a.id = v."idActuacion" GROUP BY a.nombre_artista, a.code_pais, a.titulo_cancion, a.id;`
//                             : "SELECT * FROM eurovision.actuaciones;"

//         const result = await pool.query(selectedQuery);
//         return result.rows;
//         //return result.rows[0].total;

//     } catch (err) {
//         console.error('Error:', err.message);
//         throw err;
//     }
// }


// export async function sendVotos(votoEmitido) {
//   try {
//     // const result = await pool.query("SELECT * FROM eurovision.votantes;");
//     const {idVotante, idActuacion, fechaVoto, voto} = votoEmitido
//     const result = await pool.query(`INSERT INTO eurovision.votos 
//         ("idVotante", "idActuacion", "fechaVoto", voto)
//         VALUES ($1, $2, $3, $4);`, [idVotante, idActuacion, fechaVoto, voto])
//     // console.log("imprimo result: ", result)
//     // return result;
//     return {success: true, message: "OK"}

//   } catch (err) {
//     console.error('Error:', err.message);
//     throw err;
//   }
// }

// export async function sendVotosMultiples(votosEmitidos) {
//     const stringVotos = `INSERT INTO eurovision.votos 
//         ("idVotante", "idActuacion", "fechaVoto", voto) `
//     votosEmitidos.map(voto => (
//         stringVotos += (`VALUES (${votosEmitidos.idVotante}, ${votosEmitidos.idActuacion}, ${votosEmitidos.fechaVoto}, ${votosEmitidos.voto}),`)
//     ))
//     stringVotos = st
//     try {

//         const {idVotante, idActuacion, fechaVoto, voto} = votoEmitido
//         const result = await pool.query(`INSERT INTO eurovision.votos 
//             ("idVotante", "idActuacion", "fechaVoto", voto)
//             VALUES ($1, $2, $3, $4);`, [idVotante, idActuacion, fechaVoto, voto])
//         // console.log("imprimo result: ", result)
//         // return result;
//         return {success: true, message: "OK"}

//     } catch (err) {
//         console.error('Error:', err.message);
//         throw err;
//     }
// }

