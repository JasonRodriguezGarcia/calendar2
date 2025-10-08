import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
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

    if (!usuario)
        <Navigate to="/" replace />
        
    useEffect(()=> {
        const checklogeado = () => {
            const usuario = JSON.parse(localStorage.getItem("usuario"))
            if (usuario === null || usuario === undefined){
                setLogeado(false)
            } else if (usuario.id !== null && usuario.id !== undefined && usuario.id > 0
                    && usuario.nombre_apellidos!== null && usuario.nombre_apellidos!== undefined && usuario.nombre_apellidos !== ""
                    && usuario.password!== null && usuario.password!== undefined && usuario.password !== "") {
                // Buscar usuario en backend y si todo ok
                setLogeado(true)
                setUsuario({id: usuario.id, nombre_apellidos: usuario.nombre_apellidos, password: usuario.password})
            }
            else {
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
                <Route path="/eventos" element={<EventsCalendarPage 
                    logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} />} />
                <Route path="/holidays" element={<HolidaysPage 
                    logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} />} />
                <Route path="/login" element={<LoginPage 
                    logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} />} />
                <Route path="/signup" element={<SignUpPage 
                    logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} />} />
                <Route path="/profile" element={<ProfilePage 
                    logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} />} />
                <Route path="/editprofile" element={<EditProfilePage 
                    logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} />} />
                <Route path="/staffholidays" element={<HolidaysViewPage 
                    logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} />} />
                <Route path="/winterafternoons" element={<WinterAfternoonsPage 
                    logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} />} />
                <Route path="/contacts" element={<ContactsPage 
                    logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} />} />
                <Route path="/passwordrecovery" element={<PasswordRecoveryPage 
                    logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} />} />
                <Route path="/newpassword/:id" element={<NewPasswordPage 
                    logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} />} />
                <Route path="/entityevents" element={<EntityEventsCalendarPage 
                    logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} />} />
            </Routes>
        </BrowserRouter>  )
}

export default App;
