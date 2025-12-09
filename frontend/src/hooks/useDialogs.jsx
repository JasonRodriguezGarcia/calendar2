import { useState, useCallback } from 'react';

const useDialogs = () => {
        // Creamos un estado que guardará objetos con ID de cada diálogo a usar
    const [dialogs, setDialogs] = useState({})

    // const openDialog = useCallback((id) => {  // MAS AVANZADA EVITA RENDERS INNECESARIOS
    //     setDialogs(prev => ({ ...prev, [id]: true }));
    // }, [])

    const openDialog = useCallback((id) => { // MAS SIMPLE
        setDialogs(prev => ({ ...prev, [id]: true }));
    }, [])

    // const closeDialog = useCallback((id) => {  // MAS AVANZADA EVITA RENDERS INNECESARIOS
    //     setDialogs(prev => ({ ...prev, [id]: false }));
    // }, [])
    const closeDialog = (id) => { // MÁS SIMPLE
        setDialogs(prev => ({ ...prev, [id]: false }));
    }

// Qué hace !!dialogs[id]
// El primer ! convierte el valor en booleano y lo invierte:
//     true → false
//     false → true
//     undefined → true
// El segundo ! lo vuelve a invertir para obtener un booleano real.
// Así:
//     !!true      // true
//     !!false     // false
//     !!undefined // false
// IMPORTANTE !!!
//  Esto asegura que isOpen(id) siempre devuelva true o false, incluso si el diálogo todavía no existe en el objeto.
// useCallback devuelve una versión memorizada de la función, que solo se vuelve a crear cuando cambia algo en el 
// array de dependencias.
// En este caso, la función isOpen solo se volverá a generar si cambia dialogs.
// Esto evita renders innecesarios y mantiene la referencia estable de la función.
//   const isOpen = useCallback((id) => !!dialogs[id], [dialogs]) // FUNCION AVANZADA !!
    const isOpen = (id) => { // FUNCIÓN MÁS SIMPLE
        return !!dialogs[id]
    }

    return {
        openDialog,
        closeDialog,
        isOpen,
    }
}

export default useDialogs