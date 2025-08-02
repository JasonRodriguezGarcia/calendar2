// import db from '../db-pg.js';
import pool from '../db-pg.js';
// export function createTable() {
  //   db.run(`CREATE TABLE IF NOT EXISTS productos (
    //     id INTEGER PRIMARY KEY AUTOINCREMENT,
    //     nombre TEXT NOT NULL,
    //     precio REAL NOT NULL,
    //     stock INTEGER DEFAULT 0,
    //     fecha_agregado TEXT DEFAULT CURRENT_DATE
    //   )`);
    // }
    
export async function getVotantes() {
  try {
    // const result = await pool.query("SELECT now();");
    const result = await pool.query("SELECT * FROM eurovision.votantes;");
    // const result = await pool.query("SELECT * FROM scott.emp;");
    // const result = await pool.query("SELECT * FROM scott.emp WHERE empno = $1;", [7698]);
    // const result = await pool.query("SELECT * FROM scott.emp WHERE empno = $1 OR empno = $2;", [7698, 7844]);
    
    //const result = await pool.query("SELECT * FROM scott.get_employee($1);", [1234]);
    //const result = await pool.query("SELECT scott.get_employee_count() AS total;");

    return result.rows;
    //return result.rows[0].total;

  } catch (err) {
    console.error('Error:', err.message);
    throw err;
  }
}

export async function getVotos() {
  try {
    const result = await pool.query("SELECT * FROM eurovision.votos;");
    return result.rows;
    //return result.rows[0].total;

  } catch (err) {
    console.error('Error:', err.message);
    throw err;
  }
}

export async function getActuacionesRanking(selectRanking) {
    try {
        const selectedQuery = 
            selectRanking   ? `SELECT a.nombre_artista, a.code_pais, a.titulo_cancion, a.id, SUM(v.voto) as nota FROM eurovision.votos v RIGHT JOIN eurovision.actuaciones a ON a.id = v."idActuacion" GROUP BY a.nombre_artista, a.code_pais, a.titulo_cancion, a.id;`
                            : "SELECT * FROM eurovision.actuaciones;"

        const result = await pool.query(selectedQuery);
        return result.rows;
        //return result.rows[0].total;

    } catch (err) {
        console.error('Error:', err.message);
        throw err;
    }
}


export async function sendVotos(votoEmitido) {
  try {
    // const result = await pool.query("SELECT * FROM eurovision.votantes;");
    const {idVotante, idActuacion, fechaVoto, voto} = votoEmitido
    const result = await pool.query(`INSERT INTO eurovision.votos 
        ("idVotante", "idActuacion", "fechaVoto", voto)
        VALUES ($1, $2, $3, $4);`, [idVotante, idActuacion, fechaVoto, voto])
    // console.log("imprimo result: ", result)
    // return result;
    return {success: true, message: "OK"}

  } catch (err) {
    console.error('Error:', err.message);
    throw err;
  }
}

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

