import MainMenuComponent from '../components/MainMenuComponent';
import { Navigate, useNavigate } from 'react-router-dom';
import NewPasswordComponent from '../components/NewPasswordComponent';
import { Box } from '@mui/material';
import imagenFondo from "../assets/images/erroak-page.jpeg";

const NewPasswordPage = ({ logged, setLogged, user, setUser }) =>{

    if (logged)    // con esta opción ni siquiera se muestra brevemente el componente
        // Esto interrumpe el renderizado del componente y lo redirige inmediatamente. 
        // No se ejecuta código de más, ni se renderiza MainMenuComponent ni el otro componente.
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
            <NewPasswordComponent logged={logged} setLogged={setLogged} /> {/* user={usuario} setUser={setUsuario} /> */}
        </Box>
        </>
    )
}

export default NewPasswordPage