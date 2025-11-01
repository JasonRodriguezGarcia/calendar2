import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import csurf from 'csurf';

dotenv.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET

export function authenticateToken (req, res, next) {
    // const authHeader = req.headers["authorization"]
    // lee el token desde la cookie
    const token = req.cookies.token;
    // Se comprueba is authHeader o cookie existe, si no, devuelve undefined
    // Si existe se divide el authHeader o cookie en 2 [<Bearer>, "<token>"] y se coge la posición 1 - <token>
    // const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
        console.log("Missing token")
        return res.status(401).json({message: "Missing token"}) // Unauthorized. Token faltante o inválido
    }

    jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
        if (err) {
            console.log("Invalid token")
            return res.status(403).json({message: "Invalid token"}) // Forbidden. Está logeado pero no autorizado
        }
        
        req.user = user // añadimos usuario a request
        next() // Continua la ejecución
    })

}

export function checkToken (req, res, next) {
    // const authHeader = req.headers["authorization"]
    // lee el token desde la cookie
    const token = req.cookies.token;
    // Se comprueba is authHeader o cookie existe, si no, devuelve undefined
    // Si existe se divide el authHeader o cookie en 2 [<Bearer>, "<token>"] y se coge la posición 1 - <token>
    // const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
        console.log("Missing token")
        return res.status(401).json({message: "Missing token"}) // Unauthorized. Token faltante o inválido
    }

    jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
        if (err) {
            console.log("Invalid token")
            return res.status(403).json({message: "Invalid token"}) // Forbidden. Está logeado pero no autorizado
        }
        
        req.user = user // añadimos usuario a request
        next() // Continua la ejecución
    })

}

// export const loginLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutos
//   max: 5, // Limitar a 5 intentos
//   message: "Demasiados intentos de inicio de sesión. Por favor, intente de nuevo en 15 minutos.",
//   standardHeaders: true,
//   legacyHeaders: false,
// })

// Límite específico para post('/login', ...)
export const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutos
    max: 5,                     // 5 intentos
//   skip: function (req, res) {
    // const trustedIps = ['IP_DE_TU_SERVIDOR', 'OTRA_IP'];
    // return trustedIps.includes(req.ip);
//   },
  // 🧠 Clave: aquí definís cómo identificar a cada cliente
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

// export const csrfProtection = csurf({
//   cookie: {
//     httpOnly: false, // accesible desde frontend
//     sameSite: 'none'
//   }
// });

// Configurar csurf con cookie (sin sesiones)
export const csrfProtection = csurf({
  cookie: {
    key: '_csrfSecret',  // cookie donde guarda el secreto
    httpOnly: true,      // no accesible desde JS
    sameSite: 'none',
    secure: true,
  },
})