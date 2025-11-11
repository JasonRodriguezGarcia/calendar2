import { Router} from 'express';
import { authenticateToken } from '../middleware/token.js';
import { csrfProtection } from "../middleware/csrf.js";
import { getVacaciones, postVacacion, deleteVacacion, getVacacionesCount } from '../models/vacacionesModel.js';

const router = Router()

// /api/v1/erroak/vacacion 
// Crear vacaciones
router.post('/vacacion', authenticateToken, csrfProtection, async(req, res) => {
    const vacacion = req.body
    const resultVacacion = await postVacacion(vacacion)
    res.json (resultVacacion)
})

// /api/v1/erroak/vacacion/:event_id
// BORRAR UN EVENTO EN VACACIONES
router.delete('/vacacion/:event_id', authenticateToken, csrfProtection, async (req, res) => {
    const {event_id} = req.params
    const resultVacacion = await deleteVacacion(event_id)
    res.json (resultVacacion)
});

// Cuenta vacaciones de un usuario en un año -- TIENE QUE ESTAR ANTES QUE /vacaciones/:user/:anio/:mes que es más específica
// Orden de las rutas en Express importa: Las rutas más generales deben estar después de las rutas más específicas.
// /api/v1/erroak/vacaciones/count/:user/:year
// Cuenta las vacaciones que tiene un usuario en un año
router.get('/vacaciones/count/:anio', authenticateToken, csrfProtection, async(req, res) => {
    const {anio} = req.params
    const id = req.user.usuarioID; // <- Datos conseguidos desde JWT en cookie httpOnly
    const vacacionesCount = await getVacacionesCount(id, anio);
    res.json (vacacionesCount)
})

// /api/v1/erroak/vacaciones/:user/:year/:month
// Devuelve los datos de las vacaciones de un usuario en un año y mes
router.get('/vacaciones/:start/:end/:mode', authenticateToken, csrfProtection, async(req, res) => {
    const {start, end, mode} = req.params
    const user = req.user.usuarioID // <- Datos conseguidos desde JWT en cookie httpOnly via authenticateToken
    const vacaciones = await getVacaciones(user, start, end, mode);
    res.json (vacaciones)
})

export default router
