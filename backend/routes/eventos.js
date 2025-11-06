import { Router} from 'express';
import { csrfProtection } from "../middleware/login.js";
import { authenticateToken } from '../middleware/login.js';
// import { validateQuery, validateUserId } from '../middleware/users.js';
import { getNewEventFormData, postEvento, deleteEvento, putEvento, getEventos, getEventosUsuario } from "../models/eventosModel.js"

const router = Router()

// /api/v1/erroak/vacacion 
// Conseguir los datos de los select del Formulario al crear un evento Nuevo
// CAMBIADO A POST EN LUGAR DE GET PARA PODER EJECUTAR csrfProtection
// PARA MAYOR SEGURIDAD
router.post('/getNewEventFormData', authenticateToken, csrfProtection, async(req, res) => {
    const result = await getNewEventFormData();
    console.log(result);
    res.json (result)
})

// /api/v1/erroak/evento
// Crear eventos
router.post('/evento', authenticateToken, csrfProtection, async(req, res) => {
    const evento = req.body
    console.log("Recibido en backend evento post: ", evento)
    // Validar que el usuario autenticado es el mismo que el del body
    // if (parseInt(evento.usuario_id) !== req.userID ){
    //     console.log("No autorizado para acceder a estos eventos")
    //     // Forbidden. Está loggeado pero no autorizado
    //     return res.status(403).json({ message: "No autorizado para acceder a estos eventos" })
    // }
    const resultEvento = await postEvento(evento);
    console.log(resultEvento);
    res.json (resultEvento)
})

// /api/v1/erroak/evento/:id
// BORRAR UN EVENTO
router.delete('/evento/:event_id', authenticateToken, csrfProtection, async (req, res) => {
    const evento = req.body
    const {event_id} = req.params
    const userId = req.user.usuarioID; // <- Datos conseguidos desde JWT en cookie httpOnly
    console.log("Recibido en backend evento delete: ", event_id)
    // Validar que el usuario no manipule eventos que no son suyos
    if (parseInt(evento.usuario_id) !== userId ) {
        console.log("No autorizado para acceder a estos eventos")
        // Forbidden. Está loggeado pero no autorizado a manipular eventos que no son suyos
        return res.status(403).json({ message: "No autorizado para acceder a estos eventos" })
    }
    const resultEvento = await deleteEvento(event_id);
    console.log(resultEvento);
    res.json (resultEvento)
});

//  /api/v1/erroak/evento/:id
// MODIFICAR UN EVENTO
router.put('/evento/:event_id', authenticateToken, csrfProtection, async (req, res) => {
    console.log("request body: ", req.body)
    const eventData = req.body
    const {event_id} = req.params
    const userId = req.user.usuarioID; // <- Datos conseguidos desde JWT en cookie httpOnly
    console.log("Recibido en backend evento put: ", eventData)
    // Validar que el usuario no manipule eventos que no son suyos
    if (parseInt(eventData.usuario_id) !== userId ) {
        console.log("No autorizado para acceder a estos eventos")
        // Forbidden. Está loggeado pero no autorizado a manipular eventos que no son suyos
        return res.status(403).json({ message: "No autorizado para acceder a estos eventos" })
    }
    const resultEvento = await putEvento(event_id, eventData);
    console.log(resultEvento);
    res.json (resultEvento)
});

// /api/v1/erroak/eventos/:user/:year/:endDate
// Devuelve los datos de los eventos de TODOS LOS USUARIOS en un fechaInicio fechaFin
// Pasamos usuario igualmente por seguridad
router.get('/eventos/:anio/:endDate', authenticateToken, async(req, res) => {
    const {anio, endDate} = req.params
    const usuario = req.user.usuarioID; // <- Datos conseguidos desde JWT en cookie httpOnly
    // Validar que el usuario autenticado es el mismo que el de la URL
    // if (parseInt(usuario) !== req.userID ){
    //     console.log("No autorizado para acceder a estos eventos")
    //     // Forbidden. Está loggeado pero no autorizado
    //     return res.status(403).json({ message: "No autorizado para acceder a estos eventos" })
    // }
    const eventos = await getEventos(anio, endDate, usuario);
    console.log(eventos);
    res.json (eventos)
})

// /api/v1/erroak/eventos/:user/:year/:endDate
// Devuelve los datos de los eventos de UN USUARIO en un fechaInicio fechaFin
// router.get('/eventos/:user/:anio/:endDate', async(req, res) => {
// router.get('/eventosuser/:usuario/:anio/:endDate', authenticateToken, async(req, res) => {
router.get('/eventosuser/:anio/:endDate', authenticateToken, async(req, res) => {
    const {anio, endDate} = req.params
    const usuario = req.user.usuarioID; // <- Datos conseguidos desde JWT en cookie httpOnly
    // // Validar que el usuario autenticado es el mismo que el de la URL
    // if (parseInt(usuario) !== req.userID ){
    //     console.log("No autorizado para acceder a estos eventos")
    //     // Forbidden. Está loggeado pero no autorizado
    //     return res.status(403).json({ message: "No autorizado para acceder a estos eventos" })
    // }
    const eventos = await getEventosUsuario(usuario, anio, endDate);
    console.log(eventos);
    res.json (eventos)
})

export default router
