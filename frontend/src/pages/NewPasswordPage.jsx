import { Navigate, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AppContext from '../context/AppContext';
import MenuBarComponent from '../components/MenuBarComponent';
import NewPasswordComponent from '../components/NewPasswordComponent';
import { Box } from '@mui/material';
// import imagenFondo from "../assets/images/erroak-page.jpeg";
import imagenFondo from "../assets/images/cuerda.jpg";

const NewPasswordPage = () =>{
    const { logged } = useContext(AppContext)

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
            <MenuBarComponent />
            <NewPasswordComponent />
        </Box>
        </>
    )
}

export default NewPasswordPage