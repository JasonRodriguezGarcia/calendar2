import HolidaysViewComponent from '../components/HolidaysViewComponent';
import MainMenuComponent from '../components/MainMenuComponent';
import { Navigate } from 'react-router-dom';

const HolidaysViewPage = ({ logged, setLogged, user, setUser }) =>{

    // Si no está logeado se sale del componente
    if (!logged)    // con esta opción ni siquiera se muestra brevemente EventsCalendarComponent
        // Esto interrumpe el renderizado del componente y lo redirige inmediatamente. 
        // No se ejecuta código de más, ni se renderiza MainMenuComponent ni EventsCalendarComponent.
        return <Navigate to="/" replace /> // navigate(`/`, { replace: true }) solo puede ser usado en useEffect

    return (
        <>
            <MainMenuComponent logged={logged} setLogged={setLogged} user={user} setUser={setUser} />
            <HolidaysViewComponent logged={logged} user={user} />
        </>
    )
}

export default HolidaysViewPage