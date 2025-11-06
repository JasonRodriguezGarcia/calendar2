import { useEffect, useState } from 'react';
import { useNavigate , Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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

// const languagesSelect = [
//     { lang: 'Eus', icon: PaisVasco },
//     { lang: 'Es', icon: Espana },
//     // { lang: 'Fr', icon: Francia },
//     // { lang: 'En', icon: ReinoUnido },
// ];

const MenuBarComponent = ({ logged, setLogged, user, setUser, selectedLanguage, setSelectedLanguage, languagesSelect }) => {
    const VITE_BACKEND_URL_RENDER = import.meta.env.VITE_BACKEND_URL_RENDER

    const navigate = useNavigate()
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [anchorElList, setAnchorElList] = useState(null);
    const { t, i18n } = useTranslation("menubar")
    const pages = [t("pages.eventos"), t("pages.vacaciones"), t("pages.listados"), t("pages.about")]
    const lists = [t("lists.eventosentidad"), t("lists.vacacionesentidad"), t("lists.tardesinvierno"), t("lists.contactos")]
    const settings = [t("settings.verperfil"), t("settings.modificarperfil"), t("settings.cerrarsesion")];

    // console.log("18next mainmenu: ", t("eventos"))
    
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    }
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    }

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    }

    const handleCloseUserMenu = async (setting) => {
        switch (setting) {
            case t("settings.verperfil"):
                navigate("/profile")
                break
            case t("settings.modificarperfil"):
                navigate("/editprofile")
                break
            case t("settings.cerrarsesion"):
                // localStorage.removeItem("token")
                setLogged(false)
                setUser({})
                try {
                    const response = await fetch(
                        `${VITE_BACKEND_URL_RENDER}/api/v1/erroak/logout`,
                        {
                            method: 'POST',
                            credentials: 'include', // IMPORTANTE: esto permite usar la cookie
                            headers: {
                                // 'Authorization': `Bearer ${token}`,
                                'Content-type': 'application/json; charset=UTF-8'
                            }
                        }
                    )
                    const data = await response.json()
                    console.log("Resultado logout: ", data.message)
                } catch (error) {
                    console.error("Error cerrando sesión:", error)
                }

                navigate("/", { replace: true })
                break
            default:
                break
        }
        setAnchorElUser(null);
    }

    const handleClickedPage = (page, event) => {
        console.log("Página pulsada:", page)

        switch (page) {
            case t("pages.listados"):
                setAnchorElList(event.currentTarget)
                break
            case t("pages.eventos"):
                navigate("/eventos")
                break
            case t("pages.vacaciones"):
                navigate("/holidays")
                break
            case t("pages.about"):
                navigate("/about")
                break
            default:
                break
        }
        setAnchorElNav(null) // cerrar menú móvil si estaba abierto
    }

      // filtramos las páginas y game aparece si estamos logeados
    const filteredPages = pages.filter(page => {
        if (page === t("pages.eventos")) return logged
        else if (page === t("pages.vacaciones")) return logged       
        else if (page === t("pages.listados")) return logged       
        return true
    })

    const handleLanguage = (e) => {
        const selection = e.target.value
        setSelectedLanguage(selection)
        i18n.changeLanguage(selection)      
    }

    return (
        <AppBar position="fixed" sx={{ backgroundColor: '#0072AD' }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                {/* Select Lenguaje */}
                    <FormControl variant="standard" fullWidth sx={{width: "100px"}}>
                        <Select
                            id="select-language"
                            value={selectedLanguage}
                            disableUnderline
                            onChange={handleLanguage}
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
                                        {lang.lang.toUpperCase()}
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
                {/* Icono Home */}
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
                        {/* <Tooltip title="Inicio"> */}
                        <Tooltip title={t("tooltipstext.text1")}>
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
                {/* Logo Sartu */}
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
                        {/* <Tooltip title="Página web Erroak Sartu"> */}
                        <Tooltip title={t("tooltipstext.text2")}>
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
                                // page === "Listados" ? (
                                page === t("pages.listados") ? (
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
                                                        case t("lists.eventosentidad"):
                                                            navigate("/entityevents")
                                                            break
                                                        case t("lists.vacacionesentidad"):
                                                            navigate("/staffholidays")
                                                            break
                                                        case t("lists.tardesinvierno"):
                                                            navigate("/winterafternoons")
                                                            break
                                                        case t("lists.contactos"):
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
                {/* Icono Home */}
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
                        {/* <Tooltip title="Inicio"> */}
                        <Tooltip title={t("tooltipstext.text1")}>
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
                {/* Logo Sartu */}
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
                        {/* <Tooltip title="Página web Erroak Sartu"> */}
                        <Tooltip title={t("tooltipstext.text2")}>
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
                                        case t("lists.eventosentidad"):
                                            navigate("/entityevents")
                                            break
                                        case t("lists.vacacionesentidad"):
                                            navigate("/staffholidays")
                                            break
                                        case t("lists.tardesinvierno"):
                                            navigate("/winterafternoons")
                                            break
                                        case t("lists.contactos"):
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
                                    {t("loggedusertitletext")}: {user.nombre_apellidos}
                                </Typography>
                            </Box>
                            <Tooltip title={t("tooltipstext.text3")}>
                                <IconButton onClick={handleOpenUserMenu}
                                sx={{ p: 0 }}
                                >
                                    {/* <Avatar alt={user.nombre_apellidos} src="/assets/images/avatar/1.jpg" /> */}
                                    <Avatar alt={user.nombre_apellidos} src="" />
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
                        <Tooltip title={t("tooltipstext.text4")} arrow>
                            <Button
                                onClick={()=> navigate('/signup')}
                                sx={
                                    (theme) => ({
                                        fontSize: {
                                            xs: '8px',   // móviles
                                            sm: '10px',  // tablets
                                            md: '14px',  // escritorio
                                        },
                                        mr: 1, minWidth: "auto", color: 'white', display: 'block', "&:hover": {backgroundColor: 'lightgrey', color: "black"},
                                    
                                })}
                            >
                                {t("notloggedusertitletexts.text1")}
                            </Button>
                        </Tooltip>
                    </Box>

                    <Box sx={{ flexGrow: 0, display: logged ? 'none' : 'block'}}>
                        <Tooltip title={t("tooltipstext.text5")} arrow>
                            <Button
                                onClick={()=> navigate('/login')}
                                sx={
                                    (theme) => ({
                                        fontSize: {
                                            xs: '8px',   // móviles
                                            sm: '10px',  // tablets
                                            md: '14px',  // escritorio
                                        },
                                        mr: 1, minWidth: "auto", color: 'white', display: 'block', "&:hover": {backgroundColor: 'lightgrey', color: "black"},
                                    
                                })}
                            >
                                {t("notloggedusertitletexts.text2")}
                            </Button>

                        </Tooltip>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )
}
export default MenuBarComponent;