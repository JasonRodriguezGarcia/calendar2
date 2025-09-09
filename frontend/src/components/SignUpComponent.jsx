import React, {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
// import {createContext, useContext} from 'react';
// import LoginContext from '../context/LoginContext';
import Box from '@mui/material/Box';
// MUI
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
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
import { red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime, yellow, amber, orange, deepOrange, brown, grey, blueGrey } from '@mui/material/colors';
const colorOptions = {
    // red: red[500],
    pink: pink[500],
    purple: purple[500],
    deepPurple: deepPurple[500],
    indigo: indigo[500],
    blue: blue[500],
    lightBlue: lightBlue[500],
    cyan: cyan[500],
    teal: teal[500],
    green: green[500],
    lightGreen: lightGreen[500],
    lime: lime[500],
    yellow: yellow[500],
    amber: amber[500],
    orange: orange[500],
    deepOrange: deepOrange[500],
    brown: brown[500],
    grey: grey[500],
    blueGrey: blueGrey[500],
};

const SignUpComponent = ({ logged, setLogged, user, action }) => {

    // const [isValidToken, setIsValidToken] = useState(false)
    // const [userName, setUserName] = useState("")
    // const [userEmail, setUserEmail] = useState("")
    // const [userPassword, setUserPassword] = useState("")
    const [selectedColor, setSelectedColor] = useState('red');
    const [userId, setUserId] = useState("")
    const [userEmail, setUserEmail] = useState("")
    const [userPassword, setUserPassword] = useState("")
    const [userNombre_Apellidos, setUserNombre_Apellidos] = useState("")
    const [userMovil, setUserMovil] = useState("")
    const [userExtension, setUserExtension] = useState("")
    const [userCentro, setUserCentro] = useState("")
    const [userLlave, setUserLlave] = useState("false")
    const [userAlarma, setUserAlarma] = useState("false")
    const [userTurno, setUserTurno] = useState("")
    const [centros, setCentros] = useState([])
    const [turnos, setTurnos] = useState([])
    const [minPasswordLength, setMinPasswordLength] = useState(10) // Longitud contraseña
    const [formTitle, setFormTitle] = useState('')
    const [formReadOnly, setFormReadOnly] = useState(false)
    // const [api, setApi] = useState('')
    // const [method, setMethod] = useState('')
    
    const [errorMessage, setErrorMessage] = useState("")
    const navigate = useNavigate();
    const VITE_BACKEND_URL_RENDER = import.meta.env.VITE_BACKEND_URL_RENDER

    console.log("prop usuario: ", user)

    useEffect(() => {
        const getData = async () => {
            try {
                // fetch for getting horarios & turnos data
                const response = await fetch(`${VITE_BACKEND_URL_RENDER}/api/v1/erroak/getSignUpFormData`,
                    {
                        method: 'GET',
                        headers: {'Content-type': 'application/json; charset=UTF-8'}
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
            // Esperara a que user esté definido
            // if ((action === "read" || action === "update") && user?.nombre_apellidos) {
            // debugger
            // console.log("imprimo user.id: ", user.id)
            if (action === "read" || action === "update")  {
                const endPoint= `${VITE_BACKEND_URL_RENDER}/api/v1/erroak/usuario/${user.id}`
                try {
                    // fetch for getting usuario data
                    const responseUser = await fetch(endPoint,
                        {
                            method: "GET",
                            headers: {'Content-type': 'application/json; charset=UTF-8'}
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
                        // debugger
                        // setUserId(dataUser.usuario_id)
                        setUserEmail(dataUser.email)
                        setUserPassword(dataUser.password)
                        setUserNombre_Apellidos(dataUser.nombre_apellidos)
                        const movil = dataUser.movil.slice(0, 3) + "-" + dataUser.movil.slice(3)
                        setUserMovil(movil)
                        setUserExtension(dataUser.extension)
                        setUserCentro(dataUser.centro_id)
                        setUserLlave(dataUser.llave)
                        setUserAlarma(dataUser.alarma)
                        setUserTurno(dataUser.turno_id)
                        setSelectedColor(dataUser.color)
                        const title = action === "read" ? "Ver perfil" : "Modificar perfil"
                        setFormTitle(title)
                        // const readOnly = action === "read" ? true : false
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
            console.warn("getData() abortado porque user.id es undefined");
            return;
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
    // const handleUserNickInput = (e) => {
    // if (e.target.value.length < 5)
    //     setErrorMessage("Nick demasiado corto")
    // else
    //     setUserNickInput(e.target.value) 
    // }

    const isValidMovil = (movil) => {
        const regex = /^\d{3}-\d{6}$/;
        return regex.test(movil);
    };

    const handleUserMovil = (e) => {
       let numbersOnly = e.target.value.replace(/\D/g, '').slice(0, 9); // solo 9 números
       console.log("numbersOnly: ", numbersOnly)
        // if (numbersOnly.length > 9) return;
        if (numbersOnly.length <= 3) {
            setUserMovil(numbersOnly);
        } else {
            const formatted = `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
            setUserMovil(formatted);
        }
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
        // Borrar localstorage
        // localStorage.removeItem("user", "Pepe")
        // localStorage.removeItem("password", "paswol")

        // const buttonSelected = e.nativeEvent.submitter.name
        // console.log("Pulsado: ", buttonSelected)
        // if (buttonSelected === "login") {
        if (action === "read") {
            navigate(`/`);
            return
        }
        if (userEmail.length < 7) {
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
        if (userMovil.length !== 0 && !isValidMovil(userMovil)) {
            setErrorMessage("El móvil debe tener formato 999-999999");
            return;
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
                llave: userLlave === "true",
                alarma: userAlarma === "true",
                turno_id: userTurno,
                color: selectedColor
            }
            console.log("user: ", userTmp)
            const endPoint= action === "create"
                ? `${VITE_BACKEND_URL_RENDER}/api/v1/erroak/usuario`
                // : `${VITE_BACKEND_URL_RENDER}/api/v1/erroak/usuario/${user.nombre_apellidos}`
                : `${VITE_BACKEND_URL_RENDER}/api/v1/erroak/usuario/${user.id}`
            const method = action === "create" ? "POST" : "PUT"

            // fetch validate
            const response = await fetch(endPoint,
                {
                    method: method,
                    headers: {'Content-type': 'application/json; charset=UTF-8'},
                    body: JSON.stringify(userTmp)
                }
            )
            const data = await response.json()
            console.log("Respuesta backend: ", data)
            if (data.result === "Email ya existente") {
                setErrorMessage("Email ya existente")
                // setIsValidToken(false)
                // setLogged(false)
                // navigate('/')
                return
            }
            if (data.result === "Nombre y apellidos ya existente") {
                setErrorMessage("Nombre y apellidos ya existente")
                // setIsValidToken(false)
                // setLogged(false)
                // navigate('/')
                return
            }
            if (action === "create") {
                // Crear localStorage
                localStorage.setItem("id", data.id)
            }
            localStorage.setItem("user", userNombre_Apellidos)
            localStorage.setItem("password", userPassword)
            setLogged(true)
            navigate('/')
                // setIsValidToken(true)
                // setLogged(true)       
                // setUserNick(data.nick)
                // console.log("Language localstorage: ", localStorage.getItem(user), localStorage.getItem(password))
                // navigate(`/profile/${data.token}`);
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
                backgroundColor: '#f0f0f0',
                px: 2,
            }}
        >
            {/* {isValidToken && isValidToken ? 
                <h2 style = {{ color: "white"}}>Página de perfil /Profilepage (logged)</h2>
                : <h2 style = {{ color: "white"}}>No logeado /Not logged in</h2>
            } */}
            <Box component="form"
                onSubmit={(e)=> handleSignUp(e)}
                sx={{
                heigth: "100vh",
                width: { xs: '90%', sm: 320 },
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
                // boxShadow: 5,
                // backgroundColor: "#339fff"
                }}
            >
                <div>
                    <Typography variant="h4" component="h3" sx={{ color: "black"}}>
                        {/* <b>Alta usuario</b> */}
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
                            // onChange={(e)=> setUserEmail(e.target.value)}
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
                            type="password"
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
                        <FormLabel htmlFor="usernombre_apellidos" sx={{ color: "black", minwidth: 100 }}>Nombre y apellidos:</FormLabel>
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
                            // onChange={(e)=> setUserNombre_Apellidos(e.target.value)}
                            onChange={(e)=> handleUserNombre_Apellidos(e)}
                        />
                    </Stack>
                </FormControl>
                <FormControl>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <FormLabel htmlFor="usermovil" sx={{ color: "black", minwidth: 100 }}>Movil</FormLabel>
                        <Input
                            id="usermovil"
                            name="usermovil"
                            type="text"
                            autoComplete="movil"
                            placeholder="Ej.: 699616161 (9 dígitos)"
                            fullWidth
                            value={userMovil}  // esta línea es esencial para poder usarse en la funcion handleUserMovil
                            disabled={formReadOnly}
                            // disabled
                            // onChange={(e)=> setUserMovil(e.target.value)}
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
                            // onChange={(e)=> setUserExtension(e.target.value)}
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
                            // label="Centro *"
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
                    </Stack>
                </FormControl>
                            {/* // (persona_id, email, password, nombre_apellidos, movil, extension, centro, llave, alarma, turno) */}
                <FormControl>
                    <Stack direction="row" spacing={2} alignItems="center">
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
                            // label="Turno *"
                            value={userTurno}
                            disabled={formReadOnly}
                            onChange={(e) => setUserTurno(e.target.value)}
                            required
                        >
                            {turnos.map((turno) => (
                                <MenuItem key={turno.turno_id} value={turno.turno_id}>{turno.turno} - {turno.horario}</MenuItem>

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

                {/* <Button type="submit" variant="contained" id="boton1" name="login" sx={{ mt: 1 }}>Crear usuario</Button> */}
                {/* <Button type="submit" id="boton2" name="signup" sx={{ mt: 1 }}>SignUP</Button> */}
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

export default SignUpComponent