import EventsCalendarComponent from '../components/EventsCalendarComponent';
import MenuBarComponent from '../components/MenuBarComponent';
import { Navigate } from 'react-router-dom';

const EventsCalendarPage = ({ csrfToken, setCsrfToken, logged, setLogged, user, setUser, token, selectedLanguage, setSelectedLanguage, languagesSelect }) =>{
    if (!logged)    // con esta opción ni siquiera se muestra brevemente EventsCalendarComponent
        // Esto interrumpe el renderizado del componente y lo redirige inmediatamente. 
        // No se ejecuta código de más, ni se renderiza MenuBarComponent ni EventsCalendarComponent.
        return <Navigate to="/" replace /> // navigate(`/`, { replace: true }) solo puede ser usado en useEffect

    return (
        <>
            <MenuBarComponent 
                csrfToken={csrfToken} setCsrfToken={setCsrfToken}
                selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} languagesSelect={languagesSelect}
                logged={logged} setLogged={setLogged} user={user} setUser={setUser} />
            <EventsCalendarComponent 
                csrfToken={csrfToken} setCsrfToken={setCsrfToken}
                selectedLanguage={selectedLanguage}
                logged={logged} user={user} token={token} />
        </>
    )
}

export default EventsCalendarPage