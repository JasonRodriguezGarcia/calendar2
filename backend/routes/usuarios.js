import { Router} from 'express';
import { csrfProtection } from "../middleware/csrf.js";
import { authenticateToken, checkToken } from '../middleware/token.js';
import { authorizeRole } from "../middleware/authorization.js";
import { loginLimiter, registerLimiter, updateUserLimiter } from '../middleware/limiter.js';
import { getUsuarios, postLogin, postRecoveryPassword, postNewPassword, postChangePassword, postUsuario, 
    getSignUpFormData, getUsuario, putUsuario, putUsuarioStatus, getWinterAfternoons, postMe } from '../models/usuariosModel.js';

// TODO
//  - QUE SE PUEDAN USAR SOLO LOS USUARIOS ACTIVOS

const router = Router()

// /api/v1/erroak/usuarios
// Conseguir los usuarios que hay en la bbdd
// CAMBIADO A POST EN LUGAR DE GET PARA PODER EJECUTAR csrfProtection PARA MAYOR SEGURIDAD
router.post('/usuarios', authenticateToken, csrfProtection, async(req, res) => {
    const option = req.body
    const usuarios = await getUsuarios(option)
    res.json (usuarios)
})

// /api/v1/erroak/login
// Datos para hacer un login
// No poner csrfProtection. Si dejas csrfProtection en /login:
    // Render pone el backend en standby → primera solicitud despierta el servidor → token CSRF antiguo o inexistente → falla invalid csrf token.
    // El usuario no puede iniciar sesión hasta refrescar el token.
router.post('/login', loginLimiter, async(req, res) => {
    const loginDetails = req.body
    const login = await postLogin(loginDetails)
    if (login.success) {
        // Enviar cookie httpOnly
        res.cookie('token', login.token, {
            httpOnly: true,
            // DESCOMENTAR EN PRODUCCIÓN
            secure: true,      // SOLO si usas HTTPS
            sameSite: 'none', // 'Lax' o 'Strict' dependiendo del flujo, strict si están frontend y backend en distinto dominio
            // maxAge: 60 * 60 * 1000 // 1 hora
        })
    }
    res.json (login)
})

// /api/v1/erroak/logout
// Datos para hacer un logout
router.post('/logout', authenticateToken, (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'none'
    // sameSite: 'Strict'
  })
  res.json({ message: 'Sesión cerrada' })
})

// /api/v1/erroak/me
// Datos para hacer una petición de datos de un usuario via cookie
router.get('/me', checkToken, csrfProtection, async (req, res) => {
    const user = req.user // extraído del JWT
    const login = await postMe(user)
    if (login.success) {
        // Enviar cookie httpOnly
        res.cookie('token', login.token, {
            httpOnly: true,
            // DESCOMENTAR EN PRODUCCIÓN
            secure: true,      // SOLO si usas HTTPS
            sameSite: 'none', // 'Lax' o 'None' dependiendo del flujo
            // maxAge: 60 * 60 * 1000 // 1 hora
        })
    }
    res.json (login)
})

// /api/v1/erroak/passwordrecovery
// Datos para recuperar contraseña
router.post('/passwordrecovery', async(req, res) => {
    const recoveryPasswordDetails = req.body
    const recoveryPassword = await postRecoveryPassword(recoveryPasswordDetails)
    res.json (recoveryPassword)
})

// /api/v1/erroak/newpassword
// Datos para guardar nueva contraseña
router.post('/newpassword', async(req, res) => {
    const newPasswordDetails = req.body
    const newPassword = await postNewPassword(newPasswordDetails)
    res.json (newPassword)
})

// /api/v1/erroak/changepassword
// Datos para guardar contraseña modificada
router.post('/changepassword', async(req, res) => {
    const changePasswordDetails = req.body
    const changePassword = await postChangePassword(changePasswordDetails)
    res.json (changePassword)
})

// /api/v1/erroak/getsignupformdata
// Conseguir los datos de los select del formulario de alta de un usuario
router.get('/getsignupformdata', async(req, res) => {
    const result = await getSignUpFormData()
    res.json (result)
})

// /api/v1/erroak/usuario 
// Crear usuario
router.post('/usuario', registerLimiter, csrfProtection, async(req, res) => {
    const usuario = req.body
    const resultUsuario = await postUsuario(usuario)
    res.json (resultUsuario)
})

// /api/v1/erroak/usuario/:id
router.get('/usuario', authenticateToken, csrfProtection, async(req, res) => {
    const id = req.user.usuarioID // <- Datos conseguidos desde JWT en cookie httpOnly via authenticateToken
    const resultUsuario = await getUsuario(id)
    res.json (resultUsuario)
})

// /api/v1/erroak/usuario/:id
// Modificar los datos de un usuario
router.put('/usuario', authenticateToken, updateUserLimiter, csrfProtection, async(req, res) => {
    const id = req.user.usuarioID  // <- Datos conseguidos desde JWT en cookie httpOnly via authenticateToken
    const updatedUser = req.body
    const resultUsuario = await putUsuario(id, updatedUser)
    res.json (resultUsuario)
})

router.put('/usuariostatus', authenticateToken, authorizeRole("admin"), updateUserLimiter, csrfProtection, async(req, res) => {
    // const id = req.user.usuarioID  // <- Datos conseguidos desde JWT en cookie httpOnly via authenticateToken
    // const role = req.user.role // <- Datos conseguidos desde JWT en cookie httpOnly via authenticateToken
    const activateUser = req.body
    console.log("activateUser: ", activateUser)
    const resultUsuario = await putUsuarioStatus(activateUser)
    res.json (resultUsuario)
})

// /api/v1/erroak/winterafternoons
// Conseguir los usuarios que hay en la bbdd
router.get('/winterafternoons', authenticateToken, async(req, res) => {
    const winterAfternoons = await getWinterAfternoons()
    res.json (winterAfternoons)
})

export default router
