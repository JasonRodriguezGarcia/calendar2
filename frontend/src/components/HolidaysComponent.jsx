// TO DO
// - replantear espacios ya que contienen centro y espacio(despacho), crear tabla despachos

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
// import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { es } from 'date-fns/locale';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { usuarios, espacios, programas } from "./Data"

// MUI
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControl, 
  InputLabel,
  Select,
  Stack,
  Toolbar, // en lugar de box usar Stack, que simplifica aún más la organización vertical.

} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es as localeEs } from 'date-fns/locale';

// const DnDCalendar = withDragAndDrop(Calendar);
const locales = { es };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const HolidaysComponent = ({ logged, setLogged } ) => {
    const navigate = useNavigate();
    
    const [events, setEvents] = useState([]);
    const [eventData, setEventData] = useState({
        event_id: Date.now(), 
        start: new Date(),
        end: new Date(),
        // end: new Date(start.getTime() + 60 * 60 * 1000), // 1 hora por defecto (¡importante!) TENER start y end        cellActive: false,
        cellActiveColor: "red",
        usuario_Id: '',
    });
    const [date, setDate] = useState(new Date());
    const [view, setView] = useState(Views.MONTH);      // POR DEFECTO VISTA SEMANA LABORAL
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Si no está logeado se sale del componente
    if (!logged) return null    // con esta opción ni siquiera se muestra brevemente EventsCalendarComponent
        // navigate("/")        // con esta opción se muestra brevemente y luego pasa a "/"

    const handleNavigate = (newDate) => { // Permite desplazar de fecha del calendario
        setDate(newDate);
    };


    // Creando un nuevo evento
    // Activando la celda clickada
    const handleSelectSlot = (slotInfo) => {
        let { start, end } = slotInfo;

        // ✅ Generar un ID único combinando timestamp + aleatorio
        let newEventId = Date.now() + Math.floor(Math.random() * 100000);

        // Asegurarse que no se repita ID
        while (events.some(e => e.event_id === newEventId)) {
            newEventId = Date.now() + Math.floor(Math.random() * 100000);
        }
        const eventExists = events.find(evento => 
            evento.start.getDate() === start.getDate() &&
            evento.start.getMonth() === start.getMonth() &&
            evento.start.getFullYear() === start.getFullYear()
        )
        if (eventExists != undefined )
            return

        // Generando el evento
        const newEvento = {
            event_id: newEventId, 
            start,
            end,
            // end: new Date(start.getTime() + 60 * 60 * 1000), // 1 hora por defecto (¡importante!) TENER start y end
            cellActive: true,
            cellActiveColor: "red",
            usuario_Id: '',
        };
        debugger
        setEventData(newEvento);
        setEvents([...events, newEvento]);
    };

    // Editando un evento ya creado
    // Borrando un evento ya creado
    const handleSelectEvent = (event) => {
        const filtered = events.filter(evento => evento.event_id != event.event_id)
        setEvents(filtered)
    };

    
    // Personalizando la visualizacion de eventos en el calendario, por defecto "start-end title"
    const CustomEvent = ({ event }) => {

        return (
            <div style={{
                // color: event.cellActiveColor
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9rem',
            }}>
                <strong>
                    {event.cellActive ? "Vacaciones" : null}
                </strong>
                
            </div>
        );
    };

    return (
        // <div style={{ padding: 20 }}>
        <>
            <Toolbar />
            <h2>VACACIONES</h2>
            {/* <DnDCalendar  // Permite D&D */} 
            <Calendar
                localizer={localizer}
                culture='es'                                    // días mes, semana, día en español
                events={events}                                 // Personalizando la visualizacion de eventos en el calendario
                selectable                                      // habilita la seleccion de celdas
                views={{month: true}}                           // Solo vista mensual permitida
                onSelectSlot={handleSelectSlot}                 // Crear nuevo evento
                onSelectEvent={handleSelectEvent}               // Editar evento existente
                style={{ height: 700 }}
                date={date}
                view={view}
                onNavigate={handleNavigate}
                components={{
                    event: CustomEvent
                }}
                formats={{
                    eventTimeRangeFormat: () => '',             // Oculta el "start - end" de la visualizacion de eventos que aparece por defecto
                    weekdayFormat: (date, culture, localizer) =>
                    localizer.format(date, 'eeee', culture), // 'lunes', 'martes', etc.
                }}

                eventPropGetter={(event) => {                   // Estilo visual de cada evento
                    const backgroundColor = event?.cellActiveColor || '#BDBDBD';
                    return {    // retornando un style por eso el return tiene {} en lugar de ()
                        style: {
                            backgroundColor,
                            color: 'white',
                            fontWeight: 'bold',
                        }
                    }
                }}
                messages={{
                next: 'Sig.',
                previous: 'Ant.',
                today: 'Hoy',
                month: 'Mes',
                //   week: 'Semana',                            // No se usa porque usamos work_week
                //   work_week: "Semana",                          // ponemos el texto Semana para work_week, sino aparecería "Work week"
                //   day: 'Día',
                //   agenda: 'Agenda',
                }}
            />
        {/* </div> */}
        </>
    );
}

export default HolidaysComponent;
