import React, {useEffect, useState} from "react";
import { useNavigate, useParams } from 'react-router-dom';
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

const NewPasswordComponent = ({ logged, setLogged }) => {

    // const [isValidToken, setIsValidToken] = useState(false)
    // const [userId, setUserId] = useParams.id
    const navigate = useNavigate();
    const {id} = useParams()
    console.log("userId: ", id)
    const [newPassword, setNewPassword] = useState("")
    const [userName, setUserName] = useState("")
    const [userEmail, setUserEmail] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const VITE_BACKEND_URL_RENDER = import.meta.env.VITE_BACKEND_URL_RENDER

    useEffect(()=> {
        if (errorMessage) {
            const intervalo = setTimeout(() => {
                setErrorMessage("")
            }, 3000)
            return () => clearTimeout(intervalo)
        }
    }, [errorMessage])

    if (logged)
        return

    const handleNewPassword = async (e) => {
        e.preventDefault()
        if (newPassword.length < 10) {
            setErrorMessage("Contraseña demasiado corta")
            return
        }

            try {
                const user = {
                    userid: id,
                    newpassword: newPassword,
                }
                // fetch validate

                // queda crear backend para crear nueva contraseña y añadir la llama aqui
                const response = await fetch(`${VITE_BACKEND_URL_RENDER}/api/v1/erroak/newpassword`,
                    {
                        method: 'POST',
                        headers: {'Content-type': 'application/json; charset=UTF-8'},
                        body: JSON.stringify(user)
                    }
                )
                const data = await response.json()
                console.log("Respuesta backend: ", data)
                if (data.result === "No encontrado") {
                    setErrorMessage("Id usuario no válido")
                    return
                } else {
                    // console.log("Recibido newpassword: ", data)
                }
                navigate("/")

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
                onSubmit={(e)=> handleNewPassword(e)}
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
                <div>
                    <Typography variant="h4" component="h3" sx={{ color: "black"}}>
                        <b>Nueva Contraseña</b>
                    </Typography>
                </div>
                <FormControl>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <FormLabel htmlFor="newpassword" sx={{ color: "black", minwidth: 100 }}>Nueva contraseña</FormLabel>
                        <Input
                            id="newpassword"
                            name="newpassword"
                            type="password"
                            // autoComplete="email"
                            placeholder="Nueva contraseña"
                            fullWidth
                            onChange={(e)=> setNewPassword(e.target.value)}
                        />
                    </Stack>
                </FormControl>

                <Button type="submit" variant="contained" id="boton1" name="login" sx={{ mt: 1 /* margin top */ }}>Actualizar contraseña</Button>
                
                {errorMessage && 
                    <Typography level="body-sm" color="danger" fontWeight="bold" fontSize="1em">{errorMessage}</Typography>
                }
            </Box>
        </Box>
        </>
    )
}

export default NewPasswordComponent