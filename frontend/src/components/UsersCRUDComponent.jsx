import React, {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Box, 
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
import { colorOptions } from "../utils/EventColors";

const UsersCRUDComponent = ({ logged, setLogged, user, setUser, action, token, selectedLanguage }) => {
    const VITE_BACKEND_URL_RENDER = import.meta.env.VITE_BACKEND_URL_RENDER
    const { t, i18n } = useTranslation("userscrud")

    const [tardesInvierno, setTardesInvierno] = useState([])
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
    const [dialogNewUserOpen, setDialogNewUserOpen] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const getData = async () => {
            try {
                // fetch for getting horarios & turnos data
                const response = await fetch(`${VITE_BACKEND_URL_RENDER}/api/v1/erroak/getsignupformdata`,
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
                console.log("Respuesta backend: ", data)
                // if (data.result === "Error. No hay datos en Turnos") {
                //     setErrorMessage("Faltan Datos en Turnos")
                //     return
                // } else
                if (data.result === "Error. No hay datos en Centros") {
                    setErrorMessage("Faltan Datos en centros")
                    return
                } else {
                    setCentros(data.centros)
                    // setTurnos(data.turnos)
                }

            } catch (error) {
                console.log(error.message)
            } finally {
                // setLoading(false); // Set loading to false once data is fetched or error occurs
            }
            if (action === "read" || action === "update")  {
                // const endPoint= `${VITE_BACKEND_URL_RENDER}/api/v1/erroak/usuario/${user.id}`
                const endPoint= `${VITE_BACKEND_URL_RENDER}/api/v1/erroak/usuario`
                try {
                    // fetch for getting usuario data
                    const responseUser = await fetch(endPoint,
                        {
                            method: "GET",
                            credentials: 'include',
                            headers: {
                                // 'Authorization': `Bearer ${token}`,
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
                        const title = action === "read" ? t("action.text1") : t("action.text2")
                        setFormTitle(title)
                        setFormReadOnly(action === "read")
                    }

                } catch (error) {
                    console.log(error.message)
                } finally {
                    // setLoading(false); // Set loading to false once data is fetched or error occurs
                }
            } else {
                setFormTitle(t("formtitle"))
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

    useEffect(() =>{
        setTurnos([
            {turno_id: 0, descripcion: t("turnos.descripcion0")},
            {turno_id: 1, descripcion: t("turnos.descripcion1")},
        ])
        setTardesInvierno([
            {tarde_id: 0, descripcion: t("tardesinvierno.descripcion0")},
            {tarde_id: 1, descripcion: t("tardesinvierno.descripcion1")},
            {tarde_id: 2, descripcion: t("tardesinvierno.descripcion2")},
            {tarde_id: 3, descripcion: t("tardesinvierno.descripcion3")},
            {tarde_id: 4, descripcion: t("tardesinvierno.descripcion4")},
            {tarde_id: 5, descripcion: t("tardesinvierno.descripcion5")},
        ])
        const title = action === "read" 
            ? t("action.text1") 
            : action === "update"
                ?t("action.text2")
                :t("formtitle")
        setFormTitle(title)

    }, [selectedLanguage])

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
        if (e.target.value.length > 50) return
        setUserEmail(e.target.value)
        if (e.target.value.length < 7)
            setErrorMessage(t("error.message1"))
        else
            setErrorMessage("") // Limpia el error si ya es válido
    }

    const handleUserPassword = (e) => {
        if (e.target.value.length > 15) return
        setUserPassword(e.target.value)
        if (e.target.value.length < minPasswordLength)
            setErrorMessage(t("error.message2"))
        else
            setErrorMessage("") // Limpia el error si ya es válido
    }

    const handleUserNombre_Apellidos = (e) => {
        if (e.target.value.length > 50) return
        setUserNombre_Apellidos(e.target.value)
        if (e.target.value.length < 7)
            setErrorMessage(t("error.message3"))
        else
            setErrorMessage("") // Limpia el error si ya es válido
    }

    const handleUserMovil = (e) => {
        let numbersOnly = e.target.value.replace(/\D/g, '').slice(0, 9) // solo 9 números
        setUserMovil(numbersOnly)
    }

    const handleUserExtension = (e) => {
        let numbersOnly = e.target.value.replace(/\D/g, '').slice(0, 3) // solo 3 números
        setUserExtension(numbersOnly)
        if (e.target.value > 3) {
            setErrorMessage(t("error.message4"))
            return
        }
        setErrorMessage("")
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault()
        if (action === "read") {
            navigate(`/`, { replace: true })
            return
        }
        if (userEmail.length < 18 && !userEmail.includes("@erroak.sartu.org")) {
            setErrorMessage(t("error.message5"))
            return
        }
        if (userPassword.length < minPasswordLength) {
            setErrorMessage(t("error.message6"))
            return
        }
        if (userNombre_Apellidos.length < 8) {
            setErrorMessage(t("error.message7"))
            return
        }

        try {
            console.log("paso por hadleSignUp")
            const userTmp = {
                // id: user.id,
                email: userEmail,
                password: userPassword,
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
            const endPoint = `${VITE_BACKEND_URL_RENDER}/api/v1/erroak/usuario`
            // const endPoint= action === "create"
            //     ? `${VITE_BACKEND_URL_RENDER}/api/v1/erroak/usuario`
            //     : `${VITE_BACKEND_URL_RENDER}/api/v1/erroak/usuario/${user.id}`
            const method = action === "create" ? "POST" : "PUT"

            // fetch validate
            const response = await fetch(endPoint,
                {
                    method: method,
                    credentials: 'include', // IMPORTANTE: esto permite usar la cookie
                    headers: {
                        // 'Authorization': `Bearer ${token}`, // se usará o no
                        'Content-type': 'application/json; charset=UTF-8'
                    },
                    body: JSON.stringify(userTmp)
                }
            )
            const data = await response.json()
            console.log("Respuesta backend: ", data)
            const resultado = data.result
            if (resultado === "Email ya existente") {
                setErrorMessage(t("error.message8"))
                return
            }

            // Crear/modificar localStorage
            // localStorage.setItem("token", data.token) // no hace falta un setToken porque el token se carga en "/"
            // setLogged(true)
            debugger
            if (action !== "create") { // Si no estamos creando, actualizamos datos usuario en frontend
                const usuario = {
                    id: resultado.usuario_id,
                    // password: userPassword,
                    nombre_apellidos: userNombre_Apellidos,
                    emailUsuario: resultado.email
                }
                setUser(usuario)
                navigate('/', { replace: true })
            } else {
                setDialogNewUserOpen(true)
            }
        } catch (error) {
            console.log(error.message)
        } finally {
            // setLoading(false); // Set loading to false once data is fetched or error occurs
        }
    }

    const handleNewUserClose = () => {
        setDialogNewUserOpen(false)
        navigate('/', { replace: true })
    }

    return (
        <>
        <Box
            sx={{
                minHeight: 'calc(100vh - 64px)',  // resta la altura del menu
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                px: 2,
            }}
        >
            <Box component="form"
                onSubmit={(e)=> handleFormSubmit(e)}
                sx={{
                    heigth: "100vh",
                    width: { xs: '90%', sm: "50%", md: "30%" },
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
                        <FormLabel htmlFor="useremail" sx={{ color: "black", minwidth: 100 }}>{t("box.formcontrol1.formlabel")}:</FormLabel>
                        <Input
                            id="useremail"
                            name="useremail"
                            type="email"
                            autoComplete="email"
                            placeholder={t("box.formcontrol1.placeholder")}
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
                        <FormLabel htmlFor="userpassword" sx={{ color: "black", minwidth: 100 }}>{t("box.formcontrol2.formlabel")}:</FormLabel>
                        <Input
                            id="userpassword"
                            name="userpassword"
                            type={showPassword ? 'text' : 'password'}
                            onMouseEnter={() => setShowPassword(true)}
                            onMouseLeave={() => setShowPassword(false)}
                            autoComplete="password"
                            placeholder={`(${t("box.formcontrol2.placeholder.text1")}. ${minPasswordLength} - ${t("box.formcontrol2.placeholder.text2")}.)`}
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
                        <FormLabel htmlFor="usernombre_apellidos" sx={{ color: "black", minwidth: 100 }}>{t("box.formcontrol3.formlabel")}:</FormLabel>
                        <Input
                            id="usernombre_apellidos"
                            name="usernombre_apellidos"
                            type="text"
                            autoComplete="nombre_apellidos"
                            placeholder={t("box.formcontrol3.placeholder")}
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
                        <FormLabel htmlFor="usermovil" sx={{ color: "black", minwidth: 100 }}>{t("box.formcontrol4.formlabel")}:</FormLabel>
                        <Input
                            id="usermovil"
                            name="usermovil"
                            type="text"
                            autoComplete="movil"
                            // placeholder="Ej.: 699616161 (9 dígitos)"
                            placeholder={t("box.formcontrol4.placeholder")}
                            fullWidth
                            value={userMovil}  // esta línea es esencial para poder usarse en la funcion handleUserMovil
                            disabled={formReadOnly}
                            onChange={(e)=> handleUserMovil(e)}
                        />
                    </Stack>
                </FormControl>
                <FormControl>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <FormLabel htmlFor="userextension" sx={{ color: "black", minwidth: 100 }}>{t("box.formcontrol5.formlabel")}:</FormLabel>
                        <Input
                            id="userextension"
                            name="userextension"
                            type="text"
                            autoComplete="extension"
                            placeholder={t("box.formcontrol5.placeholder")}
                            fullWidth
                            value={userExtension}
                            disabled={formReadOnly}
                            onChange={(e)=> handleUserExtension(e)}
                        />
                    </Stack>
                </FormControl>
                <FormControl>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <FormLabel htmlFor="usercentro" sx={{ color: "black", minwidth: 100 }}>{t("box.formcontrol6.formlabel")}:</FormLabel>
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
                        <FormLabel htmlFor="userllave" sx={{ color: "black", minwidth: 100 }}>{t("box.formcontrol7.formlabel")}:</FormLabel>
                        <RadioGroup
                            row //  esto los pone en horizontal
                            aria-labelledby="demo-radio-buttons-group-label-llave"
                            defaultValue="false"
                            name="radio-buttons-group-llave"
                            value={userLlave}
                            onChange={(e)=> setUserLlave(e.target.value)}
                        >
                            <FormControlLabel value="true" control={<Radio />} label={t("box.formcontrol7.radio.label1")} disabled={formReadOnly}/>
                            <FormControlLabel value="false" control={<Radio />} label={t("box.formcontrol7.radio.label2")} disabled={formReadOnly}/>
                        </RadioGroup>
                        <FormLabel htmlFor="useralarma" sx={{ color: "black", minwidth: 100 }}>{t("box.formcontrol8.formlabel")}:</FormLabel>
                        <RadioGroup
                            row //  esto los pone en horizontal
                            aria-labelledby="demo-radio-buttons-group-label-alarma"
                            defaultValue="false"
                            name="radio-buttons-group-alarma"
                            value={userAlarma}
                            onChange={(e)=> setUserAlarma(e.target.value)}
                        >
                            <FormControlLabel value="true" control={<Radio />} label={t("box.formcontrol8.radio.label1")} disabled={formReadOnly}/>
                            <FormControlLabel value="false" control={<Radio />} label={t("box.formcontrol8.radio.label2")} disabled={formReadOnly}/>
                        </RadioGroup>
                    </Stack>
                </FormControl>
                <FormControl>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <FormLabel htmlFor="selectturno" sx={{ color: "black", minwidth: 100 }}>{t("box.formcontrol9.formlabel")}:</FormLabel>
                        <Select
                            fullWidth
                            labelId="select-label-turno"
                            id="selectturno"
                            value={userTurno}
                            disabled={formReadOnly}
                            onChange={(e) => setUserTurno(e.target.value)}
                            required
                        >
                            {turnos.map((turno) => (
                                // <MenuItem key={turno.turno_id} value={turno.turno_id}>{turno.turno}</MenuItem>
                                <MenuItem key={turno.turno_id} value={turno.turno_id}>{turno.descripcion}</MenuItem>
                            ))}
                        </Select>
                    </Stack>
                </FormControl>
                <FormControl fullWidth margin="dense">
                    <Stack direction="row" spacing={2} alignItems="center">
                        <FormLabel htmlFor="selectedcolor" sx={{ color: "black", minwidth: 100 }}>{t("box.formcontrol10.formlabel")}:</FormLabel>
                        <Select
                            fullWidth
                            labelId="color-select-label"
                            id="selectedcolor"
                            value={selectedColor}
                            disabled={formReadOnly}
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
                    </Stack>
                </FormControl>
                <FormControl>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <FormLabel htmlFor="usertarde_invierno" sx={{ color: "black", minwidth: 100 }}>{t("box.formcontrol11.formlabel")}:</FormLabel>
                        <Select
                            fullWidth
                            labelId="select-label-tarde_invierno"
                            id="usertarde_invierno"
                            value={userTarde_Invierno}
                            disabled={formReadOnly}
                            onChange={(e) => setUserTarde_Invierno(e.target.value)}
                            required
                        >
                            {tardesInvierno.map((tarde) => (
                                <MenuItem key={tarde.tarde_id} value={tarde.tarde_id}>{tarde.descripcion}</MenuItem>
                            ))}
                        </Select>
                    </Stack>
                </FormControl>
                <TextField
                    fullWidth
                    label={t("box.textfieldlabel")}
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
                        ? t("box.button.text1")
                        :  action == "read" 
                            ? t("box.button.text2") 
                            : t("box.button.text3")
                    }
                </Button>
                {errorMessage &&                 
                    <Typography level="body-sm" color="danger" fontWeight="bold" fontSize="1em">{errorMessage}</Typography>
                }
                <Dialog open={dialogNewUserOpen} onClose={handleNewUserClose}>
                    <DialogTitle>
                        <Typography variant="h4" component="span">
                            {/* Usuario Creado */}
                            {t("box.dialog.title")}
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContent>
                            {/* Usuario nuevo creado con éxito.
                            Puede iniciar sesión para acceder al sistema. */}
                            {t("box.dialog.content.content")}
                        </DialogContent>
                        <DialogActions>
                                                                                    {/* Continuar */}
                            <Button onClick={handleNewUserClose} variant="contained">{t("box.dialog.content.actions")}</Button>
                        </DialogActions>
                    </DialogContent>
                </Dialog>
            </Box>
        </Box>
        </>
    )
}

export default UsersCRUDComponent