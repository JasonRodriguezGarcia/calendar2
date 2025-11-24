import MenuBarComponent from '../components/MenuBarComponent';
import { Box, Card, CardContent, Typography, Stack, Divider, Tooltip } from '@mui/material';
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
// import imagenFondo from "../assets/images/underconstruction.jpg";
import imagenFondo from "../assets/images/cuerda.jpg";

import Express from "../assets/images/icons/express.png"
import Vite from "../assets/images/icons/vite.png"
import Postgresql from "../assets/images/icons/postgresql.png"
import Render from "../assets/images/icons/render.png"
import Supabase from "../assets/images/icons/supabase.png"
const AboutComponent = () => {

    const tecnologias = [
        {tipo: "Express", ruta: Express},
        {tipo: "Vite", ruta: Vite},
        {tipo: "PostgreSQL", ruta: Postgresql},
        {tipo: "Render", ruta: Render},
        {tipo: "Supabase", ruta: Supabase},
    ]
    return (
        <>
            {/* CONTENEDOR INTERNO PARA EL CONTENIDO DE ACERCA DE */}
            <Box sx={{ p: 3, maxWidth: {xs: "50%", sm: "60%", md: "70%"} , mx: "auto",
            }}>

                {/* Título */}
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <InfoOutlinedIcon color="primary" />
                    <Typography variant="h5" fontWeight={600} 
                        // color="white"
                    >
                        Acerca de la Intranet
                    </Typography>
                </Stack>

                {/* CARD PRINCIPAL */}
                <Card elevation={24} sx={{ 
                    // backgroundColor: "rgba(255, 255, 255, 0.9)",
                    background: "transparent",
                    // color: "white",
                    borderRadius: "10px",
                    display: "flex",
                    flexDirection: "column",
                    padding: "1em"
                 }}>
                    <CardContent>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            La Intranet de <strong>Erroak Sartu</strong> está diseñada
                            para facilitar la reserva de espacios, turnos de trabajo, vacaciones y
                            contactos. Todo ello con una experiencia ágil, clara y sin complicaciones. <br />
                            Basta con darse de alta y que el administrador active tu cuenta para empezar a trabajar.
                        </Typography>

                        {/* Características */}
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 3, mb: 1 }}>
                            <StarBorderOutlinedIcon color="primary" />
                            <Typography variant="h6" fontWeight={600}>Características principales</Typography>
                        </Stack>

                        <Typography variant="subtitle1" fontWeight={600}>Comodidad</Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            • Reserva de espacios en pocos clics. <br />
                            • Aviso inmediato si el espacio ya está ocupado. <br />
                            • Reservas recurrentes para espacios concretos. <br />
                            • Repetición rápida de eventos.
                        </Typography>

                        <Typography variant="subtitle1" fontWeight={600}>Organización</Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            • Gestión centralizada de espacios, vacaciones y contactos. <br />
                            • Optimización del tiempo y recursos.
                        </Typography>

                        <Typography variant="subtitle1" fontWeight={600}>Seguridad</Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            • Protección en backend de rutas con API (anti DoS) & Login limiters (anti brute force), anti CSRF, JWT y cookies. <br />
                            • Protección en frontend con antiCSRF, JWT y cookies desde backend.
                            • Hasheado de contraseña
                        </Typography>

                        <Divider sx={{ my: 3 }} />

                        {/* Funciones adicionales */}
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                            <SettingsOutlinedIcon color="primary" />
                            <Typography variant="h6" fontWeight={600}>Funciones adicionales</Typography>
                        </Stack>

                        <Typography variant="body2" sx={{ mb: 2 }}>
                            • Uso de componentes MUI. <br />
                            • Recuperación de contraseña vía email (sendGrid) con Token. <br />
                            • Edición de datos del perfil. <br />
                            • Cambio de contraseña. <br />
                            • Uso de context, hooks, localStorage, ... <br />
                            • Mobile friendly. <br />
                            • Patrón Arquitectura MVC.
                        </Typography>

                        <Divider sx={{ my: 3 }} />

                        {/* Tecnologías */}
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                            <CodeOutlinedIcon color="primary" />
                            <Typography variant="h6" fontWeight={600}>Tecnologías utilizadas</Typography>
                        </Stack>

                        {/* <Typography variant="body2" sx={{ mb: 3 }}> */}
                            <Card elevation={3} sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    flexWrap: "wrap",
                                    gap: "1em",
                                    justifyContent: "center",
                                    // backgroundColor: "rgba(255, 255, 255, 0.9)", 
                                    backgroundColor: "transparent",
                                    borderRadius: "10px"
                                }}>
                                {tecnologias.map((tecnologia, index) => 
                        <Tooltip key={index} title={tecnologia.tipo}>
                                    <CardContent sx={{ 
                                            minWidth: "30%",
                                            // backgroundColor: "lightblue",
                                            backgroundColor: "#37baeeff",
                                            borderRadius: "10px",
                                            my: "20px", 
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            maxWidth: "4em"
                                        }}>
                                            <img
                                                src={tecnologia.ruta}
                                                alt={tecnologia.tipo || "icono"}
                                                style={{
                                                    width: "60px",
                                                    height: "60px",
                                                    objectFit: "contain",
                                                }}
                                            />
                                    </CardContent>
                        </Tooltip>
                                )}
                            </Card>

                        {/* </Typography> */}

                        <Divider sx={{ my: 3 }} />

                        {/* Autor */}
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                            <PersonOutlineOutlinedIcon color="primary" />
                            <Typography variant="h6" fontWeight={600}>Desarrollado por</Typography>
                        </Stack>

                        <Typography variant="body2"
                            sx={{ fontSize: "2em"}}
                        >
                            Jason R. G. <br />
                            <a href="mailto:jasonrodriguezempleo@gmail.com">
                                jasonrodriguezempleo@gmail.com
                            </a>
                        </Typography>
                    </CardContent>
                </Card>

            </Box>
        </>
    )
}

export default AboutComponent;
