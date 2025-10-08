import MainMenuComponent from '../components/MainMenuComponent';
import { Navigate, useNavigate } from 'react-router-dom';
import UsersCRUDComponent from '../components/UsersCRUDComponent';

import { Toolbar } from '@mui/material';

const ProfilePage = ({ logged, setLogged, user, setUser }) =>{

    // Si no está logeado se sale del componente
    if (!logged)    // con esta opción ni siquiera se muestra brevemente el siguiente componente
        // Esto interrumpe el renderizado del componente y lo redirige inmediatamente. 
        // No se ejecuta código de más, ni se renderiza MainMenuComponent ni el siguiente componente.
        return <Navigate to="/" replace /> // navigate(`/`, { replace: true }) solo puede ser usado en useEffect

    return (
        <>
            <MainMenuComponent logged={logged} setLogged={setLogged} user={user} setUser={setUser} />
            <Toolbar /> {/* Añadiendo Toolbar vacío justo después, para que actúe como "espaciador" */}
            <UsersCRUDComponent logged={logged} setLogged={setLogged} user={user} setUser={setUser} action="read" />
        </>
    )
}

export default ProfilePage