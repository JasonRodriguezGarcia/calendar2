import React, {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import AppContext from '../context/AppContext';
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

const PasswordRecoveryComponent = () => {
    const VITE_BACKEND_URL_RENDER = import.meta.env.VITE_BACKEND_URL_RENDER
    const { t, i18n } = useTranslation("passwordrecovery")
    const { logged } = useContext(AppContext)

    const [userEmail, setUserEmail] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [dialogRecovery, setDialogRecovery]= useState(false)
    const navigate = useNavigate();

    useEffect(()=> {
        if (errorMessage) {
            const intervalo = setTimeout(() => {
                setErrorMessage("")
            }, 3000)
            return () => clearTimeout(intervalo)
        }
    }, [errorMessage])

    useEffect(() => {
        if (logged) {
            navigate("/", { replace: true });
        }
    }, [logged, navigate]); // se ejecuta al menos una vez, justo después del primer render, y también cada vez que logged cambie.

    const handlePasswordRecovery = async (e) => {
        e.preventDefault()
        if (userEmail.length < 18 && !userEmail.includes("@erroak.sartu.org")) {
            setErrorMessage(t("error.message1"))
            return
        }

        try {
            const userPasswordDetails = {
                useremail: userEmail,
                emailmsg: {
                    subject: t("emailmsg.subject"),
                    html: {
                        line1: t("emailmsg.html.line1"),
                        line2: t("emailmsg.html.line2"),
                        line3: t("emailmsg.html.line3"),
                        line4: t("emailmsg.html.line4")
                    }
                }
            }
            // fetch validate
            const response = await fetch(`${VITE_BACKEND_URL_RENDER}/api/v1/erroak/passwordrecovery`,
                {
                    method: 'POST',
                    headers: {'Content-type': 'application/json; charset=UTF-8'},
                    body: JSON.stringify(userPasswordDetails)
                }
            )
            const data = await response.json()
            console.log("Respuesta backend: ", data)
            if (data.result === "No encontrado") {
                setErrorMessage(t("error.message2"))
                return
            } else {
                setDialogRecovery(true)
            }

        } catch (error) {
            // setError(error.message); // Handle errors
            console.log(error.message)
        } finally {
            // setLoading(false); // Set loading to false once data is fetched or error occurs
        }

    }

    const handleRecovery = () => {
        setDialogRecovery(false)
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
                onSubmit={(e)=> handlePasswordRecovery(e)}
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
                    <b>{t("boxtypography")}</b>
                </Typography>
                <FormControl>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <FormLabel htmlFor="useremail" sx={{ color: "black", minWidth: 100 }}>{t("boxformcontrol.formlabel")}</FormLabel>
                        <Input
                            id="useremail"
                            name="useremail"
                            type="email"
                            autoComplete="email"
                            placeholder={t("boxformcontrol.placeholder")}
                            fullWidth
                            onChange={(e)=> setUserEmail(e.target.value)}
                        />
                    </Stack>
                </FormControl>
                <Button type="submit" variant="contained" id="boton1" name="login" sx={{ mt: 1 }}>{t("boxbutton")}</Button>

                {errorMessage &&                 
                    <Typography level="body-sm" color="danger" fontWeight="bold" fontSize="1em">{errorMessage}</Typography>
                }
                <Dialog open={dialogRecovery} onClose={handleRecovery}>
                    <DialogTitle>
                        <Typography variant="h4" component="span">
                            {t("boxdialog.title")}
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContent>
                            {t("boxdialog.content")} {userEmail}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleRecovery} variant="contained">{t("boxdialog.button")}</Button>
                        </DialogActions>
                    </DialogContent>
                </Dialog>
            </Box>
        </Box>
        </>
    )
}

export default PasswordRecoveryComponent