import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
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
import { GlobalStyles } from '@mui/material'; // para cambiar el estilo del día y permita cambiar de color al pasar raton por encima

// MUI
import {
    Box,
    Checkbox,
    Button,
    MenuItem,
    FormControl, 
    Grid,
    FormLabel,
    InputLabel,
    ListItemText,
    Select,
    Stack,
    Toolbar, // en lugar de box usar Stack, que simplifica aún más la organización vertical.
    Typography,
} from '@mui/material';
import { colorOptions } from '../utils/EventColors';

const DnDCalendar = withDragAndDrop(Calendar);
const locales = { es, eu };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const saltosTiempo = 60 // step={15}
const saltosHora = 1 // timeslots={4}
const horaMinima = new Date(1970, 1, 1, 7, 0) // Limitación hora mínima
const horaMaxima =new Date(1970, 1, 1, 21, 0) // Limitacion hora máxima
const minYearSelect = 2025
const maxYearSelect = 2055
const yearsSelect = Array.from({ length: maxYearSelect - minYearSelect + 1 }, (elemento, index) => minYearSelect + index);
const monthsSelect = Array.from({ length: 12 }, (elemento, index) => index);

const EntityEventsCalendarComponent = () => {
    
    const VITE_BACKEND_URL_RENDER = import.meta.env.VITE_BACKEND_URL_RENDER
    const { t, i18n } = useTranslation("entityevents")
    const { csrfToken, user, selectedLanguage } = useContext(AppContext)
    
    const [events, setEvents] = useState([])
    const [allEvents, setAllEvents] = useState([])
    const [date, setDate] = useState(new Date())
    const [view, setView] = useState(Views.MONTH)     // POR DEFECTO VISTA MES
    const [usuarios, setUsuarios] = useState([])
    const [espacios, setEspacios] = useState([])
    const [programas, setProgramas] = useState([])
    const [errorMessage, setErrorMessage] = useState("") // SE USA PERO NO SE MUESTRA, SE PODRÍA BORRAR
    const [selectedUsuarios, setSelectedUsuarios] = useState([])
    const [selectedProgramas, setSelectedProgramas] = useState([])
    const [selectedEspacios, setSelectedEspacios] = useState([])
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

    useEffect(() => {
        const getNewEventFormData = async () => {
            try {
                // fetch for getting horarios & turnos data
                const response = await fetch(
                    `${VITE_BACKEND_URL_RENDER}/api/v1/erroak/getNewEventFormData`,
                    {
                        // method: 'GET',
                        method: 'POST', // CAMBIADO A POST PARA PODER EJECUTAR EN BACKEND CSRFTOKEN PARA MAYOR SEGURIDAD
                        credentials: 'include', // IMPORTANTE: esto permite usar la cookie
                        headers: {
                            // 'Authorization': `Bearer ${token}`,
                            'Content-type': 'application/json; charset=UTF-8',
                            'X-CSRF-Token': csrfToken,
                        },
                    }
                )
                const data = await response.json()
                console.log("Respuesta backend: ", data)
                if (data.result === "Error. No hay datos en Usuarios") {
                    setErrorMessage("Faltan Datos en usuarios")
                    return
                } else {
                    setUsuarios(data.usuarios)
                    setEspacios(data.espacios)
                    setProgramas(data.programas)
                }
                    
            } catch (error) {
                console.log(error.message)
            } finally {
                // setLoading(false); // Set loading to false once data is fetched or error occurs
            }
        }

        // Solo continuar si user.id es válido, ya que se llama 2 veces a user
        // 1. user inicia como {} (estado vacío)
        // const [usuario, setUsuario] = useState({})
        // 2. Después, se actualiza con datos reales desde el localStorage en EditProfilePage
        // setUsuario({ id: usuario_id, nombre_apellidos, password })
        // Ese cambio dispara nuevamente el useEffect de SignUpComponent, ya que user cambió. Así:
        // Primera ejecución de useEffect: user.id es undefined → no se hace fetch, pero ya se ejecutó.
        // Segunda ejecución: user.id ya tiene valor → se hace el fetch.
        // ¿Qué hace esta condición?
            // Parte	¿Qué verifica?	                ¿Cuándo es verdadera?
            // !user	¿user es null/undefined/etc?	Cuando user = null, undefined, etc.
            // !user.id	¿id está ausente o es falsy?	Cuando user = {} o user = { id: undefined }
        if (!user || !user.id) {
            console.warn("getData() abortado porque user.id es undefined");
            return;
        }

        getNewEventFormData()
    }, [date, user]) 

    useEffect(() => {
        console.log("Eventos: ", events)
    }, [events])

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
                    `${VITE_BACKEND_URL_RENDER}/api/v1/erroak/eventos/${start.toISOString()}/${end.toISOString()}`,
                    {
                        method: "GET",
                        credentials: 'include', // IMPORTANTE: esto permite usar la cookie
                        headers: {
                            // 'Authorization': `Bearer ${token}`,
                            'Content-type': 'application/json; charset=UTF-8'
                        },
                    }
                )
                const data = await response.json()
                const eventosData = data.map(evento => ({
                    ...evento,
                    start: new Date(evento.start),
                    end: new Date(evento.end),
                    color: evento.color,
                }));
                console.log("imprimo eventosData: ", eventosData)
                setAllEvents(eventosData)
                setEvents(filterEvents(eventosData, selectedUsuarios, selectedProgramas, selectedEspacios))

            } catch (error) {
                console.error("Error cargando eventos:", error)
            }
        }

        if (!user || !user.id) {
            console.warn("fetchEventos() abortado porque user.id es undefined")
            return
        }
        fetchEventos()
    }, [date, user])

    const handleNavigate = (newDate, view, action) => { // Permite desplazar de fecha del calendario
        setDate(newDate)
        if (action === "TODAY") {
            setSelectedYear(new Date(newDate).getFullYear())
        }
    }

    const handleViewChange = (newView) => { // Permite cambiar la vista del calendario
        setEvents(filterEvents(allEvents, selectedUsuarios, selectedProgramas, selectedEspacios))
        if (newView === 'week') {
            setView('work_week') // Forzamos semana laboral
        } else {
            setView(newView)
        }
    }

    // Personalizando la visualizacion de eventos en el calendario, por defecto "start-end title"
    const CustomEvent = ({ event }) => {
        const usuario = usuarios.find(p => p.usuario_id === event.usuario_id)
        const espacio = espacios.find(p => p.espacio_id === event.espacio_id)
        const programa = programas.find(p => p.programa_id === event.programa_id)

        return (
            <div>
                {programa?.descripcion.slice(0 , 4) || 'Sin nombre'}
                - <strong>{usuario?.nombre_apellidos || 'Sin nombre'}</strong> 
                - {espacio?.descripcion || 'Sin nombre'}
            </div>
        );
    };

    const handleChangeSelectedValues = (selection, event) => {
        const valorTMP = event.target.value
        // Guardamos los valores actuales de los Select
        let valoresUsuarios = selectedUsuarios
        let valoresProgramas = selectedProgramas
        let valoresEspacios = selectedEspacios
        // Dependiendo de cual sea llamado lo guardamos en su Select
        // Además actualizamos su valor en Valores
        switch (selection) {
            case "usuarios":
                setSelectedUsuarios(valorTMP)
                valoresUsuarios = valorTMP
                break
            case "programas":
                setSelectedProgramas(valorTMP)
                valoresProgramas = valorTMP
                break
            case "espacios":
                setSelectedEspacios(valorTMP)
                valoresEspacios = valorTMP
                break
            default:
                break
        }
        
        // Llamamos a filterEvents para filtrar por los valores de los Select
        // Por el mero hecho de pasar por aqui, es que se ha seleccionado un Select
        setEvents(filterEvents(allEvents, valoresUsuarios, valoresProgramas, valoresEspacios))
    }
    
    const filterEvents = (datos, usuarios, programas, espacios) => {
        // Aplicar todos los filtros que tengan valores
        const eventosFiltrados = datos.filter(evento => {
            const cumpleUsuario = usuarios.length === 0 || usuarios.includes(evento.usuario_id)
            const cumplePrograma = programas.length === 0 || programas.includes(evento.programa_id)
            const cumpleEspacio = espacios.length === 0 || espacios.includes(evento.espacio_id)

            return cumpleUsuario && cumplePrograma && cumpleEspacio
        })
        return eventosFiltrados
    }

    const handleResetFilters = () => {
        console.log("Reiniciando filtros ...")
        setSelectedUsuarios([])
        setSelectedProgramas([])
        setSelectedEspacios([])
        setEvents(allEvents)
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
        {/* <h2>{t("mainheader.text1")}: {date.getFullYear()}</h2> */}
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
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="left"
                    >
                        <FormLabel htmlFor="selectselectedyear" sx={{ color: "black", minWidth: 50,
                                fontSize: {
                                    xs: '10px',   // móviles
                                    sm: '14px',  // tablets
                                    md: '14px',  // escritorio
                                }
                            }}
                        >
                            {t("mainheader.text1")}:
                        </FormLabel>
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
                    {t("mainheader.text2")}: {date.getFullYear()}
            </Typography>
            <Box sx={{ flex: 1}}>
                <Box> </Box>
            </Box>
        </Stack>
        <Toolbar />
        {/* OCULTANDO LA LÍNEA SUPERIOR (NO NECESARIA) DE EVENTOS QUE DURAN VARIOS DÍAS */}
        {(view === 'work_week' || view === 'day') && (
        <style>
            {`
            .rbc-allday-cell,
            .rbc-allday-header {
                display: none !important;
            }
            `}
        </style>
        )}
        {/* <Calendar */}
        <GlobalStyles styles={{ // Cambiando el estilo del número de día para que al pasar el ratón por encima cambie de color
                '.rbc-month-view .rbc-date-cell > *:first-of-type:hover': {
                    backgroundColor: 'grey',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                }
            }} 
        />
    <Box sx={{ flexGrow: 1 }}>  {/* equivale a width: "100%" */}
        <Grid container spacing={1} 
            direction={{
                xs: "column",
                md: "row",
            }}
        >
            <Grid size={{ xs: 8, md: 3 }} mt={1}>
                <h2>{t("grid.header.text1")}</h2>
                <Button onClick={handleResetFilters} variant="contained">{t("grid.button1text")}</Button>
                <Stack spacing={1} m={3}> 
                    <FormControl fullWidth margin='dense'>
                        <InputLabel id="select-label-usuarios_id">{t("stack1formcontrol.inputlabel")}</InputLabel>
                        <Select
                            labelId="select-label-usuarios_id"
                            id="select-usuarios_id"
                            multiple
                            label={t("stack1formcontrol.selectlabel")}
                            value={selectedUsuarios}
                            onChange={(e)=> handleChangeSelectedValues("usuarios", e)}
                            // renderValue indica cómo queremos mostrar esos datos en este caso un array selectedUsuarios
                            // CON OBJETOS que es seleccionado como "selected"
                            // Aquí usamos el array de objetos para mostrar solo los nombre_apellidos
                            renderValue={(selected) => 
                                usuarios
                                    .filter(u => selected.includes(u.usuario_id))
                                    .map(u=> u.nombre_apellidos)
                                    .join(", ")
                            }
                        >
                            {usuarios.map((usuario) => (
                                <MenuItem key={usuario.usuario_id} value={usuario.usuario_id}>
                                    {/* revisar si ese objeto está en el array por su usuario_id */}
                                    {/* si fuese un array normal usaríamos selectedUsuarios.includes() */}
                                    <Checkbox checked={selectedUsuarios.includes(usuario.usuario_id)} />
                                    <ListItemText primary={usuario.nombre_apellidos} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>
                <Stack spacing={1} m={3}> 
                    <FormControl fullWidth margin='dense'>
                        <InputLabel id="select-label-programas_id">{t("stack2formcontrol.inputlabel")}</InputLabel>
                        <Select
                            labelId="select-label-programas_id"
                            id="select-programas_id"
                            multiple
                            label={t("stack2formcontrol.selectlabel")}
                            value={selectedProgramas}
                            onChange={(e)=> handleChangeSelectedValues("programas", e)}
                            // input={<OutlinedInput label="Tag" />} // Estilo borde exterior
                            // renderValue indica cómo queremos mostrar esos datos en este caso un array selectedUsuarios
                            // CON OBJETOS que es seleccionado como "selected"
                            // Aquí usamos el array de objetos para mostrar solo los nombre_apellidos
                            renderValue={(selected) => 
                                // selected.map((user) => user.nombre_apellidos).join(', ')
                                programas
                                    .filter(u => selected.includes(u.programa_id))
                                    .map(u=> u.descripcion)
                                    .join(", ")
                            }
                        >
                            {programas.map((programa) => (
                                <MenuItem key={programa.programa_id} value={programa.programa_id}>
                                    {/* revisar si ese objeto está en el array por su usuario_id */}
                                    {/* si fuese un array normal usaríamos selectedUsuarios.includes() */}
                                    {/* <Checkbox checked={selectedUsuarios.some(user => user.usuario_id === usuario.usuario_id)} /> */}
                                    <Checkbox checked={selectedProgramas.includes(programa.programa_id)} />
                                    <ListItemText primary={programa.descripcion} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>
                <Stack spacing={1} m={3}> 
                    <FormControl fullWidth margin='dense'>
                        <InputLabel id="select-label-espacios_id">{t("stack3formcontrol.inputlabel")}</InputLabel>
                        <Select
                            labelId="select-label-espacios_id"
                            id="select-espacios_id"
                            multiple
                            label={t("stack3formcontrol.selectlabel")}
                            value={selectedEspacios}
                            onChange={(e)=> handleChangeSelectedValues("espacios", e)}
                            // input={<OutlinedInput label="Tag" />} // Estilo borde exterior
                            // renderValue indica cómo queremos mostrar esos datos en este caso un array selectedUsuarios
                            // CON OBJETOS que es seleccionado como "selected"
                            // Aquí usamos el array de objetos para mostrar solo los nombre_apellidos
                            renderValue={(selected) => 
                                // selected.map((user) => user.nombre_apellidos).join(', ')
                                espacios
                                    .filter(u => selected.includes(u.espacio_id))
                                    .map(u=> u.descripcion)
                                    .join(", ")
                            }
                        >
                            {espacios.map((espacio) => (
                                <MenuItem key={espacio.espacio_id} value={espacio.espacio_id}>
                                    {/* revisar si ese objeto está en el array por su usuario_id */}
                                    {/* si fuese un array normal usaríamos selectedUsuarios.includes() */}
                                    {/* <Checkbox checked={selectedUsuarios.some(user => user.usuario_id === usuario.usuario_id)} /> */}
                                    <Checkbox checked={selectedEspacios.includes(espacio.espacio_id)} />
                                    <ListItemText primary={espacio.descripcion} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 9 }}>
                {/* <DnDCalendar */}
                <Calendar
                    style={{ minHeight: 1000 }} 
                    localizer={localizer}
                    // culture='es'                                 // días mes, semana, día en español
                    culture={selectedLanguage}                      // días mes, semana, día en el idioma selecionado
                    events={events}                                 // Personalizando la visualizacion de eventos en el calendario usando el array events
                    // selectable                                   // habilita la seleccion de celdas
                    views={['month', 'work_week', 'day']}           // sin agenda ya que filtra mal¿?
                    onView={handleViewChange}
                    defaultView='month'
                    step={saltosTiempo}
                    timeslots={saltosHora}
                    min={horaMinima}                                // Limitación hora mínima
                    max={horaMaxima}                                // Limitacion hora máxima
                    date={date}
                    view={view}
                    onNavigate={handleNavigate}
                    components={{
                        event: CustomEvent
                    }}
                    popup
                    formats={{
                        eventTimeRangeFormat: () => '',             // Oculta el "start - end" de la visualizacion de eventos que aparece por defecto
                        weekdayFormat: (date, culture, localizer) =>
                        localizer.format(date, 'eeee', culture), // 'lunes', 'martes', etc.
                    }}
                    tooltipAccessor={(event) => {                   // Muestra "start - end" y otros al pasar el cursor por encima
                        const programa = programas.find(p => p.programa_id === event.programa_id);
                        const usuario = usuarios.find(p => p.usuario_id === event.usuario_id);
                        const espacio = espacios.find(p => p.espacio_id === event.espacio_id);
                        // si ponemos usuario?.nombre_apellidos y no usuario.nombre_apellidos, en caso de que programa no exista, obtenemos un crash con error en ejecución
                        // Pero si ponemos usuario?.nombre_apellidos y no existe obtenemos un undefined y el programa sigue su curso
                        return `${programa?.descripcion || 'Sin programa'} -`+
                                `${usuario?.nombre_apellidos || 'Sin nombre'} -`+
                                `${espacio?.descripcion || 'Sin nombre'} -`+
                                `${format(event.start, 'HH:mm')} - ${format(event.end, 'HH:mm')}`;
                    }}

                    eventPropGetter={(event) => {                   // Estilo visual de cada evento
                        const user = usuarios.find(u => u.usuario_id === event.usuario_id);
                        const backgroundColor = colorOptions[user?.color] || '#BDBDBD';
                        return {    // retornando un style por eso el return tiene {} en lugar de ()
                            style: {
                                backgroundColor,
                                color: 'white',
                                borderRadius: '4px',
                                border: '1px solid black',
                                padding: '2px',
                                fontSize: ".8rem"
                            }
                        }
                    }}
                    messages={{
                        // next: 'Sig.',
                        // previous: 'Ant.',
                        // today: 'Hoy',
                        // month: 'Mes',
                        // work_week: "Semana",                       // ponemos el texto Semana para work_week, sino aparecería "Work week"
                        // day: 'Día',
                        // agenda: 'Agenda',
                        next: t("calendar.next"),
                        previous: t("calendar.previous"),
                        today: t("calendar.today"),
                        month: t("calendar.month"),
                        work_week: t("calendar.workweek"),                          // ponemos el texto Semana para work_week, sino aparecería "Work week"
                        day: t("calendar.day"),
                        // agenda: t("calendar.agenda"),
                        // showMore: t("calendar.showmore")
                        showMore: (count) => t("calendar.showmore", { count })  // Usar como función
                    }}
                />
            </Grid>
        </Grid>
    </Box>
    </>
    )
}

export default EntityEventsCalendarComponent;
