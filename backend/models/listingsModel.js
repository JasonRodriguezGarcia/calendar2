import pool from '../db-pg.js';

export async function getWinterAfternoons() {
    try {
        const result = await pool.query(
            `SELECT u.tarde_invierno, u.nombre_apellidos, u.centro_id, c.centro AS nombre_centro, u.llave, u.alarma FROM erroak.usuarios u
                JOIN erroak.centros c ON u.centro_id = c.centro_id
                WHERE u.tarde_invierno > 0 
                ORDER BY u.tarde_invierno, u.nombre_apellidos;`);
        return result.rows;

    } catch (err) {
        console.error('Error:', err.message);
        throw err;
    }
}

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
//         const { email, password, nombre_apellidos, movil, extension, centro_id, llave, alarma, turno_id, color, tarde_invierno } = usuario
//         const existsEmail = await pool.query(`SELECT EXISTS (SELECT 1 FROM erroak.usuarios WHERE email = $1);`, [email])
//         console.log("imprimo exists: ", existsEmail.rows[0].exists)
//         if (existsEmail.rows[0].exists)
//             return {result: "Email ya existente"}

//         const existsNombre_Apellidos = await pool.query(`SELECT EXISTS (SELECT 1 FROM erroak.usuarios WHERE nombre_apellidos = $1);`, [nombre_apellidos])
//         console.log("imprimo exists: ", existsNombre_Apellidos.rows[0].exists)
//         if (existsNombre_Apellidos.rows[0].exists)
//             return {result: "Nombre y apellidos ya existente"}

//         const result = await pool.query(`INSERT INTO erroak.usuarios
//             (email, password, nombre_apellidos, movil, extension, centro_id, llave, alarma, turno_id, color, tarde_invierno)
//             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
//             RETURNING usuario_id;`, 
//             [email, password, nombre_apellidos, movil, extension, centro_id, llave, alarma, turno_id, color, tarde_invierno])
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
//             email, password, nombre_apellidos, movil, extension, centro_id, llave, alarma, turno_id, color, tarde_invierno
//         } = updatedUser

//         const existsEmail = await pool.query(`SELECT EXISTS (SELECT 1 FROM erroak.usuarios WHERE email = $1 AND usuario_id != $2);`, [email, id])
//         console.log("imprimo exists1: ", existsEmail.rows[0].exists)
//         if (existsEmail.rows[0].exists)
//             return {result: "Email ya existente"}

//         const result = await pool.query(
//             `UPDATE erroak.usuarios SET
//                 email = $1, password = $2, nombre_apellidos = $3, movil = $4, extension = $5, centro_id = $6,
//                 llave = $7, alarma = $8, turno_id = $9, color = $10, tarde_invierno = $11
//             WHERE usuario_id = $12
//             RETURNING *`,
//             [email, password, nombre_apellidos, movil, extension, centro_id, llave, alarma, turno_id, color, tarde_invierno, parseInt(id)]
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

// // ANULADO NO USAR
// // export async function getHolidays(id, ano) {
// //     try {
// //         // habría que desencriptar password/token, esto para más adelante
// //         //
// //         const result = await pool.query("SELECT * FROM erroak.usuariosvacaciones WHERE usuario_id = $1 AND ano = $2", [id, ano]);
// //         console.log("result getHolidays: ", result)

// //         // hay que devolver los días de vacaciones y la cuenta de días de vacaciones usados
// //         if (result.rows.length > 0) {
// //             console.log("Usuario encontrado en getHolidays: ", result.rows[0])
// //             return result.rows[0]
// //             // return result.rows[0]
// //         }
// //         else
// //             return ({result: "No encontrado"})

// //   } catch (err) {
// //     console.error('Error en getHolidays:', err.message);
// //     throw err;
// //   }
// // }



// // *****************************************
// // export async function getVotos() {
// //   try {
// //     const result = await pool.query("SELECT * FROM eurovision.votos;");
// //     return result.rows;
// //     //return result.rows[0].total;

// //   } catch (err) {
// //     console.error('Error:', err.message);
// //     throw err;
// //   }
// // }

// // export async function getActuacionesRanking(selectRanking) {
// //     try {
// //         const selectedQuery = 
// //             selectRanking   ? `SELECT a.nombre_artista, a.code_pais, a.titulo_cancion, a.id, SUM(v.voto) as nota FROM eurovision.votos v RIGHT JOIN eurovision.actuaciones a ON a.id = v."idActuacion" GROUP BY a.nombre_artista, a.code_pais, a.titulo_cancion, a.id;`
// //                             : "SELECT * FROM eurovision.actuaciones;"

// //         const result = await pool.query(selectedQuery);
// //         return result.rows;
// //         //return result.rows[0].total;

// //     } catch (err) {
// //         console.error('Error:', err.message);
// //         throw err;
// //     }
// // }


// // export async function sendVotos(votoEmitido) {
// //   try {
// //     // const result = await pool.query("SELECT * FROM eurovision.votantes;");
// //     const {idVotante, idActuacion, fechaVoto, voto} = votoEmitido
// //     const result = await pool.query(`INSERT INTO eurovision.votos 
// //         ("idVotante", "idActuacion", "fechaVoto", voto)
// //         VALUES ($1, $2, $3, $4);`, [idVotante, idActuacion, fechaVoto, voto])
// //     // console.log("imprimo result: ", result)
// //     // return result;
// //     return {success: true, message: "OK"}

// //   } catch (err) {
// //     console.error('Error:', err.message);
// //     throw err;
// //   }
// // }

// // export async function sendVotosMultiples(votosEmitidos) {
// //     const stringVotos = `INSERT INTO eurovision.votos 
// //         ("idVotante", "idActuacion", "fechaVoto", voto) `
// //     votosEmitidos.map(voto => (
// //         stringVotos += (`VALUES (${votosEmitidos.idVotante}, ${votosEmitidos.idActuacion}, ${votosEmitidos.fechaVoto}, ${votosEmitidos.voto}),`)
// //     ))
// //     stringVotos = st
// //     try {

// //         const {idVotante, idActuacion, fechaVoto, voto} = votoEmitido
// //         const result = await pool.query(`INSERT INTO eurovision.votos 
// //             ("idVotante", "idActuacion", "fechaVoto", voto)
// //             VALUES ($1, $2, $3, $4);`, [idVotante, idActuacion, fechaVoto, voto])
// //         // console.log("imprimo result: ", result)
// //         // return result;
// //         return {success: true, message: "OK"}

// //     } catch (err) {
// //         console.error('Error:', err.message);
// //         throw err;
// //     }
// // }

