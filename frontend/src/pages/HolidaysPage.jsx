import HolidaysComponent from '../components/HolidaysComponent';
import MainMenuComponent from '../components/MainMenuComponent';
import { Navigate } from 'react-router-dom';

const HolidaysPage = ({ logged, setLogged, user, setUser, token }) =>{

    // Si no está logeado se sale del componente
    if (!logged)    // con esta opción ni siquiera se muestra brevemente EventsCalendarComponent
        // Esto interrumpe el renderizado del componente y lo redirige inmediatamente. 
        // No se ejecuta código de más, ni se renderiza MainMenuComponent ni EventsCalendarComponent.
        return <Navigate to="/" replace />

    return (
        <>
            <MainMenuComponent logged={logged} setLogged={setLogged} user={user} setUser={setUser} />
            <HolidaysComponent logged={logged} user={user} token={token}/>
        </>
    )
}

export default HolidaysPage