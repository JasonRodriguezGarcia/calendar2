// TO DO
// - modificar creacion/edicion evento para que tenga los siguientes campos, hay que cambiar un mónton de cosas
    // persona
    // espacio
    // programa
    // inicio-fin
    // observaciones


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
const eventColorPalette = ['#1976d2', '#899cafff', '#9c27b0', '#2e7d32', '#66514aff', '#d36900ff', '#009688', '#673ab7', '#3f51b5'];

const personas = [
  { id: 1, name: "AINTZANE VILLALOBOS", color: "#FFD54F", email: "aintzanev@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 2, name: "AITOR TECEDOR", color: "#81C784", email: "aitort@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 3, name: "ALBA ARANGUREN", color: "#64B5F6", email: "alba@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 4, name: "ALMUDENA MAESTRE", color: "", email: "almudena@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 5, name: "AMANDA NEIRA", color: "", email: "amanda@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 6, name: "ANA MARIA MARTIN", color: "", email: "anamaria@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 7, name: "ANE LOPEZ", color: "", email: "ane@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 8, name: "ARANTZA ARRATIBEL", color: "", email: "arantzaa@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 9, name: "ARANTZA VÁZQUEZ", color: "", email: "arantzav@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 10, name: "ARITZ MANCHADO", color: "", email: "aritzm@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 11, name: "BAKARTXO LOPEZ", color: "", email: "bakartxo@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 12, name: "CARLOS ASENSIO", color: "", email: "carlosa@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 13, name: "CAROLINA FERNANDEZ", color: "", email: "erroak@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 14, name: "CENTRO EMPLEO", color: "", email: "centroempleo@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 15, name: "ELENA ANSOALDE", color: "", email: "elenaa@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 16, name: "EMPLEO ERROAK", color: "", email: "empleo@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 17, name: "ESMERALDA ROMAN", color: "", email: "esmeralda@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 18, name: "ESTIBALIZ ZUGASTI", color: "", email: "ezugasti@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 19, name: "ETOR CARRO", color: "", email: "etorc@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 20, name: "EVA VIRTO", color: "", email: "evav@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 21, name: "GARBIÑE CARTON", color: "", email: "garbine@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 22, name: "HARRERA ERROAK", color: "", email: "harrera@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 23, name: "IDOYA ARTEAGA", color: "", email: "idoya@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 24, name: "IÑAKI LOPE", color: "", email: "lope@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 25, name: "IRATI MAÑERU", color: "", email: "irati@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 26, name: "IRATXE BEOBIDE", color: "", email: "iratxe@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 27, name: "IVALIN DIMITROV", color: "", email: "ivalind@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 28, name: "IZASKUN JIMENEZ", color: "", email: "izaskun@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 29, name: "JONE KRUZELEGI", color: "", email: "jonek@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 30, name: "KIEL RICO", color: "", email: "kiel@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 31, name: "LIERNI ESNAOLA", color: "", email: "liernie@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 32, name: "MAIALEN AROCENA", color: "", email: "maialena@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 33, name: "MAITE ARRETXE", color: "", email: "maite@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 34, name: "MAMEN PAJARES", color: "", email: "mamenp@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 35, name: "MARIVI SAN JUAN", color: "", email: "marivis@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 36, name: "MARKEL LAZARO", color: "", email: "markel@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 37, name: "MIKEL ZUMETA", color: "", email: "mikelz@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 38, name: "MIREN GARCIA", color: "", email: "miren@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 39, name: "NATALIA GONZALEZ", color: "", email: "nataliag@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 40, name: "NEREA AMUNARRIZ", color: "", email: "nereaa@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 41, name: "NICOLETA LOIDI", color: "", email: "nicoletal@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 42, name: "NURIA RUIZ", color: "", email: "nuriarc@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 43, name: "OIHANA MERINO", color: "", email: "oihana@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 44, name: "PEPE LAZARO", color: "", email: "martutene@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 45, name: "PILAR SANSUAN", color: "", email: "pilars@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 46, name: "RAQUEL RUIZ", color: "", email: "raquelr@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 47, name: "ROSA ARANDIA", color: "", email: "arandia@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 48, name: "ROSA OYARZABAL", color: "", email: "rosao@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 49, name: "SHANTI IRIBAR", color: "", email: "shanti@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 50, name: "SONIA TOBIA", color: "", email: "sonia@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 51, name: "SUSANA CARRANZA", color: "", email: "susanac@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 52, name: "TERESA MOREDA", color: "", email: "teresam@erroak.sartu.org", contraseña: "Erro@k2025" },
  { id: 53, name: "TXELO BERRA", color: "", email: "txelobe@erroak.sartu.org", contraseña: "Erro@k2025" }
];

const espacios = [
    { espacio_id: 1, espacio: "AMARA DESPACHO 0" },
    { espacio_id: 2, espacio: "AMARA DESPACHO 1" },
    { espacio_id: 3, espacio: "AMARA DESPACHO 2" },
    { espacio_id: 4, espacio: "AMARA DESPACHO 3" },
    { espacio_id: 5, espacio: "AMARA DESPACHO 4" },
    { espacio_id: 6, espacio: "AMARA DESPACHO 5" },
    { espacio_id: 7, espacio: "AMARA DESPACHO 6" },
    { espacio_id: 8, espacio: "AMARA DESPACHO 7" },
    { espacio_id: 9, espacio: "AMARA DESPACHO 8" },
    { espacio_id: 10, espacio: "AMARA CENTRO EMPLEO" },
    { espacio_id: 11, espacio: "AMARA AULA INFORMATICA" },
    { espacio_id: 12, espacio: "MARTUTENE 12 AULA INFORMÁTICA" },
    { espacio_id: 13, espacio: "MARTUTENE 12 ELKARREKIN" },
    { espacio_id: 14, espacio: "MARTUTENE 12 EMARI" },
    { espacio_id: 15, espacio: "MARTUTENE 12 AURRERA" },
    { espacio_id: 16, espacio: "MARTUTENE 30 DESPACHO 1" },
    { espacio_id: 17, espacio: "MARTUTENE 30 DESPACHO 2" },
    { espacio_id: 18, espacio: "MARTUTENE 30 AULA INFORMÁTICA" },
    { espacio_id: 19, espacio: "MARTUTENE 30 AULA 1" },
    { espacio_id: 20, espacio: "MARTUTENE 30 AULA 2" },
    { espacio_id: 21, espacio: "MARTUTENE 30 SUKALDEA" },
    { espacio_id: 22, espacio: "MARTUTENE 30 SOCIOSANITARIO" },
    { espacio_id: 23, espacio: "MARTUTENE 30 CENTRO DE DÍA" },
    { espacio_id: 24, espacio: "MARTUTENE 30 BIDEAN" },
    { espacio_id: 25, espacio: "MARTUTENE 30 TABERNA" },
    { espacio_id: 26, espacio: "MARTUTENE 30 ITURGINTZA" },
    { espacio_id: 27, espacio: "MARTUTENE 30 SOLDADURA" },
    { espacio_id: 28, espacio: "AMARA DESPACHO 0 TARDE" },
    { espacio_id: 29, espacio: "AMARA DESPACHO 1 TARDE" },
    { espacio_id: 30, espacio: "AMARA DESPACHO 2" },
    { espacio_id: 31, espacio: "AMARA DESPACHO 3" },
    { espacio_id: 32, espacio: "AMARA DESPACHO 4" },
    { espacio_id: 33, espacio: "AMARA DESPACHO 5" },
    { espacio_id: 34, espacio: "AMARA DESPACHO 6" },
    { espacio_id: 35, espacio: "AMARA DESPACHO 7" },
    { espacio_id: 36, espacio: "AMARA DESPACHO 8" },
    { espacio_id: 37, espacio: "AMARA CENTRO EMPLEO" },
    { espacio_id: 38, espacio: "AMARA AULA INFORMATICA" },
    { espacio_id: 39, espacio: "MARTUTENE 12 AULA INFORMÁTICA" },
    { espacio_id: 40, espacio: "MARTUTENE 12 ELKARREKIN" },
    { espacio_id: 41, espacio: "MARTUTENE 12 EMARI" },
    { espacio_id: 42, espacio: "MARTUTENE 12 AURRERA" },
    { espacio_id: 43, espacio: "MARTUTENE 30 DESPACHO 1" },
    { espacio_id: 44, espacio: "MARTUTENE 30 DESPACHO 2" },
    { espacio_id: 45, espacio: "MARTUTENE 30 AULA INFORMÁTICA" },
    { espacio_id: 46, espacio: "MARTUTENE 30 AULA 1" },
    { espacio_id: 47, espacio: "MARTUTENE 30 AULA 2" },
    { espacio_id: 48, espacio: "MARTUTENE 30 SUKALDEA" },
    { espacio_id: 49, espacio: "MARTUTENE 30 SOCIOSANITARIO" },
    { espacio_id: 50, espacio: "MARTUTENE 30 CENTRO DE DÍA" },
    { espacio_id: 51, espacio: "MARTUTENE 30 BIDEAN" },
    { espacio_id: 52, espacio: "MARTUTENE 30 TABERNA" },
    { espacio_id: 53, espacio: "MARTUTENE 30 ITURGINTZA" },
    { espacio_id: 54, espacio: "MARTUTENE 30 SOLDADURA" }
]

const programas = [
    { programa_id: 1, programa: "LANBIDE"},
    { programa_id: 2, programa: "INCORPORA"},
    { programa_id: 3, programa: "SENDOTU"},
    { programa_id: 4, programa: "EMARI"},
    { programa_id: 5, programa: "ELKARREKIN"},
    { programa_id: 6, programa: "AURRERA"},
    { programa_id: 7, programa: "BIDEAN"},
    { programa_id: 8, programa: "EGUNEKO ZENTRO"},
]
const App = () => {
        

    const [events, setEvents] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [eventData, setEventData] = useState({
        event_id: Date.now(), 
        title: '',
        notes: '',
        start: new Date(),
        end: new Date(),
        user_id: '',
        chosenColor: 0
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

        // Buscar un color no usado
        const availableColors = eventColorPalette.filter(c => !usedColors.includes(c));

        // Si ya se usaron todos, reiniciar la lista
        let chosenColor;
        if (availableColors.length > 0) {
            chosenColor = availableColors[Math.floor(Math.random() * availableColors.length)];
        } else {
            chosenColor = eventColorPalette[Math.floor(Math.random() * eventColorPalette.length)];
            setUsedColors([]); // reinicia para permitir reutilización
        }

        // Añadir color a usados
        setUsedColors(prev => [...prev, chosenColor]);

        // Generando el evento
        setEventData({
            event_id: newEventId,
            title: '',
            notes: '',
            start,
            end,
            user_id: '',
            color: chosenColor
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

        if (eventData.title.length < 1) {
            setErrorDialogMessage('Introducir título del evento');
            setErrorDialogOpen(true);
            return;
        }

        if (eventData.notes.length < 1) {
            setErrorDialogMessage('Introducir notas del evento');
            setErrorDialogOpen(true);
            return;
        }

        // Limitar inicio y fin si están fuera de los límites
        if (eventData.start >= eventData.end) {
            setErrorDialogMessage('La hora de inicio debe ser menor que la hora de fin.');
            setErrorDialogOpen(true);
            return;
        }

        if (eventData.start < minTime || eventData.end > maxTime) {
            setErrorDialogMessage('La hora del evento debe estar entre 07:00 y 21:00.');
            setErrorDialogOpen(true);
            return;
        }

        const day = eventData.start.getDay();
        if (day === 0 || day === 6) {
            setErrorDialogMessage('Solo se permiten eventos en días laborales.');
            setErrorDialogOpen(true);
            return;
        }

        // if (eventData.user_id < 1) {
        //     setErrorDialogMessage('Seleccionar un User Id');
        //     setErrorDialogOpen(true);
        //     return;
        // }

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
        return (
            <div>
                <strong>{event.title}</strong> {event.user_id}
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
        tooltipAccessor={(event) =>                     // Muestra "start - end" y otros al pasar el cursor por encima
            `${event.title} ${event.user_id} — ${format(event.start, 'HH:mm')} - ${format(event.end, 'HH:mm')}`
        }
        eventPropGetter={(event) => {
            const user = personas.find(u => u.id === event.user_id);
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
          {/* <DialogTitle>Agregar evento</DialogTitle> */}
          <DialogTitle>{!isEditing ? actionEventMessage[0] : actionEventMessage[1]} evento</DialogTitle>
          <DialogContent>
            {/* spacing 2 = 16px */}
            <Stack spacing={1}> 
                <TextField
                    fullWidth
                    label="Título"
                    name="title"
                    value={eventData.title}
                    onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                    margin="dense"
                />
                <TextField
                    fullWidth
                    label="Notas"
                    name="notes"
                    value={eventData.notes}
                    onChange={(e) => setEventData({ ...eventData, notes: e.target.value })}
                    margin="dense"
                    multiline
                    rows={3}
                />
                <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                    <DateTimePicker
                        label="Inicio"
                        value={eventData.start}
                        onChange={(newValue) => setEventData({ ...eventData, start: newValue })}
                        // renderInput={(params) => <TextField {...params} margin="dense" fullWidth />}
                        slotProps={{ textField: { fullWidth: true, margin: 'dense' } }}
                    />
                    <DateTimePicker
                        label="Fin"
                        value={eventData.end}
                        onChange={(newValue) => setEventData({ ...eventData, end: newValue })}
                        // renderInput={(params) => <TextField {...params} margin="dense" fullWidth />}
                        slotProps={{ textField: { fullWidth: true, margin: 'dense' } }}
                    />
                </Stack>
                <FormControl fullWidth margin='dense'>
                    <InputLabel id="select-label-user_id">User Id</InputLabel>
                    <Select
                        // fullWidth
                        labelId="select-label-user_id"
                        id="select-user_id"
                        label="User Id"
                        value={eventData.user_id}
                        // label="User_id"
                        onChange={(e) => setEventData({ ...eventData, user_id: e.target.value})}
                    >
                        {personas.map((user) => (
                            <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>

                        ))}
                        {/* <MenuItem value={0}> </MenuItem>
                        <MenuItem value={2}>Maria</MenuItem>
                        <MenuItem value={3}>Juan</MenuItem> */}
                    </Select>
                </FormControl>
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
