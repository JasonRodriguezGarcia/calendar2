import { Router} from 'express';
// import { validateQuery, validateUserId } from '../middleware/users.js';
// import { authenticateToken } from '../middleware/login.js';
// import jwt from 'jsonwebtoken';
import { getNewEventFormData, postEvento, deleteEvento, putEvento, getEventos, getEventosUsuario } from "../models/eventosModel.js"

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

// //  /api/v1/erroak/repeated
// // REPETIR UN EVENTO
// router.post('/repeated', async (req, res) => {
//     console.log("request body: ", req.body)
//     const eventRepeatedData = req.body
//     // const {event_id} = req.params
//     console.log("Recibido en backend repeated post: ", eventRepeatedData)
//     const resultEvento = await postRepeatedEvento(eventRepeatedData);
//     console.log(resultEvento);
//     res.json (resultEvento)
// });

// /api/v1/erroak/eventos/:user/:year/:month
// Devuelve los datos de los eventos de TODOS LOS USUARIOS en un año y mes
// Pasamos usuario igualmente por seguridad
router.get('/eventos/:anio/:mes/:usuario', async(req, res) => {
    const {user, anio, mes, usuario} = req.params
    // añadir por seguridad que el usuario exista
    const eventos = await getEventos(anio, mes, usuario);
    console.log(eventos);
    res.json (eventos)
})

// /api/v1/erroak/eventos/:user/:year/:month
// Devuelve los datos de los eventos de TODOS LOS USUARIOS en un año y mes
// router.get('/eventos/:user/:anio/:mes', async(req, res) => {
router.get('/eventosuser/:usuario/:anio/:mes', async(req, res) => {
    const {usuario, anio, mes} = req.params
    const eventos = await getEventosUsuario(usuario, anio, mes);
    console.log(eventos);
    res.json (eventos)
})

export default router
