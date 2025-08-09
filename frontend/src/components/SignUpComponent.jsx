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
  FormLabel,
  InputLabel,
  Input,
  Select,
  Stack, // en lugar de box usar Stack, que simplifica aún más la organización vertical.

} from '@mui/material';

const SignUpComponent = ({ logged, setLogged }) => {

    // const [isValidToken, setIsValidToken] = useState(false)
    // const [userName, setUserName] = useState("")
    // const [userEmail, setUserEmail] = useState("")
    // const [userPassword, setUserPassword] = useState("")
    const [userEmail, setUserEmail] = useState("")
    const [userPassword, setUserPassword] = useState("")
    const [userNombre_Apellidos, setUserNombre_Apellidos] = useState("")
    const [userMovil, setUserMovil] = useState("")
    const [userExtension, setUserExtension] = useState("")
    const [userCentro, setUserCentro] = useState("")
    const [userLlave, setUserLlave] = useState(false)
    const [userAlarma, setUserAlarma] = useState(false)
    const [userTurno, setUserTurno] = useState("")
    
    const [errorMessage, setErrorMessage] = useState("")
    const navigate = useNavigate();
    const VITE_BACKEND_URL_RENDER = import.meta.env.VITE_BACKEND_URL_RENDER

    useEffect(()=> {
        if (errorMessage) {
            const intervalo = setTimeout(() => {
                setErrorMessage("")
            }, 3000)
            return () => clearTimeout(intervalo)
        }
    }, [errorMessage])

    const handleUserPassword = (e) => {
        if (e.target.value.length < 12)
            setErrorMessage("Contraseña demasiado corta")
        else
            setUserPassword(e.target.value)
    }

    // const handleUserNickInput = (e) => {
    // if (e.target.value.length < 5)
    //     setErrorMessage("Nick demasiado corto")
    // else
    //     setUserNickInput(e.target.value) 
    // }


    const handleSignUp = async (e) => {
        e.preventDefault()
        // Borrar localstorage
        // localStorage.removeItem("user", "Pepe")
        // localStorage.removeItem("password", "paswol")

        // const buttonSelected = e.nativeEvent.submitter.name
        // console.log("Pulsado: ", buttonSelected)
        // if (buttonSelected === "login") {
        if (userEmail.length < 6) {
            setErrorMessage("Introduzca email correcto")
            return
        }
        if (userPassword.length < 12) {
            setErrorMessage("Introduzca contraseña más larga")
            return
        }

        try {
            const user = {
                email: userEmail,
                password: userPassword, // falta encriptar
                nombre_apellidos: userNombre_Apellidos,
                movil: userMovil,
                extension: userExtension,
                centro_id: userCentro,
                llave: userLlave,
                alarma: userAlarma,
                turno_id: userTurno
            }
            console.log("user: ", user)
            // fetch validate
            const response = await fetch(`${VITE_BACKEND_URL_RENDER}/api/v1/erroak/signup`,
                {
                    method: 'POST',
                    headers: {'Content-type': 'application/json; charset=UTF-8'},
                    body: JSON.stringify(user)
                }
            )
            const data = await response.json()
            debugger
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
            
            // Crear localStorage
            const resultado = data[0]
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
                alignItems: 'center',       // alineado horizontal
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
                        <b>Alta usuario</b>
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
                            placeholder="Email usuario"
                            required
                            fullWidth
                            onChange={(e)=> setUserEmail(e.target.value)}
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
                            placeholder="(mín. 12 caracteres)"
                            required
                            fullWidth
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
                            placeholder="Nombre y apellidos"
                            required
                            fullWidth
                            onChange={(e)=> setUserNombre_Apellidos(e.target.value)}
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
                            placeholder="Movil"
                            // required
                            fullWidth
                            onChange={(e)=> setUserMovil(e.target.value)}
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
                            placeholder="Extension"
                            fullWidth
                            onChange={(e)=> setUserExtension(e.target.value)}
                            />
                    </Stack>
                </FormControl>
                <FormControl>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <FormLabel htmlFor="usercentro" sx={{ color: "black", minwidth: 100 }}>Centro</FormLabel>
                        <Input
                            id="usercentro"
                            name="usercentro"
                            type="text"
                            autoComplete="centro"
                            placeholder="Centro"
                            fullWidth
                            onChange={(e)=> setUserCentro(e.target.value)}
                            />
                    </Stack>
                </FormControl>
                <FormControl>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <FormLabel htmlFor="userllave" sx={{ color: "black", minwidth: 100 }}>Llave</FormLabel>
                        <Input
                            id="userllave"
                            name="userllave"
                            type="text"
                            autoComplete="llave"
                            placeholder="Llave"
                            defaultValue={false}
                            fullWidth
                            onChange={(e)=> setUserLlave(e.target.value)}
                            />
                    </Stack>
                </FormControl>
                            {/* // (persona_id, email, password, nombre_apellidos, movil, extension, centro, llave, alarma, turno) */}
                <FormControl>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <FormLabel htmlFor="useralarma" sx={{ color: "black", minwidth: 100 }}>Alarma</FormLabel>
                        <Input
                            id="useralarma"
                            name="useralarma"
                            type="text"
                            autoComplete="alarma"
                            placeholder="Alarma"
                            defaultValue={false}
                            fullWidth
                            onChange={(e)=> setUserAlarma(e.target.value)}
                        />
                    </Stack>
                </FormControl>
                <FormControl>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <FormLabel htmlFor="userturno" sx={{ color: "black", minwidth: 100 }}>Turno</FormLabel>
                        <Input
                            id="userturno"
                            name="userturno"
                            type="text"
                            autoComplete="turno"
                            placeholder="Turno"
                            fullWidth
                            onChange={(e)=> setUserTurno(e.target.value)}
                        />
                    </Stack>
                </FormControl>

                <Button type="submit" variant="contained" id="boton1" name="login" sx={{ mt: 1 /* margin top */ }}>Crear usuario</Button>
                {/* <Button type="submit" id="boton2" name="signup" sx={{ mt: 1 }}>SignUP</Button> */}

                {errorMessage && 
                
                <Typography level="body-sm" color="danger" fontWeight="bold" fontSize="1em">{errorMessage}</Typography>
                }
                {/* <Typography
                    endDecorator={<Link href="/sign-up">Sign up</Link>}
                    sx={{ fontSize: 'sm', alignSelf: 'center' }}
                    onClick={handleSignUp}
                    >
                    Don&apos;t have an account?
                </Typography> */}

            </Box>
        </Box>
        </>
    )
}

export default SignUpComponent