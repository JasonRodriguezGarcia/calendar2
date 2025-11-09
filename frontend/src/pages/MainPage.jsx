import MenuBarComponent from '../components/MenuBarComponent';
import { Box, Toolbar } from '@mui/material';
import imagenFondo from "../assets/images/cuerda.jpg";
import imagenLogo1 from "../assets/images/erroak_logo-1.png";
import imagenLogo2 from "../assets/images/sartu_logo-1.png";

const MainPage = () => {

    return (
        <Box sx={{
            backgroundImage: `url(${imagenFondo})`,
            backgroundSize: "cover",
            minHeight: "100vh",
            // minWidth: "100%",
            backgroundPosition: "top center",

        }}>
            <Toolbar />
            <Toolbar />
            <Box sx={{
                backgroundImage: `url(${imagenLogo1})`,
                backgroundSize: "contain", // La imagen se escala para ajustarse completamente dentro del contenedor, manteniendo su relación de aspecto
                backgroundRepeat: "no-repeat",
                minHeight: "25vh",
                backgroundPosition: "center",
            }}></Box>
            <MenuBarComponent />
            <Box sx={{
                backgroundImage: `url(${imagenLogo2})`,
                backgroundSize: "contain", // La imagen se escala para ajustarse completamente dentro del contenedor, manteniendo su relación de aspecto
                backgroundRepeat: "no-repeat",
                minHeight: "25vh",
                backgroundPosition: "center",
            }}></Box>
        </Box>
    )
}

export default MainPage