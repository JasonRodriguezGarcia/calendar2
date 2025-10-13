import EventsCalendarComponent from '../components/EventsCalendarComponent';
import MainMenuComponent from '../components/MainMenuComponent';
import { Navigate } from 'react-router-dom';

const EventsCalendarPage = ({ logged, setLogged, user, setUser, token }) =>{
    if (!logged)    // con esta opción ni siquiera se muestra brevemente EventsCalendarComponent
        // Esto interrumpe el renderizado del componente y lo redirige inmediatamente. 
        // No se ejecuta código de más, ni se renderiza MainMenuComponent ni EventsCalendarComponent.
        return <Navigate to="/" replace /> // navigate(`/`, { replace: true }) solo puede ser usado en useEffect

    return (
        <>
            <MainMenuComponent logged={logged} setLogged={setLogged} user={user} setUser={setUser} />
            <EventsCalendarComponent logged={logged} user={user} token={token} />
        </>
    )
}

export default EventsCalendarPage