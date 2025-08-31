import { Router} from 'express';
// import { validateQuery, validateUserId } from '../middleware/users.js';
// import { authenticateToken } from '../middleware/login.js';
// import jwt from 'jsonwebtoken';
import { getUsuarios, postLogin, postUsuario, getSignUpFormData, getUsuario, putUsuario } from '../models/usuariosModel.js';

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

// /api/v1/erroak/login
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
    console.log("Recibido en backend: ", usuario)
    const resultUsuario = await postUsuario(usuario);
    console.log(resultUsuario);
    res.json (resultUsuario)
})

// /api/v1/erroak/usuario/:id
router.get('/usuario/:id', async(req, res) => {
    const {id} = req.params
    console.log("imprimo id en /usuario: ", id)
    const resultUsuario = await getUsuario(id);
    res.json (resultUsuario)
})

// /api/v1/erroak/usuario/:id
// Modificar los datos de un usuario
router.put('/usuario/:id', async(req, res) => {
    const {id} = req.params
    // const id_usuario = req.params.id
    const updatedUser = req.body
    console.log("imprimo id en /usuario/:id : ", id)
    const resultUsuario = await putUsuario(id, updatedUser);
    res.json (resultUsuario)
})

// ANULADO NO USAR, BUSCABA VACACIONES EN LA TABLA USUARIOSVACACIONES PARA CONSEGUIR LAS VACACIONES ASIGNADA DE UN USUARIO EN UN AÑO
// FUNCIONABA MAL¿?
// // /api/v1/erroak/holidays/:id/:ano
// router.get('/holidays/:id/:ano', async(req, res) => {
//     const {id, ano} = req.params
//     console.log("imprimo id - ano en /holidays: ", id, "-", ano)
//     const resultHolidays = await getHolidays(id, ano);
//     res.json (resultHolidays)
// })

export default router

// router.get('/votos', async(req, res) => {
//     const votos = await getVotos();
//     console.log(votos);
//     res.json (votos)
// })

// router.get('/actuaciones', async(req, res) => {
//     const actuaciones = await getActuacionesRanking(false);
//     console.log(actuaciones);
//     res.json (actuaciones)
// })

// router.get('/ranking', async(req, res) => {
//     const actuaciones = await getActuacionesRanking(true);
//     console.log(actuaciones);
//     res.json (actuaciones)
// })

// router.post('/votos', async(req, res) => {
//     const votoEmitido = req.body
//     console.log("Recibido en backend: ", votoEmitido)
//     const resultVoto = await sendVotos(votoEmitido);
//     console.log(resultVoto);
//     res.json (resultVoto)
// })

// router.post('/votosmultiples', async(req, res) => {
//     const votosEmitidos = req.body
//     console.log("Recibido en backend: ", votosEmitidos)

//     for (let index = 0; index < votosEmitidos.length; index++) {
//         const resultVoto = await sendVotos(votosEmitidos);
//     }
//     // const resultVotosMultiples = await sendVotosMultiples(votosEmitidos);
//     // console.log(resultVotosMultiples);
//     res.json ({restultado: "OK"})
// })

// router.get('/informes/:tipo', async(req, res) => { // ojo con el order al poner este gues
//     const {tipo} = req.params
//     const miembros = await informe(tipo == 'activos'? 1 : 0);
//     console.log("tipo: ", tipo)
//     console.log(miembros);
//     res.json (miembros)
// })


// router.get('/search/:id', async(req, res) => {
//     const {id} = req.params
//     const respuesta = await buscarId(id);
//     res.json ({resultado: respuesta.length})
// })

// router.get('/informes/:tipo', async(req, res) => { // ojo con el order al poner este gues
//     const {tipo} = req.params
//     const miembros = await informe(tipo == 'activos'? 1 : 0);
//     console.log("tipo: ", tipo)
//     console.log(miembros);
//     res.json (miembros)
// })


// router.get('/search/:id', async(req, res) => {
//     const {id} = req.params
//     const respuesta = await buscarId(id);
//     res.json ({resultado: respuesta.length})
// })


