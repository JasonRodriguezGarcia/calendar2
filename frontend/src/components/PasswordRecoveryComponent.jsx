import React, {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
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

const PasswordRecoveryComponent = ({ logged, setLogged }) => {

    // const [userName, setUserName] = useState("")
    const [userEmail, setUserEmail] = useState("")
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

    if (logged) return null

    const handlePasswordRecovery = async (e) => {
        e.preventDefault()
        // if (userName.length === 0) {
        //     setErrorMessage("Introduzca Nombre de usuario")
        //     return
        // }
        if (userEmail.length === 0) {
            setErrorMessage("Introduzca email")
            return
        }

            try {
                const user = {
                    // username: userName,
                    useremail: userEmail,
                }
                // fetch validate
                const response = await fetch(`${VITE_BACKEND_URL_RENDER}/api/v1/erroak/passwordrecovery`,
                    {
                        method: 'POST',
                        headers: {'Content-type': 'application/json; charset=UTF-8'},
                        body: JSON.stringify(user)
                    }
                )
                const data = await response.json()
                console.log("Respuesta backend: ", data)
                if (data.result === "No encontrado") {
                    // setErrorMessage("Nombre usuario o email no válidos")
                    setErrorMessage("Email no válido")
                    return
                } else {
                    const {usuario_id} = data[0]
                    // console.log("Recibido password: ", data[0].password)
                    // // Crear localStorage
                    // const resultado = data[0]
                    // localStorage.setItem("id", resultado.usuario_id)
                    // localStorage.setItem("user", resultado.nombre_apellidos)
                    // localStorage.setItem("password", resultado.password)
                    // setLogged(true)
                    navigate('/')
                    // navigate(`/newpassword/${usuario_id}`)
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
                onSubmit={(e)=> handlePasswordRecovery(e)}
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
                    <b>Recuperar Contraseña</b>
                </Typography>
                {/* <FormControl>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <FormLabel htmlFor="username" sx={{ color: "black", minwidth: 100 }}>Nombre Usuario</FormLabel>
                        <Input
                            id="username"
                            name="username"
                            type="text"
                            // autoComplete="email"
                            placeholder="Nombre usuario"
                            fullWidth
                            onChange={(e)=> setUserName(e.target.value)}
                        />
                    </Stack>
                </FormControl> */}
                <FormControl>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <FormLabel htmlFor="useremail" sx={{ color: "black", minwidth: 100 }}>Email</FormLabel>
                        <Input
                            id="useremail"
                            name="useremail"
                            type="email"
                            autoComplete="email"
                            placeholder="Email usuario/a"
                            fullWidth
                            onChange={(e)=> setUserEmail(e.target.value)}
                        />
                    </Stack>
                </FormControl>

                <Button type="submit" variant="contained" id="boton1" name="login" sx={{ mt: 1 /* margin top */ }}>Recuperar contraseña</Button>
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

export default PasswordRecoveryComponent