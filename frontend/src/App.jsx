import './App.css';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigate, useNavigate } from 'react-router-dom';
import EventsCalendarPage from './pages/EventsCalendarPage';
import HolidaysPage from './pages/HolidaysPage';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import HolidaysViewPage from './pages/HolidaysViewPage';
import WinterAfternoonsPage from './pages/WinterAfternoonsPage';
import ContactsPage from './pages/ContactsPage';
import PasswordRecoveryPage from './pages/PasswordRecoveryPage';
import NewPasswordPage from './pages/NewPasswordPage';
import EntityEventsCalendarPage from './pages/EntityEventsCalendarPage';


const App = () => {
    const [logeado, setLogeado] = useState(false)
    const [usuario, setUsuario] = useState({})
    const [token, setToken] = useState("")
    const VITE_BACKEND_URL_RENDER = import.meta.env.VITE_BACKEND_URL_RENDER

    // const navigate = useNavigate()

    if (!usuario)
        <Navigate to="/" replace />
        
    useEffect(()=> {
        const checklogeado = async () => {
            const usuarioToken = localStorage.getItem("token")
            if (usuarioToken) {
                try {
                    const decoded = jwtDecode(usuarioToken);
                    console.log("decoded JWT: ", decoded)
                    // const now = Date.now() / 1000;
                    // if (decoded.exp < now) {
                    //     logout(); // Token expirado
                    // } else {
                    // Recuperar datos del backend
                    const { usuarioID, emailUsuario, passwordUsuario } = decoded
                    console.log("Decodificado usuarioToken: ", decoded)
                    const user = {
                        id: usuarioID,
                        useremail: emailUsuario,
                        password: passwordUsuario,
                    }
                    const response1 = await fetch(`${VITE_BACKEND_URL_RENDER}/api/v1/erroak/login`,
                        {
                            method: 'POST',
                            headers: {'Content-type': 'application/json; charset=UTF-8'},
                            body: JSON.stringify(user)
                        }
                    )
                    const data = await response1.json()
                    console.log("Respuesta backend: ", data)
                    if (data.result === "No encontrado") {
                        setErrorMessage("usuario o contraseña no válidos")
                        return
                    } else {
                        // Crear localStorage
                        const resultado = data.result
                        console.log("data.result: ", data.result)
                        const usuario = {
                            id: resultado.usuario_id,
                            password: resultado.password, // igual sobra ¿?¿?
                            nombre_apellidos: resultado.nombre_apellidos
                        }
                        localStorage.setItem("token", data.token)
                        setUsuario(usuario)
                        setLogeado(true)
                        setToken(usuarioToken)
                        // navigate('/', { replace: true }) // no deja retroceder en el navegador
                    }
                } catch (e) {
                    // logout();
                }

            } else {
                setLogeado(false)
            }
        }
    
        checklogeado()
    }, [])

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage logged={logeado} 
                    setLogged={setLogeado} user={usuario} setUser={setUsuario}/>} />
                <Route path="/eventos" element={<EventsCalendarPage token={token}
                    logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} />} />
                <Route path="/holidays" element={<HolidaysPage token={token}
                    logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} />} />
                <Route path="/login" element={<LoginPage 
                    logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} />} />
                <Route path="/signup" element={<SignUpPage token={token}
                    logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} />} />
                <Route path="/profile" element={<ProfilePage token={token}
                    logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} />} />
                <Route path="/editprofile" element={<EditProfilePage token={token}
                    logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} />} />
                <Route path="/staffholidays" element={<HolidaysViewPage token={token}
                    logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} />} />
                <Route path="/winterafternoons" element={<WinterAfternoonsPage token={token}
                    logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} />} />
                <Route path="/contacts" element={<ContactsPage token={token}
                    logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} />} />
                <Route path="/passwordrecovery" element={<PasswordRecoveryPage 
                    logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} />} />
                <Route path="/newpassword/:id" element={<NewPasswordPage 
                    logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} />} />
                <Route path="/entityevents" element={<EntityEventsCalendarPage token={token}
                    logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} />} />
            </Routes>
        </BrowserRouter>  )
}

export default App;
