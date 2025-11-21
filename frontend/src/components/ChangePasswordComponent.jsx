import React, {useEffect, useState} from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import AppContext from '../context/AppContext';
import useLoading from "../hooks/useLoading"
import Box from '@mui/material/Box';
// MUI
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    FormControl, 
    FormLabel,
    Input,
    Stack, // en lugar de box usar Stack, que simplifica aún más la organización vertical.
} from '@mui/material';

const ChangePasswordComponent = () => {
    const VITE_BACKEND_URL_RENDER = import.meta.env.VITE_BACKEND_URL_RENDER
    const { t, i18n } = useTranslation("changepassword")
    const { csrfToken, user } = useContext(AppContext)
    const { setIsLoading, WaitingMessage } = useLoading()
    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [newPassword2, setNewPassword2] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [minPasswordLength, setMinPasswordLength] = useState(10) // Longitud contraseña
    const [dialogNewPasswordOpen, setDialogNewPasswordOpen] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false)
    
    useEffect(()=> {
        if (errorMessage) {
            const intervalo = setTimeout(() => {
                setErrorMessage("")
            }, 3000)
            return () => clearTimeout(intervalo)
        }
    }, [errorMessage])

    const handleNewPasswordSubmit = async (e) => {
        e.preventDefault()
        if (currentPassword === newPassword) {
            setErrorMessage(t("error.message5"))
            return
        }
        if (newPassword.length < minPasswordLength) {
            setErrorMessage(t("error.message1"))
            return
        }
        if (newPassword2.length < minPasswordLength) {
            setErrorMessage(t("error.message2"))
            return
        }
        if (newPassword !== newPassword2){
            setErrorMessage(t("error.message3"))
            return
        }
        setIsDisabled(true)
        setIsLoading(true)

            // llamamos a /me para recibir el token de la cookie con el usuario
            const response = await fetch(`${VITE_BACKEND_URL_RENDER}/api/v1/erroak/me`,
                {
                    method: 'GET',
                    credentials: 'include', // IMPORTANTE: esto permite usar la cookie
                    headers: {'Content-type': 'application/json; charset=UTF-8'},
                }
            )
            const data = await response.json()
            // console.log("Data: ", data)
            if (data.message) {
                // no debería de pasar por aquí
                setIsDisabled(false)
                console.log("NO HAY TOKEN")
                navigate("/")
            }
            const usuarioToken = data.token
            console.log("usuarioToken: ", usuarioToken)

            try {
                const user = {
                    token: usuarioToken,
                    newpassword: newPassword,
                    currentpassword: currentPassword
                }
                // fetch validate
                const response = await fetch(`${VITE_BACKEND_URL_RENDER}/api/v1/erroak/changepassword`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json; charset=UTF-8',
                            'X-CSRF-Token': csrfToken,
                        },
                        body: JSON.stringify(user)
                    }
                )
                const data = await response.json()
                console.log("Respuesta backend: ", data)
                setIsDisabled(false)
                if (data.result === "Error. Usuario ID no existe") {
                    setErrorMessage("Error. Usuario ID no existe")
                    return
                }
                if (data.result === "No encontrado") {
                    setErrorMessage("No encontrado")
                    return
                }
                if (data.result === "Contraseña actual incorrecta") {
                    setErrorMessage(t("error.message4"))
                    return
                }

                if (data.error) {
                    if (data.error === "El enlace ha expirado, solicite uno nuevo") {
                        setErrorMessage("El enlace ha expirado, solicite uno nuevo")
                    } else if (data.error === "Token inválido, solicite nueva contraseña") {
                        setErrorMessage("Token inválido, solicite nueva contraseña")
                    }
                    return
                }
                setDialogNewPasswordOpen(true)

            } catch (error) {
                // setError(error.message); // Handle errors
                console.log(error.message)
            } finally {
                setIsLoading(false) // Set loading to false once data is fetched or error occurs
            }

    }

    const handleNewPassword = () => {
        setDialogNewPasswordOpen(false)
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
            <WaitingMessage />
            <Box component="form"
                onSubmit={(e)=> handleNewPasswordSubmit(e)}
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
                    alignItems: 'center',       // alineado horizontal
                    gap: 2,
                    border: "1px solid grey",
                    borderRadius: '10px',
                    boxShadow: '10px 10px 15px 5px grey',
                    backgroundColor: '#f0f0f0',
                }}
            >
                <Typography variant="h4" component="h3" sx={{ color: "black"}}>
                    <b>{t("boxform.typography")}</b>
                </Typography>
                <FormControl>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <FormLabel htmlFor="currentpassword" sx={{ color: "black", minWidth: 100 }}>{t("boxform.formcontrol0.formlabel")}</FormLabel>
                        <Input
                            id="currentpassword"
                            name="currentpassword"
                            type={showPassword ? 'text' : 'password'}
                            onMouseEnter={() => setShowPassword(true)}
                            onMouseLeave={() => setShowPassword(false)}
                            placeholder={`(${t("boxform.formcontrol0.placeholder.text1")}. ${minPasswordLength} - ${t("boxform.formcontrol0.placeholder.text2")})`}
                            required
                            fullWidth
                            value={currentPassword}
                            onChange={(e)=> setCurrentPassword(e.target.value)}
                        />
                    </Stack>
                </FormControl>
                <FormControl>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <FormLabel htmlFor="newpassword" sx={{ color: "black", minWidth: 100 }}>{t("boxform.formcontrol1.formlabel")}</FormLabel>
                        <Input
                            id="newpassword"
                            name="newpassword"
                            type={showPassword ? 'text' : 'password'}
                            onMouseEnter={() => setShowPassword(true)}
                            onMouseLeave={() => setShowPassword(false)}
                            placeholder={`(${t("boxform.formcontrol1.placeholder.text1")}. ${minPasswordLength} - ${t("boxform.formcontrol1.placeholder.text2")})`}
                            required
                            fullWidth
                            value={newPassword}
                            onChange={(e)=> setNewPassword(e.target.value)}
                        />
                    </Stack>
                </FormControl>
                <FormControl>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <FormLabel htmlFor="newpassword2" sx={{ color: "black", minWidth: 100 }}>{t("boxform.formcontrol2.formlabel")}</FormLabel>
                        <Input
                            id="newpassword2"
                            name="newpassword2"
                            type={showPassword ? 'text' : 'password'}
                            onMouseEnter={() => setShowPassword(true)}
                            onMouseLeave={() => setShowPassword(false)}
                            placeholder={`(${t("boxform.formcontrol2.placeholder.text1")}. ${minPasswordLength} - ${t("boxform.formcontrol2.placeholder.text2")})`}
                            required
                            fullWidth
                            value={newPassword2}
                            onChange={(e)=> setNewPassword2(e.target.value)}
                        />
                    </Stack>
                </FormControl>
                <Button type="submit" variant="contained" id="boton1" name="login" sx={{ mt: 1 /* margin top */ }}
                    disabled={isDisabled}
                >
                    {t("button")}
                </Button>
                {errorMessage && 
                    <Typography level="body-sm" color="danger" fontWeight="bold" fontSize="1em">{errorMessage}</Typography>
                }
                <Dialog open={dialogNewPasswordOpen} onClose={handleNewPassword}>
                    <DialogTitle>
                        <Typography variant="h4" component="span">
                            {/* Contraseña cambiada */}
                            {t("dialog.title")}
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContent>
                            {/* La contraseña ha sido cambiada con éxito.
                            Puede iniciar sesión con la nueva contraseña. */}
                            {t("dialog.content.content")}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleNewPassword} variant="contained"
                            >
                                {t("dialog.content.actions")}
                            </Button>
                        </DialogActions>
                    </DialogContent>
                </Dialog>
            </Box>
        </Box>
        </>
    )
}

export default ChangePasswordComponent