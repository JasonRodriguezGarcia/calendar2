import MenuBarComponent from '../components/MenuBarComponent';
import { Navigate, useNavigate } from 'react-router-dom';
import UsersCRUDComponent from '../components/UsersCRUDComponent';
import { Box, Toolbar } from '@mui/material';
// import imagenFondo from "../assets/images/erroak-page.jpeg";
import imagenFondo from "../assets/images/cuerda.jpg";

const SignUpPage = ({ logged, setLogged, user, setUser, token, selectedLanguage, setSelectedLanguage, languagesSelect }) =>{

    if (logged)    // con esta opción ni siquiera se muestra brevemente el componente
        // Esto interrumpe el renderizado del componente y lo redirige inmediatamente. 
        // No se ejecuta código de más, ni se renderiza MenuBarComponent ni el otro componente.
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
                selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} languagesSelect={languagesSelect}
                logged={logged} setLogged={setLogged} user={user} setUser={setUser} />
            <Toolbar /> {/* Añadiendo Toolbar vacío justo después, para que actúe como "espaciador" */}
            <UsersCRUDComponent 
                selectedLanguage={selectedLanguage}
                logged={logged} setLogged={setLogged} user={user} setUser={setUser} action="create" token={token}/>
        </Box>
        </>
    )
}

export default SignUpPage