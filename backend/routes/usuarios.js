import { Router} from 'express';
import { authenticateToken, checkToken } from '../middleware/login.js';
// import { validateQuery, validateUserId } from '../middleware/users.js';
import { getUsuarios, postLogin, postRecoveryPassword, postNewPassword, postUsuario, getSignUpFormData, getUsuario,
    putUsuario, getWinterAfternoons, postMe } from '../models/usuariosModel.js';

// TODO
//  - QUE SE PUEDAN USAR SOLO LOS USUARIOS ACTIVOS

const router = Router()

// /api/v1/erroak/usuarios
// Conseguir los usuarios que hay en la bbdd
router.get('/usuarios', authenticateToken, async(req, res) => {
    const usuarios = await getUsuarios()
    console.log(usuarios)
    res.json (usuarios)
})

// /api/v1/erroak/login
// Datos para hacer un login
router.post('/login', async(req, res) => {
    const loginDetails = req.body
    console.log("loginDetails: ", loginDetails)
    const login = await postLogin(loginDetails)
    console.log("imprimo login en /login: ", login)
    if (login.success) {
        console.log("paso por login.success")
        // Enviar cookie httpOnly
        res.cookie('token', login.token, {
            httpOnly: true,
            // DESCOMENTAR EN PRODUCCIÓN
            // secure: true,      // SOLO si usas HTTPS
            secure: false,
            // sameSite: 'Strict', // 'Lax' o 'None' dependiendo del flujo
            sameSite: 'None', // 'Lax' o 'None' dependiendo del flujo
            // maxAge: 60 * 60 * 1000 // 1 hora
        })
        // console.log("imprimo res.cookie: ", res.cookie())
    }
    res.json (login)
})

// /api/v1/erroak/logout
// Datos para hacer un logout
router.post('/logout', authenticateToken, (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    // sameSite: 'Strict'
    sameSite: 'None'
  })
  res.json({ message: 'Sesión cerrada' })
})

// /api/v1/erroak/me
// Datos para hacer una petición de datos de un usuario via cookie
router.get('/me', checkToken, async (req, res) => {
    const user = req.user // extraído del JWT
  // const usuario = await getUsuario(userId);
    // console.log("imprimo /me usuario: ", usuario)
    console.log("imprimo /me user: ", user)
    // res.json({ userId});
    const login = await postMe(user)
    console.log("imprimo login en /login: ", login)
    if (login.success) {
        console.log("paso por /me login.success")
        // Enviar cookie httpOnly
        res.cookie('token', login.token, {
            httpOnly: true,
            // DESCOMENTAR EN PRODUCCIÓN
            secure: true,      // SOLO si usas HTTPS
            // secure: false,
            // sameSite: 'Strict', // 'Lax' o 'None' dependiendo del flujo
            sameSite: 'None', // 'Lax' o 'None' dependiendo del flujo
            // maxAge: 60 * 60 * 1000 // 1 hora
        })
        // console.log("imprimo res.cookie: ", res.cookie())
    }
    res.json (login)
})


// /api/v1/erroak/passwordrecovery
// Datos para recuperar contraseña
router.post('/passwordrecovery', async(req, res) => {
    const recoveryPasswordDetails = req.body
    console.log("recoveryPasswordDetails: ", recoveryPasswordDetails)
    const recoveryPassword = await postRecoveryPassword(recoveryPasswordDetails)
    console.log(recoveryPassword)
    res.json (recoveryPassword)
})

// /api/v1/erroak/newpassword
// Datos para guardar nueva contraseña
router.post('/newpassword', async(req, res) => {
    const newPasswordDetails = req.body
    console.log("newPasswordDetails: ", newPasswordDetails)
    const newPassword = await postNewPassword(newPasswordDetails)
    console.log(newPassword)
    res.json (newPassword)
})

// /api/v1/erroak/getsignupformdata
// Conseguir los datos de los select del formulario de alta de un usuario
router.get('/getsignupformdata', authenticateToken, async(req, res) => {
    const result = await getSignUpFormData()
    console.log(result)
    res.json (result)
})

// /api/v1/erroak/usuario 
// Crear usuario
router.post('/usuario', async(req, res) => {
    const usuario = req.body
    console.log("Recibido en backend post usuario: ", usuario)
    const resultUsuario = await postUsuario(usuario)
    console.log(resultUsuario)
    res.json (resultUsuario)
})

// /api/v1/erroak/usuario/:id
// router.get('/usuario/:id', authenticateToken, async(req, res) => {
router.get('/usuario', authenticateToken, async(req, res) => {
    // const {id} = req.params
    console.log("Imprimmo req.user: ", req.user)
    const id = req.user.usuarioID; // <- Datos conseguidos desde JWT en cookie httpOnly
    console.log("imprimo id en get usuario: ", id)
    // // Validar que el usuario autenticado es el mismo que el del URL
    // if (parseInt(id) !== req.userID ){
    //     console.log("No autorizado para acceder a este usuario")
    //     // Forbidden. Está loggeado pero no autorizado
    //     return res.status(403).json({ message: "No autorizado para acceder a este usuario" })
    // }
    const resultUsuario = await getUsuario(id)
    res.json (resultUsuario)
})

// /api/v1/erroak/usuario/:id
// Modificar los datos de un usuario
router.put('/usuario', authenticateToken, async(req, res) => {
    // const {id} = req.params
    const id = req.user.usuarioID
    // const id_usuario = req.params.id
    const updatedUser = req.body
    console.log("imprimo id en put usuario/:id : ", id)
    // Validar que el usuario autenticado es el mismo que el del URL
    // if (parseInt(id) !== req.userID ){
    //     console.log("No autorizado para acceder a este usuario")
    //     // Forbidden. Está loggeado pero no autorizado
    //     return res.status(403).json({ message: "No autorizado para acceder a este usuario" })
    // }
    const resultUsuario = await putUsuario(id, updatedUser)
    res.json (resultUsuario)
})

// /api/v1/erroak/usuarios
// Conseguir los usuarios que hay en la bbdd
router.get('/winterafternoons', authenticateToken, async(req, res) => {
    const winterAfternoons = await getWinterAfternoons()
    console.log(winterAfternoons)
    res.json (winterAfternoons)
})

export default router
