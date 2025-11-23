import { Box, Toolbar } from '@mui/material';
import MenuBarComponent from '../components/MenuBarComponent';
import AboutComponent from '../components/AboutComponent';
// import imagenFondo from "../assets/images/underconstruction.jpg";
import imagenFondo from "../assets/images/cuerda.jpg";

const AboutPage = () => {

    return (
        <Box
            sx={{
                backgroundImage: `url(${imagenFondo})`,
                backgroundSize: "cover",
                minHeight: "100vh",
                backgroundPosition: "top center",
                backgroundAttachment: "fixed",
                paddingTop: "60px",
            }}
        >
        
            {/* <Toolbar />
            <Toolbar /> */}
            <MenuBarComponent />
            {/* <h2>Esto es una prueba</h2> */}
            <AboutComponent />
        </Box>
    )
}

export default AboutPage