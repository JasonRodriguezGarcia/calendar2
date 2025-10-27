import pool from '../db-pg.js';
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import jwt from 'jsonwebtoken'

dotenv.config(); // Permite usar variables de entorno
const JWT_SECRET_KEY = process.env.JWT_SECRET
const FRONTEND_URL_RENDER = process.env.FRONTEND_URL_RENDER;

sgMail.setApiKey(process.env.SENDGRID_APIKEY);

export async function getUsuarios() {
    try {
        const result = await pool.query("SELECT * FROM erroak.usuarios ORDER BY nombre_apellidos;");
        return result.rows;

    } catch (err) {
        console.error('Error:', err.message);
        throw err;
    }
}

export async function postLogin(loginDetails) {
    try {
        const { useremail , password } = loginDetails
        const result = await pool.query("SELECT * FROM erroak.usuarios WHERE email = $1 AND password = $2;", [useremail, password]);
        console.log("result: ", result)
        const userData = result.rows[0]
        if (result.rows.length > 0) {
            const usuarioID = userData.usuario_id
            const nombreapellidos = userData.nombre_apellidos
            // const passwordUsuario = userData[0].password
            const emailUsuario = userData.email
            const token = jwt.sign(
                { usuarioID, nombreapellidos, emailUsuario },
                JWT_SECRET_KEY,
                // { expiresIn: '1h', algorithm: 'HS256' },
                { algorithm: 'HS256' },
            )
            console.log("JWT: ", token)
            return ({ result: userData, success: true, token: token })
            
        } 
        else
            return ({result: "No encontrado"})

    } catch (err) {
        console.error('Error en postLogin:', err.message);
        throw err;
    }
}

export async function postMe(loginMeDetails) {
    try {
        const { usuarioID , emailUsuario } = loginMeDetails
        const result = await pool.query("SELECT * FROM erroak.usuarios WHERE usuario_id = $1 AND email = $2;", [usuarioID, emailUsuario]);
        console.log("result: ", result)
        const userData = result.rows[0]
        if (result.rows.length > 0) {
            // const usuarioID = userData.usuario_id
            const nombreapellidos = userData.nombre_apellidos
            // const passwordUsuario = userData[0].password
            // const emailUsuario = userData.email
            const token = jwt.sign(
                { usuarioID, nombreapellidos, emailUsuario },
                JWT_SECRET_KEY,
                // { expiresIn: '1h', algorithm: 'HS256' },
                { algorithm: 'HS256' },
            )
            console.log("JWT: ", token)
            // return ({ result: result.rows[0], token: token })
            return ({ result: userData, success: true, token: token })
            
        } 
        else
            return ({result: "No encontrado"})

    } catch (err) {
        console.error('Error en postLogin:', err.message);
        throw err;
    }
}

export async function postRecoveryPassword(recoveryPasswordDetails) {
    try {
        const { useremail, emailmsg } = recoveryPasswordDetails
        console.log("useremail: ", useremail)
        const result = await pool.query("SELECT usuario_id, password, nombre_apellidos FROM erroak.usuarios WHERE email = $1",
            [useremail]);
        console.log("result: ", result)
        if (result.rows.length > 0) {
            const recoveryData = result.rows[0]
            const {usuario_id, nombre_apellidos} = recoveryData
            // Generar token que caduque a la hora
            const tokenRecovery = jwt.sign(
                { usuario_id, nombre_apellidos },
                JWT_SECRET_KEY,
                { expiresIn: '1h', algorithm: 'HS256' },
            )

            // const resetLink = `http://localhost:5173/newpassword/${usuario_id}`
            const resetLink = `${FRONTEND_URL_RENDER}/newpassword/${tokenRecovery}`
            const msg = {
                    to: useremail,
                    from: "jasonr@erroak.sartu.org", // debe ser verificado en SendGrid
                    subject: emailmsg.subject,
                    html: `
                        <p>${emailmsg.html.line1} ${nombre_apellidos},</p>
                        <p>${emailmsg.html.line2}:</p>
                        <p>${emailmsg.html.line3}:</p>
                        <a href="${resetLink}">${resetLink}</a>
                        <p>${emailmsg.html.line4}.</p>
                    `,
            }

            try {
                await sgMail.send(msg);
                console.log("Correo enviado correctamente a", nombre_apellidos);
                return result.rows
            } catch (error) {
                console.error("Error al enviar correo:", error.response?.body || error)
                throw error
            }

        }
        else
            return ({result: "No encontrado"})

    } catch (err) {
        console.error('Error en postRecoveryPassword:', err.message)
        throw err
    }
}

export async function postNewPassword(newPasswordDetails) {
    try {
        const { token, newpassword } = newPasswordDetails
        console.log("token - newpassword: ", token, newpassword)
        // verificar y decodificar el token
        const decoded = jwt.verify(token, JWT_SECRET_KEY)
        const userid = decoded.usuario_id
        const result = await pool.query(`UPDATE erroak.usuarios SET password = $1 WHERE usuario_id = $2 RETURNING *;`,
            [newpassword, userid]);
        console.log("result: ", result)
        if (result.rows.length > 0) {
            console.log("Usuario encontrado y CONTRASEÑA actualizada: ", result.rows[0])
            return result.rows[0]  // retornamos el usuario actualizado
        }
        else
            return ({result: "No encontrado"})

    } catch (err) {
        if (err.name === "TokenExpiredError")
            return ({error: "El enlace ha expirado, solicite uno nuevo"})
        else if (err.name === "JsonWebTokenError")
            return ({error: "Token inválido, solicite nueva contraseña"})
        else {
            console.error('Error en postRecoveryPassword:', err.message)
            throw err
        }
    }
}

