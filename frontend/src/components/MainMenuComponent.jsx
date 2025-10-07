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
// import AdbIcon from '@mui/icons-material/Adb';
import HomeIcon from '@mui/icons-material/Home';

import logo from "../assets/images/erroaksartu.jpg"
import { useScrollTrigger } from '@mui/material';
import { useState } from 'react';

const pages = ['Eventos', 'Vacaciones', 'Listados', 'About'];
const lists = ['Eventos entidad', 'Vacaciones personal', 'Tardes invierno', 'Contactos', ]
const settings = ['Ver perfil', 'Modificar perfil', 'Cerrar sesión'];

function MainMenuComponent({ logged, setLogged, user, setUser }) {
    const navigate = useNavigate()
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [anchorElList, setAnchorElList] = useState(null);
    // const [logged, setLogged] = useState(true)
    // const [userNick, setUserNick] = useState('Rosa')

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
            case "Ver perfil":
                // navigate("/profile", { replace: true });
                navigate("/profile");
                break;
            case "Modificar perfil":
                // navigate("/editprofile", { replace: true });
                navigate("/editprofile");
                break;
            case "Cerrar sesión":
                // localStorage.removeItem("id")
                // localStorage.removeItem("user")
                // localStorage.removeItem("password")
                localStorage.removeItem("usuario")
                setLogged(false)
                setUser({})
                navigate("/", { replace: true });
                break;
            default:
                break;
        }
        setAnchorElUser(null);
    };

    const handleClickedPage = (page, event) => {
        console.log("Página pulsada:", page);

        switch (page) {
            case "Listados":
                setAnchorElList(event.currentTarget);
            break;
                // case "Eventos":
            case "Eventos":
                // navigate("/eventos", { replace: true });
                navigate("/eventos");
                break;
            // case "Vacaciones":
            case "Vacaciones":
                // navigate("/holidays", { replace: true });
                navigate("/holidays");
                break;
            case "About":
                // navigate("/about", { replace: true });
                navigate("/about");
                break;
            default:
                break;
        }
        setAnchorElNav(null); // cerrar menú móvil si estaba abierto
    }

      // filtramos las páginas y game aparece si estamos logeados
    const filteredPages = pages.filter(page => {
        if (page === "Eventos") return logged
        else if (page === "Vacaciones") return logged       
        else if (page === "Listados") return logged       
        return true;
    });
    
    return (
        // <AppBar position="fixed" >
        <AppBar position="fixed" sx={{ backgroundColor: '#0072AD' }}>
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
                        {/* LOGO */}
                        <Tooltip title="Inicio">
                            <IconButton color="primary" aria-label="home">
                                <HomeIcon
                                    style={{ 
                                        height: 50,
                                        fontSize: "3rem",
                                        marginRight: 8,
                                        display: 'flex',
                                        // color: "white",
                                        color: "#8BC000",
                                        borderRadius: "10px",
                                    }}
                                />
                            </IconButton>
                        </Tooltip>
                    </Typography>
                    <Typography
                        variant="h"
                        noWrap
                        // component="a"
                        // href="#app-bar-with-responsive-menu"
                        component = {Link} // Usar link en lugar de "a" y "href" para no rerenderizar
                        to="https://erroaksartu.org/"
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
                        {/* LOGO */}
                        <Tooltip title="Página web Erroak Sartu">
                            <img 
                                src={logo} 
                                alt="logo" 
                                style={{ 
                                    height: 50, 
                                    marginRight: 8, 
                                    display: 'flex',
                                    borderRadius: "10px",
                                }} 
                            />
                        </Tooltip>
                    </Typography>
    {/* menu mobil */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }}}>
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
                            {filteredPages.map((page) => (
                                page === "Listados" ? (
                                    <div key="listados">
                                        {/* <MenuItem disabled sx={{ fontWeight: 'bold' }}> */}
                                        <MenuItem sx={{ fontWeight: 'bold', color: "slategrey" }}>
                                            <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
                                        </MenuItem>
                                        {lists.map((item) => (
                                            <MenuItem
                                                key={item}
                                                onClick={() => {
                                                    setAnchorElNav(null);
                                                    // navegación
                                                    switch (item) {
                                                        case "Eventos entidad":
                                                            // navigate("/staffholidays", { replace: true });
                                                            navigate("/entityevents");
                                                            break;
                                                        case "Vacaciones personal":
                                                            // navigate("/staffholidays", { replace: true });
                                                            navigate("/staffholidays");
                                                            break;
                                                        case "Tardes invierno":
                                                            // navigate("/winterafternoons", { replace: true });
                                                            navigate("/winterafternoons");
                                                            break;
                                                        case "Contactos":
                                                            // navigate("/contacts", { replace: true });
                                                            navigate("/contacts");
                                                            break;
                                                        default:
                                                            break;
                                                    }
                                                }}
                                                sx={{ pl: 4 }}
                                            >
                                                <Typography>{item}</Typography>
                                            </MenuItem>
                                        ))}
                                    </div>
                                ) : (
                                    <MenuItem key={page} onClick={(e)=> handleClickedPage(page,e)}
                                        sx={{ "&:hover": {backgroundColor: 'lightgrey', color: "black"},
                                            "&:selected": {backgroundColor: "grey"}
                                        }}
                                    >
                                        <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
                                    </MenuItem>
                                )
                            ))}
                        </Menu>
                    </Box>
                    {/* LOGO MOVIL */}
                    {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}
                    <Typography
                        variant="h5"
                        noWrap
                        // component="a"
                        // href="#app-bar-with-responsive-menu"
                        component = {Link} // Usar link en lugar de "a" y "href" para no rerenderizar
                        to="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                            justifyItems: 'left'
                        }}
                    >
                        {/* LOGO */}
                        <Tooltip title="Inicio">
                            <IconButton color="primary" aria-label="home">
                                <HomeIcon
                                    style={{ 
                                        height: 35, 
                                        // marginRight: 8, 
                                        // display: 'flex',
                                        // color: "white",
                                        color: "#8BC000",
                                        borderRadius: "10px",
                                    }}
                                />
                            </IconButton>
                        </Tooltip>
                    </Typography>
                    <Typography
                        variant="h5"
                        noWrap
                        // component="a"
                        // href="#app-bar-with-responsive-menu"
                        component = {Link} // Usar link en lugar de "a" y "href" para no rerenderizar
                        to="https://erroaksartu.org/"
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
                        <Tooltip title="Página web Erroak Sartu">
                            <img 
                                src={logo} 
                                alt="logo"
                                style={{ 
                                    height: 35, 
                                    marginRight: 8, 
                                    display: 'flex',
                                    borderRadius: "10px",
                                }} 
                            />
                        </Tooltip>
                    </Typography>
    {/* MENU DESKTOP */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {filteredPages.map((page) => (
                        <Button
                            key={page}
                            onClick={(e)=> handleClickedPage(page,e)}
                            // sx={{ my: 2, color: 'white', display: 'block', "&:hover": {backgroundColor: 'lightgrey', color: "black"},
                            sx={{ my: 2, color: 'white', display: 'block', "&:hover": {backgroundColor: 'lightgrey', color: "black"},
                                "&:selected": {backgroundColor: "grey"} }}
                        >
                            {page}
                        </Button>
                        ))}
                    </Box>
                {/* subMENU DE LISTADOS */}
                    <Menu
                        anchorEl={anchorElList}
                        open={Boolean(anchorElList)}
                        onClose={() => setAnchorElList(null)}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    >
                        {lists.map((item) => (
                            <MenuItem
                                key={item}
                                onClick={() => {
                                    setAnchorElList(null);
                                    // Añade aquí la lógica de navegación por cada item si la tienes
                                    switch (item) {
                                        case "Eventos entidad":
                                            // navigate("/staffholidays", { replace: true });
                                            navigate("/entityevents");
                                            break;
                                        case "Vacaciones personal":
                                            // navigate("/staffholidays", { replace: true });
                                            navigate("/staffholidays");
                                            break;
                                        case "Tardes invierno":
                                            // navigate("/winterafternoons", { replace: true });
                                            navigate("/winterafternoons");
                                            break;
                                        case "Contactos":
                                            // navigate("/contacts", { replace: true });
                                            navigate("/contacts");
                                            break;
                                        default:
                                            break;
                                    }
                                }}
                            >
                                {item}
                            </MenuItem>
                        ))}
                    </Menu>
            {/* USUARIO LOGEADO */}
                    <Box sx={{ flexGrow: 0, display: logged ? 'block' : 'none' }}>
                        <Box sx={{ display: "flex", alignItems: "center"}}>
                            <Box sx={{mx: 1}}>
                                {/* User */}
                                <Typography
                                    variant="body1"
                                    // sx={{ mx: 2, color: 'white', fontWeight: 'bold', backgroundColor: '#0072AD', px: 1.5, py: 0.5, borderRadius: 1 }}
                                    sx={
                                        (theme) => ({
                                            fontSize: {
                                                xs: '10px',   // móviles
                                                sm: '10px',  // tablets
                                                md: '14px',  // escritorio
                                            },
                                            color: 'white', fontWeight: 'bold', backgroundColor: '#0072AD', px: 1.5, py: 0.5, borderRadius: 1 
                                    })}
                                >
                                    Usuario/a: {user.nombre_apellidos}
                                </Typography>
                            </Box>
                            <Tooltip title="Abrir configuración">
                                <IconButton onClick={handleOpenUserMenu}
                                sx={{ p: 0 }}
                                >
                                    <Avatar alt={user.nombre_apellidos} src="/static/images/avatar/2.jpg" />
                                    {/* <Avatar alt={user.nombre_apellidos} src="/static/images/personicons/rosa.jpg" /> */}
                                </IconButton>
                            </Tooltip>
                        </Box >
                        <Menu
                            sx={{ mt: '45px' }}         // Aplica margen superior de 45px (espaciado del botón que abre el menú)
                            id="menu-appbar"            // ID para accesibilidad
                            anchorEl={anchorElUser}     // Elemento DOM que "ancora" el menú (desde dónde aparece)
                            anchorOrigin={{             // Desde dónde se alinea respecto al ancla
                                vertical: 'top',        
                                horizontal: 'right',    
                            }}
                            keepMounted                 // Mantiene el componente montado aunque esté cerrado (mejora rendimiento)
                            transformOrigin={{          // Desde dónde se "despliega" el menú
                                vertical: 'top',        
                                horizontal: 'right',    
                            }}
                            open={Boolean(anchorElUser)}    // Solo se abre si anchorElUser no es null
                            onClose={handleCloseUserMenu}   // Cierra el menú al hacer clic fuera o seleccionar una opción
                        >
                            {settings.map((setting) => (
                                <MenuItem key={setting} onClick={()=> handleCloseUserMenu(setting)}
                                    sx={{ "&:hover": {backgroundColor: 'lightgrey', color: "black"},
                                        "&:selected": {backgroundColor: "grey"}
                                    }}
                                >
                                    <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

            {/* Usuario no logeado */}
                    <Box sx={{ flexGrow: 0, display: logged ? 'none' : 'block'}}>
                        <Tooltip title="Darse de alta" arrow>
                            <Button
                                // onClick={handleSignUp}
                                // onClick={()=> navigate('/signup', { replace: true })}
                                onClick={()=> navigate('/signup')}
                                // sx={{ 
                                //     m: 2, color: 'white', display: 'block', "&:hover": {backgroundColor: 'lightgrey', color: "black"},
                                //     "&:selected": {backgroundColor: "grey"}
                                // }}
                                sx={
                                    (theme) => ({
                                        fontSize: {
                                            xs: '10px',   // móviles
                                            sm: '10px',  // tablets
                                            md: '14px',  // escritorio
                                        },
                                        mr: 2, color: 'white', display: 'block', "&:hover": {backgroundColor: 'lightgrey', color: "black"},
                                    
                                })}
                            >
                                Alta usuario/a
                            </Button>
                        </Tooltip>
                    </Box>

                    <Box sx={{ flexGrow: 0, display: logged ? 'none' : 'block'}}>
                        <Tooltip title="Iniciar sesión" arrow>
                            <Button
                                // onClick={()=> navigate('/login', { replace: true })}
                                onClick={()=> navigate('/login')}
                                // sx={{ m: 2, color: 'white', display: 'block', "&:hover": {backgroundColor: 'lightgrey', color: "black"},
                                //     "&:selected": {backgroundColor: "grey"}
                                // }}
                                sx={
                                    (theme) => ({
                                        fontSize: {
                                            xs: '10px',   // móviles
                                            sm: '10px',  // tablets
                                            md: '14px',  // escritorio
                                        },
                                        mr: 2, color: 'white', display: 'block', "&:hover": {backgroundColor: 'lightgrey', color: "black"},
                                    
                                })}

                            >
                                Iniciar sesión
                            </Button>

                        </Tooltip>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default MainMenuComponent;