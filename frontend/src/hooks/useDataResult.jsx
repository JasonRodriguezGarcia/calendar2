import { useState } from "react";
import { Alert, Snackbar } from "@mui/material";

const useDataResult = () => {

    const duration = 50000
    const [snackAction, setSnackAction ] = useState(0)
    const [isOpen, setIsOpen] = useState(false)
    const snackActionMessage= [
        "Datos Guardados",
        "Datos Borrados"
    ]
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return

        setIsOpen(false);
    }

    const SnackMessage = () => {
        return (
            <Snackbar open={isOpen} autoHideDuration={duration} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    // severity="success"
                    severity={snackAction === 0? "success" : "error"}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackActionMessage[snackAction]}
                </Alert>
            </Snackbar>
        )
    }

    return {
        snackAction, setSnackAction, isOpen, setIsOpen, SnackMessage
    }
}

export default useDataResult