import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AppContext from '../context/AppContext';
import EventsCalendarComponent from '../components/EventsCalendarComponent';
import MenuBarComponent from '../components/MenuBarComponent';

const EventsCalendarPage = () =>{
    const { logged } = useContext(AppContext)

    if (!logged)    // con esta opción ni siquiera se muestra brevemente EventsCalendarComponent
        // Esto interrumpe el renderizado del componente y lo redirige inmediatamente. 
        // No se ejecuta código de más, ni se renderiza MenuBarComponent ni EventsCalendarComponent.
        return <Navigate to="/" replace /> // navigate(`/`, { replace: true }) solo puede ser usado en useEffect

    return (
        <>
            <MenuBarComponent />
            <EventsCalendarComponent />
        </>
    )
}

export default EventsCalendarPage