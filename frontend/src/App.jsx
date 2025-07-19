// TO DO
// - ver si permite fields

import React, { useState } from 'react';
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

function App() {
        
        
    const saltosTiempo = 15 // step={15}
    const saltosHora = 2 // timeslots={4}
    const horaMinima = new Date(1970, 1, 1, 7, 0) // Limitación hora mínima
    const horaMaxima =new Date(1970, 1, 1, 21, 0) // Limitacion hora máxima

    const [events, setEvents] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [eventData, setEventData] = useState({
        event_id: Date.now(), 
        title: '',
        notes: '',
        start: new Date(),
        end: new Date(),
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

    // function getDefaultTimes() {
    //     const baseDate = new Date()
    //     const start = new Date(baseDate);
    //     start.setMinutes(0, 0, 0); // minutos, segundos, milisegundos = 0

    //     const end = new Date(start);
    //     end.setHours(end.getHours() + 1);

    //     return { start, end };
    // }

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

    // Al hacer clic en una celda, la función handleSelectSlot recibe un objeto "slotInfo" con esta forma:
    // {
    //     start: Date,
    //     end: Date,
    //     slots: Date[],
    //     action: 'select' | 'click' | 'doubleClick'
    // }
    // Necesitamos usar slotInfo.start y slotInfo.end como start y end del evento nuevo.

    // Creando un nuevo evento
    const handleSelectSlot = (slotInfo) => {
        debugger
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

        // Asegurarse que no se repita
        while (events.some(e => e.event_id === newEventId)) {
            newEventId = Date.now() + Math.floor(Math.random() * 100000);
        }

        setEventData({
            event_id: newEventId,
            title: '',
            notes: '',
            start,
            end,
        });
        setIsEditing(false);
        setSelectedEvent(null);
        setDialogOpen(true);
    };

    const handleSelectEvent = (event) => {
        setEventData({ ...event });
        setIsEditing(true);
        setSelectedEvent(event);
        setDialogOpen(true);
    };

    // Guardando eventos creados / editados
    const handleSaveEvent = () => { 
        debugger
        // Validar que las horas estén dentro del rango permitido
        const minTime = new Date(eventData.start);
        minTime.setHours(horaMinima.getHours(), horaMinima.getMinutes());

        const maxTime = new Date(eventData.start);
        maxTime.setHours(horaMaxima.getHours(), horaMaxima.getMinutes());

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

  return (
    <div style={{ padding: 20 }}>
      <h2>Calendario con formulario MUI</h2>
      <Calendar
        localizer={localizer}
        events={events}
        selectable // habilita la seleccion de celdas
        views={['month', 'work_week', 'day', 'agenda']}
        onView={handleViewChange}
        defaultView='work_week'
        step={saltosTiempo}
        timeslots={saltosHora}
        min={horaMinima} // Limitación hora mínima
        max={horaMaxima} // Limitacion hora máxima
        onSelectSlot={handleSelectSlot}     // Crear nuevo evento
        onSelectEvent={handleSelectEvent}   // Editar evento existente
        style={{ height: 700 }}
        date={date}
        view={view}
        onNavigate={handleNavigate}
        messages={{
          next: 'Sig.',
          previous: 'Ant.',
          today: 'Hoy',
          month: 'Mes',
        //   week: 'Semana',       // No se usa porque usamos work_week
          work_week: "Semana",  // ponemos el texto Semana para work_week, sino aparecería "Work week"
          day: 'Día',
          agenda: 'Agenda',
        }}
      />

      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={localeEs}>
        <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth>
          {/* <DialogTitle>Agregar evento</DialogTitle> */}
          <DialogTitle>{!isEditing ? actionEventMessage[0] : actionEventMessage[1]} evento</DialogTitle>
          <DialogContent>
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
            <DateTimePicker
              label="Inicio"
              value={eventData.start}
              onChange={(newValue) => setEventData({ ...eventData, start: newValue })}
              renderInput={(params) => <TextField {...params} margin="dense" fullWidth />}
            />
            <DateTimePicker
              label="Fin"
              value={eventData.end}
              onChange={(newValue) => setEventData({ ...eventData, end: newValue })}
              renderInput={(params) => <TextField {...params} margin="dense" fullWidth />}
            />
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
