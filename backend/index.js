// USERS versión final con usersRouter y usando el directorio routes, osea enrutamiento avanzado
import express from "express";
import path from "path";
import cors from 'cors';
import { fileURLToPath } from "url";
import erroakRouter from './routes/erroak.js'
import dotenv from 'dotenv';
dotenv.config();

console.log("Loaded env:");
console.log("DATABASE_USER:", process.env.DATABASE_USER);
console.log("DATABASE_PASSWORD:", process.env.DATABASE_PASSWORD);


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
// const HOSTNAME = "127.0.0.1"

// Middleware
// Servir archivos desde la carpeta 'public'
app.use('/images', express.static(path.join(__dirname, 'public/images')));
// cors() permite el acceso entre dominios (Cross-Origin Resource Sharing).
// Esto es necesario cuando tienes React y Express en distintos orígenes (por ejemplo, React en localhost:3000 y Express en localhost:5000).
// Sin esto, el navegador bloquearía las peticiones por razones de seguridad.
app.use(cors()); // para tener acceso desde React, ya que React y Express no están en el mismo directorio
// Habilita el parsing de JSON en los requests.
// Es decir, cuando un cliente (como React) envía datos en formato JSON (por ejemplo, en un POST o PUT), Express puede leerlos desde req.body.
app.use(express.json());

// app.use(logger); // adding middleware to show some logs
// Esto registra routers separados para manejar distintas partes del backend:
app.use('/api/v1/erroak', erroakRouter)

// // Start Server
// app.listen(PORT, HOSTNAME, () => {
// console.log(`Server running on http://localhost:${PORT} IP:${HOSTNAME}`);
// });
// Start Server
app.listen(PORT, () => {
console.log(`Server running on http://localhost:${PORT}`);
});
