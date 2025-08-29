import { Router} from 'express';
// import { validateQuery, validateUserId } from '../middleware/users.js';
// import { authenticateToken } from '../middleware/login.js';
// import jwt from 'jsonwebtoken';
// import { getUsuarios, postLogin, postUsuario, getSignUpFormData, getUsuario, putUsuario, getHolidays } from '../models/usuariosModel.js';
import { getVacaciones, postVacacion, deleteVacacion } from '../models/vacacionesModel.js';

const router = Router()

// /api/v1/erroak/vacaciones
// router.get('/vacaciones/:date1/:date2', async(req, res) => {
//     const {date1, date2} = req.params
//     const vacaciones = await getVacaciones(date1, date2);
//     console.log(vacaciones);
//     res.json (vacaciones)
// })


// /api/v1/erroak/vacacion -- create vacaciones
router.post('/vacacion', async(req, res) => {
    const vacacion = req.body
    console.log("Recibido en backend vacacion post: ", vacacion)
    const resultVacacion = await postVacacion(vacacion);
    console.log(resultVacacion);
    res.json (resultVacacion)
})

// POST /api/v1/erroak/vacacion/:id
router.delete('/vacacion/:event_id', async (req, res) => {
    const {event_id} = req.params
    console.log("Recibido en backend vacacion delete: ", event_id)
    const resultVacacion = await deleteVacacion(event_id);
    console.log(resultVacacion);
    res.json (resultVacacion)
});

// GET /api/v1/erroak/vacaciones/:user/:year/:month
router.get('/vacaciones/:user/:anio/:mes', async(req, res) => {
    const {user, anio, mes} = req.params
    const vacaciones = await getVacaciones(user, anio, mes);
    console.log(vacaciones);
    res.json (vacaciones)
})

export default router

// /api/v1/erroak/usuarios
// router.get('/usuarios', async(req, res) => {
//     const usuarios = await getUsuarios();
//     console.log(usuarios);
//     res.json (usuarios)
// })

// // /api/v1/erroak/login
// router.post('/login', async(req, res) => {
//     const loginDetails = req.body
//     console.log("loginDetails: ", loginDetails)
//     const login = await postLogin(loginDetails);
//     console.log(login);
//     res.json (login)
// })

// router.get('/getSignUpFormData', async(req, res) => {
//     const result = await getSignUpFormData();
//     console.log(result);
//     res.json (result)
// })

// // /api/v1/erroak/usuario -- create usuarios
// // a /usuario y cambiar sendUsuarios por postUsuario
// router.post('/usuario', async(req, res) => {
//     const usuario = req.body
//     console.log("Recibido en backend: ", usuario)
//     const resultUsuario = await postUsuario(usuario);
//     console.log(resultUsuario);
//     res.json (resultUsuario)
// })

// // /api/v1/erroak/usuario/:id
// router.get('/usuario/:id', async(req, res) => {
//     const {id} = req.params
//     console.log("imprimo id en /usuario: ", id)
//     const resultUsuario = await getUsuario(id);
//     res.json (resultUsuario)
// })

// // /api/v1/erroak/usuario/:id
// router.put('/usuario/:id', async(req, res) => {
//     const {id} = req.params
//     // const id_usuario = req.params.id
//     const updatedUser = req.body
//     console.log("imprimo id en /usuario/:id : ", id)
//     const resultUsuario = await putUsuario(id, updatedUser);
//     res.json (resultUsuario)
// })

// router.get('/holidays/:id/:ano', async(req, res) => {
//     const {id, ano} = req.params
//     console.log("imprimo id - ano en /holidays: ", id, "-", ano)
//     const resultHolidays = await getHolidays(id, ano);
//     res.json (resultHolidays)
// })



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


