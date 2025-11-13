import { useState, useEffect } from 'react';
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    FormControl, 
    FormLabel,
    InputLabel,
    Select,
    Stack,
    Toolbar, // en lugar de box usar Stack, que simplifica aún más la organización vertical.
    Typography,
} from '@mui/material';
import { colorOptions } from "../utils/EventColors";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es as localeEs } from 'date-fns/locale';
import { eu as localeEu } from 'date-fns/locale';

const DnDCalendar = withDragAndDrop(Calendar);
const locales = { es, eu };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const saltosTiempo = 30 // step={15}
const saltosHora = 2 // timeslots={4}
const horaMinima = new Date(1970, 1, 1, 7, 0) // Limitación hora mínima
const horaMaxima =new Date(1970, 1, 1, 21, 0) // Limitacion hora máxima
const minYearSelect = 2025
const maxYearSelect = 2055
const yearsSelect = Array.from({ length: maxYearSelect - minYearSelect + 1 }, (elemento, index) => minYearSelect + index);
const monthsSelect = Array.from({ length: 12 }, (elemento, index) => index);

const EventsCalendarComponent = () => {
    
    const VITE_BACKEND_URL_RENDER = import.meta.env.VITE_BACKEND_URL_RENDER
    const { t, i18n } = useTranslation("events")
    const { csrfToken, user, selectedLanguage } = useContext(AppContext)

    const [events, setEvents] = useState([])                // todos los eventos del rango actual
    const [dialogOpen, setDialogOpen] = useState(false)
    const [eventData, setEventData] = useState({})          // evento actual
    const [date, setDate] = useState(new Date())
    const [view, setView] = useState(Views.WORK_WEEK)       // POR DEFECTO VISTA SEMANA LABORAL
    const [isEditing, setIsEditing] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
    const [errorDialogOpen, setErrorDialogOpen] = useState(false)
    const [errorDialogMessage, setErrorDialogMessage] = useState('')
    const [actionEventMessage, setActionEventMessage] = useState([])
    const [usuarios, setUsuarios] = useState([])
    const [espacios, setEspacios] = useState([])
    const [programas, setProgramas] = useState([])
    const [dialogRepeatOpen, setDialogRepeatOpen] = useState(false)
    const [eventDataRepeatStart, setEventDataRepeatStart] = useState('')
    const [eventDataRepeatEnd, setEventDataRepeatEnd] = useState('')
    const [errorMessage, setErrorMessage] = useState("")
    const [dialogError, setDialogError] = useState(false)
    const [dialogRepeatedResultOpen, setDialogRepeatedResultOpen] = useState(false)
    const [errorMessageRepeated, setErrorMessageRepeated] = useState("")
    const [isRepeatableSpace, setIsRepeatableSpace] = useState(false)
    // Espacios especiales que se pueden repetir: 
        // KANPOALDEA / EXTERIOR (28) - añadir más en caso de
        // BILERA / REUNION (30)
    const [repeatableSpaces, setRepeatableSpaces] = useState([
        28,
        30
    ])
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

    useEffect(() => {
        const getNewEventFormData = async () => {
            try {
                // fetch for getting Select data
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
                        }
                    }
                )
                const data = await response.json()
                // console.log("Respuesta backend: ", data)
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
                  `${VITE_BACKEND_URL_RENDER}/api/v1/erroak/eventosuser/${start.toISOString()}/${end.toISOString()}`,
                    {
                        method: 'GET',
                        credentials: 'include', // IMPORTANTE: esto permite usar la cookie
                        headers: {
                            // 'Authorization': `Bearer ${token}`,
                            'Content-type': 'application/json; charset=UTF-8'
                        }
                    }
                )
                const data = await response.json()
                // para evitar pantalla blanca con error en consola
                // poner aqui chequeo resultado data === "Invalid token" || === "Missing token"
                // que en caso afirmativo llamar a función aviso indicando el resultado erróneo
                // devolver el control a "/"
                const eventosData = data.map(evento => ({
                    ...evento,
                    start: new Date(evento.start),
                    end: new Date(evento.end),
                    color: evento.color,
                }))
                console.log("imprimo eventosData: ", eventosData)
                setEvents(eventosData)
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

    useEffect(() => {
        setActionEventMessage([t("actioneventmessage.message1"), t("actioneventmessage.message2")])
    }, [selectedLanguage])
    
    if (!localizer) return null; // o loader si quieres

    const handleNavigate = (newDate, view, action) => { // Permite desplazar de fecha del calendario
        setDate(newDate)
        if (action === "TODAY") {
            setSelectedYear(new Date(newDate).getFullYear())
        }
    }

    const handleViewChange = (newView) => { // Permite cambiar la vista del calendario
        if (newView === 'week') {
            setView('work_week') // Forzamos semana laboral
        } else {
            setView(newView)
        }
    }

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
        const resta = fechaFinal - fechaInicial

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
            // 'Solo se permiten eventos en días laborales.'
            setErrorDialogMessage(t("errordialog.message1"))
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
            color: '',
            repetible: false,
        })
        setIsEditing(false)
        setIsRepeatableSpace(false)
        setSelectedEvent(null)
        setDialogOpen(true)
    }

    // Editando un evento
    const handleSelectEvent = async (event) => {
        setEventData({ ...event })
        setIsEditing(true)
        setIsRepeatableSpace(repeatableSpaces.includes(event.espacio_id))
        setSelectedEvent(event)
        setDialogOpen(true)
    }

    const handleSaveRepeat = async () => { 
        console.log("Repetir !!", selectedEvent, eventDataRepeatStart, eventDataRepeatEnd)
        if (eventDataRepeatEnd < eventDataRepeatStart) {
            // `Fecha Fin menor que fecha Inicio`
            setErrorDialogMessage(t("errordialog.message2"))
            setErrorDialogOpen(true)
            return
        }
        // Permitir repetir 30 dias máximo
        if(restaDias(eventDataRepeatStart, eventDataRepeatEnd) > 30) {
            // `Maximo repeticiones 30 días`
            setErrorDialogMessage(t("errordialog.message3"))
            setErrorDialogOpen(true)
            return
        }
        const newEvents = []
        let currentDate = new Date(eventDataRepeatStart)      // Copia de eventDataRepatStart
        let endDate = new Date(eventDataRepeatEnd)
        const startHours = selectedEvent.start.getHours()
        const startMinutes = selectedEvent.start.getMinutes()
        const endHours = selectedEvent.end.getHours()
        const endMinutes = selectedEvent.end.getMinutes()
        const alreadyExistSpaces = []
        while (currentDate <= endDate) {
            console.log("Paso por el ciclo")
            const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6
            if (!isWeekend) {
                const newEventId = eventGenerator()
                let startSave = new Date(currentDate)
                startSave.setHours(startHours, startMinutes)
                let endSave = new Date(currentDate)
                endSave.setHours(endHours, endMinutes)
                // Generando el evento DUPLICADO
                const eventDataRepeated ={
                    event_id: newEventId, 
                    usuario_id: user.id,
                    espacio_id: selectedEvent.espacio_id,
                    programa_id: selectedEvent.programa_id,
                    start: startSave,
                    end: endSave,
                    observaciones: selectedEvent.observaciones,
                    color: selectedEvent.color,
                    repetible: repeatableSpaces.includes(selectedEvent.espacio_id)
                }
                // añadir a backend y dependiendo de si ya esta ocupado se guarda o no
                // pero hay que pasar la fecha y el espacio_id
                // se responde a backend con el resultado para que se añada a o no a newEvents
                try {
                    // fetch eventos para repeticiones
                    const responseRepeated = await fetch(
                        `${VITE_BACKEND_URL_RENDER}/api/v1/erroak/evento/`,
                        {
                            method: "POST",
                            credentials: 'include', // IMPORTANTE: esto permite usar la cookie
                            headers: {
                                // 'Authorization': `Bearer ${token}`,
                                'Content-type': 'application/json; charset=UTF-8',
                                'X-CSRF-Token': csrfToken,
                            },
                            body: JSON.stringify(eventDataRepeated)
                        }
                    )
                    const data = await responseRepeated.json()
                    console.log("Respuesta backend evento post: ", data)
                    if (data.result === "Evento ya existente") { // PRACTICAMENTE IMPOSIBLE
                        console.log("OJO EVENTO YA EXISTENTE??")
                    } else if (data.result === "Espacio ya existente") {
                        alreadyExistSpaces.push(eventDataRepeated)
                        console.log("alreadyExistSpaces: ", alreadyExistSpaces)
                    } else {
                        // Busca en eventos el evento seleccionado y lo reemplaza por eventData
                        setEvents(events.map(ev => ev.event_id === selectedEvent.event_id ? eventData : ev))
                        newEvents.push(eventDataRepeated)
                    }
                } catch (error) {
                    // setError(error.message); // Handle errors
                    // console.log(error.message)
                } finally {
                    // setLoading(false); // Set loading to false once data is fetched or error occurs
                }
            }   
            currentDate.setDate(currentDate.getDate() + 1)  // Sumo un día
            if (alreadyExistSpaces.length > 0) {
                setErrorMessageRepeated([...alreadyExistSpaces])
            }
            setDialogRepeatedResultOpen(true)
        }

        setEvents([...events, ...newEvents]);
        setIsEditing(false)
        setSelectedEvent(null)
        setDialogOpen(true)
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
            // 'La hora de inicio debe ser menor que la hora de fin'
            setErrorDialogMessage(t("errordialog.message4"))
            setErrorDialogOpen(true)
            return
        }
        if (eventData.start < minTime || eventData.end > maxTime) {
            // `La hora del evento debe estar entre ${horaMinima.getHours()}hrs y ${horaMaxima.getHours()}hrs (dentro del mismo día)`
            setErrorDialogMessage(`${t("message5.part1")} ${horaMinima.getHours()}${t("message5.part2")} ${horaMaxima.getHours()}${t("message5.part3")}`)
            setErrorDialogOpen(true)
            return
        }

        const day = eventData.start.getDay()
        if (day === 0 || day === 6) {
            // 'Solo se permiten eventos en días laborales'
            setErrorDialogMessage(t("errordialog.message1"))
            setErrorDialogOpen(true)
            return
        }

        if (eventData.usuario_id < 1) {
            // 'Seleccionar un Usuario'
            setErrorDialogMessage(t("errordialog.message6"))
            setErrorDialogOpen(true)
            return
        }

        if (eventData.espacio_id < 1) {
            // 'Seleccionar un Espacio'
            setErrorDialogMessage(t("errordialog.message7"))
            setErrorDialogOpen(true)
            return
        }

        if (eventData.programa_id < 1) {
            // 'Seleccionar un Programa'
            setErrorDialogMessage(t("errordialog.message8"))
            setErrorDialogOpen(true)
            return
        }

        if (isEditing && selectedEvent) {
            // Añadir aqui la llamada a backend para modificar un evento nuevo - selectedEvent.event_id
            try {
                // fetch eventos para modificar
                const responseEdit = await fetch(
                    `${VITE_BACKEND_URL_RENDER}/api/v1/erroak/evento/${selectedEvent.event_id}`,
                    {
                        method: "PUT",
                        credentials: 'include', // IMPORTANTE: esto permite usar la cookie
                        headers: {
                            // 'Authorization': `Bearer ${token}`,
                            'Content-type': 'application/json; charset=UTF-8',
                            'X-CSRF-Token': csrfToken,
                        },
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
                    // "Espacio OCUPADO, elegir otro"
                    setErrorMessage(t("errormessage.message1"))
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
                // fetch eventos para crear
                const response = await fetch(
                    `${VITE_BACKEND_URL_RENDER}/api/v1/erroak/evento`,
                    {
                        method: "POST",
                        credentials: 'include', // IMPORTANTE: esto permite usar la cookie
                        headers: {
                            // 'Authorization': `Bearer ${token}`,
                            'Content-type': 'application/json; charset=UTF-8',
                            'X-CSRF-Token': csrfToken,
                        },
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
                    // "Espacio en uso en ese rango de tiempo"
                    setErrorMessage(t("errormessage.message2"))
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
    }

    const handleDeleteEvent = () => {
        setConfirmDeleteOpen(true)
    }

    const handleRepeatEvent = () => {
        setDialogRepeatOpen(true)
    }

    const handleEventDrop = async ({ event, start, end }) => {
        const day = start.getDay()
        if (day === 0 || day === 6) {
            // 'Solo se permiten eventos en días laborales.'
            setErrorDialogMessage(t("errordialog.message1"))
            setErrorDialogOpen(true)
            return
        }
        const updatedEvent = { ...event, start, end };
        console.log("updatedEvent: ", updatedEvent)

        // OJO !!! LA HORA ES UTC+2, EN BACKEND SE GUARDA -2HRS, PERO NO HAY PROBLEMA PORQUE AL 
        // CARGARSE LOS DATOS LOS ATUALIZA A UTC+2
        try {
            // fetch eventos para modificar/guardar con nueva fecha/hora de un evento movido
            const responseEdit = await fetch(
                `${VITE_BACKEND_URL_RENDER}/api/v1/erroak/evento/${event.event_id}`,
                {
                    method: "PUT",
                    credentials: 'include', // IMPORTANTE: esto permite usar la cookie
                    headers: {
                        // 'Authorization': `Bearer ${token}`,
                        'Content-type': 'application/json; charset=UTF-8',
                        'X-CSRF-Token': csrfToken,
                    },
                    body: JSON.stringify(updatedEvent)
                }
            )
            const data = await responseEdit.json()
            console.log("Respuesta backend vacacion post: ", data)
            if (data.result === "Evento event_id NO existente") {
                setErrorMessage("Evento event_id NO existente")  // practicamente imposible
                return
            }
            if (data.result === "Espacio ya existente") {
                // "Espacio en uso en ese rango de tiempo."
                setErrorMessage(t("errormessage.message2"))
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

    }

    const confirmDelete = async () => {
        if (!selectedEvent || !selectedEvent.event_id) {
            // 'No hay evento válido para eliminar.'
            setErrorDialogMessage(t("errordialog.message9"))
            setErrorDialogOpen(true)
            return
        }

        setEvents(events.filter(ev => ev.event_id !== selectedEvent.event_id))
        setConfirmDeleteOpen(false)
        setDialogOpen(false)
// Llamar a backend para borrar un evento - selectedEvent.event_id
        try {
            // fetch eventos parar borrar
            console.log("Evento a borrar: ", selectedEvent.event_id)
            const response = await fetch(
                `${VITE_BACKEND_URL_RENDER}/api/v1/erroak/evento/${selectedEvent.event_id}`,
                {
                    method: "DELETE",
                    credentials: 'include', // IMPORTANTE: esto permite usar la cookie
                    headers: {
                        // 'Authorization': `Bearer ${token}`,
                        'Content-type': 'application/json; charset=UTF-8',
                        'X-CSRF-Token': csrfToken,
                    },
                    body: JSON.stringify(selectedEvent)
                }
            )
            const data = await response.json()
            console.log("Respuesta backend vacacion post: ", data)
            if (data.result === "Evento event_id NO existente") {
                setErrorMessage("Evento event_id NO existente") // practicamente imposible
                return
            }
        } catch (error) {
            // setError(error.message); // Handle errors
            console.log(error.message)
        } finally {
            // setLoading(false); // Set loading to false once data is fetched or error occurs
        }

    }

    const cancelDelete = () => {
        setConfirmDeleteOpen(false);
    }

    const handleCloseDialog = () => {
        setDialogOpen(false)
    }

    const handleCloseRepeat = () => {
        setEventDataRepeatStart('')
        setEventDataRepeatEnd('')
        setDialogRepeatOpen(false)
    }

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
        setErrorMessageRepeated("")
    }

    // Personalizando la visualizacion de eventos en el calendario, por defecto "start-end title"
    const CustomEvent = ({ event }) => {
        const usuario = usuarios.find(p => p.usuario_id === event.usuario_id);
        const espacio = espacios.find(p => p.espacio_id === event.espacio_id);
        const programa = programas.find(p => p.programa_id === event.programa_id);

        return (
            <div>
                {programa?.descripcion.slice(0 , 4) || 'Sin nombre'}
                - <strong>{usuario?.nombre_apellidos || 'Sin nombre'}</strong> 
                - {espacio?.descripcion || 'Sin nombre'}
            </div>
        )
    }

    const handleCopyToClipboard = () => {
        if (!errorMessageRepeated || errorMessageRepeated.length === 0) return

        const formattedErrors = errorMessageRepeated
            .map(error => new Date(error.start).toLocaleDateString('es-ES'))
            .join('\n')
        console.log("formattedErrors: ", formattedErrors)
        navigator.clipboard.writeText(formattedErrors)
            .then(() => {
                console.log('Copiado al portapapeles')
                // Si quieres mostrar feedback visual, puedes usar Snackbar
            })
            .catch(err => {
                console.error('Error al copiar:', err)
            })
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
                    sm: '12px',  // tablets
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
                        <FormLabel 
                            id="select-label-selectedyear"
                            sx={{ color: "black", minWidth: 50,
                                fontSize: {
                                    xs: '10px',   // móviles
                                    sm: '14px',  // tablets
                                    md: '14px',  // escritorio
                                }
                            }}
                        >{t("mainheader.text1")}:</FormLabel>
                        <Select
                            aria-labelledby="select-label-selectedyear"
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
                    alignItems: "center" ,
}}>
                    {t("mainheader.text2")}: {date.getFullYear()}
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
        <GlobalStyles styles={{ // Cambiando el estilo del día para que al pasar el ratón por encima cambie de color
            '.rbc-month-view .rbc-date-cell > *:first-of-type:hover': {
                backgroundColor: 'grey',
                fontWeight: 'bold',
                cursor: 'pointer',
            }
        }} />
        <DnDCalendar
            // style= {{height: 800, fontSize: 'clamp(0.75rem, 1vw, 1.2rem)',}}
            style= {{ minHeight: 1000 }}
            // eventOffset={20} // en teoría esto es para el espacio entre eventos
            localizer={localizer}
            // culture='es'                                    // días mes, semana, día en español
            culture={selectedLanguage}                         // días mes, semana, día en español
            events={events}                                 // Personalizando la visualizacion de eventos en el calendario usando el array events
            selectable                                      // habilita la seleccion de celdas
            views={['month', 'work_week', 'day', 'agenda']}
            onView={handleViewChange}
            defaultView='work_week'
            step={saltosTiempo}
            timeslots={saltosHora}
            min={horaMinima}                                // Limitación hora mínima
            max={horaMaxima}                                // Limitacion hora máxima
            onSelectSlot={handleSelectSlot}                 // Crear nuevo evento
            onSelectEvent={handleSelectEvent}               // Editar evento existente
            onEventDrop={handleEventDrop}                   // Permite hacer d&d con eventos, se ejecuta cuando arrastramos un evento y lo soltamos a otra posicion
            draggableAccessor={() => true}                  // Indica si un evento puede ser movido mediante drag and drop.
            // permitir si un evento se puede mover o no a conveniencia mediante una condición
            // draggableAccessor={(event) => event.permiteMover === true}
            resizable={false}                               // No permite ampliar/reducir eventos (su horario)
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
                        `${espacio?.descripcion || 'Sin descripcion'} -`+
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
                        fontSize: ".8rem" // añadido esto
                    }
                }
            }}
            messages={{
                next: t("calendar.next"),
                previous: t("calendar.previous"),
                today: t("calendar.today"),
                month: t("calendar.month"),
                work_week: t("calendar.workweek"),                          // ponemos el texto Semana para work_week, sino aparecería "Work week"
                day: t("calendar.day"),
                agenda: t("calendar.agenda"),
                noEventsInRange: t("calendar.noeventsinrange"),
                showMore: (count) => t("calendar.showmore", { count })  // Usar como función
            }}
        />

        {/* <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={localeEs}> */}
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={localeEs}>
            <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth>
                <DialogTitle>{!isEditing ? actionEventMessage[0] : actionEventMessage[1]}</DialogTitle>
                <DialogContent>
                    <Stack spacing={1} mt={1}> 
                        <FormControl fullWidth margin='dense'>
                            {/*>Usuario *< */}
                            <InputLabel id="select-label-usuario_id">{t("dialogcontents.formcontrol1.inputlabel")} *</InputLabel>
                            <Select
                                labelId="select-label-usuario_id"
                                id="select-usuario_id"
                                label={`${t("dialogcontents.formcontrol1.selectlabel")} *`}
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
                            {/* >Espacio *< */}
                            <InputLabel id="select-label-espacio_id">{t("dialogcontents.formcontrol2.inputlabel")} *</InputLabel>
                            <Select
                                labelId="select-label-espacio_id"
                                id="select-espacio_id"
                                label={`${t("dialogcontents.formcontrol2.selectlabel")} *`}
                                value={eventData.espacio_id}
                                onChange={(e) => setEventData({ ...eventData, espacio_id: e.target.value, repetible: repeatableSpaces.includes(e.target.value)})}
                            >
                                {espacios.map((espacio) => (
                                    <MenuItem key={espacio.espacio_id} value={espacio.espacio_id}>{espacio.descripcion}</MenuItem>

                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin='dense'>
                            {/* >Programa *<*/}
                            <InputLabel id="select-label-programa_id">{t("dialogcontents.formcontrol3.inputlabel")} *</InputLabel>
                            <Select
                                labelId="select-label-programa_id"
                                id="select-programa_id"
                                label={`${t("dialogcontents.formcontrol3.selectlabel")} *`}
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
                                label={`${t("dialogcontents.stackdatetimepickerlabel1")} *`}
                                value={eventData.start}
                                onChange={(newValue) => setEventData({ ...eventData, start: newValue })}
                                slotProps={{ textField: { fullWidth: true, margin: 'dense' } }}
                            />
                            <DateTimePicker
                                label={`${t("dialogcontents.stackdatetimepickerlabel2")} *`}
                                value={eventData.end}
                                onChange={(newValue) => setEventData({ ...eventData, end: newValue })}
                                slotProps={{ textField: { fullWidth: true, margin: 'dense' } }} // forma moderna y sin avisos en consola
                            />
                        </Stack>

                        <TextField
                            fullWidth
                            label={`${t("dialogcontents.textfield")}`}
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
                    {isEditing &&
                        // >Eliminar<
                        <Button onClick={handleDeleteEvent} color="error" variant="contained">{t("buttontexts.text1")}</Button>
                    }
                    {isEditing && !isRepeatableSpace && (
                        // >Repetir<
                        <Button onClick={handleRepeatEvent} variant="contained">{t("buttontexts.text2")}</Button>
                    )}
                    {/* >Guardar< */}
                    <Button onClick={handleSaveEvent} variant="contained">{t("buttontexts.text3")}</Button>
                    {/* >Cancelar< */}
                    <Button onClick={handleCloseDialog} variant="contained">{t("buttontexts.text4")}</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={confirmDeleteOpen} onClose={cancelDelete}>
                {/* >¿Eliminar evento?<*/}
                <DialogTitle>{t("dialogtitles.title1")}</DialogTitle>
                <DialogContent>
                    {/* ¿Estás seguro de que deseas eliminar el evento <strong>{selectedEvent?.title}</strong>? */}
                    ¿{t("dialogcontents.text")} <strong>{selectedEvent?.title}</strong>?
                </DialogContent>
                <DialogActions>
                    {/* >Eliminar< */}
                    <Button onClick={confirmDelete} color="error" variant="contained">{t("buttontexts.text1")}</Button>
                    {/* >Cancelar< */}
                    <Button onClick={cancelDelete} variant="contained">{t("buttontexts.text4")}</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={dialogRepeatOpen} onClose={handleCloseRepeat}>
                {/* >Repetir evento (max. 30)< */}
                <DialogTitle>{t("dialogtitles.title2")}</DialogTitle>
                <DialogContent>
                        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                            <DatePicker
                                label={`${t("dialogcontents.stackdatetimepickerlabel1")} *`}
                                value={eventDataRepeatStart}
                                onChange={(value) => handleEventDataRepeatStart(value)}
                                slotProps={{ textField: { fullWidth: true, margin: 'dense', sx: { mt: 1 }} }}
                            />
                            <DatePicker
                                label={`${t("dialogcontents.stackdatetimepickerlabel2")} *`}
                                value={eventDataRepeatEnd}
                                onChange={(value) => handleEventDataRepeatEnd(value)}
                                slotProps={{ textField: { fullWidth: true, margin: 'dense' }, sx: { mt: 1 } }} // forma moderna y sin avisos en consola
                            />
                        </Stack>
                </DialogContent>
                <DialogActions>
                    {/* >Repetir<*/}
                    <Button onClick={handleSaveRepeat} color="error" variant="contained">{t("buttontexts.text2")}</Button>
                   {/* >Cancelar< */}
                    <Button onClick={handleCloseRepeat} variant="contained">{t("buttontexts.text4")}</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={errorDialogOpen} onClose={() => setErrorDialogOpen(false)}>
                {/* >Advertencia< */}
                <DialogTitle>{t("dialogtitles.title3")}</DialogTitle>
                <DialogContent>{errorDialogMessage}</DialogContent>
                <DialogActions>
                    {/* >Cerrar< */}
                    <Button onClick={() => setErrorDialogOpen(false)} variant="contained" autoFocus>{t("buttontexts.text5")}</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={dialogError} onClose={handleCloseError}>
                {/* >No se puede guardar< */}
                <DialogTitle>{t("dialogtitles.title4")}</DialogTitle>
                <DialogContent>
                    <DialogContent>
                        {errorMessage}
                    </DialogContent>
                    <DialogActions>
                        {/* >Continuar< */}
                        <Button onClick={handleCloseError} variant="contained">{t("buttontexts.text6")}</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
            <Dialog open={dialogRepeatedResultOpen} onClose={handleCloseRepeatedResult}>
                {/* >Resultado Repetición< */}
                <DialogTitle>{t("dialogtitles.title5")}</DialogTitle>
                <DialogContent>
                    <DialogContent>
                        {!errorMessageRepeated &&
                            <Typography>
                                {/* Repetición sin incidencias */}
                                {t("dialogcontents.dialogcontent.typography1")}
                            </Typography>
                        }
                        {errorMessageRepeated &&
                            <>
                                <Typography>
                                    {/* Desde: {eventDataRepeatStart.toLocaleString('es-ES', { */}
                                    {t("dialogcontents.dialogcontent.typography2.text1")}: {eventDataRepeatStart.toLocaleString('es-ES', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                            })}
                                    {/* &nbsp; - Hasta: {eventDataRepeatEnd.toLocaleString('es-ES', { */}
                                    &nbsp; - {t("dialogcontents.dialogcontent.typography2.text2")}: {eventDataRepeatEnd.toLocaleString('es-ES', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                            })}
                                </Typography>
                                <Typography color="error" >
                                    {/* Repetición CON incidencias */}
                                    {t("dialogcontents.dialogcontent.typography3")}
                                </Typography>
                                {errorMessageRepeated.map((error, index) => (
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
                                    {/* >Copiar incidencias<*/}
                                    <Button variant="outlined" onClick={handleCopyToClipboard}>{t("buttontexts.text7")}</Button>
                                </Box>
                            </>
                        }
                    </DialogContent>
                    <DialogActions>
                        {/* >Continuar< */}
                        <Button onClick={handleCloseRepeatedResult} variant="contained">{t("buttontexts.text6")}</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </LocalizationProvider>
    </>
    )
}

export default EventsCalendarComponent;
