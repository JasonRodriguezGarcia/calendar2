import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AppContext from '../context/AppContext';
import MenuBarComponent from '../components/MenuBarComponent';
import LoginComponent from '../components/LoginComponent';
import { Box } from '@mui/material';
// import imagenFondo from "../assets/images/erroak-page.jpeg";
import imagenFondo from "../assets/images/cuerda.jpg";

const LoginPage = () =>{
    const { logged } = useContext(AppContext)

    if (logged)    // con esta opción ni siquiera se muestra brevemente el siguiente Componente
        // Esto interrumpe el renderizado del componente y lo redirige inmediatamente. 
        // No se ejecuta código de más, ni se renderiza MenuBarComponent ni el siguiente Componente
        return <Navigate to="/" replace /> // navigate(`/`, { replace: true }) solo puede ser usado en useEffect

    return (
        <>
        <Box sx={{
            backgroundImage: `url(${imagenFondo})`,
            backgroundSize: "cover",
            minHeight: "100vh",
            backgroundPosition: "top center",
        }}>
            <MenuBarComponent />
            <LoginComponent />
        </Box>
        </>
    )
}

export default LoginPage