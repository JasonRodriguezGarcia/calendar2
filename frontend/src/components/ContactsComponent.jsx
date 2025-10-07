import { useEffect, useState, useMemo } from 'react';
import {
    Box,
    Stack,
    Button,
    Typography,
    Toolbar,
    Tooltip,
    Table,
    TableContainer,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    useTheme,
    Paper, 
} from '@mui/material';
import AlarmIcon from '@mui/icons-material/Alarm'; // despertador
import VpnKeyIcon from '@mui/icons-material/VpnKey'; // llave
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'; // sirena

const ContactsComponent = ({ logged, user }) => {
    const VITE_BACKEND_URL_RENDER = import.meta.env.VITE_BACKEND_URL_RENDER;
    const theme = useTheme();

    const [events, setEvents] = useState([])
    const [usuarios, setUsuarios] = useState([])
    const [date, setDate] = useState(new Date())
    const [rows, setRows] = useState([])
    const [headTableDays, setHeadTableDays] = useState([
        "Lunes", "Martes", "Miércoles", "Jueves", "Viernes"
    ])
    const [actualMonthDays, setActualMonthDays] = useState([])

    const fetchUsuarios = async () => {
        try {
            const response = await fetch(
                `${VITE_BACKEND_URL_RENDER}/api/v1/erroak/usuarios`,
            )
            const data = await response.json()
        // // Paso 1: Inicializar 5 columnas vacías (lunes a viernes)
        // const columnasPorDia = Array.from({ length: 5 }, () => [])

        // // Paso 2: Distribuir usuarios según su tarde_invierno
        // data.forEach(usuario => {
        //     const dia = usuario.tarde_invierno; // 1 = lunes, 5 = viernes
        //     if (dia >= 1 && dia <= 5) {
        //         columnasPorDia[dia - 1].push(usuario)
        //     }
        // })

        // // Paso 3: Calcular el máximo número de usuarios en un día
        // const maxUsuarios = Math.max(...columnasPorDia.map(col => col.length))

        // // Paso 4: Transponer la matriz para que cada fila tenga 5 columnas
        // const filas = [];
        // for (let i = 0; i < maxUsuarios; i++) {
        //     const fila = []
        //     for (let j = 0; j < 5; j++) {
        //         fila.push(columnasPorDia[j][i] || null); // rellena con null si no hay usuario
        //     }
        //     filas.push(fila)
        // }
        //     console.log("imprimo filas: ", filas)
            // setUsuarios(filas)
            setUsuarios(data)
        } catch (error) {
            console.error("Error cargando listingsafternoons:", error)
        }
    }

    useEffect(() => {
        if (!user?.id) return
        fetchUsuarios();
    }, [user])

    useEffect(() => {
        console.log("usuarios: ", events, usuarios)
    }, [usuarios])

    // if (!logged) return null

    return (
    <>
        <Toolbar />

        <Stack direction="row" justifyContent="center" alignItems="center" mb={3}>
            <Typography variant="h6">
                CONTACTOS
            </Typography>

        </Stack>
        <Box sx={{ width: "100%", overflowY: "auto"}}>
            <TableContainer sx={{ width: "100%"}}>
                {/* tableLayout: fixed - Esto garantiza que todas las celdas mantendrán su ancho de acuerdo al header. */}
                <Table stickyHeader sx={{ width: "100%", tableLayout: "fixed"}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center"
                                sx= {
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
                                    border: '1px solid rgba(224, 224, 224, 1)', // borde completo
                                    padding: '8px',
                                    fontWeight: 'bold',
                                })}
                            >
                                Nombre
                            </TableCell>
                            <TableCell align="center"
                                sx= {
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
                                    border: '1px solid rgba(224, 224, 224, 1)', // borde completo
                                    padding: '8px',
                                    fontWeight: 'bold',
                                })}
                            >
                                Email
                            </TableCell>
                            <TableCell align="center"
                                sx= {
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
                                    border: '1px solid rgba(224, 224, 224, 1)', // borde completo
                                    padding: '8px',
                                    fontWeight: 'bold',
                                })}
                            >
                                Movil Empresa
                            </TableCell>
                            <TableCell align="center"
                                sx= {
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
                                    border: '1px solid rgba(224, 224, 224, 1)', // borde completo
                                    padding: '8px',
                                    fontWeight: 'bold',
                                })}
                            >
                                Extension
                            </TableCell>
                            <TableCell align="center"
                                sx= {
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
                                    border: '1px solid rgba(224, 224, 224, 1)', // borde completo
                                    padding: '8px',
                                    fontWeight: 'bold',
                                })}
                            >
                                Observaciones
                            </TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody
                    >
                        {usuarios.map((usuario, index) => (
                            <TableRow key={index}>
                                    <TableCell sx={{
                                        border: '1px solid rgba(224, 224, 224, 1)', // borde completo
                                        padding: '8px',
                                        fontSize: {
                                        xs: '6px',
                                        sm: '10px',
                                        md: '14px',
                                        },
                                    }}
                                    >
                                        {usuario.nombre_apellidos}
                                    </TableCell>
                                    <TableCell sx={{
                                        border: '1px solid rgba(224, 224, 224, 1)', // borde completo
                                        padding: '8px',
                                        fontSize: {
                                        xs: '6px',
                                        sm: '10px',
                                        md: '14px',
                                        },
                                    }}
                                    >
                                        {usuario.email}
                                    </TableCell>
                                    <TableCell sx={{
                                        border: '1px solid rgba(224, 224, 224, 1)', // borde completo
                                        padding: '8px',
                                        fontSize: {
                                        xs: '6px',
                                        sm: '10px',
                                        md: '14px',
                                        },
                                    }}
                                    >
                                        {usuario.movil}
                                    </TableCell>
                                    <TableCell sx={{
                                        border: '1px solid rgba(224, 224, 224, 1)', // borde completo
                                        padding: '8px',
                                        fontSize: {
                                        xs: '6px',
                                        sm: '10px',
                                        md: '14px',
                                        },
                                    }}
                                    >
                                        {usuario.extension}
                                    </TableCell>
                                    <TableCell sx={{
                                        border: '1px solid rgba(224, 224, 224, 1)', // borde completo
                                        padding: '8px',
                                        fontSize: {
                                        xs: '6px',
                                        sm: '10px',
                                        md: '14px',
                                        },
                                    }}
                                    >
                                        {usuario.observaciones}
                                    </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    </>
  );
};

export default ContactsComponent;
