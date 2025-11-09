import csurf from 'csurf';

// Configurar csurf con cookie (sin sesiones)
export const csrfProtection = csurf({
  cookie: {
    key: '_csrfSecret',  // cookie donde guarda el secreto
    httpOnly: true,      // no accesible desde JS
    sameSite: 'none',
    secure: true,
  },
})