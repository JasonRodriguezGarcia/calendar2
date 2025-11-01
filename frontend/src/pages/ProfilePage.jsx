import MenuBarComponent from '../components/MenuBarComponent';
import { Navigate, useNavigate } from 'react-router-dom';
import UsersCRUDComponent from '../components/UsersCRUDComponent';
import { Box, Toolbar } from '@mui/material';
// import imagenFondo from "../assets/images/erroak-page.jpeg";
import imagenFondo from "../assets/images/cuerda.jpg";

const ProfilePage = ({ csrfToken, setCsrfToken, logged, setLogged, user, setUser, token, selectedLanguage, setSelectedLanguage, languagesSelect }) =>{

    // Si no está logeado se sale del componente
    if (!logged)    // con esta opción ni siquiera se muestra brevemente el siguiente componente
        // Esto interrumpe el renderizado del componente y lo redirige inmediatamente. 
        // No se ejecuta código de más, ni se renderiza MenuBarComponent ni el siguiente componente.
        return <Navigate to="/" replace /> // navigate(`/`, { replace: true }) solo puede ser usado en useEffect

    return (
        <>
        <Box sx={{
            backgroundImage: `url(${imagenFondo})`,
            backgroundSize: "cover",
            minHeight: "100vh",
            backgroundPosition: "top center",
        }}>
            <MenuBarComponent 
                csrfToken={csrfToken} setCsrfToken={setCsrfToken}
                selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} languagesSelect={languagesSelect}
                logged={logged} setLogged={setLogged} user={user} setUser={setUser} />
            <Toolbar /> {/* Añadiendo Toolbar vacío justo después, para que actúe como "espaciador" */}
            <UsersCRUDComponent 
                // csrfToken={csrfToken} setCsrfToken={setCsrfToken}
                selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage}
                logged={logged} setLogged={setLogged} user={user} setUser={setUser} action="read" token={token}/>
        </Box>
        </>
    )
}

export default ProfilePage