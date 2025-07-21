// TO DO
// - drag and drop de eventos creados
// - replantear espacios ya que contienen centro y espacio(despacho), crear tabla despachos

import { useState } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { es } from 'date-fns/locale';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
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
  Stack, // en lugar de box usar Stack, que simplifica aún más la organización vertical.

} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es as localeEs } from 'date-fns/locale';

const locales = { es };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const saltosTiempo = 15 // step={15}
const saltosHora = 2 // timeslots={4}
const horaMinima = new Date(1970, 1, 1, 7, 0) // Limitación hora mínima
const horaMaxima =new Date(1970, 1, 1, 21, 0) // Limitacion hora máxima
// const eventColorPalette = ['#1976d2', '#899cafff', '#9c27b0', '#2e7d32', '#66514aff', '#d36900ff', '#009688', '#673ab7', '#3f51b5'];

const personas = [
  { persona_Id: 1, name: "AINTZANE VILLALOBOS", color: "#FFD54F", email: "aintzanev@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 2, name: "AITOR TECEDOR", color: "#81C784", email: "aitort@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 3, name: "ALBA ARANGUREN", color: "#64B5F6", email: "alba@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 4, name: "ALMUDENA MAESTRE", color: "", email: "almudena@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 5, name: "AMANDA NEIRA", color: "", email: "amanda@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 6, name: "ANA MARIA MARTIN", color: "", email: "anamaria@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 7, name: "ANE LOPEZ", color: "", email: "ane@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 8, name: "ARANTZA ARRATIBEL", color: "", email: "arantzaa@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 9, name: "ARANTZA VÁZQUEZ", color: "", email: "arantzav@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 10, name: "ARITZ MANCHADO", color: "", email: "aritzm@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 11, name: "BAKARTXO LOPEZ", color: "", email: "bakartxo@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 12, name: "CARLOS ASENSIO", color: "", email: "carlosa@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 13, name: "CAROLINA FERNANDEZ", color: "", email: "erroak@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 14, name: "CENTRO EMPLEO", color: "", email: "centroempleo@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 15, name: "ELENA ANSOALDE", color: "", email: "elenaa@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 16, name: "EMPLEO ERROAK", color: "", email: "empleo@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 17, name: "ESMERALDA ROMAN", color: "", email: "esmeralda@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 18, name: "ESTIBALIZ ZUGASTI", color: "", email: "ezugasti@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 19, name: "ETOR CARRO", color: "", email: "etorc@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 20, name: "EVA VIRTO", color: "", email: "evav@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 21, name: "GARBIÑE CARTON", color: "", email: "garbine@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 22, name: "HARRERA ERROAK", color: "", email: "harrera@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 23, name: "IDOYA ARTEAGA", color: "", email: "idoya@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 24, name: "IÑAKI LOPE", color: "", email: "lope@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 25, name: "IRATI MAÑERU", color: "", email: "irati@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 26, name: "IRATXE BEOBIDE", color: "", email: "iratxe@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 27, name: "IVALIN DIMITROV", color: "", email: "ivalind@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 28, name: "IZASKUN JIMENEZ", color: "", email: "izaskun@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 29, name: "JONE KRUZELEGI", color: "", email: "jonek@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 30, name: "KIEL RICO", color: "", email: "kiel@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 31, name: "LIERNI ESNAOLA", color: "", email: "liernie@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 32, name: "MAIALEN AROCENA", color: "", email: "maialena@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 33, name: "MAITE ARRETXE", color: "", email: "maite@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 34, name: "MAMEN PAJARES", color: "", email: "mamenp@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 35, name: "MARIVI SAN JUAN", color: "", email: "marivis@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 36, name: "MARKEL LAZARO", color: "", email: "markel@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 37, name: "MIKEL ZUMETA", color: "", email: "mikelz@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 38, name: "MIREN GARCIA", color: "", email: "miren@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 39, name: "NATALIA GONZALEZ", color: "", email: "nataliag@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 40, name: "NEREA AMUNARRIZ", color: "", email: "nereaa@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 41, name: "NICOLETA LOIDI", color: "", email: "nicoletal@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 42, name: "NURIA RUIZ", color: "", email: "nuriarc@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 43, name: "OIHANA MERINO", color: "", email: "oihana@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 44, name: "PEPE LAZARO", color: "", email: "martutene@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 45, name: "PILAR SANSUAN", color: "", email: "pilars@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 46, name: "RAQUEL RUIZ", color: "", email: "raquelr@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 47, name: "ROSA ARANDIA", color: "", email: "arandia@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 48, name: "ROSA OYARZABAL", color: "", email: "rosao@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 49, name: "SHANTI IRIBAR", color: "", email: "shanti@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 50, name: "SONIA TOBIA", color: "", email: "sonia@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 51, name: "SUSANA CARRANZA", color: "", email: "susanac@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 52, name: "TERESA MOREDA", color: "", email: "teresam@erroak.sartu.org", contraseña: "Erro@k2025" , movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: ""},
  { persona_Id: 53, name: "TXELO BERRA", color: "", email: "txelobe@erroak.sartu.org", contraseña: "Erro@k2025", movil: "", extension: "", centro_id: "", llave: true, alarma: true, turno_trabajo: "" }
];

const espacios = [
    { espacio_Id: 1, espacio: "AMARA DESPACHO 0" },
    { espacio_Id: 2, espacio: "AMARA DESPACHO 1" },
    { espacio_Id: 3, espacio: "AMARA DESPACHO 2" },
    { espacio_Id: 4, espacio: "AMARA DESPACHO 3" },
    { espacio_Id: 5, espacio: "AMARA DESPACHO 4" },
    { espacio_Id: 6, espacio: "AMARA DESPACHO 5" },
    { espacio_Id: 7, espacio: "AMARA DESPACHO 6" },
    { espacio_Id: 8, espacio: "AMARA DESPACHO 7" },
    { espacio_Id: 9, espacio: "AMARA DESPACHO 8" },
    { espacio_Id: 10, espacio: "AMARA CENTRO EMPLEO" },
    { espacio_Id: 11, espacio: "AMARA AULA INFORMATICA" },
    { espacio_Id: 12, espacio: "MARTUTENE 12 AULA INFORMÁTICA" },
    { espacio_Id: 13, espacio: "MARTUTENE 12 ELKARREKIN" },
    { espacio_Id: 14, espacio: "MARTUTENE 12 EMARI" },
    { espacio_Id: 15, espacio: "MARTUTENE 12 AURRERA" },
    { espacio_Id: 16, espacio: "MARTUTENE 30 DESPACHO 1" },
    { espacio_Id: 17, espacio: "MARTUTENE 30 DESPACHO 2" },
    { espacio_Id: 18, espacio: "MARTUTENE 30 AULA INFORMÁTICA" },
    { espacio_Id: 19, espacio: "MARTUTENE 30 AULA 1" },
    { espacio_Id: 20, espacio: "MARTUTENE 30 AULA 2" },
    { espacio_Id: 21, espacio: "MARTUTENE 30 SUKALDEA" },
    { espacio_Id: 22, espacio: "MARTUTENE 30 SOCIOSANITARIO" },
    { espacio_Id: 23, espacio: "MARTUTENE 30 CENTRO DE DÍA" },
    { espacio_Id: 24, espacio: "MARTUTENE 30 BIDEAN" },
    { espacio_Id: 25, espacio: "MARTUTENE 30 TABERNA" },
    { espacio_Id: 26, espacio: "MARTUTENE 30 ITURGINTZA" },
    { espacio_Id: 27, espacio: "MARTUTENE 30 SOLDADURA" },
    { espacio_Id: 28, espacio: "AMARA DESPACHO 0 TARDE" },
    { espacio_Id: 29, espacio: "AMARA DESPACHO 1 TARDE" },
    { espacio_Id: 30, espacio: "AMARA DESPACHO 2" },
    { espacio_Id: 31, espacio: "AMARA DESPACHO 3" },
    { espacio_Id: 32, espacio: "AMARA DESPACHO 4" },
    { espacio_Id: 33, espacio: "AMARA DESPACHO 5" },
    { espacio_Id: 34, espacio: "AMARA DESPACHO 6" },
    { espacio_Id: 35, espacio: "AMARA DESPACHO 7" },
    { espacio_Id: 36, espacio: "AMARA DESPACHO 8" },
    { espacio_Id: 37, espacio: "AMARA CENTRO EMPLEO" },
    { espacio_Id: 38, espacio: "AMARA AULA INFORMATICA" },
    { espacio_Id: 39, espacio: "MARTUTENE 12 AULA INFORMÁTICA" },
    { espacio_Id: 40, espacio: "MARTUTENE 12 ELKARREKIN" },
    { espacio_Id: 41, espacio: "MARTUTENE 12 EMARI" },
    { espacio_Id: 42, espacio: "MARTUTENE 12 AURRERA" },
    { espacio_Id: 43, espacio: "MARTUTENE 30 DESPACHO 1" },
    { espacio_Id: 44, espacio: "MARTUTENE 30 DESPACHO 2" },
    { espacio_Id: 45, espacio: "MARTUTENE 30 AULA INFORMÁTICA" },
    { espacio_Id: 46, espacio: "MARTUTENE 30 AULA 1" },
    { espacio_Id: 47, espacio: "MARTUTENE 30 AULA 2" },
    { espacio_Id: 48, espacio: "MARTUTENE 30 SUKALDEA" },
    { espacio_Id: 49, espacio: "MARTUTENE 30 SOCIOSANITARIO" },
    { espacio_Id: 50, espacio: "MARTUTENE 30 CENTRO DE DÍA" },
    { espacio_Id: 51, espacio: "MARTUTENE 30 BIDEAN" },
    { espacio_Id: 52, espacio: "MARTUTENE 30 TABERNA" },
    { espacio_Id: 53, espacio: "MARTUTENE 30 ITURGINTZA" },
    { espacio_Id: 54, espacio: "MARTUTENE 30 SOLDADURA" }
]

const programas = [
    { programa_Id: 1, programa: "LANBIDE"},
    { programa_Id: 2, programa: "INCORPORA"},
    { programa_Id: 3, programa: "SENDOTU"},
    { programa_Id: 4, programa: "EMARI"},
    { programa_Id: 5, programa: "ELKARREKIN"},
    { programa_Id: 6, programa: "AURRERA"},
    { programa_Id: 7, programa: "BIDEAN"},
    { programa_Id: 8, programa: "EGUNEKO ZENTRO"},
]

const centros = [
    { centro_Id: 1, centro: "AMARA"},
    { centro_Id: 2, centro: "MARTUTENE 12"},
    { centro_Id: 3, centro: "MARTUTENE 30"},
    { centro_Id: 4, centro: "EXTERIOR"},
]

const App = () => {
        

    const [events, setEvents] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [eventData, setEventData] = useState({
        // event_id: Date.now(), 
        // title: '',
        // notes: '',
        // start: new Date(),
        // end: new Date(),
        // user_id: '',
        // chosenColor: 0
        event_id: Date.now(), 
        persona_Id: '',
        espacio_Id: '',
        programa_Id: '',
        start: new Date(),
        end: new Date(),
        observaciones: '',
        color: ''
    });
    const [date, setDate] = useState(new Date());
    // const [view, setView] = useState(Views.WORK_WEEK);   // POR DEFECTO VISTA MES
    const [view, setView] = useState(Views.WORK_WEEK);      // POR DEFECTO VISTA SEMANA LABORAL
    const [isEditing, setIsEditing] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [errorDialogMessage, setErrorDialogMessage] = useState('');
    const [actionEventMessage, setActionEventMessage] = useState(['Agregar', 'Editar'])
    const [usedColors, setUsedColors] = useState([]); // backgroundColor del evento

    const handleNavigate = (newDate) => { // Permite desplazar de fecha del calendario
        setDate(newDate);
    };

    const handleViewChange = (newView) => { // Permite cambiar la vista del calendario
        if (newView === 'week') {
            setView('work_week'); // Forzamos semana laboral
        } else {
            setView(newView);
        }
    };

    // Creando un nuevo evento
    const handleSelectSlot = (slotInfo) => {
        // debugger
        // const { start, end } = getDefaultTimes();
        let { start, end } = slotInfo;

        // Si es fin de semana, no permitir (opcional según el comentario)
        const isWeekend = start.getDay() === 0 || start.getDay() === 6;
        if (isWeekend) {
            setErrorDialogMessage('Solo se permiten eventos en días laborales.');
            setErrorDialogOpen(true);
            return;
        }

        // ✅ Generar un ID único combinando timestamp + aleatorio
        let newEventId = Date.now() + Math.floor(Math.random() * 100000);

        // Asegurarse que no se repita ID
        while (events.some(e => e.event_id === newEventId)) {
            newEventId = Date.now() + Math.floor(Math.random() * 100000);
        }

        // Generando el evento
        setEventData({
            event_id: newEventId, 
            persona_Id: '',
            espacio_Id: '',
            programa_Id: '',
            start,
            end,
            observaciones: '',
            color: ''

        });
        setIsEditing(false);
        setSelectedEvent(null);
        setDialogOpen(true);
    };

    // Editando un evento
    const handleSelectEvent = (event) => {
        setEventData({ ...event });
        setIsEditing(true);
        setSelectedEvent(event);
        setDialogOpen(true);
    };

    // Guardando eventos creados / editados
    const handleSaveEvent = () => { 
        // debugger
        // Validar que las horas estén dentro del rango permitido
        const minTime = new Date(eventData.start);
        minTime.setHours(horaMinima.getHours(), horaMinima.getMinutes());

        const maxTime = new Date(eventData.start);
        maxTime.setHours(horaMaxima.getHours(), horaMaxima.getMinutes());

        // if (eventData.observaciones.length < 1) {
        //     setErrorDialogMessage('Introducir observaciones del evento');
        //     setErrorDialogOpen(true);
        //     return;
        // }

        // Limitar inicio y fin si están fuera de los límites
        if (eventData.start >= eventData.end) {
            setErrorDialogMessage('La hora de inicio debe ser menor que la hora de fin.');
            setErrorDialogOpen(true);
            return;
        }

        if (eventData.start < minTime || eventData.end > maxTime) {
            // setErrorDialogMessage('La hora del evento debe estar entre 07:00 y 21:00.');
            setErrorDialogMessage(`La hora del evento debe estar entre ${horaMinima.getHours()}hrs y ${horaMaxima.getHours()}hrs.`);
            setErrorDialogOpen(true);
            return;
        }

        const day = eventData.start.getDay();
        if (day === 0 || day === 6) {
            setErrorDialogMessage('Solo se permiten eventos en días laborales.');
            setErrorDialogOpen(true);
            return;
        }

        if (eventData.persona_Id < 1) {
            setErrorDialogMessage('Seleccionar una Persona');
            setErrorDialogOpen(true);
            return;
        }

        if (eventData.programa_Id < 1) {
            setErrorDialogMessage('Seleccionar un Programa');
            setErrorDialogOpen(true);
            return;
        }

        if (isEditing && selectedEvent) {
            setEvents(events.map(ev => ev.event_id === selectedEvent.event_id ? eventData : ev));
        } else {
            setEvents([...events, eventData]);
        }
        handleCloseDialog();
    };

    const handleDeleteEvent = () => {
        setConfirmDeleteOpen(true);
    };

    const confirmDelete = () => {
        if (!selectedEvent || !selectedEvent.event_id) {
            setErrorDialogMessage('No hay evento válido para eliminar.');
            setErrorDialogOpen(true);
            return;
        }

        setEvents(events.filter(ev => ev.event_id !== selectedEvent.event_id));
        setConfirmDeleteOpen(false);
        setDialogOpen(false);
    };

    const cancelDelete = () => {
        setConfirmDeleteOpen(false);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    // Personalizando la visualizacion de eventos en el calendario, por defecto "start-end title"
    const CustomEvent = ({ event }) => {
        const persona = personas.find(p => p.persona_Id === event.persona_Id);
        const programa = programas.find(p => p.programa_Id === event.programa_Id);

        return (
            <div>
                <strong>{persona?.name || 'Sin nombre'}</strong> {programa?.programa || 'Sin nombre'}
            </div>
        );
    };

  return (
    <div style={{ padding: 20 }}>
      <h2>Calendario con formulario MUI</h2>
      <Calendar
        localizer={localizer}
        culture='es'                                    // días mes, semana, día en español
        events={events}                                 // Personalizando la visualizacion de eventos en el calendario
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
        tooltipAccessor={(event) => {                   // Muestra "start - end" y otros al pasar el cursor por encima
            const persona = personas.find(p => p.persona_Id === event.persona_Id);
            const programa = programas.find(p => p.programa_Id === event.programa_Id);
            // si ponemos persona?.name y no persona.name, en caso de que programa no exista, obtenemos un crash con error en ejecución
            // Pero si ponemos persona?.name y no existe obtenemos un undefined y el programa sigue su curso
            return `${persona?.name || 'Sin nombre'} - ${programa?.programa || 'Sin programa'}  — ${format(event.start, 'HH:mm')} - ${format(event.end, 'HH:mm')}`;
        }}

        eventPropGetter={(event) => {                   // Estilo visual de cada evento
            const user = personas.find(u => u.persona_Id === event.persona_Id);
            const backgroundColor = user?.color || '#BDBDBD';
            return {    // retornando un style por eso el return tiene {} en lugar de ()
                style: {
                    backgroundColor,
                    color: 'white',
                    borderRadius: '4px',
                    border: '1px solid black',
                    padding: '4px',
                }
            }
        }}
        messages={{
          next: 'Sig.',
          previous: 'Ant.',
          today: 'Hoy',
          month: 'Mes',
        //   week: 'Semana',                            // No se usa porque usamos work_week
          work_week: "Semana",                          // ponemos el texto Semana para work_week, sino aparecería "Work week"
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
                        <InputLabel id="select-label-persona_Id">Persona *</InputLabel>
                        <Select
                            // fullWidth
                            labelId="select-label-persona_Id"
                            id="select-persona_Id"
                            label="Persona *"
                            value={eventData.persona_Id}
                            onChange={(e) => setEventData({ ...eventData, persona_Id: e.target.value})}
                        >
                            {personas.map((persona) => (
                                <MenuItem key={persona.persona_Id} value={persona.persona_Id}>{persona.name}</MenuItem>

                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin='dense'>
                        <InputLabel id="select-label-espacio_Id">Espacio</InputLabel>
                        <Select
                            // fullWidth
                            labelId="select-label-espacio_Id"
                            id="select-espacio_Id"
                            label="Espacio"
                            value={eventData.espacio_Id}
                            onChange={(e) => setEventData({ ...eventData, espacio_Id: e.target.value})}
                        >
                            {espacios.map((espacio) => (
                                <MenuItem key={espacio.espacio_Id} value={espacio.espacio_Id}>{espacio.espacio}</MenuItem>

                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin='dense'>
                        <InputLabel id="select-label-programa_Id">Programa *</InputLabel>
                        <Select
                            // fullWidth // al ser un FormControl no es necesario
                            labelId="select-label-programa_Id"
                            id="select-programa_Id"
                            label="Programa *"
                            value={eventData.programa_Id}
                            onChange={(e) => setEventData({ ...eventData, programa_Id: e.target.value})}
                        >
                            {programas.map((programa) => (
                                <MenuItem key={programa.programa_Id} value={programa.programa_Id}>{programa.programa}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                        <DateTimePicker
                            label="Inicio *"
                            value={eventData.start}
                            onChange={(newValue) => setEventData({ ...eventData, start: newValue })}
                            // renderInput={(params) => <TextField {...params} margin="dense" fullWidth />}
                            slotProps={{ textField: { fullWidth: true, margin: 'dense' } }}
                        />
                        <DateTimePicker
                            label="Fin *"
                            value={eventData.end}
                            onChange={(newValue) => setEventData({ ...eventData, end: newValue })}
                            // renderInput={(params) => <TextField {...params} margin="dense" fullWidth />} // forma antigua
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
                    <Button onClick={handleDeleteEvent} color="error">
                    Eliminar
                    </Button>
            )}
                <Button onClick={handleCloseDialog}>Cancelar</Button>
                <Button onClick={handleSaveEvent} variant="contained">Guardar</Button>
            </DialogActions>
        </Dialog>
        <Dialog open={confirmDeleteOpen} onClose={cancelDelete}>
            <DialogTitle>¿Eliminar evento?</DialogTitle>
            <DialogContent>
                ¿Estás seguro de que deseas eliminar el evento <strong>{selectedEvent?.title}</strong>?
            </DialogContent>
            <DialogActions>
                <Button onClick={cancelDelete}>Cancelar</Button>
                <Button onClick={confirmDelete} color="error" variant="contained">Eliminar</Button>
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
      </LocalizationProvider>
    </div>
  );
}

export default App;
