import { useState, useCallback } from "react";
import { Backdrop, CircularProgress } from "@mui/material";

const useLoading = () => {

    const [isLoading, setIsLoading] = useState(false)

    const WaitingMessage= () => {
        return (
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={isLoading}
                >
                <CircularProgress color="inherit" />
                    <b>Loading ... </b>
            </Backdrop>
        )
    }

    return {
        isLoading, setIsLoading, WaitingMessage
    }
}

export default useLoading