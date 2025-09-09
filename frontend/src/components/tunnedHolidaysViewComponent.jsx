import { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Stack,
  Button,
  Typography,
  Toolbar,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useTheme,
} from '@mui/material';

import { es } from 'date-fns/locale';
import {
  addDays,
  format,
  isSameDay,
  startOfMonth,
  endOfMonth,
  differenceInCalendarDays,
} from 'date-fns';

const HolidaysViewComponent = ({ logged, user }) => {
  const VITE_BACKEND_URL_RENDER = import.meta.env.VITE_BACKEND_URL_RENDER;
  const theme = useTheme();

  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(new Date());
  const [diasUsadosVacaciones, setDiasUsadosVacaciones] = useState(0);

  // Generar días para 3 meses (mes anterior, actual y siguiente)
  const days = useMemo(() => {
    const start = startOfMonth(new Date(date.getFullYear(), date.getMonth() - 1));
    const end = endOfMonth(new Date(date.getFullYear(), date.getMonth() + 1));
    const arr = [];
    let current = start;
    while (current <= end) {
      arr.push(new Date(current));
      current = addDays(current, 1);
    }
    return arr;
  }, [date]);

  // Cabeceras de meses con colspan
  const monthHeaders = useMemo(() => {
    const months = [];
    let lastMonth = null;
    let count = 0;

    days.forEach((day, i) => {
      const monthKey = format(day, 'MMMM yyyy', { locale: es });
      if (monthKey !== lastMonth) {
        if (lastMonth !== null) {
          months.push({ label: lastMonth, colspan: count });
        }
        lastMonth = monthKey;
        count = 1;
      } else {
        count++;
      }
    });

    // Añadir el último mes
    if (lastMonth !== null) {
      months.push({ label: lastMonth, colspan: count });
    }

    return months;
  }, [days]);

//   const fetchCheckHolidays = async () => {
//     try {
//       const response = await fetch(`${VITE_BACKEND_URL_RENDER}/api/v1/erroak/vacaciones/count/${user.id}/${date.getFullYear()}`);
//       const data = await response.json();
//       setDiasUsadosVacaciones(parseInt(data.count));
//     } catch (error) {
//       console.error("Error cargando vacaciones/count:", error);
//     }
//   };

  const fetchEventos = async () => {
    const start = startOfMonth(new Date(date.getFullYear(), date.getMonth() - 1));
    const end = endOfMonth(new Date(date.getFullYear(), date.getMonth() + 1));
    try {
      const response = await fetch(
        `${VITE_BACKEND_URL_RENDER}/api/v1/erroak/vacaciones/${user.id}/${start.toISOString()}/${end.toISOString()}`
      );
      const data = await response.json();
      const formatted = data.map(vacacion => ({
        ...vacacion,
        start: new Date(vacacion.start),
        end: new Date(vacacion.end),
        cellColor: vacacion.cell_color,
      }));
      setEvents(formatted);
    } catch (error) {
      console.error("Error cargando vacaciones:", error);
    }
  };

  useEffect(() => {
    if (!user?.id) return;
    fetchEventos();
    // fetchCheckHolidays();
  }, [date, user]);

  if (!logged) return null;

  return (
    <>
      <Toolbar />

      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Button variant="outlined" onClick={() => {
          const newDate = new Date(date);
          newDate.setMonth(date.getMonth() - 1);
          setDate(newDate);
        }}>
          Mes Ant.
        </Button>

        <Typography variant="h6">
          VACACIONES ENTIDAD: {date.getFullYear()}
        </Typography>

        <Button variant="outlined" onClick={() => {
          const newDate = new Date(date);
          newDate.setMonth(date.getMonth() + 1);
          setDate(newDate);
        }}>
          Mes Sig.
        </Button>
      </Stack>

      <Box sx={{ overflowX: 'auto', border: `1px solid ${theme.palette.divider}` }}>
        <Table size="small" sx={{ minWidth: '700px', tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow>
              {monthHeaders.map(({ label, colspan }, index) => (
                <TableCell
                  key={index}
                  colSpan={colspan}
                  align="center"
                  sx={{
                    fontWeight: 'bold',
                    backgroundColor: theme.palette.grey[200],
                    borderBottom: `2px solid ${theme.palette.divider}`,
                  }}
                >
                  {label.charAt(0).toUpperCase() + label.slice(1)}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              {days.map((day, idx) => {
                const isToday = isSameDay(day, new Date());
                return (
                  <TableCell
                    key={idx}
                    align="center"
                    sx={{
                      padding: '4px 2px',
                      fontWeight: 'bold',
                      fontSize: '0.75rem',
                      backgroundColor: isToday ? theme.palette.action.hover : 'inherit',
                      borderRight: '1px solid #ccc',
                    }}
                  >
                    {format(day, 'dd')}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow>
              {days.map((day, idx) => {
                const eventForDay = events.find(e => isSameDay(e.start, day));
                return (
                  <TableCell
                    key={idx}
                    align="center"
                    sx={{
                      padding: '8px 2px',
                      backgroundColor: eventForDay?.cellColor || 'transparent',
                      borderRight: '1px solid #ccc',
                      height: "10%",
                    }}
                    // title={eventForDay ? ' Vacaciones' : ''}
                    title={eventForDay ? ' ' : ''}
                  >
                    {/* {eventForDay ? 'Vacaciones' : ''} */}
                    {eventForDay ? ' ' : ''}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </>
  );
};

export default HolidaysViewComponent;
