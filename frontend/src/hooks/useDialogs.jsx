import { useState, useCallback } from 'react';

const useDialogs = () => {
    // Creamos un estado que guardará objetos con ID de cada diálogo a usar
  const [dialogs, setDialogs] = useState({})

  const openDialog = useCallback((id) => {
    setDialogs(prev => ({ ...prev, [id]: true }));
  }, [])

  const closeDialog = useCallback((id) => {
    setDialogs(prev => ({ ...prev, [id]: false }));
  }, [])

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
  const isOpen = useCallback((id) => !!dialogs[id], [dialogs])

  return {
    openDialog,
    closeDialog,
    isOpen,
  }
}

export default useDialogs