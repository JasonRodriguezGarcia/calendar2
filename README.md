react big-calendar

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