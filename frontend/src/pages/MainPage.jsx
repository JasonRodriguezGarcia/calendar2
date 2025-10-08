import MainMenuComponent from '../components/MainMenuComponent';
import { Box, Toolbar } from '@mui/material';
import imagenFondo from "../assets/images/erroak-page.jpeg";

const MainPage = ({ logged, setLogged, user, setUser }) => {

    return (
        <Box sx={{
            backgroundImage: `url(${imagenFondo})`,
            backgroundSize: "cover",
            minHeight: "100vh",
            backgroundPosition: "top center",

        }}>
            <MainMenuComponent logged={logged} setLogged={setLogged} user={user} setUser={setUser} />
            <Toolbar />
        </Box>
    )
}

export default MainPage