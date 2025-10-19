import MenuBarComponent from '../components/MenuBarComponent';
import { Box, Toolbar } from '@mui/material';
import imagenFondo from "../assets/images/cuerda.jpg";
import imagenLogo1 from "../assets/images/erroak_logo-1.png";
import imagenLogo2 from "../assets/images/sartu_logo-1.png";

const MainPage = ({ logged, setLogged, user, setUser, selectedLanguage, setSelectedLanguage, languagesSelect }) => {

    // console.log("Lenguaje seleccionado: ", selectedLanguage)
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
            <MenuBarComponent 
                selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} languagesSelect={languagesSelect}
                logged={logged} setLogged={setLogged} user={user} setUser={setUser} />
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