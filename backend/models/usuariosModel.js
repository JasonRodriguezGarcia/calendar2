import pool from '../db-pg.js';
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs";

dotenv.config(); // Permite usar variables de entorno
const JWT_SECRET_KEY = process.env.JWT_SECRET
const FRONTEND_URL_RENDER = process.env.FRONTEND_URL_RENDER;
const saltRounds = 10

sgMail.setApiKey(process.env.SENDGRID_APIKEY);

export async function getUsuarios(action) {
    const { option } = action
    let query = "SELECT * FROM erroak.usuarios "
    if (option !== "all")
        query += "WHERE activo = true "
    query += "ORDER BY nombre_apellidos;"
    try {
        const result = await pool.query(
            // `SELECT * FROM erroak.usuarios ${option === "all" ? `WHERE activo = true` : ""} ORDER BY nombre_apellidos;`
            query
        )
        console.log("GET - usuarios ", option === "all" ? "all" : "")
        return result.rows

    } catch (err) {
        console.error('Error en getUsuarios:', err.message)
        throw err
    }
}

export async function postLogin(loginDetails) {
    try {
        const { useremail , password } = loginDetails
        const result = await pool.query("SELECT * FROM erroak.usuarios WHERE email = $1", [useremail])
        const userData = result.rows[0]
        if (result.rows.length > 0) {
        // Comparamos la contraseña del formulario con el hash de la BD
            const passwordCorrecta = await bcrypt.compare(password, userData.password)
            if (!passwordCorrecta) {
                return ({result: "Email o contraseña incorrecta"})
            }
            if (!userData.activo) {
                return ({result: "Usuario desactivado"})
            }

            const usuarioID = userData.usuario_id
            const nombreapellidos = userData.nombre_apellidos
            const emailUsuario = userData.email
            const role = userData.role
            const token = jwt.sign(
                { usuarioID, nombreapellidos, emailUsuario, role },
                JWT_SECRET_KEY,
                // { expiresIn: '1h', algorithm: 'HS256' },
                { algorithm: 'HS256' },
            )
            console.log("POST - login")
            console.log("JWT CREADO en postLogin")
            return ({ result: userData, success: true, token: token })
            
        } 
        else
            return ({result: "Email o contraseña incorrecta"})

    } catch (err) {
        console.error('Error en postLogin:', err.message)
        throw err
    }
}

export async function postMe(loginMeDetails) {
    try {
        const { usuarioID , emailUsuario } = loginMeDetails
        const result = await pool.query("SELECT * FROM erroak.usuarios WHERE usuario_id = $1 AND email = $2;", [usuarioID, emailUsuario])
        const userData = result.rows[0]
        if (result.rows.length > 0) {
            const nombreapellidos = userData.nombre_apellidos
            const role = userData.role
            const token = jwt.sign(
                { usuarioID, nombreapellidos, emailUsuario, role },
                JWT_SECRET_KEY,
                // { expiresIn: '1h', algorithm: 'HS256' },
                { algorithm: 'HS256' },
            )
            console.log(" POST - me")
            console.log("JWT CREADO en LoginMeDetails")
            return ({ result: userData, success: true, token: token })
            
        } 
        else
            return ({result: "No encontrado"})

    } catch (err) {
        console.error('Error en postMe:', err.message)
        throw err
    }
}

