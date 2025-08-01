// import * as React from 'react';
import { useNavigate , Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';

import logo from "../assets/images/erroaksartu.jpg"
import { useScrollTrigger } from '@mui/material';
import { useState } from 'react';

const pages = ['Eventos', 'Vacaciones', 'About'];
const settings = ['Datos perfil', 'Modificar Datos Perfil', 'Cerrar sesión'];

function MainMenuComponent() {
    const navigate = useNavigate()
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [logged, setLogged] = useState(true)
    const [userNick, setUserNick] = useState('Rosa')

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = (setting) => {
        switch (setting) {
            // case "Datos perfil":
            //     navigate("/games");
            //     break;
            // case "Modificar datos perfil":
            //     navigate("/pricing");
            //     break;
            case "Cerrar sesión":
                setLogged(false)
                setUserNick('')
                navigate("/");
                break;
            default:
                break;
        }
        setAnchorElUser(null);
    };

    const handleClickedPage = (page) => {
        console.log("Página pulsada:", page);

        switch (page) {
            case "Eventos":
                navigate("/eventos");
                break;
            case "Vacaciones":
                navigate("/vacaciones");
                break;
            // case "About":
            //     navigate("/about");
            //     break;
            default:
                break;
        }
        setAnchorElNav(null); // cerrar menú móvil si estaba abierto
    }

      // filtramos las páginas y game aparece si estamos logeados
    const filteredPages = pages.filter(page => {
        if (page === "Eventos") return logged
        else if (page === "Vacaciones") return logged       
        return true;
    });
    
    return (
        <AppBar position="fixed">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
                <Typography
                    variant="h6"
                    noWrap
                    // component="a"
                    // href="#app-bar-with-responsive-menu"
                    component = {Link} // Usar link en lugar de "a" y "href" para no rerenderizar
                    to="/"
                    sx={{
                        mr: 2,
                        display: { xs: 'none', md: 'flex' },
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        color: 'inherit',
                        textDecoration: 'none',
                    }}
                >
                    {/* LOGO
                    */}
                    <img 
                        src={logo} 
                        alt="logo" 
                        style={{ 
                            height: 60, 
                            marginRight: 8, 
                            display: 'flex',
                            borderRadius: "10px",
                        }} 
                    />
                </Typography>
{/* menu mobil */}
                <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleOpenNavMenu}
                        color="inherit"
                    >
                    <MenuIcon />
                        </IconButton>
                    <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{ display: { xs: 'block', md: 'none' } }}
                    >
                    {/* {pages.map((page) => ( */}
                        {filteredPages.map((page) => (
                            <MenuItem key={page} onClick={()=> handleClickedPage(page)}>
                                <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
                {/* LOGO MOVIL */}
                {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}
                <Typography
                    variant="h5"
                    noWrap
                    component="a"
                    href="#app-bar-with-responsive-menu"
                    sx={{
                        mr: 2,
                        display: { xs: 'flex', md: 'none' },
                        flexGrow: 1,
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        color: 'inherit',
                        textDecoration: 'none',
                    }}
                >
                    {/* LOGO */}
                    <img 
                        src={logo} 
                        alt="logo" 
                        style={{ 
                            height: 60, 
                            marginRight: 8, 
                            display: 'flex',
                            borderRadius: "10px",
                        }} 
                    />
                </Typography>
                {/* MENU DESKTOP */}
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                    {filteredPages.map((page) => (
                    <Button
                        key={page}
                        onClick={()=> handleClickedPage(page)}
                        // sx={{ my: 2, color: 'white', display: 'block' }}
                        sx={{ my: 2, color: 'white', display: 'block', "&:hover": {backgroundColor: 'lightgrey', color: "black"},
                            "&:selected": {backgroundColor: "grey"} }}
                    >
                        {page}
                    </Button>
                    ))}
                </Box>
                {/* USUARIO LOGEADO */}
                <Box sx={{ flexGrow: 0, display: logged ? 'block' : 'none' }}>
                    <Tooltip title="Abrir configuración">
                        <Box sx={{ display: "flex", alignItems: "center"}}>
                            <Box sx={{mx: 2}}>
                                {/* User */}
                                <Typography
                                    variant="body1"
                                    sx={{ mx: 2, color: 'white', fontWeight: 'bold', backgroundColor: '#1976d2', px: 1.5, py: 0.5, borderRadius: 1 }}
                                >
                                    User: {userNick}
                                </Typography>
                            </Box>
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                {/* <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" /> */}
                                <Avatar alt={userNick} src="/static/images/avatar/2.jpg" />

                            </IconButton>
                        </Box >
                    </Tooltip>
                    <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                    {settings.map((setting) => (
                        <MenuItem key={setting} onClick={()=> handleCloseUserMenu(setting)}>
                        <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                        </MenuItem>
                    ))}
                    </Menu>
                </Box>

          <Box sx={{ flexGrow: 0, display: logged ? 'none' : 'block'}}>
            <Tooltip title="Darse de alta" arrow>
                <Button
                    // onClick={handleSignUp}
                    onClick={()=> navigate('/signup')}
                    sx={{ m: 2, color: 'white', display: 'block', "&:hover": {backgroundColor: 'lightgrey', color: "black"},
                    "&:selected": {backgroundColor: "grey"}
                    }}
                >
                    Darse de alta
                </Button>

            </Tooltip>
          </Box>

          <Box sx={{ flexGrow: 0, display: logged ? 'none' : 'block'}}>
            <Tooltip title="Abrir sesión" arrow>
                <Button
                    onClick={()=> navigate('/login')}
                    sx={{ m: 2, color: 'white', display: 'block', "&:hover": {backgroundColor: 'lightgrey', color: "black"},
                        "&:selected": {backgroundColor: "grey"}
                    }}
                >
                    Abrir sesión
                </Button>

            </Tooltip>
          </Box>


                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default MainMenuComponent;