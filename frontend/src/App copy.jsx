import React, { useState, useCallback } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { es } from 'date-fns/locale';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { es };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

function App() {
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState(Views.MONTH);

  const handleNavigate = useCallback((newDate) => {
    setDate(newDate);
  }, []);

  const handleViewChange = useCallback((newView) => {
    setView(newView);
  }, []);

  // Manejar clic en espacio vacío para agregar evento
  const handleSelectSlot = useCallback((slotInfo) => {
    const title = prompt('Ingrese el título del evento');
    if (title) {
      const newEvent = {
        title,
        start: slotInfo.start,
        end: slotInfo.end,
        allDay: slotInfo.action === 'click',
      };
      setEvents((prev) => [...prev, newEvent]);
    }
  }, []);

  // Manejar clic en evento (opcional)
  const handleSelectEvent = (event) => {
    alert(`Evento: ${event.title}`);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Calendario con navegación y eventos</h2>
      <Calendar
        localizer={localizer}
        events={events}
        date={date}
        view={view}
        onNavigate={handleNavigate}
        onView={handleViewChange}
        views={['month', 'week', 'day', 'agenda']}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        style={{ height: 700 }}
        messages={{
          next: 'Sig.',
          previous: 'Ant.',
          today: 'Hoy',
          month: 'Mes',
          week: 'Semana',
          day: 'Día',
          agenda: 'Agenda',
        }}
      />
    </div>
  );
}

export default App;