export async function postUsuario(usuario) {
    try {
        const { email, password, nombre_apellidos, movil, extension, centro_id, llave, alarma, turno_id, color, tarde_invierno, observaciones } = usuario
        const existsEmail = await pool.query(`SELECT EXISTS (SELECT 1 FROM erroak.usuarios WHERE email = $1);`, [email])
        console.log("imprimo exists: ", existsEmail.rows[0].exists)
        if (existsEmail.rows[0].exists)
            return {result: "Email ya existente"}

        const existsNombre_Apellidos = await pool.query(`SELECT EXISTS (SELECT 1 FROM erroak.usuarios WHERE nombre_apellidos = $1);`, [nombre_apellidos])
        console.log("imprimo exists: ", existsNombre_Apellidos.rows[0].exists)
        if (existsNombre_Apellidos.rows[0].exists)
            return {result: "Nombre y apellidos ya existente"}

        const result = await pool.query(`INSERT INTO erroak.usuarios
            (email, password, nombre_apellidos, movil, extension, centro_id, llave, alarma, turno_id, color, tarde_invierno, observaciones)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *;`, 
            // RETURNING usuario_id;`, 
            [email, password, nombre_apellidos, movil, extension, centro_id, llave, alarma, turno_id, color, tarde_invierno, observaciones])
        console.log("usuario creado: ", result)
        const userData = result.rows[0]
        const usuarioID = userData.usuario_id
        const nombreapellidos = userData.nombre_apellidos
        // const passwordUsuario = result.rows[0].password
        const emailUsuario = userData.email
        const tokenPost = jwt.sign(
            { usuarioID, nombreapellidos, emailUsuario },
            JWT_SECRET_KEY,
            // { expiresIn: '1h', algorithm: 'HS256' },
            { algorithm: 'HS256' },
        )
        console.log("JWT: ", tokenPost)
        return ({ result: result.rows[0], token: tokenPost })

    } catch (err) {
        console.error('Error:', err.message);
        throw err;
    }
}

export async function getSignUpFormData() {
    try {
        const centros = await pool.query(`SELECT * from erroak.centros ORDER BY centro`)
        console.log("centros: ", centros.rows)
        if (!centros.rows.length)
            return {result: "Error. No hay datos en Centros"}
        const turnos = await pool.query(`SELECT * from erroak.turnos ORDER BY turno`)
        console.log("turnos: ", turnos.rows)
        if (!turnos.rows.length)
            return {result: "Error. No hay datos en Turnos"}

        return {centros: centros.rows, turnos: turnos.rows}

    } catch (err) {
        console.error('Error:', err.message);
        throw err;
    }
}

export async function getUsuario(id) {
    try {
        const result = await pool.query("SELECT * FROM erroak.usuarios WHERE usuario_id = $1", [id]);
        console.log("result getUsuario: ", result)
        if (result.rows.length > 0) {
            console.log("Usuario encontrado en getUsuario: ", result.rows[0])
            return result.rows[0]
        }
        else
            return ({result: "No encontrado"})

    } catch (err) {
        console.error('Error en getUsuario:', err.message);
        throw err;
    }
}

export async function putUsuario(id, updatedUser) {
    try {
        const {
            email, password, nombre_apellidos, movil, extension, centro_id, llave, alarma, turno_id, color, tarde_invierno, observaciones
        } = updatedUser

        const existsEmail = await pool.query(`SELECT EXISTS (SELECT 1 FROM erroak.usuarios WHERE email = $1 AND usuario_id != $2);`, [email, id])
        console.log("imprimo exists1: ", existsEmail.rows[0].exists)
        if (existsEmail.rows[0].exists)
            return {result: "Email ya existente"}

        const result = await pool.query(
            `UPDATE erroak.usuarios SET
                email = $1, password = $2, nombre_apellidos = $3, movil = $4, extension = $5, centro_id = $6,
                llave = $7, alarma = $8, turno_id = $9, color = $10, tarde_invierno = $11, observaciones = $12
            WHERE usuario_id = $13
            RETURNING *`,
            [email, password, nombre_apellidos, movil, extension, centro_id, llave, alarma, turno_id, color, tarde_invierno, observaciones, parseInt(id)]
        )
        console.log("result: ", result.command)
        const userData = result.rows[0]
        if (result.rows.length > 0) {
            console.log("Usuario encontrado y actualizado: ", userData)
            const usuarioID = userData.usuario_id
            const nombreapellidos = userData.nombre_apellidos
            // const passwordUsuario = result.rows[0].password
            const emailUsuario = userData.email
            const token = jwt.sign(
                { usuarioID, nombreapellidos, emailUsuario },
                JWT_SECRET_KEY,
                // { expiresIn: '1h', algorithm: 'HS256' },
                { algorithm: 'HS256' },
            )
            console.log("JWT: ", token)
            return ({ result: result.rows[0], token: token })
        }
        else
            return ({result: "No encontrado"})

    } catch (err) {
        console.error('Error en putUsuario:', err.message);
        throw err;
    }
}

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
