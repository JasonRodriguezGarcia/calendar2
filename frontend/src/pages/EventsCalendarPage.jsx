import EventsCalendarComponent from '../components/EventsCalendarComponent';
import MainMenuComponent from '../components/MenuBarComponent';
import { Navigate } from 'react-router-dom';

const EventsCalendarPage = ({ logged, setLogged, user, setUser, token, selectedLanguage, setSelectedLanguage, languagesSelect }) =>{
    if (!logged)    // con esta opción ni siquiera se muestra brevemente EventsCalendarComponent
        // Esto interrumpe el renderizado del componente y lo redirige inmediatamente. 
        // No se ejecuta código de más, ni se renderiza MainMenuComponent ni EventsCalendarComponent.
        return <Navigate to="/" replace /> // navigate(`/`, { replace: true }) solo puede ser usado en useEffect

    return (
        <>
            <MainMenuComponent 
                selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} languagesSelect={languagesSelect}
                logged={logged} setLogged={setLogged} user={user} setUser={setUser} />
            <EventsCalendarComponent 
                selectedLanguage={selectedLanguage}
                logged={logged} user={user} token={token} />
        </>
    )
}

export default EventsCalendarPage