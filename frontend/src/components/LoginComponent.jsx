import React, {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
// MUI
import {
  Typography,
  Button,
  FormControl, 
  FormLabel,
  Input,
  Stack, // en lugar de box usar Stack, que simplifica aún más la organización vertical.

} from '@mui/material';

const LoginComponent = ({ logged, setLogged, user, setUser, token, setToken, selectedLanguage }) => {
    const VITE_BACKEND_URL_RENDER = import.meta.env.VITE_BACKEND_URL_RENDER
    const { t, i18n } = useTranslation("login")

    const [userName, setUserName] = useState("")
    const [userEmail, setUserEmail] = useState("")
    const [userPassword, setUserPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [passwordLength, setPasswordLength] = useState(10) // Longitud contraseña

    const navigate = useNavigate();

    useEffect(()=> {
        if (errorMessage) {
            const intervalo = setTimeout(() => {
                setErrorMessage("")
            }, 3000)
            return () => clearTimeout(intervalo)
        }
    }, [errorMessage])

    const handleUserPassword = (e) => {
        if (e.target.value.length < passwordLength)
            setErrorMessage(t("error.message1"))
        else
            setUserPassword(e.target.value)
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        const buttonSelected = e.nativeEvent.submitter.name
        if (buttonSelected === "passwordrecover") {
            console.log("pulsado recuperar contraseña")
            navigate('/passwordrecovery', { replace: true }) // no deja retroceder en el navegador
        }
        if (userEmail.length === 0) {
            setErrorMessage(t("error.message2"))
            return
        }
        if (userPassword.length === 0) {
            setErrorMessage(t("error.message3"))
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
                setErrorMessage(t("error.message4"))
                return
            } else {
                // Crear localStorage
                const resultado = data.result
                const usuario = {
                    id: resultado.usuario_id,
                    password: resultado.password,
                    nombre_apellidos: resultado.nombre_apellidos
                }
                localStorage.setItem("token", data.token)
                console.log("token hadleLogin: :", data.token)
                setUser(usuario)
                setLogged(true)
                setToken(data.token)
                navigate('/', { replace: true }) // no deja retroceder en el navegador
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
                px: 2,
            }}
        >
            <Box component="form"
                onSubmit={(e)=> handleLogin(e)}
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
                    alignItems: 'center',       // alineado horizontal
                    gap: 2,
                    border: "1px solid grey",
                    borderRadius: '10px',
                    boxShadow: '10px 10px 15px 5px grey',
                    backgroundColor: '#f0f0f0',
                }}
            >
                <Typography variant="h4" component="h3" sx={{ color: "black"}}>
                    <b>{t("box.typography")}</b>
                </Typography>
                <FormControl>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <FormLabel htmlFor="useremail" sx={{ color: "black", minwidth: 100 }}>{t("box.formcontrol1.formlabel")}</FormLabel>
                        <Input
                            id="useremail"
                            name="useremail"
                            type="email"
                            autoComplete="email"
                            placeholder={t("box.formcontrol1.placeholder")}
                            fullWidth
                            onChange={(e)=> setUserEmail(e.target.value)}
                        />
                    </Stack>
                </FormControl>
                <FormControl>
                    <Stack direction="row" spacing={2} justifyContent="left" alignItems="center">
                        <FormLabel htmlFor="userpassword" sx={{ color: "black", minwidth: 100 }}>{t("box.formcontrol2.formlabel")}</FormLabel>
                        <Input
                            id="userpassword"
                            name="userpassword"
                            type={showPassword ? 'text' : 'password'}
                            onMouseEnter={() => setShowPassword(true)}
                            onMouseLeave={() => setShowPassword(false)}
                            autoComplete="password"
                            placeholder={`(${t("box.formcontrol2.placeholder.text1")}. ${passwordLength} ${t("box.formcontrol2.placeholder.text2")})`}
                            fullWidth
                            onChange={(e)=> handleUserPassword(e)}
                        />
                    </Stack>
                </FormControl>
                <Button type="submit" variant="contained" id="boton1" name="login" sx={{ mt: 1 /* margin top */ }}>{t("box.buttontext")}</Button>
                {errorMessage && 
                    <Typography level="body-sm" color="danger" fontWeight="bold" fontSize="1em">{errorMessage}</Typography>
                }
                <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                    <Typography
                        sx={{ fontSize: 'sm', alignSelf: 'center' }}
                    >
                        {t("box.stack.typography")}
                    </Typography>
                    <Button type="submit" id="boton2" name="passwordrecover" sx={{ mt: 1 /* margin top */ }}>{t("box.stack.buttontext")}</Button>
                </Stack>
            </Box>
        </Box>
        </>
    )
}

export default LoginComponent