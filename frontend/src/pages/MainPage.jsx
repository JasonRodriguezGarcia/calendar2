import MainMenuComponent from '../components/MainMenuComponent';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Toolbar, Typography } from '@mui/material';
import imagenFondo from "../assets/images/cuerda.jpg";
const MainPage = ({ logged }) => {

    const navigate = useNavigate();
    const [logeado, setLogeado] = useState(false)
    const [usuario, setUsuario] = useState({})

    useEffect(()=> {
        const checklogeado = () => {
            const usuario_id = localStorage.getItem("id")
            const nombre_apellidos = localStorage.getItem("user")
            const password = localStorage.getItem("password")
            console.log("Localstorage: ", usuario_id, "-", nombre_apellidos, " - ", password)
            // debugger
            if (nombre_apellidos!== null && password!== null) {
                // lo busca en backend y si todo ok
                setLogeado(true)
                setUsuario({id: usuario_id, nombre_apellidos: nombre_apellidos, password: password})
            }
            else {
                setLogeado(false)
                navigate(`/`, { replace: true }); // evita que el usuario regrese con back
            }
        }

        checklogeado()
    }, [])

    return (
        // <div>
        <Box sx={{
            backgroundImage: `url(${imagenFondo})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "100vh",

        }}>
            <MainMenuComponent logged={logeado} setLogged={setLogeado} user={usuario} setUser={setUsuario} />
            <Toolbar />
            <Typography variant='h3'
                sx={{
                    width: { xs: '90%', sm: "30%" },
                    mx: "auto", my: 4,
                    borderRadius: "10px",
                    // backgroundColor: "white",
                    backgroundColor: '#0072AD',
                    color: "#8BC000",
                }}
            >
                Intranet Erroak Sartu
            </Typography>
            {/* <h1 style={{paddingTop: "100px"}}>Erroak Sartu</h1> */}
            {/* <h3 style={{paddingTop: "100px"}}>Logeado/a: {logeado ? "Si" : "No"}</h3> */}
        </Box>
        // </div>
    )
}

export default MainPage