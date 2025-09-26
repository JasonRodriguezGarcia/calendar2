import React, {useEffect, useState} from "react";
import { useNavigate, Link } from 'react-router-dom';
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

const LoginComponent = ({ logged, setLogged }) => {

    const [userName, setUserName] = useState("")
    const [userEmail, setUserEmail] = useState("")
    const [userPassword, setUserPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [passwordLength, setPasswordLength] = useState(10) // Longitud contraseña

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

    const handleSignUp = () => {}
    const handleUserPassword = (e) => {
        if (e.target.value.length < passwordLength)
            setErrorMessage("Contraseña demasiado corta")
        else
            setUserPassword(e.target.value)
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        const buttonSelected = e.nativeEvent.submitter.name
        if (buttonSelected === "passwordrecover") {
            console.log("pulsado recuperar contraseña")
            navigate('/passwordrecovery')
        }
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
                    return
                } else {
                    // Crear localStorage
                    const resultado = data[0]
                    localStorage.setItem("id", resultado.usuario_id)
                    localStorage.setItem("user", resultado.nombre_apellidos)
                    localStorage.setItem("password", resultado.password)
                    setLogged(true)
                    navigate('/')
                }

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
            <Box component="form"
                onSubmit={(e)=> handleLogin(e)}
                sx={{
                    heigth: "100vh",
                    // width: { xs: '90%', sm: 320 },
                    width: { xs: '90%', sm: "30%" },
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
                <Typography variant="h4" component="h3" sx={{ color: "black"}}>
                    <b>Inicio de sesión</b>
                </Typography>
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
            <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                <Typography
                    sx={{ fontSize: 'sm', alignSelf: 'center' }}
                    >
                    {/* Don&apos;t have an account? */}
                    ¿Olvidaste la contraseña?
                </Typography>
                <Button type="submit" id="boton2" name="passwordrecover" sx={{ mt: 1 /* margin top */ }}>Recuperar contraseña</Button>

            </Stack>
            </Box>
        </Box>
        </>
    )
}

export default LoginComponent