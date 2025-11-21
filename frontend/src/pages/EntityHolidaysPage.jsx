import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AppContext from '../context/AppContext';
import EntityHolidaysComponent from '../components/EntityHolidaysComponent'
import MenuBarComponent from '../components/MenuBarComponent';

const EntityHolidaysPage = () =>{
    const { logged } = useContext(AppContext)

    // Si no está logeado se sale del componente
    if (!logged)    // con esta opción ni siquiera se muestra brevemente EventsCalendarComponent
        // Esto interrumpe el renderizado del componente y lo redirige inmediatamente. 
        // No se ejecuta código de más, ni se renderiza MenuBarComponent ni EventsCalendarComponent.
        return <Navigate to="/" replace /> // navigate(`/`, { replace: true }) solo puede ser usado en useEffect

    return (
        <>
            <MenuBarComponent />
            <EntityHolidaysComponent />
        </>
    )
}

export default EntityHolidaysPage