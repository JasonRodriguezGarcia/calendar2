import { useState } from 'react';
import { useNavigate , Link } from 'react-router-dom';
import logo from "../assets/images/erroaksartu.jpg"
import {
    AppBar,
    Avatar,
    Box,
    Button, 
    Container,
    FormControl,
    Menu,
    MenuItem,
    IconButton,
    Select,
    Toolbar, // en lugar de box usar Stack, que simplifica aún más la organización vertical.
    Tooltip, 
    Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
// import PaisVasco from "../assets/images/flags/paisvasco.png"
// import Espana from "../assets/images/flags/espana.png"
// import Francia from "../assets/images/flags/francia.png"
// import ReinoUnido from "../assets/images/flags/ReinoUnido.png"


const pages = ['Eventos', 'Vacaciones', 'Listados', 'About'];
const lists = ['Eventos entidad', 'Vacaciones entidad', 'Tardes invierno', 'Contactos', ]
const settings = ['Ver perfil', 'Modificar perfil', 'Cerrar sesión'];
// const languagesSelect = [
//     { lang: 'Eus', icon: PaisVasco },
//     { lang: 'Es', icon: Espana },
//     // { lang: 'Fr', icon: Francia },
//     // { lang: 'En', icon: ReinoUnido },
// ];

const MainMenuComponent = ({ logged, setLogged, user, setUser, selectedLanguage, setSelectedLanguage, languagesSelect }) => {
    const navigate = useNavigate()
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [anchorElList, setAnchorElList] = useState(null);
    // const [selectedLanguage, setSelectedLanguage] = useState(languagesSelect[1].lang) // lenguaje por defecto

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    }
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    }

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    }

    const handleCloseUserMenu = (setting) => {
        switch (setting) {
            case "Ver perfil":
                // navigate("/profile", { replace: true });
                navigate("/profile")
                break
            case "Modificar perfil":
                // navigate("/editprofile", { replace: true });
                navigate("/editprofile")
                break
            case "Cerrar sesión":
                // localStorage.removeItem("usuario")
                localStorage.removeItem("token")
                setLogged(false)
                setUser({})
                navigate("/", { replace: true })
                break
            default:
                break
        }
        setAnchorElUser(null);
    };

    const handleClickedPage = (page, event) => {
        console.log("Página pulsada:", page);

        switch (page) {
            case "Listados":
                setAnchorElList(event.currentTarget)
                break
            case "Eventos":
                // navigate("/eventos", { replace: true });
                navigate("/eventos")
                break
            case "Vacaciones":
                // navigate("/holidays", { replace: true });
                navigate("/holidays")
                break
            case "About":
                // navigate("/about", { replace: true });
                navigate("/about")
                break
            default:
                break
        }
        setAnchorElNav(null) // cerrar menú móvil si estaba abierto
    }

      // filtramos las páginas y game aparece si estamos logeados
    const filteredPages = pages.filter(page => {
        if (page === "Eventos") return logged
        else if (page === "Vacaciones") return logged       
        else if (page === "Listados") return logged       
        return true
    });

    return (
        <AppBar position="fixed" sx={{ backgroundColor: '#0072AD' }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <FormControl variant="standard" fullWidth sx={{width: "100px"}}>
                        <Select
                            id="select-usuario_id"
                            value={selectedLanguage}
                            disableUnderline
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                            sx={{
                                color: "white",
                                display: "flex",
                                width: "100%",
                                borderRadius: "5px",
                                "&:hover": {backgroundColor: 'lightgrey', color: "black"},
                                "&:selected": {backgroundColor: "grey"},
                                fontSize: {xs: "12px", md:"18px"},
                                "& .MuiSelect-select": {
                                    textAlign: "center",  // <- centra el texto seleccionado
                                    display: "flex",
                                    justifyContent: "center", // centra horizontalmente el contenido
                                    alignItems: "center",     // centra verticalmente (opcional)
                                }
                            }}
                            >
                            {languagesSelect.map((lang, index) => (
                                <MenuItem 
                                    sx={{ display: "flex", fontSize: {xs: "12px", md:"18px"}, alignItems: "center", height: "100%" }}
                                    key={index} value={lang.lang}
                                >
                                    <Box sx={{display: "flex", alignItems: "center"}}>
                                        {lang.lang}
                                        {/* &nbsp;
                                        <img 
                                            src={lang.icon} 
                                            alt={`bandera-${lang.lang}`}
                                            style={{ 
                                                height: 25, 
                                                width: 30,
                                                marginRight: 8, 
                                            }} 
                                        /> */}
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Typography
                        variant="h6"
                        noWrap
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
                                    marginRight: 16, 
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
                                        <MenuItem sx={{ fontWeight: 'bold', color: "slategrey" }}>
                                            <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
                                        </MenuItem>
                                        {lists.map((item) => (
                                            <MenuItem
                                                key={item}
                                                onClick={() => {
                                                    setAnchorElNav(null)
                                                    // navegación
                                                    switch (item) {
                                                        case "Eventos entidad":
                                                            // navigate("/staffholidays", { replace: true });
                                                            navigate("/entityevents")
                                                            break
                                                        case "Vacaciones entidad":
                                                            // navigate("/staffholidays", { replace: true });
                                                            navigate("/staffholidays")
                                                            break
                                                        case "Tardes invierno":
                                                            // navigate("/winterafternoons", { replace: true });
                                                            navigate("/winterafternoons")
                                                            break
                                                        case "Contactos":
                                                            // navigate("/contacts", { replace: true });
                                                            navigate("/contacts")
                                                            break
                                                        default:
                                                            break
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
                    <Typography
                        variant="h5"
                        noWrap
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
                                        height: 30, 
                                        marginRight: 4,
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
                                    marginRight: 18, 
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
                                    setAnchorElList(null)
                                    // Añade aquí la lógica de navegación por cada item si la tienes
                                    switch (item) {
                                        case "Eventos entidad":
                                            // navigate("/staffholidays", { replace: true });
                                            navigate("/entityevents")
                                            break
                                        case "Vacaciones entidad":
                                            // navigate("/staffholidays", { replace: true });
                                            navigate("/staffholidays")
                                            break
                                        case "Tardes invierno":
                                            // navigate("/winterafternoons", { replace: true });
                                            navigate("/winterafternoons")
                                            break
                                        case "Contactos":
                                            // navigate("/contacts", { replace: true });
                                            navigate("/contacts")
                                            break
                                        default:
                                            break
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
                                    sx={
                                        (theme) => ({
                                            fontSize: {
                                                xs: '8px',   // móviles
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
                                onClick={()=> navigate('/signup')}
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
    )
}
export default MainMenuComponent;