export async function postRecoveryPassword(recoveryPasswordDetails) {
    try {
        const { useremail, emailmsg } = recoveryPasswordDetails
        const result = await pool.query("SELECT usuario_id, password, nombre_apellidos FROM erroak.usuarios WHERE email = $1",
            [useremail])
        if (result.rows.length > 0) {
            const recoveryData = result.rows[0]
            const {usuario_id, nombre_apellidos, email} = recoveryData
            // Generar token que caduque a la hora
            const usuarioID = usuario_id
            const nombreapellidos = nombre_apellidos
            const emailUsuario = email
            const role = role
            const tokenRecovery = jwt.sign(
                { usuarioID, nombreapellidos, emailUsuario, role },
                JWT_SECRET_KEY,
                { expiresIn: '1h', algorithm: 'HS256' },
            )

            const resetLink = `${FRONTEND_URL_RENDER}/newpassword/${tokenRecovery}`
            const msg = {
                    to: useremail,
                    // from: "jasonr@erroak.sartu.org", // debe ser verificado en SendGrid con una cuenta en sendGrid
                    from: "no-reply@erroak.sartu.org",
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
                console.log("POST - recoveryPassword");
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
        // verificar y decodificar el token
        let decoded
        try {
            decoded = jwt.verify(token, JWT_SECRET_KEY)
        } catch (err) {
            if (err.name === "TokenExpiredError")
                return { error: "El enlace ha expirado, solicite uno nuevo" }
            else if (err.name === "JsonWebTokenError" || err instanceof SyntaxError)
                return { error: "Token inválido, solicite nueva contraseña" }
            else
                throw err
        }

        const userid = decoded.usuarioID
        // const saltRounds = 14
        const hashedPassword = await bcrypt.hash(newpassword, saltRounds)
        const result = await pool.query(`UPDATE erroak.usuarios SET password = $1 WHERE usuario_id = $2 RETURNING *;`,
            [hashedPassword, userid])
        if (result.rows.length > 0) {
            console.log("POST - newPassword")
            return ({success: true, message: "Contraseña actualizada correctamente"})
        }
        else
            return ({result: "No encontrado"})

    } catch (err) {
        console.error('Error en postNewPassword:', err.message)
            throw err
    }
}

export async function postChangePassword(newPasswordDetails) {
    try {
        const { token, newpassword, currentpassword } = newPasswordDetails
        // verificar y decodificar el token
        let decoded
        try {
            decoded = jwt.verify(token, JWT_SECRET_KEY)
        } catch (err) {
            if (err.name === "TokenExpiredError")
                return { error: "El enlace ha expirado, solicite uno nuevo" }
            else if (err.name === "JsonWebTokenError" || err instanceof SyntaxError)
                return { error: "Token inválido, solicite nueva contraseña" }
            else
                throw err
        }

        const userid = decoded.usuarioID
        // Comprobar que el password de userid sea igual que el currentpassword
        const existID = await pool.query("SELECT * FROM erroak.usuarios WHERE usuario_id = $1", [userid])
        const userData = existID.rows[0]
        if (existID.rows.length < 1) {
            console.log("Error en postChangePassword")
            return ({result: "Error. Usuario ID no existe"})
        }
        // Comparamos la contraseña del formulario con el hash de la BD
        const passwordCorrecta = await bcrypt.compare(currentpassword, userData.password)
        if (!passwordCorrecta) {
            return ({result: "Contraseña actual incorrecta"})
        }

        // const saltRounds = 14
        const hashedPassword = await bcrypt.hash(newpassword, saltRounds)
        const result = await pool.query(`UPDATE erroak.usuarios SET password = $1 WHERE usuario_id = $2 RETURNING *;`,
            [hashedPassword, userid])
        if (result.rows.length > 0) {
            console.log("POST - newPassword")
            return ({success: true, message: "Contraseña actualizada correctamente"})
        }
        else
            return ({result: "No encontrado"})

    } catch (err) {
        console.error('Error en postChangePassword:', err.message)
            throw err
    }
}

export async function postUsuario(usuario) {
    try {
        const { email, password, nombre_apellidos, movil, extension, centro_id, llave, alarma, turno_id, color, tarde_invierno,
            observaciones, lenguaje_id 
        } = usuario
        const existsEmail = await pool.query(`SELECT EXISTS (SELECT 1 FROM erroak.usuarios WHERE email = $1);`, [email])
        if (existsEmail.rows[0].exists)
            return {result: "Email ya existente"}

        const existsNombre_Apellidos = await pool.query(`SELECT EXISTS (SELECT 1 FROM erroak.usuarios WHERE nombre_apellidos = $1);`, [nombre_apellidos])
        if (existsNombre_Apellidos.rows[0].exists)
            return {result: "Nombre y apellidos ya existente"}
        // Hashear la contraseña
        // Como es el caso de la creación de un usuario guardando todos los datos incluída la contraseña HASHEADA
        // const saltRounds = 14
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        const result = await pool.query(`INSERT INTO erroak.usuarios
            (email, password, nombre_apellidos, movil, extension, centro_id, llave, alarma, turno_id, color, tarde_invierno, 
            observaciones, lenguaje_id, role)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING *;`, 
            // RETURNING usuario_id;`, 
            [email, hashedPassword, nombre_apellidos, movil, extension, centro_id, llave, alarma, turno_id, color, tarde_invierno,
                observaciones, lenguaje_id, 'user'
            ])
        const userData = result.rows[0]
        const usuarioID = userData.usuario_id
        const nombreapellidos = userData.nombre_apellidos
        const emailUsuario = userData.email
        const role = userData.role
        const tokenPost = jwt.sign(
            { usuarioID, nombreapellidos, emailUsuario, role },
            JWT_SECRET_KEY,
            // { expiresIn: '1h', algorithm: 'HS256' },
            { algorithm: 'HS256' },
        )
        console.log("POST - usuario")
        console.log("JWT CREADO EN postUsuario")
        delete result.rows[0].password
        return ({ result: result.rows[0], token: tokenPost })

    } catch (err) {
        console.error('Error en postUsuario:', err.message)
        throw err
    }
}

export async function getSignUpFormData() {
    try {
        const centros = await pool.query(`SELECT * from erroak.centros ORDER BY centro`)
        if (!centros.rows.length) {
            console.log("NO HAY DATOS DE centros")
            return {result: "Error. No hay datos en Centros"}
        }

        const turnos = await pool.query(`SELECT * from erroak.turnos ORDER BY turno`)
        if (!turnos.rows.length) {
            console.log("NO HAY DATOS DE turnos")
            return {result: "Error. No hay datos en Turnos"}
        }
        console.log ("GET - signUpFormData")
        return {centros: centros.rows, turnos: turnos.rows}

    } catch (err) {
        console.error('Error en getSignUpData:', err.message)
        throw err
    }
}

export async function getUsuario(id) {
    try {
        const result = await pool.query("SELECT * FROM erroak.usuarios WHERE usuario_id = $1", [id])
        if (result.rows.length > 0) {
            console.log("GET - usuario")
            delete result.rows[0].userPassword
            return result.rows[0]
        }
        else
            return ({result: "No encontrado"})

    } catch (err) {
        console.error('Error en getUsuario:', err.message)
        throw err
    }
}

export async function putUsuario(id, updatedUser) {
    try {
        const {
            email, nombre_apellidos, movil, extension, centro_id, llave, alarma, turno_id, color, tarde_invierno,
            observaciones, lenguaje_id
        } = updatedUser

        const existsEmail = await pool.query(`SELECT EXISTS (SELECT 1 FROM erroak.usuarios WHERE email = $1 AND usuario_id != $2);`, [email, id])
        if (existsEmail.rows[0].exists) {
            console.log("Email ya existente")
            return {result: "Email ya existente"}
        }

        const result = await pool.query(
            `UPDATE erroak.usuarios SET
                email = $1, nombre_apellidos = $2, movil = $3, extension = $4, centro_id = $5,
                llave = $6, alarma = $7, turno_id = $8, color = $9, tarde_invierno = $10, observaciones = $11, lenguaje_id = $12
            WHERE usuario_id = $13
            RETURNING *`,
            [email, nombre_apellidos, movil, extension, centro_id, llave, alarma, turno_id, color, tarde_invierno, 
                observaciones, lenguaje_id, parseInt(id)
            ]
        )
        const userData = result.rows[0]
        if (result.rows.length > 0) {
            const usuarioID = userData.usuario_id
            const nombreapellidos = userData.nombre_apellidos
            const emailUsuario = userData.email
            const role = userData.role
            const token = jwt.sign(
                { usuarioID, nombreapellidos, emailUsuario, role },
                JWT_SECRET_KEY,
                // { expiresIn: '1h', algorithm: 'HS256' },
                { algorithm: 'HS256' },
            )
            console.log("PUT - usuario")
            console.log("JWT CREADO EN putUsuario")
            delete result.rows[0].password
            return ({ result: result.rows[0], token: token })
        }
        else
            return ({result: "No encontrado"})

    } catch (err) {
        console.error('Error en putUsuario:', err.message)
        throw err
    }
}

export async function putUsuarioStatus(activateUser) {
    try {
        const {userid, activate } = activateUser

        const result = await pool.query(
            `UPDATE erroak.usuarios SET
                activo = $1  WHERE usuario_id = $2
            RETURNING *`,
            [activate, userid]
        )
        const userData = result.rows[0]
        if (result.rows.length > 0) {
            return ({ result: "Actualizado" })
        }
        else
            return ({result: "No encontrado"})

    } catch (err) {
        console.error('Error en putUsuario:', err.message)
        throw err
    }
}

export async function getWinterAfternoons() {
    try {
        const result = await pool.query(
            `SELECT u.tarde_invierno, u.nombre_apellidos, u.centro_id, c.centro AS nombre_centro, u.llave, u.alarma FROM erroak.usuarios u
                JOIN erroak.centros c ON u.centro_id = c.centro_id
                WHERE u.tarde_invierno > 0 
                ORDER BY u.tarde_invierno, u.nombre_apellidos;`)
        console.log("GET - winterafternoons")
        return result.rows;
    } catch (err) {
        console.error('Error en getWinterAfternoons:', err.message)
        throw err
    }
}
