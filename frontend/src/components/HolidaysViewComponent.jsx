import { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Stack,
  Button,
  Typography,
  Toolbar,
  Table,
  TableContainer,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useTheme,
  Paper, 
} from '@mui/material';

import {
  startOfMonth,
  endOfMonth,
} from 'date-fns';

const HolidaysViewComponent = ({ logged, user, token }) => {
    const VITE_BACKEND_URL_RENDER = import.meta.env.VITE_BACKEND_URL_RENDER;
    const theme = useTheme();

    const [events, setEvents] = useState([])
    const [usuarios, setUsuarios] = useState([])
    const [date, setDate] = useState(new Date())
    const [rows, setRows] = useState([])
    const [actualMonthDays, setActualMonthDays] = useState([])

    const fetchEventos = async () => {
        console.log("Date: ", date)
        const start = startOfMonth(date);
        const end = endOfMonth(date);
        console.log("user.id: ", user.id)
        try {
            const response = await fetch(
                `${VITE_BACKEND_URL_RENDER}/api/v1/erroak/vacaciones/${user.id}/${start.toISOString()}/${end.toISOString()}/all`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-type': 'application/json; charset=UTF-8'
                    }
                }
            )
            const data = await response.json();
            const formatted = data.map(vacacion => ({
                ...vacacion,
                start: new Date(vacacion.start),
                end: new Date(vacacion.end),
                cellColor: vacacion.cell_color,
            }))
            console.log("Eventos: ", formatted)
            setEvents(formatted)
        } catch (error) {
            console.error("Error cargando vacaciones:", error)
        }
    }

    const fetchUsuarios = async () => {
        try {
            const response = await fetch(
                `${VITE_BACKEND_URL_RENDER}/api/v1/erroak/usuarios`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-type': 'application/json; charset=UTF-8'
                    }
                }
            )
            const data = await response.json();
            console.log("Usuarios: ", data)
            setUsuarios(data)
        } catch (error) {
            console.error("Error cargando vacaciones:", error)
        }
    }

    // useEffect(() => {
    //     fetchUsuarios()
    //     fetchEventos()
    // }, [])

    useEffect(() => {
        if (!user?.id) return // Sobra ¿?
        fetchEventos()
        fetchUsuarios()
        // Obtener fecha actual
        const year = date.getFullYear();
        const month = date.getMonth() // OJO: 0 = Enero, 11 = Diciembre

        // Obtener número de días del mes actual
        const daysMonth = new Date(year, month + 1, 0).getDate() 
        const tempMonth = []
        for (let index = 0; index < daysMonth; index++) {
            tempMonth.push(index+1)
        }
        setActualMonthDays([...tempMonth])
    }, [date])
    // }, [date, user])

      // Construir filas cuando usuarios esté listo
    useEffect(() => {
        // if (events.length === 0) return
        if (usuarios.length === 0) return

        const tempRows = usuarios.map(usuario => {
            // añadir filtro para que filtre también por la fecha del mes en uso en date
            // events[0].start podría ser igual a "Fri Aug 01 2025 12:00:00 GMT+0200 (hora de verano de Europa central)"
            // startOfMonth(date) podría ser igual a "Tue Sep 30 2025 23:59:59 GMT+0200 (hora de verano de Europa central)"
            const eventosUsuario = events.filter(e => e.usuario_id === usuario.usuario_id && e.start >= startOfMonth(date) && e.start <= endOfMonth(date))

            return {
                id: usuario.usuario_id,
                nombre_apellidos: usuario.nombre_apellidos.slice(0, 15),
                fechas: eventosUsuario,
            }
        })
        setRows(tempRows)
    }, [usuarios, events])

    return (
    <>
        <Toolbar />

        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}
            sx={{position: "fixed",  top: 60,
            left: 0,
            right: 0,
            zIndex: 1100, // mayor que AppBar (por defecto en MUI)
            backgroundColor: 'white',
            paddingY: 1,
            paddingX: 2,
            borderBottom: '1px solid #ddd',}}
        >
            <Button variant="outlined" onClick={() => {
                const newDate = new Date(date)
                    newDate.setMonth(date.getMonth() - 1)
                    setDate(newDate)
                }}>
                Mes Ant.
            </Button>

            <Typography variant="h6">
                VACACIONES ENTIDAD: {date.getFullYear()} - 
                Mes: {date.toLocaleString('es-ES', { month: 'long' }).toUpperCase()}
            </Typography>

            <Button variant="outlined" onClick={() => {
                const newDate = new Date(date)
                    newDate.setMonth(date.getMonth() + 1)
                    setDate(newDate)
                }}>
                Mes Sig.
            </Button>
        </Stack>
        <Toolbar />
        <Box sx={{ width: "100%", overflowY: "auto"}}>
            <TableContainer sx={{ width: "100%"}}>
                <Table stickyHeader sx={{ width: "100%", tableLayout: "fixed"}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left" sx={
                                (theme) => ({
                                    width: {
                                        xs: '20px',   // móviles
                                        sm: '120px',  // tablets
                                        md: '150px',  // escritorio
                                    },
                                    fontSize: {
                                        xs: '6px',   // móviles
                                        sm: '10px',  // tablets
                                        md: '14px',  // escritorio
                                    },
                                borderRight: '1px solid rgba(0, 0, 0, 0.12)'
                            })}>Usuario</TableCell>
                            {actualMonthDays.map((actualMonthDay, index) => (
                                <TableCell key={index} align="center"
                                /* si el día es domingo =0 o sabado = 6 */
                                    sx= {{ 
                                        padding: '6px',
                                        fontSize: '12px',
                                        backgroundColor : 
                                            (new Date(date.getFullYear(), date.getMonth(), actualMonthDay).getDay() === 0) ||
                                            (new Date(date.getFullYear(), date.getMonth(), actualMonthDay).getDay() === 6)
                                                ? "lightGrey"
                                                : "none"
                                    }}
                                >
                                {actualMonthDay}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow
                                key={index}
                            >
                                <TableCell component="th" scope="row"  sx={ 
                                    (theme) => ({
                                        width: {
                                            xs: '20px',   // móviles
                                            sm: '120px',  // tablets
                                            md: '150px',  // escritorio
                                        },
                                        fontSize: {
                                            xs: '6px',   // móviles
                                            sm: '10px',  // tablets
                                            md: '14px',  // escritorio
                                        },
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        borderRight: '1px solid rgba(0, 0, 0, 0.12)'
                                    })
                                }>
                                    {row.nombre_apellidos}
                                </TableCell>
                                {actualMonthDays.map((day, dayIndex) => {
                                    const currentDate = new Date(date.getFullYear(), date.getMonth(), day, 12, 0, 0)
                                    const weekDay = new Date(date.getFullYear(), date.getMonth(), day).getDay()
                                    const tieneEvento = row.fechas.some(evento => {
                                        const start = evento.start
                                        const end = evento.end
                                        return currentDate >= start && currentDate <= end
                                    })
                                    return (
                                        <TableCell
                                            key={dayIndex}
                                            align="center"
                                            sx={{
                                                padding: '6px',
                                                fontSize: '12px',
                                                backgroundColor: tieneEvento ? 'red' : 
                                                    weekDay === 0 ||
                                                    weekDay === 6
                                                        ? "lightGrey"
                                                        : "none",
                                                borderRight: '1px solid rgba(0, 0, 0, 0.12)',
                                                color: "white"
                                            }}
                                        >
                                            {tieneEvento ? "V" : ' '}
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    </>
  )
}

export default HolidaysViewComponent;
