import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
// import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { es } from 'date-fns/locale';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
// import addMonths from 'date-fns/addMonths';
import {
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
} from 'date-fns'; // necesario para calcular el rango visible del calendario y startOfWeek para indicar el día que comienza la semana
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';

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
    const [eventData, setEventData] = useState({});
    const [date, setDate] = useState(new Date());
    const [view, setView] = useState(Views.MONTH);      // POR DEFECTO VISTA SEMANA LABORAL
    const [selectedEvent, setSelectedEvent] = useState(null);
    // const [diasTotalVacaciones, setDiasTotalVacaciones] = useState(0)
    const [diasUsadosVacaciones, setDiasUsadosVacaciones] = useState(0)

    const fetchCheckHolidays = async () => {
        // Llamada a la cuenta del año en curso de las vacaciones acumuladas
        try {
            const response = await fetch(`${VITE_BACKEND_URL_RENDER}/api/v1/erroak/vacaciones/count/${user.id}/${date.getFullYear()}`,
                {
                    method: 'GET',
                    headers: {'Content-type': 'application/json; charset=UTF-8'}
                }
            )
            const dataHolidaysCount = await response.json();
            console.log("dataHolidaysCount: ", dataHolidaysCount)
            
            setDiasUsadosVacaciones(parseInt(dataHolidaysCount.count));
        } catch (error) {
            console.error("Error cargando vacaciones/count:", error);
        }

        // A BORRAR MÁS ADELANTE ¿?
        // Llamando a los datos de vacaciones del usuario del usuario según datos en su perfil 
        // try {
        //     const response = await fetch(`${VITE_BACKEND_URL_RENDER}/api/v1/erroak/holidays/${user.id}/${new Date().getFullYear()}`,
        //         {
        //             method: 'GET',
        //             headers: {'Content-type': 'application/json; charset=UTF-8'}
        //         }
        //     )
        //     const dataHolidays = await response.json();
        //     console.log("dataHolidays: ", dataHolidays)
            
        //     setDiasTotalVacaciones(dataHolidays.dias);
        // } catch (error) {
        //     console.error("Error cargando usuariosvacaciones:", error);
        // }
    }


    useEffect(()=> {
        // Conseguimos la fecha cuando cambie de mes con los botones Mes Ant. y Mes Sig.
        const month = date.getMonth() + 1; // 0 = Enero, así que +1
        const year = date.getFullYear();

        console.log("Cargando eventos para:", month, year);

        const getVisibleRange = (date) => {         // Para conseguir el rango visible del calendario
            const start = startOfWeek(startOfMonth(date), { weekStartsOn: 1 });
            const end = endOfWeek(endOfMonth(date), { weekStartsOn: 1 });
            return { start, end };
        };

        const fetchEventos = async () => {
// Esta línea llama a una función getVisibleRange(date) que devuelve el inicio y fin visibles del calendario para el mes actual (date).
//  start: normalmente será el lunes anterior al primer día del mes.
//  end: normalmente el domingo posterior al último día del mes.
// Esto asegura que el calendario muestra todos los días visibles, incluso si no pertenecen al mes exacto (como el 1 de agosto que 
//      aparece en julio).
            const { start, end } = getVisibleRange(date);
            // Llamando a backend para presentar los datos
            try {
                const response = await fetch(
                  `${VITE_BACKEND_URL_RENDER}/api/v1/erroak/vacaciones/${user.id}/${start.toISOString()}/${end.toISOString()}/uno`
                );
                const data = await response.json();
                const vacacionesData = data.map(vacacion => ({
                    ...vacacion,
                    start: new Date(vacacion.start),
                    end: new Date(vacacion.end),
                    cellColor: vacacion.cell_color,
                }));
                console.log("imprimo vacacionesData: ", vacacionesData)
                setEvents(vacacionesData);
            } catch (error) {
                console.error("Error cargando vacaciones:", error);
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
    const handleSelectSlot = async (slotInfo) => {
        // Esto ayuda a que el evento no se "expanda" a otras celdas y se mantenga en la celda seleccionada.
        const start = new Date(slotInfo.start)
        const end = new Date(start); // mismo día
        const day = start.getDay(); // 0 = domingo, 6 = sábado

        // Evitar que zona horaria te reste un día por la diferencia horaria
        start.setHours(12, 0, 0, 0);
        end.setHours(12, 0, 0, 0);

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
        const newVacacion = {
            event_id: newEventId, 
            start,
            end,
            cellColor: "red",
            usuario_id: user.id
        }
        // SOBRA? ¿?¿?¿?
        // const backendVacation = {...newVacacion}
        // backendVacation.start = start.toISOString()
        // backendVacation.end = end.toISOString()

        console.log("newVacacion: ", newVacacion)
        setEventData(newVacacion);
        setEvents([...events, newVacacion]);
// Ya que estamos comenzando y los campos start y end vienen de JavaScript, es recomiendable guardar las fechas en 
// formato UTC (como .toISOString() en JS) y usar TIMESTAMPTZ en PostgreSQL.
// Así evitaremos problemas futuros con zonas horarias.

// Llamada a backend para guardar
        try {
            // fetch vacaciones
            const response = await fetch(`${VITE_BACKEND_URL_RENDER}/api/v1/erroak/vacacion`,
                {
                    method: "POST",
                    headers: {'Content-type': 'application/json; charset=UTF-8'},
                    body: JSON.stringify(newVacacion)
                }
            )
            const data = await response.json()
            console.log("Respuesta backend vacacion post: ", data)
            if (data.result === "Vacacion ya existente") {
                setErrorMessage("Email ya existente")
                return
            }
        } catch (error) {
            // setError(error.message); // Handle errors
            console.log(error.message)
        } finally {
            // setLoading(false); // Set loading to false once data is fetched or error occurs
        }

        fetchCheckHolidays();

    }

    // Editando un evento ya creado que en este caso lo borra
    const handleSelectEvent = async (event) => {
        const filtered = events.filter(evento => evento.event_id != event.event_id)
        setEvents(filtered)
    // Llama a backend para borrar
        try {
            // fetch vacaciones
            const response = await fetch(`${VITE_BACKEND_URL_RENDER}/api/v1/erroak/vacacion/${event.event_id}`,
                {
                    method: "DELETE",
                    headers: {'Content-type': 'application/json; charset=UTF-8'},
                    // body: JSON.stringify(newVacacion)
                }
            )
            const data = await response.json()
            console.log("Respuesta backend vacacion delete: ", data)
            if (data.result === "Vacacion event_id NO existente") {
                setErrorMessage("Vacacion event_id NO existente")
                return
            }
        } catch (error) {
            // setError(error.message); // Handle errors
            console.log(error.message)
        } finally {
            // setLoading(false); // Set loading to false once data is fetched or error occurs
        }

        fetchCheckHolidays();

    }
    
    // Personalizando la visualizacion de eventos en el calendario, por defecto "start-end title"
    const CustomEvent = ({ event }) => {
        return (
            <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.8rem',
            }}>
                <strong>
                    {/* {event.cellActive ? "Vacaciones" : null} */}
                    V
                </strong>
            </div>
        )
    }

    return (
        // <div style={{ padding: 20 }}>
        <>
            <Toolbar />
            <h2>VACACIONES AÑO: {date.getFullYear()} (Dias de vac. en uso: {diasUsadosVacaciones})</h2>
            {/* <h2>VACACIONES (Dias restantes: {diasTotalVacaciones - diasUsadosVacaciones} - En uso: {diasUsadosVacaciones})</h2> */}
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
                    const backgroundColor = event?.cellColor || '#BDBDBD';
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
