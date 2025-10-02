import { Router} from 'express';
// import { validateQuery, validateUserId } from '../middleware/users.js';
// import { authenticateToken } from '../middleware/login.js';
// import jwt from 'jsonwebtoken';
import { getUsuarios, postLogin, postRecoveryPassword, postNewPassword, postUsuario, getSignUpFormData, getUsuario,
    putUsuario, getWinterAfternoons } from '../models/usuariosModel.js';

// TODO
//  - SE SE PUEDAN USAR SOLO LOS USUARIOS ACTIVOS

const router = Router()

// /api/v1/erroak/usuarios
// Conseguir los usuarios que hay en la bbdd
router.get('/usuarios', async(req, res) => {
    const usuarios = await getUsuarios();
    console.log(usuarios);
    res.json (usuarios)
})

// /api/v1/erroak/login
// Datos para hacer un login
router.post('/login', async(req, res) => {
    const loginDetails = req.body
    console.log("loginDetails: ", loginDetails)
    const login = await postLogin(loginDetails);
    console.log(login);
    res.json (login)
})

// /api/v1/erroak/passwordrecovery
// Datos para recuperar contraseña
router.post('/passwordrecovery', async(req, res) => {
    const recoveryPasswordDetails = req.body
    console.log("recoveryPasswordDetails: ", recoveryPasswordDetails)
    const recoveryPassword = await postRecoveryPassword(recoveryPasswordDetails);
    console.log(recoveryPassword);
    res.json (recoveryPassword)
})

// /api/v1/erroak/newpassword
// Datos para guardar nueva contraseña
router.post('/newpassword', async(req, res) => {
    const newPasswordDetails = req.body
    console.log("newPasswordDetails: ", newPasswordDetails)
    const newPassword = await postNewPassword(newPasswordDetails);
    console.log(newPassword);
    res.json (newPassword)
})

// /api/v1/erroak/getsignupformdata
// Conseguir los datos de los select del formulario de alta de un usuario
router.get('/getSignUpFormData', async(req, res) => {
    const result = await getSignUpFormData();
    console.log(result);
    res.json (result)
})

// /api/v1/erroak/usuario 
// Crear usuario
router.post('/usuario', async(req, res) => {
    const usuario = req.body
    console.log("Recibido en backend post usuario: ", usuario)
    const resultUsuario = await postUsuario(usuario);
    console.log(resultUsuario);
    res.json (resultUsuario)
})

// /api/v1/erroak/usuario/:id
router.get('/usuario/:id', async(req, res) => {
    const {id} = req.params
    console.log("imprimo id en get usuario: ", id)
    const resultUsuario = await getUsuario(id);
    res.json (resultUsuario)
})

// /api/v1/erroak/usuario/:id
// Modificar los datos de un usuario
router.put('/usuario/:id', async(req, res) => {
    const {id} = req.params
    // const id_usuario = req.params.id
    const updatedUser = req.body
    console.log("imprimo id en put usuario/:id : ", id)
    const resultUsuario = await putUsuario(id, updatedUser);
    res.json (resultUsuario)
})

// /api/v1/erroak/usuarios
// Conseguir los usuarios que hay en la bbdd
router.get('/winterafternoons', async(req, res) => {
    const winterAfternoons = await getWinterAfternoons();
    console.log(winterAfternoons);
    res.json (winterAfternoons)
})

export default router
