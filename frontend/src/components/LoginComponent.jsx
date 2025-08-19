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

// import { CssVarsProvider, useColorScheme } from '@mui/joy/styles';
// import Sheet from '@mui/joy/Sheet';
// import CssBaseline from '@mui/joy/CssBaseline';
// import Typography from '@mui/joy/Typography';
// import FormControl from '@mui/joy/FormControl';
// import FormLabel from '@mui/joy/FormLabel';
// import Input from '@mui/joy/Input';
// import Button from '@mui/joy/Button';
// import Link from '@mui/joy/Link';
// import Select from '@mui/joy/Select';
// import Option from '@mui/joy/Option';
// import { grey } from "@mui/material/colors";
// import { useEventCallback } from "@mui/material";

const LoginComponent = ({ logged, setLogged }) => {

    // const [isValidToken, setIsValidToken] = useState(false)
    const [userName, setUserName] = useState("")
    const [userEmail, setUserEmail] = useState("")
    const [userPassword, setUserPassword] = useState("")
    // const [userNickInput, setUserNickInput] = useState("")
    // const [userNick, setUserNick] = useState("")
    // const {logged, setLogged, userNick, setUserNick} = useContext(LoginContext)
    // const [logged, setLogged] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    // const [languageSet, setLanguageSet] = useState("")
    const [passwordLength, setPasswordLength] = useState(10) // Longitud contraseña

    // const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const VITE_BACKEND_URL_RENDER = import.meta.env.VITE_BACKEND_URL_RENDER

    
    // useEffect(()=> {
    //     console.log("Idioma: ", language)
    //     setLanguageSet(language)
    //     i18n.changeLanguage(language)
    // }, [language])

    useEffect(()=> {
        if (errorMessage) {
            const intervalo = setTimeout(() => {
                setErrorMessage("")
            }, 3000)
            return () => clearTimeout(intervalo)
        }
    }, [errorMessage])

    // const loginText = "Texto de Login"

    const handleUserPassword = (e) => {
        if (e.target.value.length < passwordLength)
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


    const handleLogin = async (e) => {
        e.preventDefault()
        // Borrar localstorage
        // localStorage.removeItem("user", "Pepe")
        // localStorage.removeItem("password", "paswol")

        // const buttonSelected = e.nativeEvent.submitter.name
        // console.log("Pulsado: ", buttonSelected)
        // if (buttonSelected === "login") {
        if (userEmail.length === 0) {
            setErrorMessage("Introduzca email")
            return
        }
        if (userPassword.length === 0) {
            setErrorMessage("Introduzca contraseña")
            return
        }

            try {
                const user = {
                    id: userName,
                    useremail: userEmail,
                    password: userPassword // falta encriptar
                }
                // fetch validate
                // const response = await fetch('"http://localhost:5000/api/v1/playarena/login"',
                const response = await fetch(`${VITE_BACKEND_URL_RENDER}/api/v1/erroak/login`,
                    {
                        method: 'POST',
                        headers: {'Content-type': 'application/json; charset=UTF-8'},
                        body: JSON.stringify(user)
                    }
                )
                const data = await response.json()
                console.log("Respuesta backend: ", data)
                if (data.result === "No encontrado") {
                    setErrorMessage("usuario o contraseña no válidos")
                    // setIsValidToken(false)
                    // setLogged(false)
                    // navigate('/')
                    return
                } else {
                    // Crear localStorage
                    const resultado = data[0]
                    localStorage.setItem("id", resultado.usuario_id)
                    localStorage.setItem("user", resultado.nombre_apellidos)
                    localStorage.setItem("password", resultado.password)
                    setLogged(true)
                    navigate('/')
                    // setIsValidToken(true)
                    // setLogged(true)       
                    // setUserNick(data.nick)
                    // console.log("Language localstorage: ", localStorage.getItem(user), localStorage.getItem(password))
                }

                // navigate(`/profile/${data.token}`);
            } catch (error) {
                // setError(error.message); // Handle errors
                console.log(error.message)
            } finally {
                // setLoading(false); // Set loading to false once data is fetched or error occurs
            }

        // } else {
        //     try {
        //         const user = {
        //             username: userName,
        //             password: userPassword,
        //             // nick: userNickInput
        //             // nick: userNick
        //         }
        //         // fetch validate
        //         // const response = await fetch("http://localhost:5000/api/v1/playarena/signup",
        //         const response = await fetch(`${VITE_BACKEND_URL_RENDER}/api/v1/playarena/signup`,
        //             {
        //                 method: 'POST',
        //                 headers: {'Content-type': 'application/json; charset=UTF-8'},
        //                 body: JSON.stringify(user)
        //             }
        //         )
        //         const data = await response.json()
        //         console.log("Respuesta backend: ", data)
        //         if (data.result === "YA EXISTE") {
        //             setErrorMessage("Usuario ya existente")
        //             // setIsValidToken(false)
        //             setLogged(false)
        //             return
        //         }
        //         // setIsValidToken(true)
        //         setLogged(true)       
        //         // setUserNick(userNickInput)
        //         navigate('/')

        //     } catch (error) {
        //         // setError(error.message); // Handle errors
        //         console.log(error.message)
        //     } finally {
        //         // setLoading(false); // Set loading to false once data is fetched or error occurs
        //     }
        // }
    }
    
    // const handleSignUp = (e) => {
    //     e.preventDefault()
    //     console.log(userName, userPassword)
    // }

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
                onSubmit={(e)=> handleLogin(e)}
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
                        <b>Inicio de sesión</b>
                        {/* <b>{loginText.loginWindow.headLine1}</b> */}
                    </Typography>
                    {/* <Typography sx={{ color: "black" }} level="body-sm">Login form</Typography> */}
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
                            placeholder={`(mín. ${passwordLength} caracteres)`}
                            fullWidth
                            onChange={(e)=> handleUserPassword(e)}
                        />
                    </Stack>
                </FormControl>

                <Button type="submit" variant="contained" id="boton1" name="login" sx={{ mt: 1 /* margin top */ }}>Iniciar sesión</Button>
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

export default LoginComponent