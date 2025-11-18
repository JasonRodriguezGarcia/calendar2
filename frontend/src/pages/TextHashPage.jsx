import React, { useEffect, useState } from "react";
import bcrypt from "bcryptjs";
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
const saltRounds = 14

const TextHashPage = () => {
    const [hashed, setHashed] = useState("")
    const [password, setPassword] = useState("")
    const [isDisabled, setIsDisabled] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        if (errorMessage) {
            const intervalo = setTimeout(() => {
                setErrorMessage("")
            }, 3000)
            return () => clearTimeout(intervalo)
        }
    }, [errorMessage])


  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (password.length < 10) {
        setErrorMessage("Contraseña demasiado corta")
        return
    }
    setIsDisabled(true)
    // bcrypt en navegador debe ser síncrono
    const hash = bcrypt.hash(password, saltRounds)
    setHashed(hash)
    setIsDisabled(false)
  }

  return (
    <>
    <Box component="form"
        onSubmit={(e)=> handleFormSubmit(e)}
        sx={{
            width: "100%"
        }}
    >
        <br />
        <FormControl>
            <Stack direction="row" spacing={2} alignItems="center">
                <FormLabel htmlFor="password" sx={{ color: "black", minWidth: 150 }}>Password text:</FormLabel>
                <Input
                    id="password"
                    name="password"
                    type="text"
                    placeholder="(mín. 10 caract.)"
                    required
                    fullWidth
                    value={password}
                    onChange={(e)=> setPassword(e.target.value)}
                />
            </Stack>
        </FormControl>
        <br />
        <Button type="submit" variant="contained" id="boton1" sx={{ mt: 1 }}
            disabled={isDisabled}
        >
            Crear Hash!!
        </Button>
    </Box>
    { errorMessage && errorMessage}
    <Stack sx={{ p: 4, maxWidth: 600, margin: "auto" }}>
        <Typography variant="body1" component="h2">
            {/* Hola Visualmente texto normal, pero HTML &lt;h2&gt; */}
            Hash del texto es:
            <br />
            {hashed}
        </Typography>
    </Stack>
    </>
  )
}

export default TextHashPage