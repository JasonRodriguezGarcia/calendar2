import rateLimit from 'express-rate-limit';
import csurf from 'csurf';

// Límite específico para post('/login', ...)
export const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutos
    max: 5,                     // 5 intentos
  // Aquí definimos cómo identificar a cada cliente
    keyGenerator: (req, res) => {
    // Si viene un usuario en el body, se usa como clave
        return req.body?.useremail
    },
    message: {message: `Demasiados intentos de inicio de sesión. Intente de nuevo más tarde.`},
    standardHeaders: true,
    legacyHeaders: false
})

// Límite global (toda la API)
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 100, // 100 peticiones por IP
  message: {message: "Demasiadas solicitudes API. Intente de nuevo más tarde."},
  standardHeaders: true,
  legacyHeaders: false,
})

// Límite específico para registro .post('/usuario', ...)
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5, // máximo 5 registros por IP en una hora
  message: {
    success: false,
    message: {message: "Demasiadas solicitudes de registro. Intente más tarde."},
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Limitador para PUT /usuario
export const updateUserLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 10, // Máximo 10 modificaciones por minuto
  message: {
    success: false,
    message: "Demasiadas actualizaciones. Intenta de nuevo en un minuto.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.usuarioID, // 💡 Limita por usuario autenticado si hay token
})

// Configurar csurf con cookie (sin sesiones)
export const csrfProtection = csurf({
  cookie: {
    key: '_csrfSecret',  // cookie donde guarda el secreto
    httpOnly: true,      // no accesible desde JS
    sameSite: 'none',
    secure: true,
  },
})