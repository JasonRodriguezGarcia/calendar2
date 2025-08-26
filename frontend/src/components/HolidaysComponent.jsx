// TO DO
// - replantear espacios ya que contienen centro y espacio(despacho), crear tabla despachos

import { useEffect, useState } from 'react';
import { data, useNavigate } from 'react-router-dom';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
// import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { es } from 'date-fns/locale';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import addMonths from 'date-fns/addMonths';
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

const HolidaysComponent = ({ logged, setLogged, user } ) => {

    const navigate = useNavigate();
    const VITE_BACKEND_URL_RENDER = import.meta.env.VITE_BACKEND_URL_RENDER

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
    const [diasTotalVacaciones, setDiasTotalVacaciones] = useState(0)
    const [diasUsadosVacaciones, setDiasUsadosVacaciones] = useState(0)


    // useEffect(()=> {
    //     if (!user || !user.id) {
    //         console.warn("fetchEventos() abortado porque user.id es undefined");
    //         return;
    //     }
    //     fetchCheckHolidays()
    // }, [])

    useEffect(()=> {
        // Conseguimos la fecha cuando cambie de mes con los botones Mes Ant. y Mes Sig.
        const month = date.getMonth() + 1; // 0 = Enero, así que +1
        const year = date.getFullYear();

        console.log("Cargando eventos para:", month, year);

        // Simulación de llamada a API
        const fetchEventos = async () => {
            try {
                // Aquí iría tu llamada real, como:
                // const response = await fetch(`/api/eventos?mes=${month}&anio=${year}`);
                // const data = await response.json();

                // ⚠️ Simulamos delay y datos
                await new Promise(resolve => setTimeout(resolve, 500)); // Simula delay de red

                const data = [
                    {
                        event_id: Date.now(),
                        start: new Date(year, month - 1, 5),
                        end: new Date(year, month - 1, 5),
                        cellActive: true,
                        cellActiveColor: "red",
                        usuario_Id: user.id
                    },
                    {
                        event_id: Date.now() + 1,
                        start: new Date(year, month - 1, 12),
                        end: new Date(year, month - 1, 12),
                        cellActive: true,
                        cellActiveColor: "red",
                        usuario_Id: user.id
                    }
                ];

                setEvents(data);
            } catch (error) {
            console.error("Error cargando eventos:", error);
            }
        }

    const fetchCheckHolidays = async () => {
        // debugger
        // Llamando a los datos de vacaciones del usuario
        try {
            const response = await fetch(`${VITE_BACKEND_URL_RENDER}/api/v1/erroak/holidays/${user.id}/${new Date().getFullYear()}`,
                {
                    method: 'GET',
                    headers: {'Content-type': 'application/json; charset=UTF-8'}
                }
            )
            const dataHolidays = await response.json();
            console.log("dataHolidays: ", dataHolidays)
            debugger
            // await new Promise(resolve => setTimeout(resolve, 500)); // Simula delay de red
            
            setDiasTotalVacaciones(dataHolidays.dias);
        } catch (error) {
            console.error("Error cargando usuariosvacaciones:", error);
        }
    }
    
        if (!user || !user.id) {
            console.warn("fetchEventos() abortado porque user.id es undefined");
            return;
        }
        fetchEventos();
        fetchCheckHolidays();
    }, [date, user])

    // Esto se tiene que ejecutar detrás de los useEffect
    // Si no está logeado se sale del componente
    if (!logged) return null    // con esta opción ni siquiera se muestra brevemente EventsCalendarComponent
        // navigate("/")        // con esta opción se muestra brevemente y luego pasa a "/"

    const handleNavigate = (newDate) => { // Permite desplazar de fecha del calendario, parámetro newDate que es la fecha a la que se desplaza
        console.log("Navegando a nueva fecha:", newDate);
        setDate(newDate);
    };

    // Creando un nuevo evento
    // Activando la celda clickada
    const handleSelectSlot = (slotInfo) => {
        // let { start, end } = slotInfo;
        // Forzar que el evento solo dure 1 día (ignora end del rango)
        // Esto ayuda a que el evento no se "expanda" a otras celdas y se mantenga en la celda seleccionada.
        const start = new Date(slotInfo.start)
        const end = new Date(start); // mismo día
        const day = start.getDay(); // 0 = domingo, 6 = sábado

        // No permitir seleccionar sábados ni domingos
        if (day === 0 || day === 6) return;

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
        if (eventExists )
            return

        // Generando el evento
        const newEvento = {
            event_id: newEventId, 
            start,
            end,
            // end: new Date(start.getTime() + 60 * 60 * 1000), // 1 hora por defecto (¡importante!) TENER start y end
            cellActive: true,
            cellActiveColor: "red",
            usuario_Id: user.id,
        };
        // debugger
        setEventData(newEvento);
        setEvents([...events, newEvento]);
    };

    // Editando un evento ya creado que en este caso lo borra
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
                    fontSize: '2.8rem',
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
            <h2>VACACIONES (Dias restantes: {diasTotalVacaciones - diasUsadosVacaciones} - En uso: {diasUsadosVacaciones})</h2>
            {/* <DnDCalendar  // Permite D&D */} 
            {/* <div style={{ display: 'flex', gap: 20 }}> */}

            <Calendar
                localizer={localizer}
                culture='es'                                    // días mes, semana, día en español
                events={events}                                 // Personalizando la visualizacion de eventos en el calendario
                selectable="single"                             // habilita la seleccion de celdas SOLO DE 1 EN 1, SIN RANGOS
                views={{month: true}}                           // Solo vista mensual permitida
                onSelectSlot={handleSelectSlot}                 // Crear nuevo evento
                onSelectEvent={handleSelectEvent}               // Editar evento existente
                style={{ height: 700 }}
                // style={{ height: 600, width: '33%' }}
                date={date}
                view={view}
                onNavigate={handleNavigate}                     // Cuando el usuario cambia de mes, Calendar ejecuta handleNavigate(newDate).
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
                    next: 'Mes Sig.',
                    previous: 'Mes Ant.',
                    today: 'Hoy',
                    month: 'Mes',
                    //   week: 'Semana',                        // No se usa porque usamos work_week
                    //   work_week: "Semana",                   // ponemos el texto Semana para work_week, sino aparecería "Work week"
                    //   day: 'Día',
                    //   agenda: 'Agenda',
                }}
            />
        {/* </div> */}
        </>
    );
}

export default HolidaysComponent;
