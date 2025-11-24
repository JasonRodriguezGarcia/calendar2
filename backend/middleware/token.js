import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET

export function authenticateToken (req, res, next) {
    // lee el token desde la cookie
    const token = req.cookies.token;

    if (!token) {
        console.log("Missing token in authenticateToken")
        return res.status(401).json({message: "Missing token"}) // Unauthorized. Token faltante o inválido
    }

    // Lee el token, verifica la firma y te devuelve ese mismo payload del token con el nombre user
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
    // lee el token desde la cookie
    const token = req.cookies.token;

    if (!token) {
        console.log("Missing token in checkToken")
        return res.status(401).json({message: "Missing token"}) // Unauthorized. Token faltante o inválido
    }

    // Lee el token, verifica la firma y te devuelve ese mismo payload del token con el nombre user
    jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
        if (err) {
            console.log("Invalid token")
            return res.status(403).json({message: "Invalid token"}) // Forbidden. Está logeado pero no autorizado
        }
        
        req.user = user // añadimos usuario a request
        next() // Continua la ejecución
    })

}
