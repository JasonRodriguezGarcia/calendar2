import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigate, useNavigate, Link } from 'react-router-dom';
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
    // const navigate = useNavigate();

    if (!usuario)
        <Navigate to="/" replace />
        
    useEffect(()=> {
        const checklogeado = () => {
            // const usuario = {
            //     id: 12,
            //     password: "1234567890",
            //     name: "Jason Rodríguez"
            // }
            // localStorage.setItem("usuario", JSON.stringify(usuario))
            // const userTest = JSON.parse(localStorage.getItem("usuario"))
            // console.log("usuarioTest: ", userTest)
            const usuario = JSON.parse(localStorage.getItem("usuario"))
            // const usuario_id = localStorage.getItem("id")
            // const nombre_apellidos = localStorage.getItem("user")
            // const password = localStorage.getItem("password")
            // console.log("Localstorage: ", usuario_id, "-", nombre_apellidos, " - ", password)
            // debugger
            console.log("usuario: ", usuario)
            if (usuario === null || usuario === undefined){
                setLogeado(false)
                // navigate(`/`, { replace: true }); // evita que el usuario regrese con back
            } else if (usuario.nombre_apellidos!== null && usuario.password!== null) {
                // lo busca en backend y si todo ok
                setLogeado(true)
                setUsuario({id: usuario.id, nombre_apellidos: usuario.nombre_apellidos, password: usuario.password})
            }
            else {
                setLogeado(false)
                // navigate(`/`, { replace: true }); // evita que el usuario regrese con back
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
                
                {/* <Route path="/" element={<DashboardPage />} />
                    <Route path="/descriptions/new" element={<DescriptionsFormInsertPage />} />
                    <Route path="/descriptions/view/:id" element={<DescriptionsView />} />
                    <Route path="/descriptions/view/:id/ia" element={<DescriptionsViewIA />} />
                    <Route path="/descriptions/edit/:id" element={<DescriptionsFormEditPage />} /> */}
            </Routes>
        </BrowserRouter>  );
}

export default App;
