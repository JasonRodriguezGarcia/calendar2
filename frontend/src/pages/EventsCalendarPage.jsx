import { useState } from 'react';
import EventsCalendarComponent from '../components/EventsCalendarComponent';
import MainMenuComponent from '../components/MainMenuComponent';

const EventsCalendarPage = () =>{
    return (
        <>
            <MainMenuComponent />
            <EventsCalendarComponent />
        </>
    )
}

export default EventsCalendarPage