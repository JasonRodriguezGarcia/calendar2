import { useEffect, useState, useMemo } from 'react';
import { useContext } from 'react';
import AppContext from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import useLoading from "../hooks/useLoading"
import { styled } from '@mui/material/styles';
import imagenFondo from "../assets/images/cuerda.jpg";
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Paper,
    Table,
    TableContainer,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    tableCellClasses,
} from '@mui/material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function createData(usuario_id, nombre_apellidos, activo = false, role) {
  return { usuario_id, nombre_apellidos, activo, role }
}
const AdminComponent = () => {
    const VITE_BACKEND_URL_RENDER = import.meta.env.VITE_BACKEND_URL_RENDER

    const { csrfToken, user, selectedLanguage, logged } = useContext(AppContext)
    const { setIsLoading, WaitingMessage } = useLoading()

    const [initialRows, setInitialRows] = useState([])
    const [rows, setRows] = useState(initialRows)
    const [usuarios, setUsuarios] = useState([])
    const [userChecked, setUserChecked] = useState(false)
    const [confirmChangeOpen, setConfirmChangeOpen] = useState(false)
    const [indexToChange, setIndexToChange] = useState(0)
    const [active, setActive] = useState(false)
    const [usuarioID, setUsuarioID] = useState(0)

    const fetchUsuarios = async () => {
        setIsLoading(true)
        try {
            const action = {
                option: "all"
            }
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
                    },
                    body: JSON.stringify(action)
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
        if (!user?.id) return
        fetchUsuarios()
    }, [user])

    useEffect(() => {
        if (usuarios.length === 0) return
        const initial = usuarios.map((u) =>
            createData(
                u.usuario_id ?? "Sin nombre",
                u.nombre_apellidos ?? "Sin nombre",
                u.activo ?? false,
                u.role
            )
        )
        setInitialRows(initial)
        setRows(initial)  // Muy importante para que se renderice la tabla
    }, [usuarios]) // una vez relleno usuarios este useeffect se ejecuta

    const handleCheck = (index, usuario, e) => {
        if (usuario.role === "admin") {
            setUserChecked(true)
            return
        }
        console.log(e.target.checked)
        setUserChecked(e.target.checked)
        console.log("Indice: ", index)
        console.log("usuario_id: ", usuario.usuario_id)
        setActive(e.target.checked)
        setUsuarioID(usuario.usuario_id)
        setIndexToChange(index)
        setConfirmChangeOpen(true)
    }
    
    const confirmChange = async () => {
        const newRows = [...rows]
        newRows[indexToChange].activo = !newRows[indexToChange].activo
        setRows(newRows)
        setConfirmChangeOpen(false)
        // Queda cambiar vía API
        setIsLoading(true)
        try {
            const userTmp = {
                userid: usuarioID,
                activate: active,
            }
            const response = await fetch(
                `${VITE_BACKEND_URL_RENDER}/api/v1/erroak/usuariostatus`,
                {
                    method: "PUT",
                    credentials: 'include', // IMPORTANTE: esto permite usar la cookie
                    headers: {
                        // 'Authorization': `Bearer ${token}`, // se usará o no
                        'Content-type': 'application/json; charset=UTF-8',
                        'X-CSRF-Token': csrfToken,
                    },
                    body: JSON.stringify(userTmp)
                }
            )
            const data = await response.json()
            console.log("Respuesta backend: ", data)
            const resultado = data.result
            if (resultado === "No encontrado") {
                // setErrorMessage(t("error.message8")+"***")
                console.log("No encontrado")
                return
            }
        } catch (error) {
            console.error("Error guardando admincomponent:", error)
        } finally {
            setIsLoading(false) // Set loading to false once data is fetched or error occurs
        }

    }

    const cancelChange = () => {
        setConfirmChangeOpen(false)
    }

    return (
    <>
    <Box sx={{
        backgroundImage: `url(${imagenFondo})`,
        backgroundSize: "cover",
        minHeight: "100vh",
        backgroundPosition: "top center",
        backgroundAttachment: "fixed",
        paddingTop: "60px",
    }}>
        <WaitingMessage />
        <Box sx={{
            height: "75vh",
            width: { xs: '80%', sm: "50%", md: "30%" },
            mx: 'auto',
            my: 4,
            py: 3,
            px: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'left',
            gap: 2,
            border: "1px solid grey",
            borderRadius: '10px',
            boxShadow: '10px 10px 15px 5px grey',
            backgroundColor: '#f0f0f0',
        }}>
            <Typography variant="h6">
                ACTIVAR/DESACTIVAR USUARIOS
            </Typography>

            <TableContainer component={Paper}>
                <Table aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Activo</StyledTableCell>
                        <StyledTableCell>ID</StyledTableCell>
                        <StyledTableCell align='left'>Nombre y apellidos</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => (
                        <StyledTableRow key={row.usuario_id}>
                            <StyledTableCell padding="checkbox">
                                <Checkbox
                                    checked={row.activo}
                                    onChange={(e) => handleCheck(index, row, e)}
                                />
                            </StyledTableCell>
                            <StyledTableCell component="th" scope="row">
                                {row.usuario_id}
                            </StyledTableCell>
                            <StyledTableCell align="left" sx={{ fontWeight: row.role === "admin" ? "bold" : "normal"}}>
                                {row.nombre_apellidos}
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={confirmChangeOpen} onClose={cancelChange}>
                {/* >¿Eliminar evento?<*/}
                <DialogTitle>Cambio de estado</DialogTitle>
                <DialogContent>
                    {/* ¿Estás seguro de que deseas eliminar el evento <strong>{selectedEvent?.title}</strong>? */}
                    {/* ¿Confirmar activar/desactivar usuario? */}
                    ¿Confirmar {active && active ? "ACTIVAR" : "DESACTIVAR"} usuario?
                </DialogContent>
                <DialogActions>
                    {/* >Eliminar< */}
                    <Button onClick={confirmChange} color="error" variant="contained">Aceptar</Button>
                    {/* >Cancelar< */}
                    <Button onClick={cancelChange} variant="contained">Cancelar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    </Box>
    </>
  )
}

export default AdminComponent;