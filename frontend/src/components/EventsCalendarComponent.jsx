// TO DO
// - replantear espacios ya que contienen centro y espacio(despacho), crear tabla despachos

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
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

const DnDCalendar = withDragAndDrop(Calendar);
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

const EventsCalendarComponent = ({ logged, setLogged } ) => {
    const navigate = useNavigate();
    
    const [events, setEvents] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [eventData, setEventData] = useState({
        event_id: Date.now(), 
        usuario_Id: '',
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

    // Si no está logeado se sale del componente
    if (!logged) return null    // con esta opción ni siquiera se muestra brevemente EventsCalendarComponent
        // navigate("/")        // con esta opción se muestra brevemente y luego pasa a "/"

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
            usuario_Id: '',
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
        // debugger
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

        if (eventData.usuario_Id < 1) {
            setErrorDialogMessage('Seleccionar un Usuario');
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

    const handleEventDrop = ({ event, start, end }) => {
        // debugger
        const day = start.getDay();
        if (day === 0 || day === 6) {
            setErrorDialogMessage('Solo se permiten eventos en días laborales.');
            setErrorDialogOpen(true);
            return;
        }

        const updatedEvent = { ...event, start, end };
        setEvents(prevEvents =>
            prevEvents.map(ev => (ev.event_id === event.event_id ? updatedEvent : ev))
        );
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
        const usuario = usuarios.find(p => p.usuario_Id === event.usuario_Id);
        const programa = programas.find(p => p.programa_Id === event.programa_Id);

        return (
            <div>
                <strong>{usuario?.name || 'Sin nombre'}</strong> - {programa?.programa || 'Sin nombre'}
            </div>
        );
    };

  return (
    // <div style={{ padding: 20 }}>
    <>
        <Toolbar />
      <h2>EVENTOS</h2>
      {/* <Calendar */}
      <DnDCalendar
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
        onEventDrop={handleEventDrop}                   // Permite hacer d&d con eventos, se ejecuta cuando arrastramos un evento y lo soltamos a otra posicion
        draggableAccessor={() => true}                  // Indica si un evento puede ser movido mediante drag and drop.
        // permitir si un evento se puede mover o no a conveniencia mediante una condición
        // draggableAccessor={(event) => event.permiteMover === true}
        resizable={false}                               // No permite ampliar/reducir eventos (su horario)
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
            const usuario = usuarios.find(p => p.usuario_Id === event.usuario_Id);
            const programa = programas.find(p => p.programa_Id === event.programa_Id);
            // si ponemos usuario?.name y no usuario.name, en caso de que programa no exista, obtenemos un crash con error en ejecución
            // Pero si ponemos usuario?.name y no existe obtenemos un undefined y el programa sigue su curso
            return `${usuario?.name || 'Sin nombre'} - ${programa?.programa || 'Sin programa'}  — ${format(event.start, 'HH:mm')} - ${format(event.end, 'HH:mm')}`;
        }}

        eventPropGetter={(event) => {                   // Estilo visual de cada evento
            const user = usuarios.find(u => u.usuario_Id === event.usuario_Id);
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
                        <InputLabel id="select-label-usuario_Id">Usuario *</InputLabel>
                        <Select
                            // fullWidth
                            labelId="select-label-usuario_Id"
                            id="select-usuario_Id"
                            label="Usuario *"
                            value={eventData.usuario_Id}
                            onChange={(e) => setEventData({ ...eventData, usuario_Id: e.target.value})}
                        >
                            {usuarios.map((usuario) => (
                                <MenuItem key={usuario.usuario_Id} value={usuario.usuario_Id}>{usuario.name}</MenuItem>

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
    {/* </div> */}
    </>
  );
}

export default EventsCalendarComponent;
