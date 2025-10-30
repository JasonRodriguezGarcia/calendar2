// USERS versión final con usersRouter y usando el directorio routes, osea enrutamiento avanzado
import express from "express";
import path from "path";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { fileURLToPath } from "url";
import { apiLimiter } from "./middleware/login.js";
import usuariosRouter from './routes/usuarios.js'
import vacacionesRouter from './routes/vacaciones.js'
import eventosRouter from './routes/eventos.js'
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
// const HOSTNAME = "127.0.0.1"
const allowedOrigins = [
  'http://localhost:5173',
  'https://calendar2-6wyj.onrender.com'
];

// Middleware
// Servir archivos desde la carpeta 'public'
app.use('/images', express.static(path.join(__dirname, 'public/images')));
// cors() permite el acceso entre dominios (Cross-Origin Resource Sharing).
// Esto es necesario cuando tienes React y Express en distintos orígenes (por ejemplo, React en localhost:3000 y Express en localhost:5000).
// Sin esto, el navegador bloquearía las peticiones por razones de seguridad.
app.use(cors({
  origin: (origin, callback) => {
    // Permitir solicitudes sin origin (como Postman) o si está en la lista
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origen no permitido por CORS'));
    }
  },
  credentials: true  // ESTO PERMITE EL USO DE COOKIES
})); // para tener acceso desde React, ya que React y Express no están en el mismo directorio
app.use(cookieParser()); // Para el uso de cookies
// Habilita el parsing de JSON en los requests.
// Es decir, cuando un cliente (como React) envía datos en formato JSON (por ejemplo, en un POST o PUT), Express puede leerlos desde req.body.
app.use(express.json());

// Aplica rate limit a toda la API
app.use('/api/v1/erroak', apiLimiter)

// app.use(logger); // adding middleware to show some logs
// Esto registra routers separados para manejar distintas partes del backend:
app.use('/api/v1/erroak', usuariosRouter)
app.use('/api/v1/erroak', vacacionesRouter)
app.use('/api/v1/erroak', eventosRouter)
// app.use('/api/v1/erroak', listingsRouter)

// // Start Server
// app.listen(PORT, HOSTNAME, () => {
// console.log(`Server running on http://localhost:${PORT} IP:${HOSTNAME}`);
// });
// Start Server
app.listen(PORT, () => {
console.log(`Server running on http://localhost:${PORT}`);
});
