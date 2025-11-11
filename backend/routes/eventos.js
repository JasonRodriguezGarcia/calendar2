import { Router} from 'express';
import { csrfProtection } from "../middleware/csrf.js";
import { authenticateToken } from '../middleware/token.js';
import { getNewEventFormData, postEvento, deleteEvento, putEvento, getEventos, getEventosUsuario } from "../models/eventosModel.js"

const router = Router()

// /api/v1/erroak/vacacion 
// Conseguir los datos de los select del Formulario al crear un evento Nuevo
// CAMBIADO A POST EN LUGAR DE GET PARA PODER EJECUTAR csrfProtection
// PARA MAYOR SEGURIDAD
router.post('/getNewEventFormData', authenticateToken, csrfProtection, async(req, res) => {
    const result = await getNewEventFormData();
    res.json (result)
})

// /api/v1/erroak/evento
// Crear eventos
router.post('/evento', authenticateToken, csrfProtection, async(req, res) => {
    const evento = req.body
    const resultEvento = await postEvento(evento);
    res.json (resultEvento)
})

// /api/v1/erroak/evento/:id
// BORRAR UN EVENTO
router.delete('/evento/:event_id', authenticateToken, csrfProtection, async (req, res) => {
    const evento = req.body
    const {event_id} = req.params
    const userId = req.user.usuarioID; // <- Datos conseguidos desde JWT en cookie httpOnly
    // Validar que el usuario no manipule eventos que no son suyos
    if (parseInt(evento.usuario_id) !== userId ) {
        // Forbidden. Está loggeado pero no autorizado a manipular eventos que no son suyos
        return res.status(403).json({ message: "No autorizado para acceder a estos eventos" })
    }
    const resultEvento = await deleteEvento(event_id);
    res.json (resultEvento)
});

//  /api/v1/erroak/evento/:id
// MODIFICAR UN EVENTO
router.put('/evento/:event_id', authenticateToken, csrfProtection, async (req, res) => {
    const eventData = req.body
    const {event_id} = req.params
    const userId = req.user.usuarioID; // <- Datos conseguidos desde JWT en cookie httpOnly
    // Validar que el usuario no manipule eventos que no son suyos
    if (parseInt(eventData.usuario_id) !== userId ) {
        // Forbidden. Está loggeado pero no autorizado a manipular eventos que no son suyos
        return res.status(403).json({ message: "No autorizado para acceder a estos eventos" })
    }
    const resultEvento = await putEvento(event_id, eventData);
    res.json (resultEvento)
});

// /api/v1/erroak/eventos/:user/:year/:endDate
// Devuelve los datos de los eventos de TODOS LOS USUARIOS en un fechaInicio fechaFin
// Pasamos usuario igualmente por seguridad
router.get('/eventos/:anio/:endDate', authenticateToken, async(req, res) => {
    const {anio, endDate} = req.params
    const usuario = req.user.usuarioID; // <- Datos conseguidos desde JWT en cookie httpOnly
    const eventos = await getEventos(anio, endDate, usuario);
    res.json (eventos)
})

// /api/v1/erroak/eventos/:user/:year/:endDate
// Devuelve los datos de los eventos de UN USUARIO en un fechaInicio fechaFin
// router.get('/eventos/:user/:anio/:endDate', async(req, res) => {
// router.get('/eventosuser/:usuario/:anio/:endDate', authenticateToken, async(req, res) => {
router.get('/eventosuser/:anio/:endDate', authenticateToken, async(req, res) => {
    const {anio, endDate} = req.params
    const usuario = req.user.usuarioID; // <- Datos conseguidos desde JWT en cookie httpOnly
    const eventos = await getEventosUsuario(usuario, anio, endDate);
    res.json (eventos)
})

export default router
