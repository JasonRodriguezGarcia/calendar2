import { Router} from 'express';
// import { validateQuery, validateUserId } from '../middleware/users.js';
// import { authenticateToken } from '../middleware/login.js';
// import jwt from 'jsonwebtoken';
// import { getUsuarios, postLogin, postUsuario, getSignUpFormData, getUsuario, putUsuario, getHolidays } from '../models/usuariosModel.js';
// import { getVacaciones, postVacacion, deleteVacacion, getVacacionesCount } from '../models/vacacionesModel.js';
import { getNewEventFormData, postEvento, deleteEvento, putEvento, getEventos } from "../models/eventosModel.js"

const router = Router()

// /api/v1/erroak/vacacion 
// Conseguir los datos de los select del Formulario al crear un evento Nuevo

router.get('/getNewEventFormData', async(req, res) => {
    const result = await getNewEventFormData();
    console.log(result);
    res.json (result)
})

// /api/v1/erroak/evento
// Crear eventos
router.post('/evento', async(req, res) => {
    const evento = req.body
    console.log("Recibido en backend evento post: ", evento)
    const resultEvento = await postEvento(evento);
    console.log(resultEvento);
    res.json (resultEvento)
})

// /api/v1/erroak/evento/:id
// BORRAR UN EVENTO
router.delete('/evento/:event_id', async (req, res) => {
    const {event_id} = req.params
    console.log("Recibido en backend evento delete: ", event_id)
    const resultEvento = await deleteEvento(event_id);
    console.log(resultEvento);
    res.json (resultEvento)
});

//  /api/v1/erroak/evento/:id
// MODIFICAR UN EVENTO
router.put('/evento/:event_id', async (req, res) => {
    console.log("request body: ", req.body)
    const eventData = req.body
    const {event_id} = req.params
    console.log("Recibido en backend evento put: ", eventData)
    const resultEvento = await putEvento(event_id, eventData);
    console.log(resultEvento);
    res.json (resultEvento)
});

// /api/v1/erroak/eventos/:user/:year/:month
// Devuelve los datos de los eventos de un usuario en un año y mes
router.get('/eventos/:user/:anio/:mes', async(req, res) => {
    const {user, anio, mes} = req.params
    const eventos = await getEventos(user, anio, mes);
    console.log(eventos);
    res.json (eventos)
})




export default router
// // /api/v1/erroak/vacacion 
// // Crear vacaciones
// router.post('/vacacion', async(req, res) => {
//     const vacacion = req.body
//     console.log("Recibido en backend vacacion post: ", vacacion)
//     const resultVacacion = await postVacacion(vacacion);
//     console.log(resultVacacion);
//     res.json (resultVacacion)
// })

// // DELETE /api/v1/erroak/vacacion/:id
// // BORRAR UN EVENTO EN VACACIONES
// router.delete('/vacacion/:event_id', async (req, res) => {
//     const {event_id} = req.params
//     console.log("Recibido en backend vacacion delete: ", event_id)
//     const resultVacacion = await deleteVacacion(event_id);
//     console.log(resultVacacion);
//     res.json (resultVacacion)
// });

// // Cuenta vacaciones de un usuario en un año -- TIENE QUE ESTAR ANTES QUE /vacaciones/:user/:anio/:mes que es más específica
// // Orden de las rutas en Express importa: Las rutas más generales deben estar después de las rutas más específicas.
// // GET /api/v1/erroak/vacaciones/count/:user/:year
// // Cuenta las vacaciones que tiene un usuario en un año
// router.get('/vacaciones/count/:user/:anio', async(req, res) => {
//     const {user, anio} = req.params
//     console.log("imprimo en vacacionesCount user-anio-mes: user, anio, mes")
//     const vacacionesCount = await getVacacionesCount(user, anio);
//     console.log(vacacionesCount);
//     res.json (vacacionesCount)
// })

// // GET /api/v1/erroak/vacaciones/:user/:year/:month
// // Devuelve los datos de las vacaciones de un usuario en un año y mes
// router.get('/vacaciones/:user/:anio/:mes', async(req, res) => {
//     const {user, anio, mes} = req.params
//     const vacaciones = await getVacaciones(user, anio, mes);
//     console.log(vacaciones);
//     res.json (vacaciones)
// })


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


