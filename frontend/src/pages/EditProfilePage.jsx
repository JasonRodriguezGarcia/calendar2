import MenuBarComponent from '../components/MenuBarComponent';
import { Navigate, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AppContext from '../context/AppContext';
import UsersCRUDComponent from '../components/UsersCRUDComponent';
import { Box, Toolbar } from '@mui/material';
// import imagenFondo from "../assets/images/erroak-page.jpeg";
import imagenFondo from "../assets/images/cuerda.jpg";

const EditProfilePage = () =>{
    const { logged } = useContext(AppContext)

    // Si no está logeado se sale del componente
    if (!logged)    // con esta opción ni siquiera se muestra brevemente el componente
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
            <Toolbar /> {/* Añadiendo Toolbar vacío justo después, para que actúe como "espaciador" */}
            <UsersCRUDComponent action="update" />
        </Box>
        </>
    )
}

export default EditProfilePage