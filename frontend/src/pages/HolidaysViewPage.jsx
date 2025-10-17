import HolidaysViewComponent from '../components/HolidaysViewComponent';
import MainMenuComponent from '../components/MenuBarComponent';
import { Navigate } from 'react-router-dom';

const HolidaysViewPage = ({ logged, setLogged, user, setUser, token, selectedLanguage, setSelectedLanguage, languagesSelect }) =>{

    // Si no está logeado se sale del componente
    if (!logged)    // con esta opción ni siquiera se muestra brevemente EventsCalendarComponent
        // Esto interrumpe el renderizado del componente y lo redirige inmediatamente. 
        // No se ejecuta código de más, ni se renderiza MainMenuComponent ni EventsCalendarComponent.
        return <Navigate to="/" replace /> // navigate(`/`, { replace: true }) solo puede ser usado en useEffect

    return (
        <>
            <MainMenuComponent 
                selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} languagesSelect={languagesSelect}
                logged={logged} setLogged={setLogged} user={user} setUser={setUser} />
            <HolidaysViewComponent 
                selectedLanguage={selectedLanguage}
                logged={logged} user={user} token={token} />
        </>
    )
}

export default HolidaysViewPage