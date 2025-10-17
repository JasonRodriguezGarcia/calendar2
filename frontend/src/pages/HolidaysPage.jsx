import HolidaysComponent from '../components/HolidaysComponent';
import MenuBarComponent from '../components/MenuBarComponent';
import { Navigate } from 'react-router-dom';

const HolidaysPage = ({ logged, setLogged, user, setUser, token, selectedLanguage, setSelectedLanguage, languagesSelect }) =>{

    // Si no está logeado se sale del componente
    if (!logged)    // con esta opción ni siquiera se muestra brevemente EventsCalendarComponent
        // Esto interrumpe el renderizado del componente y lo redirige inmediatamente. 
        // No se ejecuta código de más, ni se renderiza MenuBarComponent ni EventsCalendarComponent.
        return <Navigate to="/" replace />

    return (
        <>
            <MenuBarComponent 
                selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} languagesSelect={languagesSelect}
                logged={logged} setLogged={setLogged} user={user} setUser={setUser} />
            <HolidaysComponent 
                selectedLanguage={selectedLanguage} 
                logged={logged} user={user} token={token}/>
        </>
    )
}

export default HolidaysPage