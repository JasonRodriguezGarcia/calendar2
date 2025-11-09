import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import AppContext from '../context/AppContext';
import { es, eu } from 'date-fns/locale';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
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
    Toolbar,
    Box, // en lugar de box usar Stack, que simplifica aún más la organización vertical.
    FormControl,
    FormLabel,
    Stack,
    Select,
    MenuItem,
    Typography
} from '@mui/material';
const locales = { es, eu };
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales,
});
const minYearSelect = 2025
const maxYearSelect = 2055
const yearsSelect = Array.from({ length: maxYearSelect - minYearSelect + 1 }, (elemento, index) => minYearSelect + index);
const monthsSelect = Array.from({ length: 12 }, (elemento, index) => index);

const HolidaysComponent = () => {

    const VITE_BACKEND_URL_RENDER = import.meta.env.VITE_BACKEND_URL_RENDER
    const { csrfToken, user, selectedLanguage } = useContext(AppContext)

    const [events, setEvents] = useState([]);
    const [eventData, setEventData] = useState({});
    const [date, setDate] = useState(new Date());
    const [view, setView] = useState(Views.MONTH);      // POR DEFECTO VISTA SEMANA LABORAL
    const [diasUsadosVacaciones, setDiasUsadosVacaciones] = useState(0)
    const { t, i18n } = useTranslation("holidays")
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

    console.log("selectedLanguage", selectedLanguage)

    const fetchCheckHolidays = async () => {
        // Llamada a la cuenta del año en curso de las vacaciones acumuladas
        try {
            const response = await fetch(`${VITE_BACKEND_URL_RENDER}/api/v1/erroak/vacaciones/count/${date.getFullYear()}`,
                {
                    method: 'GET',
                    credentials: 'include', // IMPORTANTE: esto permite usar la cookie
                    headers: {
                        // 'Authorization': `Bearer ${token}`,
                        'Content-type': 'application/json; charset=UTF-8',
                        'X-CSRF-Token': csrfToken,
                    }
                }
            )
            const dataHolidaysCount = await response.json()
            console.log("dataHolidaysCount: ", dataHolidaysCount)
            
            setDiasUsadosVacaciones(parseInt(dataHolidaysCount.count))
        } catch (error) {
            console.error("Error cargando vacaciones/count:", error)
        }
    }


    useEffect(()=> {
        // Conseguimos la fecha cuando cambie de mes con los botones Mes Ant. y Mes Sig.
        const month = date.getMonth() + 1 // 0 = Enero, así que +1
        const year = date.getFullYear()

        console.log("Cargando eventos para:", month, year)

        const getVisibleRange = (date) => {         // Para conseguir el rango visible del calendario
            const start = startOfWeek(startOfMonth(date), { weekStartsOn: 1 })
            const end = endOfWeek(endOfMonth(date), { weekStartsOn: 1 })
            return { start, end }
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
                  `${VITE_BACKEND_URL_RENDER}/api/v1/erroak/vacaciones/${start.toISOString()}/${end.toISOString()}/uno`,
                    {
                        method: 'GET',
                        credentials: 'include', // IMPORTANTE: esto permite usar la cookie
                        headers: {
                            // 'Authorization': `Bearer ${token}`,
                            'Content-type': 'application/json; charset=UTF-8',
                            'X-CSRF-Token': csrfToken,
                        }
                    }
                )
                const data = await response.json()
                const vacacionesData = data.map(vacacion => ({
                    ...vacacion,
                    start: new Date(vacacion.start),
                    end: new Date(vacacion.end),
                    cellColor: vacacion.cell_color,
                }))
                console.log("imprimo vacacionesData: ", vacacionesData)
                setEvents(vacacionesData)
            } catch (error) {
                console.error("Error cargando vacaciones:", error)
            }
        }

        if (!user || !user.id) {
            console.warn("fetchEventos() abortado porque user.id es undefined")
            return
        }
        fetchEventos()
        fetchCheckHolidays()
    }, [date, user])

    const handleNavigate = (newDate) => { // Permite desplazar de fecha del calendario, parámetro newDate que es la fecha a la que se desplaza
        console.log("Navegando a nueva fecha:", newDate)
        setDate(newDate)
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

        console.log("newVacacion: ", newVacacion)
        setEventData(newVacacion);
        setEvents([...events, newVacacion]);
// Ya que estamos comenzando y los campos start y end vienen de JavaScript, es recomendable guardar las fechas en 
// formato UTC (como .toISOString() en JS) y usar TIMESTAMPTZ en PostgreSQL.
// Así evitaremos problemas futuros con zonas horarias.

        try {
            // Llamada a backend para guardar
            // fetch vacaciones
            const response = await fetch(`${VITE_BACKEND_URL_RENDER}/api/v1/erroak/vacacion`,
                {
                    method: "POST",
                    credentials: 'include', // IMPORTANTE: esto permite usar la cookie
                    headers: {
                        // 'Authorization': `Bearer ${token}`,
                        'Content-type': 'application/json; charset=UTF-8',
                        'X-CSRF-Token': csrfToken,
                    },
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

    // Borrando evento viejo
    const handleSelectEvent = async (event) => {
        const filtered = events.filter(evento => evento.event_id != event.event_id)
        setEvents(filtered)
    // Llama a backend para borrar evento viejo
        try {
            // fetch vacaciones
            const response = await fetch(`${VITE_BACKEND_URL_RENDER}/api/v1/erroak/vacacion/${event.event_id}`,
                {
                    method: "DELETE",
                    credentials: 'include', // IMPORTANTE: esto permite usar la cookie
                    headers: {
                        // 'Authorization': `Bearer ${token}`,
                        'Content-type': 'application/json; charset=UTF-8',
                        'X-CSRF-Token': csrfToken,
                    },
                    // body: JSON.stringify(event)
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
            console.log(error)
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
                    {/* V */}
                    {selectedLanguage === "es"? "V" : "O"}
                </strong>
            </div>
        )
    }

    const handleSelectedYear = (e) => {
        setSelectedYear(e.target.value)
        const newSelectedYear = new Date(date)
        newSelectedYear.setFullYear(e.target.value)
        setDate(newSelectedYear)
    }

    return (
        <>
            <Toolbar />
            {/* <h2>{t("mainheader.text1")}: {date.getFullYear()} ({t("mainheader.text2")}: {diasUsadosVacaciones})</h2>
            <p>({t("mainheader.text3")})</p> */}
            <Stack justifyContent="space-between" alignItems="center" mb={0}
                sx={{
                    position: "fixed",  top: 60,
                    left: 0,
                    right: 0,
                    zIndex: 1100, // mayor que AppBar (por defecto en MUI)
                    backgroundColor: 'white',
                    // paddingY: 1,
                    // paddingX: 2,
                    borderBottom: '1px solid #ddd',
                    fontSize: {
                        xs: '8px',   // móviles
                        sm: '10px',  // tablets
                        md: '14px',  // escritorio
                    }
                }}
                    direction={{ 
                        xs: "column",   // móviles
                        sm: "row",  // tablets
                        md: "row",  // escritorio
                    }}
                    flexDirection={{ 
                        xs: "column-reverse",   // móviles
                        sm: "row",  // tablets
                        md: "row",  // escritorio
                    }}
                >
                <Box sx={{ flex: 1}}>
                    <FormControl>
                        <Stack direction="row" spacing={2} alignItems="center" justifyContent="left" mb={0}
                        >
                            <FormLabel htmlFor="selectselectedyear" 
                                sx={{ color: "black", minWidth: 50,
                                    fontSize: {
                                        xs: '10px',   // móviles
                                        sm: '14px',  // tablets
                                        md: '14px',  // escritorio
                                    }
                                }}
                            >
                                {t("mainheader.text1")}:</FormLabel>
                            <Select 
                                fullWidth
                                labelId="select-label-selectedyear"
                                id="selectselectedyear"
                                value={selectedYear}
                                onChange={handleSelectedYear}
                                variant='outlined'
                                sx= {{fontSize: {
                                    xs: '10px',   // móviles
                                    sm: '14px',  // tablets
                                    md: '14px',  // escritorio
                                }}}
                            >
                                {yearsSelect.map((year, index) => (
                                    <MenuItem key={index} value={year}
                                        // sx={{ fontWeight: 'bold' }}  // también negrita en opciones
                                    >
                                        {year}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Stack>
                    </FormControl>
                </Box>
                {/* <h2>EVENTOS AÑO: {date.getFullYear()}</h2> */}
                {/* <h2>{t("mainheader.text1")}: {date.getFullYear()}</h2> */}
                {/* <Typography variant="h4" sx={{my: "0.83em"}}> */}
                <Typography variant="h4" component="h4"
                    sx={{  
                        flex: 1,
                        fontSize: "1.5em",
                        my: "0.83em",
                        fontWeight: "bold",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center" 
                    }}>
                        {t("mainheader.text2")}: {date.getFullYear()} ({t("mainheader.text3")}: {diasUsadosVacaciones})
                </Typography>
                <Box sx={{ flex: 1}}>
                    <Box> </Box>
                </Box>
            </Stack>
            <Toolbar />
            <Toolbar sx={{ display:{
                    xs: "flex",   // móviles
                    sm: "none",  // tablets
                    md: "none",  // escritorio
            }}}/>
            <p>({t("mainheader.text4")})</p>

            <Calendar
                localizer={localizer}
                // culture='es'                                    // días mes, semana, día en español
                culture={selectedLanguage}                                    // días mes, semana, día en español
                events={events}                                 // Personalizando la visualizacion de eventos en el calendario
                selectable="single"                             // habilita la seleccion de celdas SOLO DE 1 EN 1, SIN RANGOS
                views={{month: true}}                           // Solo vista mensual permitida
                onSelectSlot={handleSelectSlot}                 // Crear nuevo evento
                onSelectEvent={handleSelectEvent}               // Editar evento existente
                // style={{ height: "calc(100vh - 150px)"}}
                style={{ minHeight: 500}}
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
                    // next: 'Mes Sig.',
                    // previous: 'Mes Ant.',
                    // today: 'Hoy',
                    // month: 'Mes',
                    next: t("calendar.next"),
                    previous: t("calendar.previous"),
                    today: t("calendar.today"),
                    month: t("calendar.month"),
                }}
            />
        </>
    );
}

export default HolidaysComponent;
