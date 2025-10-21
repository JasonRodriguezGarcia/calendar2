import { Router} from 'express';
import { authenticateToken } from '../middleware/login.js';
// import { validateQuery, validateUserId } from '../middleware/users.js';
import { getVacaciones, postVacacion, deleteVacacion, getVacacionesCount } from '../models/vacacionesModel.js';

const router = Router()

// /api/v1/erroak/vacacion 
// Crear vacaciones
router.post('/vacacion', authenticateToken, async(req, res) => {
    const vacacion = req.body
    console.log("Recibido en backend vacacion post: ", vacacion)
    // Validar que el usuario autenticado es el mismo que el del body
    if (parseInt(vacacion.usuario_id) !== req.userID ){
        console.log("No autorizado para acceder a estas vacaciones")
        // Forbidden. Está loggeado pero no autorizado
        return res.status(403).json({ message: "No autorizado para acceder a estas vacaciones" })
    }
    const resultVacacion = await postVacacion(vacacion);
    console.log(resultVacacion);
    res.json (resultVacacion)
})

// /api/v1/erroak/vacacion/:event_id
// BORRAR UN EVENTO EN VACACIONES
router.delete('/vacacion/:event_id', authenticateToken, async (req, res) => {
    const evento = req.body
    const {event_id} = req.params
    console.log("Recibido en backend vacacion delete: ", event_id)
    // Validar que el usuario autenticado es el mismo que el del body
    if (parseInt(evento.usuario_id) !== req.userID ){
        console.log("No autorizado para acceder a estas vacaciones")
        // Forbidden. Está loggeado pero no autorizado
        return res.status(403).json({ message: "No autorizado para acceder a estas vacaciones" })
    }
    const resultVacacion = await deleteVacacion(event_id);
    console.log(resultVacacion);
    res.json (resultVacacion)
});

// Cuenta vacaciones de un usuario en un año -- TIENE QUE ESTAR ANTES QUE /vacaciones/:user/:anio/:mes que es más específica
// Orden de las rutas en Express importa: Las rutas más generales deben estar después de las rutas más específicas.
// /api/v1/erroak/vacaciones/count/:user/:year
// Cuenta las vacaciones que tiene un usuario en un año
router.get('/vacaciones/count/:user/:anio', authenticateToken, async(req, res) => {
    const {user, anio} = req.params
    console.log("imprimo en vacacionesCount user-anio-mes: user, anio, mes")
    // Validar que el usuario autenticado es el mismo que el del body
    if (parseInt(user) !== req.userID ){
        console.log("No autorizado para acceder a estas vacaciones")
        // Forbidden. Está loggeado pero no autorizado
        return res.status(403).json({ message: "No autorizado para acceder a estas vacaciones" })
    }
    const vacacionesCount = await getVacacionesCount(user, anio);
    console.log(vacacionesCount);
    res.json (vacacionesCount)
})

// /api/v1/erroak/vacaciones/:user/:year/:month
// Devuelve los datos de las vacaciones de un usuario en un año y mes
router.get('/vacaciones/:user/:start/:end/:mode', authenticateToken, async(req, res) => {
    const {user, start, end, mode} = req.params
    console.log("Imprimo en getVacaciones: user, start, end, mode: ", user, start, end, mode)
    // Validar que el usuario autenticado es el mismo que el del body
    if (parseInt(user) !== req.userID ){
        console.log("No autorizado para acceder a estas vacaciones")
        // Forbidden. Está loggeado pero no autorizado
        return res.status(403).json({ message: "No autorizado para acceder a estas vacaciones" })
    }
    const vacaciones = await getVacaciones(user, start, end, mode);
    console.log(vacaciones);
    res.json (vacaciones)
})

export default router
