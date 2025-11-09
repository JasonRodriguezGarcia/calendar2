import MenuBarComponent from '../components/MenuBarComponent';
import { Box, Toolbar } from '@mui/material';
import imagenFondo from "../assets/images/underconstruction.jpg";

const UnderConstructionPage = () => {

    return (
        <Box sx={{
            backgroundImage: `url(${imagenFondo})`,
            backgroundSize: "cover",
            minHeight: "100vh",
            backgroundPosition: "center",
            marginTop: "60px"
        }}>
            <Toolbar />
            <Toolbar />
            <MenuBarComponent />
        </Box>
    )
}

export default UnderConstructionPage