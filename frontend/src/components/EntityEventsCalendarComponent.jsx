import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { es } from 'date-fns/locale';
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    FormControl, 
    Grid,
    InputLabel,
    ListItemText,
    Select,
    Stack,
    Toolbar, // en lugar de box usar Stack, que simplifica aún más la organización vertical.
    Typography,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es as localeEs } from 'date-fns/locale';

const DnDCalendar = withDragAndDrop(Calendar);
const locales = { es };
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

const EntityEventsCalendarComponent = ({ logged, user } ) => {
    
    const VITE_BACKEND_URL_RENDER = import.meta.env.VITE_BACKEND_URL_RENDER
    
    const [events, setEvents] = useState([])
    const [allEvents, setAllEvents] = useState([])
    const [dialogOpen, setDialogOpen] = useState(false)
    const [eventData, setEventData] = useState({})
    const [date, setDate] = useState(new Date())
    const [view, setView] = useState(Views.MONTH)     // POR DEFECTO VISTA MES
    const [isEditing, setIsEditing] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
    const [errorDialogOpen, setErrorDialogOpen] = useState(false)
    const [errorDialogMessage, setErrorDialogMessage] = useState('')
    const [actionEventMessage, setActionEventMessage] = useState(['Agregar', 'Editar'])
    const [usuarios, setUsuarios] = useState([])
    const [espacios, setEspacios] = useState([])
    const [programas, setProgramas] = useState([])
    const [dialogRepeatOpen, setDialogRepeatOpen] = useState(false)
    const [eventDataRepeatStart, setEventDataRepeatStart] = useState('')
    const [eventDataRepeatEnd, setEventDataRepeatEnd] = useState('')
    const [errorMessage, setErrorMessage] = useState("") // SE USA PERO NO SE MUESTRA, SE PODRÍA BORRAR
    const [dialogError, setDialogError] = useState(false)
    const [dialogRepeatedResultOpen, setDialogRepeatedResultOpen] = useState(false)
    const [selectedUsuarios, setSelectedUsuarios] = useState([])
    const [selectedProgramas, setSelectedProgramas] = useState([])
    const [selectedEspacios, setSelectedEspacios] = useState([])

    useEffect(() => {
        const getNewEventFormData = async () => {
            try {
                // fetch for getting horarios & turnos data
                const response = await fetch(`${VITE_BACKEND_URL_RENDER}/api/v1/erroak/getNewEventFormData`,
                    {
                        method: 'GET',
                        headers: {'Content-type': 'application/json; charset=UTF-8'}
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
                //   `${VITE_BACKEND_URL_RENDER}/api/v1/erroak/eventos/${start.toISOString()}/${end.toISOString()}`
                  `${VITE_BACKEND_URL_RENDER}/api/v1/erroak/eventos/${start.toISOString()}/${end.toISOString()}/${user.id}`
                );
                const data = await response.json();
                const eventosData = data.map(evento => ({
                    ...evento,
                    start: new Date(evento.start),
                    end: new Date(evento.end),
                    color: evento.color,
                }));
                console.log("imprimo eventosData: ", eventosData)
                // setEvents(eventosData)
                setAllEvents(eventosData)
                setEvents(filterEvents(eventosData, selectedUsuarios, selectedProgramas, selectedEspacios))

            } catch (error) {
                console.error("Error cargando eventos:", error);
            }
        }

        if (!user || !user.id) {
            console.warn("fetchEventos() abortado porque user.id es undefined")
            return
        }
        fetchEventos()
    }, [date, user])

    const handleNavigate = (newDate) => { // Permite desplazar de fecha del calendario
        setDate(newDate)
    };

    const handleViewChange = (newView) => { // Permite cambiar la vista del calendario
        setEvents(filterEvents(allEvents, selectedUsuarios, selectedProgramas, selectedEspacios))
        if (newView === 'week') {
            setView('work_week') // Forzamos semana laboral
        } else {
            setView(newView)
        }
    };

    const eventGenerator = () => {
        // Generar un ID único combinando timestamp + aleatorio
        let newEventIdGenerated = Date.now() + Math.floor(Math.random() * 100000)

        // Asegurarse que no se repita ID
        while (events.some(e => e.event_id === newEventIdGenerated)) {
            newEventIdGenerated = Date.now() + Math.floor(Math.random() * 100000)
        }

        return newEventIdGenerated

    }
    const restaDias = (finicial, ffinal) => {
        const dia = 1000 * 60 * 60 * 24; // Milisegundos en un día

        // Normalizar las fechas para ignorar la hora
        const fechaInicial = new Date(finicial)
        const fechaFinal = new Date(ffinal)
        fechaInicial.setHours(0, 0, 0, 0)
        fechaFinal.setHours(0, 0, 0, 0)
        const resta = fechaFinal - fechaFinal

        return Math.round(resta / dia)
    }


    // Creando un nuevo evento
    const handleSelectSlot = ({ start, end }) => {

        const newStart = start
        const newEnd = end
        // En vista "month" el "end" es por defecto un día mas, le restamos un día
        if (view === "month") {
            newEnd.setDate(end.getDate() -1) // resto un día
        }

        const isWeekend = newStart.getDay() === 0 || newStart.getDay() === 6

        if (isWeekend) {
            setErrorDialogMessage('Solo se permiten eventos en días laborales.')
            setErrorDialogOpen(true)
            return
        }

        let newEventId = eventGenerator()
        // Generando el evento
        setEventData({
            event_id: newEventId, 
            usuario_id: user.id,
            espacio_id: '',
            programa_id: '',
            start: newStart,
            end: newEnd,
            observaciones: '',
            color: ''
        })
        setIsEditing(false)
        setSelectedEvent(null)
        setDialogOpen(true)
    };

    // Editando un evento
    const handleSelectEvent = async (event) => {
        if (user.id === 12341234) {
            setEventData({ ...event })
            setIsEditing(true)
            setSelectedEvent(event)
            setDialogOpen(true)
        }
    };

    const handleSaveRepeat = async () => { 
        console.log("Repetir !!", selectedEvent, eventDataRepeatStart, eventDataRepeatEnd)
        if (eventDataRepeatEnd < eventDataRepeatStart) {
            setErrorDialogMessage(`Fecha Fin menor que fecha Inicio`)
            setErrorDialogOpen(true)
            return
        }
        // Permitir repetir 30 dias máximo
        if(restaDias(eventDataRepeatStart, eventDataRepeatEnd) > 30) {
            setErrorDialogMessage(`Maximo repeticiones 30 días`)
            setErrorDialogOpen(true)
            return
        }

        const newEvents = []
        let currentDate = new Date(eventDataRepeatStart)      // Copia de eventDataRepatStart
        let endDate = new Date(eventDataRepeatEnd)
        let dayCounter = 0
        const startHour = selectedEvent.start.getHours()
        const endHour = selectedEvent.end.getHours()
        const alreadyExistSpaces = []
        while (currentDate <= endDate) {
            console.log("Paso por el ciclo")
            const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6
            if (!isWeekend) {
                const newEventId = eventGenerator()
                let startSave = new Date(currentDate)
                startSave.setHours(startHour)
                let endSave = new Date(currentDate)
                endSave.setHours(endHour)
                // Generando el evento DUPLICADO
                const eventDataRepeated ={
                    event_id: newEventId, 
                    usuario_id: user.id,
                    espacio_id: selectedEvent.espacio_id,
                    programa_id: selectedEvent.programa_id,
                    start: startSave,
                    end: endSave,
                    observaciones: selectedEvent.observaciones,
                    color: selectedEvent.color
                }
                // añadir a backend y dependiendo de si ya esta ocupado se guarda o no
                // pero hay que pasar la fecha y el espacio_id
                // se responde a backend con el resultado para que se añada a o no a newEvents
                try {
                    // fetch eventos
                    const responseRepeated = await fetch(`${VITE_BACKEND_URL_RENDER}/api/v1/erroak/evento/`,
                        {
                            method: "POST",
                            headers: {'Content-type': 'application/json; charset=UTF-8'},
                            body: JSON.stringify(eventDataRepeated)
                        }
                    )
                    const data = await responseRepeated.json()
                    console.log("Respuesta backend evento post: ", data)
                    if (data.result === "Evento ya existente") { // PRACTICAMENTE IMPOSIBLE
                        console.log("OJO EVENTO YA EXISTENTE??")
                        // setErrorMessage("Evento ya existente")
                        // setDialogError(true)
                        // return
                    } else if (data.result === "Espacio ya existente") {
                        // setErrorMessage("Espacio OCUPADO, elegir otro")
                        // setDialogError(true)
                        // return
                        alreadyExistSpaces.push(eventDataRepeated)
                        console.log("alreadyExistSpaces: ", alreadyExistSpaces)
                    } else {
                        // Busca en eventos el evento seleccionado y lo reemplaza por eventData
                        setEvents(events.map(ev => ev.event_id === selectedEvent.event_id ? eventData : ev))
                        newEvents.push(eventDataRepeated)
                    }
                } catch (error) {
                    // setError(error.message); // Handle errors
                    console.log(error.message)
                } finally {
                    // setLoading(false); // Set loading to false once data is fetched or error occurs
                }
            }   
            currentDate.setDate(currentDate.getDate() + 1)  // Sumo un día
            if (alreadyExistSpaces.length > 0) {
                setErrorMessage([...alreadyExistSpaces])
            }
            setDialogRepeatedResultOpen(true)
            // const
        }

        setEvents([...events, ...newEvents]);
        setIsEditing(false)
        setSelectedEvent(null)
        setDialogOpen(true)
        // setEventDataRepeatStart('')
        // setEventDataRepeatEnd('')
        // setDialogOpen(false)
        setDialogRepeatOpen(false)
    }

    // Guardando eventos creados / editados
    const handleSaveEvent = async () => { 
        // Validar que las horas estén dentro del rango permitido
        const minTime = new Date(eventData.start)
        minTime.setHours(horaMinima.getHours(), horaMinima.getMinutes())

        const maxTime = new Date(eventData.start)
        maxTime.setHours(horaMaxima.getHours(), horaMaxima.getMinutes())

        // Limitar inicio y fin si están fuera de los límites
        if (eventData.start >= eventData.end) {
            setErrorDialogMessage('La hora de inicio debe ser menor que la hora de fin')
            setErrorDialogOpen(true)
            return
        }
        if (eventData.start < minTime || eventData.end > maxTime) {
            setErrorDialogMessage(`La hora del evento debe estar entre ${horaMinima.getHours()}hrs y ${horaMaxima.getHours()}hrs (dentro del mismo día)`)
            setErrorDialogOpen(true)
            return
        }

        const day = eventData.start.getDay()
        if (day === 0 || day === 6) {
            setErrorDialogMessage('Solo se permiten eventos en días laborales')
            setErrorDialogOpen(true)
            return
        }

        if (eventData.usuario_id < 1) {
            setErrorDialogMessage('Seleccionar un Usuario')
            setErrorDialogOpen(true)
            return
        }

        if (eventData.programa_id < 1) {
            setErrorDialogMessage('Seleccionar un Programa');
            setErrorDialogOpen(true)
            return
        }
        if (isEditing && selectedEvent) {
            // Añadir aqui la llamada a backend para modificar un evento nuevo - selectedEvent.event_id
            try {
                // fetch eventos
                const responseEdit = await fetch(`${VITE_BACKEND_URL_RENDER}/api/v1/erroak/evento/${selectedEvent.event_id}`,
                    {
                        method: "PUT",
                        headers: {'Content-type': 'application/json; charset=UTF-8'},
                        body: JSON.stringify(eventData)
                    }
                )
                const data = await responseEdit.json()
                console.log("Respuesta backend evento post: ", data)
                if (data.result === "Evento ya existente") { // PRACTICAMENTE IMPOSIBLE
                    setErrorMessage("Evento ya existente")
                    setDialogError(true)
                    return
                }
                if (data.result === "Espacio ya existente") {
                    setErrorMessage("Espacio OCUPADO, elegir otro")
                    setDialogError(true)
                    return
                }

                // Busca en eventos el evento seleccionado y lo reemplaza por eventData
                setEvents(events.map(ev => ev.event_id === selectedEvent.event_id ? eventData : ev))

            } catch (error) {
                // setError(error.message); // Handle errors
                console.log(error.message)
            } finally {
                // setLoading(false); // Set loading to false once data is fetched or error occurs
            }

        } else {
            // Añadir aqui la llamada a backend para guardar un evento nuevo - eventData
            try {
                // fetch eventos
                const response = await fetch(`${VITE_BACKEND_URL_RENDER}/api/v1/erroak/evento`,
                    {
                        method: "POST",
                        headers: {'Content-type': 'application/json; charset=UTF-8'},
                        body: JSON.stringify(eventData)
                    }
                )
                const data = await response.json()
                console.log("Respuesta backend vacacion post: ", data)
                if (data.result === "Evento ya existente") { // PRACTICAMENTE IMPOSIBLE
                    setErrorMessage("Evento ID ya existente")
                    setDialogError(true)
                    return
                }
                if (data.result === "Espacio ya existente") {
                    setErrorMessage("Espacio en uso en ese rango de tiempo.")
                    setDialogError(true)
                    return
                }
                setEvents([...events, eventData])

            } catch (error) {
                // setError(error.message); // Handle errors
                console.log(error.message)
            } finally {
                // setLoading(false); // Set loading to false once data is fetched or error occurs
            }

        }
        handleCloseDialog()
    };

    const handleDeleteEvent = () => {
        setConfirmDeleteOpen(true)
    };

    const handleRepeatEvent = () => {
        setDialogRepeatOpen(true)
    };

    const handleEventDrop = async ({ event, start, end }) => {
        const day = start.getDay()
        if (day === 0 || day === 6) {
            setErrorDialogMessage('Solo se permiten eventos en días laborales.')
            setErrorDialogOpen(true)
            return
        }
        const updatedEvent = { ...event, start, end };

        // OJO !!! LA HORA ES UTC+2, EN BACKEND SE GUARDA -2HRS, PERO NO HAY PROBLEMA PORQUE AL 
        // CARGARSE LOS DATOS LOS ATUALIZA A UTC+2
        try {
            // fetch eventos
            const responseEdit = await fetch(`${VITE_BACKEND_URL_RENDER}/api/v1/erroak/evento/${event.event_id}`,
                {
                    method: "PUT",
                    headers: {'Content-type': 'application/json; charset=UTF-8'},
                    body: JSON.stringify(updatedEvent)
                }
            )
            const data = await responseEdit.json()
            console.log("Respuesta backend vacacion post: ", data)
            if (data.result === "Evento event_id NO existente") {
                setErrorMessage("Evento event_id NO existente")
                return
            }
            if (data.result === "Espacio ya existente") {
                setErrorMessage("Espacio en uso en ese rango de tiempo.")
                setDialogError(true)
                return
            }
            setEvents(prevEvents => // busca el evento y lo actualiza, actualización de objetos --> updatedEvent: ev
                prevEvents.map(ev => (ev.event_id === event.event_id ? updatedEvent : ev)) 
            );

        } catch (error) {
            // setError(error.message); // Handle errors
            console.log(error.message)
        } finally {
            // setLoading(false); // Set loading to false once data is fetched or error occurs
        }

    };

    const confirmDelete = async () => {
        if (!selectedEvent || !selectedEvent.event_id) {
            setErrorDialogMessage('No hay evento válido para eliminar.')
            setErrorDialogOpen(true)
            return
        }

        setEvents(events.filter(ev => ev.event_id !== selectedEvent.event_id))
        setConfirmDeleteOpen(false)
        setDialogOpen(false)
// Llamar a backend para borrar un evento - selectedEvent.event_id
        try {
            // fetch eventos
            console.log("Evento a borrar: ", selectedEvent.event_id)
            const response = await fetch(`${VITE_BACKEND_URL_RENDER}/api/v1/erroak/evento/${selectedEvent.event_id}`,
                {
                    method: "DELETE",
                    headers: {'Content-type': 'application/json; charset=UTF-8'},
                }
            )
            const data = await response.json()
            console.log("Respuesta backend vacacion post: ", data)
            if (data.result === "Evento event_id NO existente") {
                setErrorMessage("Evento event_id NO existente")
                return
            }
        } catch (error) {
            // setError(error.message); // Handle errors
            console.log(error.message)
        } finally {
            // setLoading(false); // Set loading to false once data is fetched or error occurs
        }

    };

    const cancelDelete = () => {
        setConfirmDeleteOpen(false);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false)
    };

    const handleCloseRepeat = () => {
        setEventDataRepeatStart('')
        setEventDataRepeatEnd('')
        setDialogRepeatOpen(false)
    };

    const handleEventDataRepeatStart = (value) => {
        console.log("value: ", value)
        if (value) {
            const tempValue = new Date(value)
            tempValue.setHours(12, 0, 0, 0)
            setEventDataRepeatStart(tempValue)
        }
    }
    const handleEventDataRepeatEnd = (value) => {
        console.log("value: ", value)
        if (value) {
            const tempValue = new Date(value)
            tempValue.setHours(12, 0, 0, 0)
            setEventDataRepeatEnd(tempValue)
        }
    }

    const handleCloseError = () => {
        setDialogError(false)
    }

    const handleCloseRepeatedResult = () => {
        setDialogOpen(false)
        setDialogRepeatedResultOpen(false)
        setEventDataRepeatStart('')
        setEventDataRepeatEnd('')
        setErrorMessage("")
    }

    // Personalizando la visualizacion de eventos en el calendario, por defecto "start-end title"
    const CustomEvent = ({ event }) => {
        const usuario = usuarios.find(p => p.usuario_id === event.usuario_id);
        const espacio = espacios.find(p => p.espacio_id === event.espacio_id);
        const programa = programas.find(p => p.programa_id === event.programa_id);

        return (
            <div>
                {programa?.descripcion || 'Sin nombre'}
                - <strong>{usuario?.nombre_apellidos || 'Sin nombre'}</strong> 
                - {espacio?.descripcion || 'Sin nombre'}
            </div>
        );
    };

    const handleCopyToClipboard = () => {
        if (!errorMessage || errorMessage.length === 0) return

        const formattedErrors = errorMessage
            .map(error => new Date(error.start).toLocaleDateString('es-ES'))
            .join('\n')

        navigator.clipboard.writeText(formattedErrors)
            .then(() => {
                console.log('Copiado al portapapeles')
                // Se podría mostrar un texto "Copiado al portapapeles" usando un Snackbar
            })
            .catch(err => {
                console.error('Error al copiar:', err)
            })
    }

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

    return (
    <>
        <Toolbar />
        <h2>EVENTOS ENTIDAD AÑO: {date.getFullYear()}</h2>

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
        <Grid container spacing={2} 
            direction={{
                xs: "column",
                md: "row",
            }}
        >
            <Grid size={{ xs: 8, md: 3 }}>
                <h2>Filtros</h2>
                <Button onClick={handleResetFilters} variant="contained">Borrar filtros</Button>
                <Stack spacing={1} m={3}> 
                    <FormControl fullWidth margin='dense'>
                        <InputLabel id="select-label-usuarios_id">Usuarios</InputLabel>
                        <Select
                            // fullWidth
                            labelId="select-label-usuarios_id"
                            id="select-usuarios_id"
                            multiple
                            label="Usuarios"
                            value={selectedUsuarios}
                            onChange={(e)=> handleChangeSelectedValues("usuarios", e)}
                            // input={<OutlinedInput label="Tag" />} // Estilo borde exterior
                            // renderValue indica cómo queremos mostrar esos datos en este caso un array selectedUsuarios
                            // CON OBJETOS que es seleccionado como "selected"
                            // Aquí usamos el array de objetos para mostrar solo los nombre_apellidos
                            renderValue={(selected) => 
                                // selected.map((user) => user.nombre_apellidos).join(', ')
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
                                    {/* <Checkbox checked={selectedUsuarios.some(user => user.usuario_id === usuario.usuario_id)} /> */}
                                    <Checkbox checked={selectedUsuarios.includes(usuario.usuario_id)} />
                                    <ListItemText primary={usuario.nombre_apellidos} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>
                <Stack spacing={1} m={3}> 
                    <FormControl fullWidth margin='dense'>
                        <InputLabel id="select-label-programas_id">Programas</InputLabel>
                        <Select
                            // fullWidth
                            labelId="select-label-programas_id"
                            id="select-programas_id"
                            multiple
                            label="Programas"
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
                        <InputLabel id="select-label-espacios_id">Espacios</InputLabel>
                        <Select
                            // fullWidth
                            labelId="select-label-espacios_id"
                            id="select-espacios_id"
                            multiple
                            label="Espacios"
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
                <DnDCalendar
                    style={{ 
                        minHeight: 1000,
                        // fontSize: 'clamp(0.75rem, 1rem, 1.2rem)',  // Ajuste responsivo
                    //     minHeight: 'calc(100vh - 64px)',  // resta la altura del menu
                    }} 
                    localizer={localizer}
                    culture='es'                                    // días mes, semana, día en español
                    events={events}                                 // Personalizando la visualizacion de eventos en el calendario usando el array events
                    selectable                                      // habilita la seleccion de celdas
                    views={['month', 'work_week', 'day', 'agenda']}
                    onView={handleViewChange}
                    // defaultView='work_week'
                    defaultView='month'
                    step={saltosTiempo}
                    timeslots={saltosHora}
                    min={horaMinima}                                // Limitación hora mínima
                    max={horaMaxima}                                // Limitacion hora máxima
                    // a modificar onSelectEvent en el futuro
                    onSelectEvent={handleSelectEvent}               // Editar evento existente
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
                        const backgroundColor = user?.color || '#BDBDBD';
                        return {    // retornando un style por eso el return tiene {} en lugar de ()
                            style: {
                                backgroundColor,
                                color: 'white',
                                borderRadius: '4px',
                                border: '1px solid black',
                                padding: '2px',
                            }
                        }
                    }}
                    messages={{
                        next: 'Sig.',
                        previous: 'Ant.',
                        today: 'Hoy',
                        month: 'Mes',
                        work_week: "Semana",                       // ponemos el texto Semana para work_week, sino aparecería "Work week"
                        day: 'Día',
                        agenda: 'Agenda',
                    }}
                />

                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={localeEs}>
                    <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth>
                        <DialogTitle>{!isEditing ? actionEventMessage[0] : actionEventMessage[1]} evento</DialogTitle>
                        <DialogContent>
                            <Stack spacing={1} mt={1}> 
                                <FormControl fullWidth margin='dense'>
                                    <InputLabel id="select-label-usuario_id">Usuario *</InputLabel>
                                    <Select
                                        // fullWidth
                                        labelId="select-label-usuario_id"
                                        id="select-usuario_id"
                                        label="Usuario *"
                                        value={eventData.usuario_id}
                                        onChange={(e) => setEventData({ ...eventData, usuario_id: e.target.value})}
                                        disabled
                                    >
                                        {usuarios.map((usuario) => (
                                            <MenuItem key={usuario.usuario_id} value={usuario.usuario_id}>{usuario.nombre_apellidos}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth margin='dense'>
                                    <InputLabel id="select-label-espacio_id">Espacio</InputLabel>
                                    <Select
                                        // fullWidth
                                        labelId="select-label-espacio_id"
                                        id="select-espacio_id"
                                        label="Espacio"
                                        value={eventData.espacio_id}
                                        onChange={(e) => setEventData({ ...eventData, espacio_id: e.target.value})}
                                    >
                                        {espacios.map((espacio) => (
                                            <MenuItem key={espacio.espacio_id} value={espacio.espacio_id}>{espacio.descripcion}</MenuItem>

                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth margin='dense'>
                                    <InputLabel id="select-label-programa_id">Programa *</InputLabel>
                                    <Select
                                        // fullWidth // al ser un FormControl no es necesario
                                        labelId="select-label-programa_id"
                                        id="select-programa_id"
                                        label="Programa *"
                                        value={eventData.programa_id}
                                        onChange={(e) => setEventData({ ...eventData, programa_id: e.target.value})}
                                    >
                                        {programas.map((programa) => (
                                            <MenuItem key={programa.programa_id} value={programa.programa_id}>{programa.descripcion}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                                    <DateTimePicker
                                        label="Inicio *"
                                        value={eventData.start}
                                        onChange={(newValue) => setEventData({ ...eventData, start: newValue })}
                                        slotProps={{ textField: { fullWidth: true, margin: 'dense' } }}
                                    />
                                    <DateTimePicker
                                        label="Fin *"
                                        value={eventData.end}
                                        onChange={(newValue) => setEventData({ ...eventData, end: newValue })}
                                        slotProps={{ textField: { fullWidth: true, margin: 'dense' } }} // forma moderna y sin avisos en consola
                                    />
                                </Stack>

                                <TextField
                                    fullWidth
                                    label="Observaciones"
                                    name="observaciones"
                                    value={eventData.observaciones}
                                    onChange={(e) => setEventData({ ...eventData, observaciones: e.target.value })}
                                    margin="dense"
                                    multiline
                                    rows={3}
                                />
                            </Stack>
                        </DialogContent>
                        <DialogActions>
                            {isEditing && (
                                <>
                                    {/* <Button onClick={handleDeleteEvent} color="error" variant="contained">Eliminar</Button> */}
                                    {/* <Button onClick={handleRepeatEvent} variant="contained">Repetir</Button> */}
                                </>
                            )}
                            <Button onClick={handleSaveEvent} variant="contained">Guardar</Button>
                            <Button onClick={handleCloseDialog} variant="contained">Cancelar</Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={confirmDeleteOpen} onClose={cancelDelete}>
                        <DialogTitle>¿Eliminar evento?</DialogTitle>
                        <DialogContent>
                            ¿Estás seguro de que deseas eliminar el evento <strong>{selectedEvent?.title}</strong>?
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={confirmDelete} color="error" variant="contained">Eliminar</Button>
                            <Button onClick={cancelDelete} variant="contained">Cancelar</Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={dialogRepeatOpen} onClose={handleCloseRepeat}>
                        <DialogTitle>Repetir evento (max. 30)</DialogTitle>
                        <DialogContent>
                                <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                                    <DatePicker
                                        label="Inicio *"
                                        value={eventDataRepeatStart}
                                        onChange={(value) => handleEventDataRepeatStart(value)}
                                        slotProps={{ textField: { fullWidth: true, margin: 'dense', sx: { mt: 1 }} }}
                                    />
                                    <DatePicker
                                        label="Fin *"
                                        value={eventDataRepeatEnd}
                                        onChange={(value) => handleEventDataRepeatEnd(value)}
                                        slotProps={{ textField: { fullWidth: true, margin: 'dense' }, sx: { mt: 1 } }} // forma moderna y sin avisos en consola
                                    />
                                </Stack>

                            {/* ¿Estás seguro de que deseas Repetir el evento <strong>{selectedEvent?.title}</strong>? */}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleSaveRepeat} color="error" variant="contained">Repetir</Button>
                            <Button onClick={handleCloseRepeat} variant="contained">Cancelar</Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={errorDialogOpen} onClose={() => setErrorDialogOpen(false)}>
                        <DialogTitle>Advertencia</DialogTitle>
                        <DialogContent>{errorDialogMessage}</DialogContent>
                        <DialogActions>
                                <Button onClick={() => setErrorDialogOpen(false)} autoFocus>
                                    Cerrar
                                </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={dialogError} onClose={handleCloseError}>
                        <DialogTitle>
                            No se puede guardar
                        </DialogTitle>
                        <DialogContent>
                            <DialogContent>
                                {errorMessage}
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseError} variant="contained">Continuar</Button>
                            </DialogActions>
                        </DialogContent>
                    </Dialog>
                    <Dialog open={dialogRepeatedResultOpen} onClose={handleCloseRepeatedResult}>
                        <DialogTitle>
                            Resultado Repetición
                        </DialogTitle>
                        <DialogContent>
                            <DialogContent>
                                {!errorMessage &&
                                    <Typography>
                                        Repetición sin incidencias
                                    </Typography>
                                }
                                {errorMessage &&
                                    <>
                                        <Typography>
                                            Desde: {eventDataRepeatStart.toLocaleString('es-ES', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                    })}
                                            &nbsp; - Hasta: {eventDataRepeatEnd.toLocaleString('es-ES', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                    })}
                                        </Typography>
                                        <Typography color="error" >
                                            Repetición CON incidencias
                                        </Typography>
                                        {errorMessage.map((error, index) => (
                                            <Typography key={index}>
                                                {error.start.toLocaleString('es-ES', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                    }
                                                )}
                                            </Typography>
                                        ))}
                                        {/* Botón para copiar al portapapeles */}
                                        <Box mt={2}>
                                            <Button variant="outlined" onClick={handleCopyToClipboard}>
                                                Copiar incidencias
                                            </Button>
                                        </Box>
                                    </>
                                }
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseRepeatedResult} variant="contained">Continuar</Button>
                            </DialogActions>
                        </DialogContent>
                    </Dialog>
                </LocalizationProvider>
            </Grid>
        </Grid>

    </Box>
    </>
    )
}

export default EntityEventsCalendarComponent;
