import ListingsWinterAfternoonsComponent from '../components/WinterAfternoonsComponent';
import MainMenuComponent from '../components/MenuBarComponent';
import { Navigate, useNavigate } from 'react-router-dom';

const WinterAfternoonsPage = ({ logged, setLogged, user, setUser, token, selectedLanguage, setSelectedLanguage, languagesSelect }) =>{

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
            <ListingsWinterAfternoonsComponent 
                selectedLanguage={selectedLanguage}
                logged={logged} user={user} token={token}/>
        </>
    )
}

export default WinterAfternoonsPage