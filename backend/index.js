// USERS versión final con usersRouter y usando el directorio routes (enrutamiento avanzado)
import express from "express";
import path from "path";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { fileURLToPath } from "url";
import { apiLimiter } from "./middleware/limiter.js";
import { csrfProtection } from "./middleware/csrf.js";
import { configureTrustProxy } from "./config/proxy.js";
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
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS.split(',');

// Añadimos esta línea antes de usar express-rate-limit o cualquier middleware relacionado con IPs
// Configura automáticamente trust proxy según entorno
// Así de cara al futuro si migramos puede que haya varios proxies (ejemplo como Cliente → Cloudflare → Nginx → Render → Express
// si migramos a otro lado alojamiento) en lugar de uno (que es como Render está ahora) y nos avisaría para cambiar
// la variable de entorno TRUST_PROXY al valor adecuado.
configureTrustProxy(app);

// Middleware
// Servir archivos desde la carpeta 'public'
app.use('/images', express.static(path.join(__dirname, 'public/images')));
// cors() permite el acceso entre dominios (Cross-Origin Resource Sharing).
// Esto es necesario cuando tienes React y Express en distintos orígenes o dominios (por ejemplo, React en localhost:3000 y 
// Express en localhost:5000).
// Sin esto, el navegador bloquearía las peticiones por razones de seguridad.
app.use(cors({
  origin: (origin, callback) => {
    // Permitir solicitudes sin origin (como Postman) o si está en la lista
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origen no permitido por CORS'));
    }
  },
  credentials: true
})) // para tener acceso desde React, ya que React y Express no están en el mismo directorio

app.use(cookieParser()) // Para el uso de cookies

// Habilita el parsing de JSON en los requests.
// Es decir, cuando un cliente (como React) envía datos en formato JSON (por ejemplo, en un POST o PUT), Express puede leerlos
//  desde req.body.
app.use(express.json());

// Aplica rate limit a toda la API
app.use('/api/v1/erroak', apiLimiter)

// 🔹 Endpoint para obtener el token CSRF
// csrfProtection crea y valida el secreto CSRF en la cookie.
// req.csrfToken() genera un token válido que el frontend puede usar en los fetch que requieren protección (POST, PUT, etc.).
app.get('/api/v1/erroak/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// ✅ Endpoint de salud básico (para Render / UptimeRobot-pending)
// Usaremos este Endpoint para que el backend en Render que es gratuíto no entre en stand-by
app.get("/api/v1/erroak/nodormir", (req, res) => {
    console.log("Llamando a Health para no entrar en stand-by...")
    res.status(200).send("OK")
})

// app.use(logger); // adding middleware to show some logs
// Esto registra routers separados para manejar distintas partes del backend:
app.use('/api/v1/erroak', usuariosRouter)
app.use('/api/v1/erroak', vacacionesRouter)
app.use('/api/v1/erroak', eventosRouter)

// Cuándo tiene sentido especificar HOSTNAME
// Situación	                                            HOST recomendado	Razón
// 🧪 Desarrollo local, sólo quieres usar el propio PC	    '127.0.0.1'	        Aisla el servidor, mejora seguridad local
// 🌐 Producción (Render, Vercel, etc.)	                    No pongas HOST	    Render ya gestiona la red y necesita 0.0.0.0
// 🧱 Entorno Docker o Kubernetes	                        '0.0.0.0'	        Para que sea accesible fuera del contenedor
// 🏠 Servidor casero o red local	                        '0.0.0.0'	        Permite acceder desde otros dispositivos
// // Start Server
// app.listen(PORT, HOSTNAME, () => {
// console.log(`Server running on http://localhost:${PORT} IP:${HOSTNAME}`);
// });
// Start Server
app.listen(PORT, () => {
console.log(`Server running on http://localhost:${PORT}`);
});
