import pool from '../db-pg.js';

export async function getUsuarios() {
  try {
    const result = await pool.query("SELECT * FROM erroak.usuarios;");
    return result.rows;

  } catch (err) {
    console.error('Error:', err.message);
    throw err;
  }
}

export async function postLogin(loginDetails) {
  try {
    const { useremail , password } = loginDetails
    // habría que desencriptar password/token, esto para más adelante
    const result = await pool.query("SELECT * FROM erroak.usuarios WHERE email = $1 AND password = $2;", [useremail, password]);
    console.log("result: ", result)
    if (result.rows.length > 0) 
        return result.rows
    else
        return ({result: "No encontrado"})

  } catch (err) {
    console.error('Error en postLogin:', err.message);
    throw err;
  }
}

export async function sendUsuarios(usuario) {
  try {
    const { email, password, nombre_apellidos, movil, extension, centro_id, llave, alarma, turno_id } = usuario
	const existsEmail = await pool.query(`SELECT EXISTS (SELECT 1 FROM erroak.usuarios WHERE email = $1);`, [email])
    console.log("imprimo exists: ", existsEmail.rows[0].exists)
    if (existsEmail.rows[0].exists)
        return {result: "Email ya existente"}

    const existsNombre_Apellidos = await pool.query(`SELECT EXISTS (SELECT 1 FROM erroak.usuarios WHERE nombre_apellidos = $1);`, [nombre_apellidos])
    console.log("imprimo exists: ", existsNombre_Apellidos.rows[0].exists)
    if (existsNombre_Apellidos.rows[0].exists)
        return {result: "Nombre y apellidos ya existente"}

    const result = await pool.query(`INSERT INTO erroak.usuarios
        (email, password, nombre_apellidos, movil, extension, centro_id, llave, alarma, turno_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`, 
        [email, password, nombre_apellidos, movil, extension, centro_id, llave, alarma, turno_id])
    return {success: true, message: "OK"}

  } catch (err) {
    console.error('Error:', err.message);
    throw err;
  }
}

export async function getSignUpFormData() {
  try {
    const centros = await pool.query(`SELECT * from erroak.centros ORDER BY centro`)
    console.log("centros: ", centros.rows)
    if (centros.length)
        return {result: "Error. No hay datos en Centros"}
    const turnos = await pool.query(`SELECT * from erroak.turnos ORDER BY turno`)
    console.log("turnos: ", turnos.rows)
    if (turnos.length)
        return {result: "Error. No hay datos en Turnos"}

    // return {success: true, message: "OK"}

    return {centros: centros.rows, turnos: turnos.rows}

  } catch (err) {
    console.error('Error:', err.message);
    throw err;
  }
}


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

