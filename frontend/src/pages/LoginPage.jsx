import { Navigate } from 'react-router-dom';
import MainMenuComponent from '../components/MainMenuComponent';
import LoginComponent from '../components/LoginComponent';
import { Box } from '@mui/material';
import imagenFondo from "../assets/images/erroak-page.jpeg";

const LoginPage = ({ logged, setLogged, user, setUser }) =>{

    if (logged)    // con esta opción ni siquiera se muestra brevemente el siguiente Componente
        // Esto interrumpe el renderizado del componente y lo redirige inmediatamente. 
        // No se ejecuta código de más, ni se renderiza MainMenuComponent ni el siguiente Componente
        return <Navigate to="/" replace /> // navigate(`/`, { replace: true }) solo puede ser usado en useEffect

    return (
        <>
        <Box sx={{
            backgroundImage: `url(${imagenFondo})`,
            backgroundSize: "cover",
            minHeight: "100vh",
            backgroundPosition: "top center",
        }}>
            <MainMenuComponent logged={logged} setLogged={setLogged} user={user} setUser={setUser} />
            <LoginComponent logged={logged} setLogged={setLogged} user={user} setUser={setUser} /> {/* user={usuario} setUser={setUsuario} /> */}
        </Box>
        </>
    )
}

export default LoginPage