Web para el uso de calendario minimalista adaptado a los requerimientos requeridos en las prácticas

- Uso librería react big-calendar con la creación de eventos en la agenda con CRUD y repetición eventos, generación de vacaciones del personal
- CRUD de usuarios
- Gestión de vacaciones usuario
- Listado de 
    eventos de todos los usuarios
    vacaciones de todos los usuario
    situación de la posesión de llaves y alarma de cada día
    contactos
- Login con posibilidad de Recuperación de contraseña
- Manejo desde backend de la seguridad con
    cookies en apis con JWT permitiendo o no acceso 
    protección básica ante ataques CSRF
- Limitación de llamadas API al backend (anti DoS)
- Limitación de intentos de login de usuario por fuerza bruta
- Recuperación de contraseña con envío vía email de un link que al usarlo, se chequea que no esté caducado o sea inválido
- Uso de Context para un mejor manejo de los props


Notas varias:

Primeras pruebas de la librería con resultados satisfactorios usando versiones de React y Mui actuales

Segundas pruebas en la creación de eventos con resultados satisfactorios

Terceras pruebas en la gestión de loggeo de usuarios satisfactoria con un usuario creado a mano en la bbbdd. Uso de locasStorage para guardar el usuario y la contraseña una vez logeado, a cambiar en un futuro por usuario y token. Cambios oportunos hechos de tal manera que si no se está logeado no se pueden acceder a las rutas oportunas. Conectado con backend y base de datos (bbdd) la cual está en supabase (tipo render).

Cuartas pruebas pendientes para la creación de usuarios y guardado de los mismos en la bbdd.


Encontrado en consola los siguientes avisos que no errores comon en react-scheduler a los que hay que estudiar soluciones:
    Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for 
    faster performance: https://react.dev/link/new-jsx-transform
    overrideMethod @ hook.js:608

    MUI X: The `renderInput` prop has been removed in version 6.0 of the Date and Time Pickers.
    You can replace it with the `textField` component slot in most cases.
    For more information, please have a look at the migration 
    guide (https://mui.com/x/migration/migration-pickers-v5/#input-renderer-required-in-v5).