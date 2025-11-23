import './App.css';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigate, useNavigate } from 'react-router-dom';
import './utils/i18next/i18n';  // Path is relative to the current file in App.jsx
// OJO useTranslation tiene su propio context, ni solo se usa la traducción pero no se harían cambios
// del lenguaje en el propio componente a lo MenuBarComponent, no haría falta pasar parámetros, ya que al usar en el 
// componente const { t, i18n } = useTranslation("passwordrecovery") se selecciona el lenguaje actual de App.jsx
import { useTranslation } from 'react-i18next'; 
import AppContext from './context/AppContext';
import EventsCalendarPage from './pages/EventsCalendarPage';
import HolidaysPage from './pages/HolidaysPage';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import EntityHolidaysPage from './pages/EntityHolidaysPage';
import WinterAfternoonsPage from './pages/WinterAfternoonsPage';
import ContactsPage from './pages/ContactsPage';
import PasswordRecoveryPage from './pages/PasswordRecoveryPage';
import NewPasswordPage from './pages/NewPasswordPage';
import EntityEventsCalendarPage from './pages/EntityEventsCalendarPage';
import AboutPage from './pages/AboutPage';
import AdminPage from './pages/AdminPage';
import TextHashPage from './pages/TextHashPage';
import PaisVasco from "./assets/images/flags/paisvasco.png"
import Espana from "./assets/images/flags/espana.png"
import Francia from "./assets/images/flags/francia.png"
import ReinoUnido from "./assets/images/flags/reinounido.png"

const App = () => {
    const VITE_BACKEND_URL_RENDER = import.meta.env.VITE_BACKEND_URL_RENDER
    const [logged, setLogged] = useState(false)
    const [user, setUser] = useState({})
    const [token, setToken] = useState("")
    const [csrfToken, setCsrfToken] = useState(null);
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
            // console.log("Data: ", data)
            if (data.message) {
                console.log("NO HAY TOKEN")
                setLogged(false)
                return <Navigate to="/" replace />
            }
            const usuarioToken = data.token
            console.log("usuarioToken: ", usuarioToken)
            if (usuarioToken) {
                try {
                    const decoded = jwtDecode(usuarioToken);
                    // console.log("decoded JWT: ", decoded)
                    const { usuarioID, emailUsuario, nombreapellidos, role } = decoded
                    console.log("Decodificado usuarioToken: ", decoded)
                        const usuario = {
                            id: usuarioID,
                            nombre_apellidos: nombreapellidos,
                            emailUsuario: emailUsuario,
                            role: role
                        }
                        setUser(usuario)
                        setLogged(true)
                } catch (e) {
                    // logout();
                }

            } else {
                setLogged(false)
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
        const fetchCsrfToken = async () => {
            try {
                const res = await fetch(`${VITE_BACKEND_URL_RENDER}/api/v1/erroak/csrf-token`, {
                    credentials: "include", // 🔑 importante para enviar/recibir cookies
                })
                const data = await res.json()
                // console.log("csrfToken de data: ", data.csrfToken)
                setCsrfToken(data.csrfToken)
            } catch (error) {
                console.error("Error al obtener CSRF token:", error);
            } finally {
                // setIsLoading(false);
            }
        }

        checkLogeado()
        checkIdioma()
        fetchCsrfToken()
    }, [])

    useEffect(() => {
        if (selectedLanguage) {
            localStorage.setItem("idioma", selectedLanguage);
        }
    }, [selectedLanguage]);

    return (
    // envolvemos en el provider los valores globales a usar
    <AppContext.Provider value={{
        csrfToken, setCsrfToken,
        token, setToken,
        selectedLanguage, setSelectedLanguage, languagesSelect,
        logged, setLogged, user, setUser,
    }} >  
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/eventos" element={<EventsCalendarPage />} />
                <Route path="/holidays" element={<HolidaysPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/editprofile" element={<EditProfilePage />} />
                <Route path="/changepassword" element={<ChangePasswordPage />} />
                <Route path="/entityevents" element={<EntityEventsCalendarPage />} />
                <Route path="/entityholidays" element={<EntityHolidaysPage />} />
                <Route path="/winterafternoons" element={<WinterAfternoonsPage />} />
                <Route path="/contacts" element={<ContactsPage />} />
                <Route path="/passwordrecovery" element={<PasswordRecoveryPage />} />
                <Route path="/newpassword/:token" element={<NewPasswordPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/hash" element={<TextHashPage />} />
            </Routes>
        </BrowserRouter>  
    </AppContext.Provider>
    )
}

export default App;
