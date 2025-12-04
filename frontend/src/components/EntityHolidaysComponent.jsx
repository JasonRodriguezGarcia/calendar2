import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import AppContext from '../context/AppContext';
import useLoading from "../hooks/useLoading"
import useExcelHolidays from "../hooks/useExcelHolidays";
import useDialogs from '../hooks/useDialogs';
import ExcelIcon from "../assets/images/icons/excel.png";
import {
    Box,
    Stack,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Toolbar,
    Table,
    TableContainer,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    useTheme,
    Paper, 
} from '@mui/material';

import {
  startOfMonth,
  endOfMonth,
} from 'date-fns';

const EntityHolidaysComponent = () => {
    const VITE_BACKEND_URL_RENDER = import.meta.env.VITE_BACKEND_URL_RENDER
    const { t, i18n } = useTranslation("entityholidays")
    const { csrfToken, user, selectedLanguage } = useContext(AppContext)
    const { setIsLoading, WaitingMessage } = useLoading()
    const { exportVacacionesToExcel, formatted, formattedAll } = useExcelHolidays()
    const { openDialog, closeDialog, isOpen } = useDialogs()
    const theme = useTheme()

    const [events, setEvents] = useState([])
    const [usuarios, setUsuarios] = useState([])
    const [date, setDate] = useState(new Date())
    const [rows, setRows] = useState([])
    const [actualMonthDays, setActualMonthDays] = useState([])

    const fetchEventos = async () => {
        const start = startOfMonth(date);
        const end = endOfMonth(date);
        setIsLoading(true)

        try {
            const response = await fetch(
                `${VITE_BACKEND_URL_RENDER}/api/v1/erroak/vacaciones/${start.toISOString()}/${end.toISOString()}/all`,
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
            const eventsFormatted = data.map(vacacion => ({
                ...vacacion,
                start: new Date(vacacion.start),
                end: new Date(vacacion.end),
                cellColor: vacacion.cell_color,
            }))
            console.log("Eventos: ", eventsFormatted)
            setEvents(eventsFormatted)
        } catch (error) {
            console.error("Error cargando vacaciones:", error)
        } finally {
            setIsLoading(false) // Set loading to false once data is fetched or error occurs
        }

    }

    const fetchUsuarios = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(
                `${VITE_BACKEND_URL_RENDER}/api/v1/erroak/usuarios`,
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
            const data = await response.json();
            // console.log("Usuarios: ", data)
            setUsuarios(data)
        } catch (error) {
            console.error("Error cargando vacaciones:", error)
        } finally {
            setIsLoading(false) // Set loading to false once data is fetched or error occurs
        }

    }

    useEffect(() => {
        if (!user?.id) return // Sobra ¿?
        fetchEventos()
        fetchUsuarios()
        // Obtener fecha actual
        const year = date.getFullYear()
        const month = date.getMonth() // OJO: 0 = Enero, 11 = Diciembre

        // Obtener número de días del mes actual
        const daysMonth = new Date(year, month + 1, 0).getDate() 
        const tempMonth = []
        for (let index = 0; index < daysMonth; index++) {
            tempMonth.push(index+1)
        }
        setActualMonthDays([...tempMonth])
    }, [date])

    // Construir filas cuando usuarios esté listo
    useEffect(() => {
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

    const HandleExportVacacionesToExcelAll = (eventos, fecha) => {
        if (eventos.length === 0) {
            console.log("No hay Eventos")
            openDialog('dialogHolidays')
            return
        }

        exportVacacionesToExcel(formattedAll(eventos, fecha), fecha)
    }

    return (
    <>
        <Dialog open={isOpen('dialogHolidays')} onClose={() => closeDialog('dialogHolidays')}>
            {/* >¿Eliminar evento?<*/}
            <DialogTitle>{t("dialog.title")}</DialogTitle>
            <DialogContent>
                {t("dialog.content")}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => closeDialog('dialogHolidays')} variant="contained">{t("dialog.button")}</Button>
            </DialogActions>
        </Dialog>

        <WaitingMessage />
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
                {t("stack.button1text")}.
            </Button>

            <Typography variant="h6"   sx={{
                fontSize: {
                xs: "0.7rem",   // móviles
                sm: "1.1rem",   // tablets
                md: "1.25rem",  // escritorio
                },}}
            >
                {t("stack.typography.text1")}: {date.getFullYear()} - 
                &nbsp;{t("stack.typography.text2")}: {
                    date.toLocaleString(selectedLanguage === "es"?'es-ES': "eu-EU", { month: 'long' }).toUpperCase()
                        }
            </Typography>
            <Box display="flex">
                <Box sx={{ flex: 1 }}>
                    <Button sx={{ margin: 0, padding: 0}} onClick={() => HandleExportVacacionesToExcelAll(events, date)}>
                        <Tooltip title="Exportar a Excel">
                            {/* Exportar a Excel */}
                            <Box color="primary" aria-label="home"
                                sx={{
                                    padding: 0, 
                                    width: { xs: 24, md: 32 },
                                    height: { xs: 24, md: 32 },
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                <Box component= "img" // es una imagen no un componente React
                                    src={ExcelIcon}
                                    alt="excel"
                                    sx={{ 
                                        height: "100%",
                                        // size: "contain",
                                        // marginRight: 8,
                                        // display: 'flex',
                                        // borderRadius: "10px",
                                    }}
                                />
                            </Box>
                        </Tooltip>
                    </Button>
                </Box>
                <Box>
                    <Button variant="outlined" onClick={() => {
                        const newDate = new Date(date)
                        newDate.setMonth(date.getMonth() + 1)
                        setDate(newDate)
                    }}>
                        {t("stack.button2text")}.
                    </Button>
                </Box>
            </Box>
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
                            })}>
                                <b>USUARIO</b>
                            </TableCell>
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
                                            {tieneEvento ? selectedLanguage === "es"?"V":"O"
                                                         : ' '}
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

export default EntityHolidaysComponent