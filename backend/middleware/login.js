import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET


export function authenticateToken (req, res, next) {
    const authHeader = req.headers["authorization"]
    // Se comprueba is authHeader existe, si no, devuelve undefined
    // Si existe se divide el authHeader en 2 [<Bearer>, "<token>"] y se coge la posición 1 - <token>
    const token = authHeader && authHeader.split(" ")[1]

    if (!token)
        return res.status(401).json({message: "Missing token"})

    jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({message: "Invalid token"})
        
        req.user = user // añadimos user a request
        next()
    })

}