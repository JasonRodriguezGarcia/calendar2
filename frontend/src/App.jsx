import './App.css';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigate, useNavigate } from 'react-router-dom';
import './utils/i18next/i18n';  // Path is relative to the current file in App.jsx
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
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
import UnderConstructionPage from './pages/UnderContructionPage';
import PaisVasco from "./assets/images/flags/paisvasco.png"
import Espana from "./assets/images/flags/espana.png"
import Francia from "./assets/images/flags/francia.png"
import ReinoUnido from "./assets/images/flags/reinounido.png"


const App = () => {
    const VITE_BACKEND_URL_RENDER = import.meta.env.VITE_BACKEND_URL_RENDER
    const [logeado, setLogeado] = useState(false)
    const [usuario, setUsuario] = useState({})
    const [token, setToken] = useState("")
    const languagesSelect = [
        { lang: 'es', icon: Espana },
        { lang: 'eu', icon: PaisVasco },
        // { lang: 'Fr', icon: Francia },
        // { lang: 'En', icon: ReinoUnido },
    ];
    const [selectedLanguage, setSelectedLanguage] = useState("")
    const { t, i18n } = useTranslation("menubar")

    useEffect(()=> {
        const checkLogeado = async () => {
            const response = await fetch(`${VITE_BACKEND_URL_RENDER}/api/v1/erroak/me`,
                {
                    method: 'GET',
                    credentials: 'include', // IMPORTANTE: esto permite usar la cookie
                    headers: {'Content-type': 'application/json; charset=UTF-8'},
                }
            )
            const data = await response.json()
            console.log("Data: ", data)
            if (data.message) {
                console.log("NO HAY TOKEN")
                setLogeado(false)
                return <Navigate to="/" replace />
            }
            const usuarioToken = data.token
            console.log("usuarioToken: ", usuarioToken)
            if (usuarioToken) {
                try {
                    const decoded = jwtDecode(usuarioToken);
                    console.log("decoded JWT: ", decoded)
                    const { usuarioID, emailUsuario, nombreapellidos } = decoded
                    console.log("Decodificado usuarioToken: ", decoded)
                        const usuario = {
                            id: usuarioID,
                            // password: resultado.password, // igual sobra ¿?¿?
                            nombre_apellidos: nombreapellidos,
                            emailUsuario: emailUsuario
                        }
                        setUsuario(usuario)
                        setLogeado(true)
                } catch (e) {
                    // logout();
                }

            } else {
                setLogeado(false)
            }
        }

        const checkIdioma = async () => {
            const usuarioIdioma = localStorage.getItem("idioma")
            // Las líneas comentadas ponían el idioma directamente en localStorage dentro de checkIdioma, 
            // y ahora el almacenamiento queda solo en el useEffect que observa selectedLanguage.
            // Esto mejora la sincronización y evita redundancias.
            if (usuarioIdioma && languagesSelect.some(languagesSelect => languagesSelect.lang === usuarioIdioma)) {
                setSelectedLanguage(usuarioIdioma)
                i18n.changeLanguage(usuarioIdioma)
            } else {
                const idiomaPorDefecto = languagesSelect[0].lang // lenguaje por defecto
                setSelectedLanguage(idiomaPorDefecto)
                i18n.changeLanguage(idiomaPorDefecto)
            }
        }
        
        checkLogeado()
        checkIdioma()
    }, [])

    useEffect(() => {
        if (selectedLanguage) {
            localStorage.setItem("idioma", selectedLanguage);
        }
    }, [selectedLanguage]);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage 
                    selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} languagesSelect={languagesSelect}
                    logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario}/>} />
                <Route path="/eventos" element={<EventsCalendarPage 
                    selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} languagesSelect={languagesSelect}
                    token={token} logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} />} />
                <Route path="/holidays" element={<HolidaysPage 
                    selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} languagesSelect={languagesSelect}
                    token={token} logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} />} />
                <Route path="/login" element={<LoginPage 
                    token={token} setToken={setToken}
                    selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} languagesSelect={languagesSelect}
                    logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} />} />
                <Route path="/signup" element={<SignUpPage 
                    selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} languagesSelect={languagesSelect}
                    token={token} logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} />} />
                <Route path="/profile" element={<ProfilePage 
                    selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} languagesSelect={languagesSelect}
                    token={token} logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} />} />
                <Route path="/editprofile" element={<EditProfilePage 
                    selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} languagesSelect={languagesSelect}
                    token={token} logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} />} />
                <Route path="/entityevents" element={<EntityEventsCalendarPage 
                    selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} languagesSelect={languagesSelect}
                    token={token} logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} />} />
                <Route path="/staffholidays" element={<HolidaysViewPage 
                    selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} languagesSelect={languagesSelect}
                    token={token} logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} />} />
                <Route path="/winterafternoons" element={<WinterAfternoonsPage 
                    selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} languagesSelect={languagesSelect}
                    token={token} logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} />} />
                <Route path="/contacts" element={<ContactsPage 
                    selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} languagesSelect={languagesSelect}
                    token={token} logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} />} />
                <Route path="/passwordrecovery" element={<PasswordRecoveryPage 
                    selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} languagesSelect={languagesSelect}
                    logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} />} />
                <Route path="/newpassword/:token" element={<NewPasswordPage 
                    selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} languagesSelect={languagesSelect}
                    logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} />} />
                <Route path="/about" element={<UnderConstructionPage
                    selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} languagesSelect={languagesSelect}
                    logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} />} />
            </Routes>
        </BrowserRouter>  )
}

export default App;
