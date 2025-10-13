import React, {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import {
    Box, 
    Typography,
    Button,
    TextField,
    MenuItem,
    FormControl, 
    FormControlLabel, 
    FormLabel,
    InputLabel,
    Input,
    RadioGroup,
    Radio,    
    Select,
    Stack, // en lugar de box usar Stack, que simplifica aún más la organización vertical.
} from '@mui/material';
import { colorOptions } from "../utils/EventColors";

const tardes_invierno = [
    {tarde_id: 0, descripcion: "No"},
    {tarde_id: 1, descripcion: "Lunes"},
    {tarde_id: 2, descripcion: "Martes"},
    {tarde_id: 3, descripcion: "Miércoles"},
    {tarde_id: 4, descripcion: "Jueves"},
    {tarde_id: 5, descripcion: "Viernes"},
]
const UsersCRUDComponent = ({ logged, setLogged, user, setUser, action, token }) => {

    const [selectedColor, setSelectedColor] = useState("")
    const [userEmail, setUserEmail] = useState("")
    const [userPassword, setUserPassword] = useState("")
    const [userNombre_Apellidos, setUserNombre_Apellidos] = useState("")
    const [userMovil, setUserMovil] = useState("")
    const [userExtension, setUserExtension] = useState("")
    const [userCentro, setUserCentro] = useState("")
    const [userLlave, setUserLlave] = useState("false")
    const [userAlarma, setUserAlarma] = useState("false")
    const [userTurno, setUserTurno] = useState("")
    const [userTarde_Invierno, setUserTarde_Invierno] = useState("")
    const [userObservaciones, setUserObservaciones] = useState("")
    const [centros, setCentros] = useState([])
    const [turnos, setTurnos] = useState([])
    const [minPasswordLength, setMinPasswordLength] = useState(10) // Longitud contraseña
    const [formTitle, setFormTitle] = useState('')
    const [formReadOnly, setFormReadOnly] = useState(false)
    const [showPassword,setShowPassword] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const navigate = useNavigate();
    const VITE_BACKEND_URL_RENDER = import.meta.env.VITE_BACKEND_URL_RENDER

    console.log("prop usuario: ", user)
    console.log("token: ", token)

    useEffect(() => {
        const getData = async () => {
            try {
                // fetch for getting horarios & turnos data
                const response = await fetch(`${VITE_BACKEND_URL_RENDER}/api/v1/erroak/getSignUpFormData`,
                    {
                        method: 'GET',
                        headers: {
                            // 'Authorization': `Bearer ${token}`,
                            'Content-type': 'application/json; charset=UTF-8'
                        }
                    }
                )
                const data = await response.json()
                console.log("Respuesta backend: ", data)
                if (data.result === "Error. No hay datos en Turnos") {
                    setErrorMessage("Faltan Datos en Turnos")
                    return
                } else if (data.result === "Error. No hay datos en Centros") {
                    setErrorMessage("Faltan Datos en centros")
                    return
                } else {
                    setCentros(data.centros)
                    setTurnos(data.turnos)
                }
                    
            } catch (error) {
                console.log(error.message)
            } finally {
                // setLoading(false); // Set loading to false once data is fetched or error occurs
            }
            if (action === "read" || action === "update")  {
                const endPoint= `${VITE_BACKEND_URL_RENDER}/api/v1/erroak/usuario/${user.id}`
                try {
                    // fetch for getting usuario data
                    const responseUser = await fetch(endPoint,
                        {
                            method: "GET",
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-type': 'application/json; charset=UTF-8'
                            }
                        }
                    )
                    const dataResponseUser = await responseUser.json()
                    const dataUser = dataResponseUser
                    console.log("Respuesta backend: ", dataUser)
    // si ponemos dataUser?.result y no dataUser.menu, en caso de que programa no exista, obtenemos un crash con error en ejecución
    // Pero si ponemos dataUser?.name y no existe obtenemos un undefined y el programa sigue su curso
                    if (dataUser?.result === "No encontrado") {
                        setErrorMessage("usuario no válido")
                        return
                    } else {
                        setUserEmail(dataUser.email)
                        setUserPassword(dataUser.password)
                        setUserNombre_Apellidos(dataUser.nombre_apellidos)
                        setUserMovil(dataUser.movil)
                        setUserExtension(dataUser.extension)
                        setUserCentro(dataUser.centro_id)
                        setUserLlave(dataUser.llave)
                        setUserAlarma(dataUser.alarma)
                        setUserTurno(dataUser.turno_id)
                        setSelectedColor(dataUser.color)
                        setUserTarde_Invierno(dataUser.tarde_invierno)
                        setUserObservaciones(dataUser.observaciones)
                        const title = action === "read" ? "Ver perfil" : "Modificar perfil"
                        setFormTitle(title)
                        setFormReadOnly(action === "read")
                    }

                } catch (error) {
                    console.log(error.message)
                } finally {
                    // setLoading(false); // Set loading to false once data is fetched or error occurs
                }
            } else {
                setFormTitle('Alta usuari@')
                setFormReadOnly(false)
            }
        }

        // Solo continuar si user.id es válido, ya que se llama 2 veces a user
        // 1. user inicia como {} (estado vacío)
        // const [usuario, setUsuario] = useState({})
        // 2. Después, se actualiza con datos reales desde el localStorage en EditProfilePage
        // setUsuario({ id: usuario_id, nombre_apellidos, password })
        // Ese cambio dispara nuevamente el useEffect de SignUpComponent, ya que user cambió. Así:
        // Primera ejecución de useEffect: user.id es undefined → no se hace fetch, pero ya se ejecutó.
        // Segunda ejecución: user.id ya tiene valor → se hace el fetch.
        // ¿Qué hace esta condición?
            // Parte	¿Qué verifica?	                ¿Cuándo es verdadera?
            // !user	¿user es null/undefined/etc?	Cuando user = null, undefined, etc.
            // !user.id	¿id está ausente o es falsy?	Cuando user = {} o user = { id: undefined }
        if ((action === "read" || action === "update") && (!user || !user.id)) {
            console.warn("getData() abortado porque user.id es undefined")
            return
        }

        getData()
    }, [action, user]) // Importante para tener dependencias actualizadas
    // Así nos aseguramos de que cuando user cambie desde '' a { nombre_apellidos, password }, el useEffect se dispare de nuevo 
    // y haga el fetch correctamente.

    useEffect(() => {
        if (errorMessage) {
            const intervalo = setTimeout(() => {
                setErrorMessage("")
            }, 3000)
            return () => clearTimeout(intervalo)
        }
    }, [errorMessage])

    const handleChangeColor = (event) => {
        setSelectedColor(event.target.value)
    }

    const handleUserEmail = (e) => {
        if (e.target.value.length > 50) return;
        setUserEmail(e.target.value)
        if (e.target.value.length < 7)
            setErrorMessage("Email demasiado corto")
        else
            setErrorMessage(""); // Limpia el error si ya es válido
    }

    const handleUserPassword = (e) => {
        if (e.target.value.length > 15) return;
        setUserPassword(e.target.value)
        if (e.target.value.length < minPasswordLength)
            setErrorMessage("Contraseña demasiado corta")
        else
            setErrorMessage(""); // Limpia el error si ya es válido
    }

    const handleUserNombre_Apellidos = (e) => {
        if (e.target.value.length > 50) return;
        setUserNombre_Apellidos(e.target.value)
        if (e.target.value.length < 7)
            setErrorMessage("Nombre y Apellidos demasiado cortos")
        else
            setErrorMessage(""); // Limpia el error si ya es válido
    }

    const handleUserMovil = (e) => {
        let numbersOnly = e.target.value.replace(/\D/g, '').slice(0, 9); // solo 9 números
        setUserMovil(numbersOnly);
    }

    const handleUserExtension = (e) => {
        let numbersOnly = e.target.value.replace(/\D/g, '').slice(0, 3); // solo 3 números
        setUserExtension(numbersOnly)
        if (e.target.value > 3) {
            setErrorMessage("Máx. caracteres alcanzado")
            return
        }
        setErrorMessage("")
    }

    const handleSignUp = async (e) => {
        e.preventDefault()
        if (action === "read") {
            navigate(`/`, { replace: true });
            return
        }
        if (userEmail.length < 7 || !userEmail.includes("@erroak.sartu.org")) {
            setErrorMessage("Introduzca email correcto")
            return
        }
        if (userPassword.length < minPasswordLength) {
            setErrorMessage("Introduzca contraseña más larga")
            return
        }
        if (userNombre_Apellidos.length < 8) {
            setErrorMessage("Nombre y Apellidos más largo")
            return
        }

        try {
            console.log("paso por hadleSignUp")
            const userTmp = {
                // id: user.id,
                email: userEmail,
                password: userPassword, // falta encriptar
                nombre_apellidos: userNombre_Apellidos,
                movil: userMovil.replace('-', ''),
                extension: userExtension,
                centro_id: userCentro,
                llave: userLlave,
                alarma: userAlarma,
                turno_id: userTurno,
                color: selectedColor,
                tarde_invierno: userTarde_Invierno,
                observaciones: userObservaciones
            }
            console.log("user: ", userTmp)
            const endPoint= action === "create"
                ? `${VITE_BACKEND_URL_RENDER}/api/v1/erroak/usuario`
                : `${VITE_BACKEND_URL_RENDER}/api/v1/erroak/usuario/${user.id}`
            const method = action === "create" ? "POST" : "PUT"

            // fetch validate
            const response = await fetch(endPoint,
                {
                    method: method,
                    headers: {
                        'Authorization': `Bearer ${token}`, // se usará o no
                        'Content-type': 'application/json; charset=UTF-8'
                    },
                    body: JSON.stringify(userTmp)
                }
            )
            const data = await response.json()
            console.log("Respuesta backend: ", data)
            const resultado = data.result
            if (resultado === "Email ya existente") {
                setErrorMessage("Email ya existente")
                return
            }
            const usuario = {
                id: resultado.usuario_id,
                // id: action === "create" ? resultado : data.usuario_id,
                // id: resultado.usuario_id,
                password: userPassword,
                nombre_apellidos: userNombre_Apellidos,
            }

            // Crear/modificar localStorage
            localStorage.setItem("token", data.token) // no hace falta un setToken porque el token se carga en "/"
            setLogged(true)
            setUser(usuario)
            navigate('/', { replace: true })
        } catch (error) {
            // setError(error.message); // Handle errors
            console.log(error.message)
        } finally {
            // setLoading(false); // Set loading to false once data is fetched or error occurs
        }
    }

    return (
        <>
        <Box
            sx={{
                minHeight: 'calc(100vh - 64px)',  // resta la altura del menu
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                // backgroundColor: '#f0f0f0',
                px: 2,
            }}
        >
            <Box component="form"
                onSubmit={(e)=> handleSignUp(e)}
                sx={{
                    heigth: "100vh",
                    width: { xs: '90%', sm: "30%" },
                    mx: 'auto', // margin left & right
                    my: 4, // margin top & bottom
                    py: 3, // padding top & bottom
                    px: 2, // padding left & right
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',   // alineado vertical
                    alignItems: 'left',       // alineado horizontal
                    gap: 2,
                    border: "1px solid grey",
                    borderRadius: '10px',
                    boxShadow: '10px 10px 15px 5px grey',
                    backgroundColor: '#f0f0f0',
                }}
            >
                <div>
                    <Typography variant="h4" component="h3" sx={{ color: "black"}}>
                        <b>{formTitle}</b>
                    </Typography>
                </div>
                <FormControl>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <FormLabel htmlFor="useremail" sx={{ color: "black", minwidth: 100 }}>Email</FormLabel>
                        <Input
                            id="useremail"
                            name="useremail"
                            type="email"
                            autoComplete="email"
                            placeholder="(min 7 - max. 50 car.)"
                            required
                            fullWidth
                            value={userEmail}
                            disabled={formReadOnly}
                            onChange={(e)=> handleUserEmail(e)}
                        />
                    </Stack>
                </FormControl>
                <FormControl>
                    <Stack direction="row" spacing={2} justifyContent="left" alignItems="center">
                        <FormLabel htmlFor="userpassword" sx={{ color: "black", minwidth: 100 }}>Contraseña</FormLabel>
                        <Input
                            id="userpassword"
                            name="userpassword"
                            type={showPassword ? 'text' : 'password'}
                            onMouseEnter={() => setShowPassword(true)}
                            onMouseLeave={() => setShowPassword(false)}
                            autoComplete="password"
                            placeholder={`(mín. ${minPasswordLength} - máx. 15 car.)`}
                            required
                            fullWidth
                            value={userPassword}
                            disabled={formReadOnly}
                            onChange={(e)=> handleUserPassword(e)}
                        />
                    </Stack>
                </FormControl>
                <FormControl>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <FormLabel htmlFor="usernombre_apellidos" sx={{ color: "black", minwidth: 100 }}>Nombre y apellido:</FormLabel>
                        <Input
                            id="usernombre_apellidos"
                            name="usernombre_apellidos"
                            type="text"
                            autoComplete="nombre_apellidos"
                            placeholder="(mín. 7 - máx. 50 car.)"
                            required
                            fullWidth
                            value={userNombre_Apellidos}
                            disabled={formReadOnly}
                            onChange={(e)=> handleUserNombre_Apellidos(e)}
                        />
                    </Stack>
                </FormControl>
                <FormControl>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <FormLabel htmlFor="usermovil" sx={{ color: "black", minwidth: 100 }}>Movil Empresa:</FormLabel>
                        <Input
                            id="usermovil"
                            name="usermovil"
                            type="text"
                            autoComplete="movil"
                            placeholder="Ej.: 699616161 (9 dígitos)"
                            fullWidth
                            value={userMovil}  // esta línea es esencial para poder usarse en la funcion handleUserMovil
                            disabled={formReadOnly}
                            onChange={(e)=> handleUserMovil(e)}
                        />
                    </Stack>
                </FormControl>
                <FormControl>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <FormLabel htmlFor="userextension" sx={{ color: "black", minwidth: 100 }}>Extension</FormLabel>
                        <Input
                            id="userextension"
                            name="userextension"
                            type="text"
                            autoComplete="extension"
                            placeholder="(máx. 3 car.)"
                            fullWidth
                            value={userExtension}
                            disabled={formReadOnly}
                            onChange={(e)=> handleUserExtension(e)}
                        />
                    </Stack>
                </FormControl>
                <FormControl>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <FormLabel htmlFor="usercentro" sx={{ color: "black", minwidth: 100 }}>Centro</FormLabel>
                        <Select
                            fullWidth
                            labelId="select-label-centro"
                            id="select-centro"
                            value={userCentro}
                            disabled={formReadOnly}
                            onChange={(e) => setUserCentro(e.target.value)}
                            required
                        >
                            {centros.map((centro) => (
                                <MenuItem key={centro.centro_id} value={centro.centro_id}>{centro.centro}</MenuItem>
                            ))}
                        </Select>
                    </Stack>
                </FormControl>
                <FormControl>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <FormLabel htmlFor="userllave" sx={{ color: "black", minwidth: 100 }}>Llave</FormLabel>
                        <RadioGroup
                            row //  esto los pone en horizontal
                            aria-labelledby="demo-radio-buttons-group-label-llave"
                            defaultValue="false"
                            name="radio-buttons-group-llave"
                            value={userLlave}
                            onChange={(e)=> setUserLlave(e.target.value)}
                        >
                            <FormControlLabel value="true" control={<Radio />} label="Si" disabled={formReadOnly}/>
                            <FormControlLabel value="false" control={<Radio />} label="No" disabled={formReadOnly}/>
                        </RadioGroup>
                        <FormLabel htmlFor="useralarma" sx={{ color: "black", minwidth: 100 }}>Alarma</FormLabel>
                        <RadioGroup
                            row //  esto los pone en horizontal
                            aria-labelledby="demo-radio-buttons-group-label-alarma"
                            defaultValue="false"
                            name="radio-buttons-group-alarma"
                            value={userAlarma}
                            onChange={(e)=> setUserAlarma(e.target.value)}
                        >
                            <FormControlLabel value="true" control={<Radio />} label="Si" disabled={formReadOnly}/>
                            <FormControlLabel value="false" control={<Radio />} label="No"disabled={formReadOnly}/>
                        </RadioGroup>
                    </Stack>
                </FormControl>
                <FormControl>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <FormLabel htmlFor="userturno" sx={{ color: "black", minwidth: 100 }}>Turno</FormLabel>
                        <Select
                            fullWidth
                            labelId="select-label-turno"
                            id="select-turno"
                            value={userTurno}
                            disabled={formReadOnly}
                            onChange={(e) => setUserTurno(e.target.value)}
                            required
                        >
                            {turnos.map((turno) => (
                                <MenuItem key={turno.turno_id} value={turno.turno_id}>{turno.turno}</MenuItem>
                            ))}
                        </Select>
                    </Stack>
                </FormControl>
                <FormControl fullWidth margin="dense">
                    <InputLabel id="color-select-label">Color</InputLabel>
                    <Select
                        labelId="color-select-label"
                        value={selectedColor}
                        disabled={formReadOnly}
                        label="Color"
                        onChange={handleChangeColor}
                    >
                        {Object.entries(colorOptions).map(([name, hex]) => (
                            <MenuItem key={name} value={name}>
                                <Box
                                    sx={{
                                        width: 20,
                                        height: 20,
                                        backgroundColor: hex,
                                        display: 'inline-block',
                                        borderRadius: '50%',
                                        marginRight: 1,
                                }}
                            />
                                {name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <FormLabel htmlFor="usertarde_invierno" sx={{ color: "black", minwidth: 100 }}>Tarde Invierno</FormLabel>
                        <Select
                            fullWidth
                            labelId="select-label-tarde_invierno"
                            id="select-tarde_invierno"
                            value={userTarde_Invierno}
                            disabled={formReadOnly}
                            onChange={(e) => setUserTarde_Invierno(e.target.value)}
                            required
                        >
                            {tardes_invierno.map((tarde) => (
                                <MenuItem key={tarde.tarde_id} value={tarde.tarde_id}>{tarde.descripcion}</MenuItem>
                            ))}
                        </Select>
                    </Stack>
                </FormControl>
                <TextField
                    fullWidth
                    label="Observaciones"
                    name="observaciones"
                    value={userObservaciones}
                    disabled={formReadOnly}
                    onChange={(e) => setUserObservaciones(e.target.value)}
                    margin="dense"
                    multiline
                    rows={3}
                />
                <Button type="submit" variant="contained" id="boton1" name="login" sx={{ mt: 1 }}>
                    {/* Crear usuario */}
                    {action === "create" 
                        ?"Crear"
                        :  action == "read" 
                            ? "Cerrar" 
                            : "Guardar"
                    }
                </Button>
                {errorMessage &&                 
                    <Typography level="body-sm" color="danger" fontWeight="bold" fontSize="1em">{errorMessage}</Typography>
                }
            </Box>
        </Box>
        </>
    )
}

export default UsersCRUDComponent