import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { useContext } from 'react';
import AppContext from '../context/AppContext';
import useLoading from "../hooks/useLoading";
import { 
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    tableCellClasses,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Paper
 }
from '@mui/material';
import MenuBarComponent from '../components/MenuBarComponent';
import imagenFondo from "../assets/images/cuerda.jpg";

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

function createData(usuario_id, nombre_apellidos, activo = false) {
  return { usuario_id, nombre_apellidos, activo }
}

// const initialRows = [
//   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//   createData('Eclair', 262, 16.0, 24, 6.0),
//   createData('Cupcake', 305, 3.7, 67, 4.3),
//   createData('Gingerbread', 356, 16.0, 49, 3.9),
// ];

const AdminPage = () => {
    const VITE_BACKEND_URL_RENDER = import.meta.env.VITE_BACKEND_URL_RENDER
    const { csrfToken, user, selectedLanguage, logged } = useContext(AppContext)
    const { setIsLoading, WaitingMessage } = useLoading()

    const [initialRows, setInitialRows] = useState([])
    const [rows, setRows] = useState(initialRows)
    const [usuarios, setUsuarios] = useState([])
    const [userChecked, setUserChecked] = useState(false)
    const [confirmChangeOpen, setConfirmChangeOpen] = useState(false)
    const [indexToChange, setIndexToChange] = useState(0)

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
        if (!user?.id) return
        fetchUsuarios()
    }, [user])

    useEffect(() => {
        console.log("usuarios: ", usuarios)
        if (usuarios.length === 0) return
        console.log("usuarios[0]: ", usuarios[0].usuario_id)
        const initial = usuarios.map((u) =>
            createData(
                u.usuario_id ?? "Sin nombre",
                u.nombre_apellidos ?? "Sin nombre",
                u.activo ?? false,
            )
        )
        setInitialRows(initial)
        setRows(initial)  // Muy importante para que se renderice la tabla
    }, [usuarios]) // una vez relleno usuarios este useeffect se ejecuta

    const handleCheck = (index, usuario_id, e) => {
        console.log(e.target.checked)
        setUserChecked(e.target.checked)
        console.log("Indice: ", index)
        console.log("usuario_id: ", usuario_id)
        setIndexToChange(index)
        setConfirmChangeOpen(true)
    }
    
    const confirmChange = () => {
        const newRows = [...rows]
        newRows[indexToChange].activo = !newRows[indexToChange].activo
        setRows(newRows)
        setConfirmChangeOpen(false)
        // Queda cambiar vía API
    }

    const cancelChange = () => {
        setConfirmChangeOpen(false)
    }



    // Si no está logeado se sale del componente
    if (!logged || user.role !== "admin")    // con esta opción ni siquiera se muestra brevemente el componente
        // Esto interrumpe el renderizado del componente y lo redirige inmediatamente. 
        // No se ejecuta código de más, ni se renderiza MenuBarComponent ni el otro componente.
        return <Navigate to="/" replace /> // navigate(`/`, { replace: true }) solo puede ser usado en useEffect

    return (
    <Box sx={{
        backgroundImage: `url(${imagenFondo})`,
        backgroundSize: "cover",
        minHeight: "100vh",
        backgroundPosition: "top center",
        backgroundAttachment: "fixed",
        paddingTop: "60px",
    }}>
        <WaitingMessage />
        <MenuBarComponent />

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
                {/* <Table sx={{ minWidth: 700 }} aria-label="customized table"> */}
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
                                    onChange={(e) => handleCheck(index, row.usuario_id, e)}
                                />
                            </StyledTableCell>
                            <StyledTableCell component="th" scope="row">
                                {row.usuario_id}
                            </StyledTableCell>
                            <StyledTableCell align="left">
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
                        ¿Confirmar activar/desactivar usuario?
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
  )
}

export default AdminPage;
