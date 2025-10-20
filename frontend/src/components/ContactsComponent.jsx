import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Stack,
    Typography,
    Toolbar,
    Table,
    TableContainer,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    useTheme,
} from '@mui/material';

const ContactsComponent = ({ logged, user, token, selectedLanguage }) => {
    const VITE_BACKEND_URL_RENDER = import.meta.env.VITE_BACKEND_URL_RENDER;
    const { t, i18n } = useTranslation("contacts")

    const theme = useTheme();
    const [usuarios, setUsuarios] = useState([])

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
            const data = await response.json()
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
        console.log("usuarios: ", usuarios)
    }, [usuarios])

    return (
    <>
        <Toolbar />

        <Stack direction="row" justifyContent="center" alignItems="center" mb={3}>
            <Typography variant="h6">
                {t("stacktypography")}
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
                                {t("tableheadtablerow.celltext1")}
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
                                {t("tableheadtablerow.celltext2")}
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
                                {t("tableheadtablerow.celltext3")}
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
                                {t("tableheadtablerow.celltext4")}
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
                                {t("tableheadtablerow.celltext5")}
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
