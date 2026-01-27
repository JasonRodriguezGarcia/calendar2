import { useState } from "react";
// import * as XLSX from "xlsx";
// import XLSX from "xlsx-style"; // es de pago para el uso de estilos
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const useExcelHolidays = () => {

    // vacacionesData debe ser un array
    const exportVacacionesToExcel = async (vacacionesData, fecha) => {
        if (vacacionesData.length === 0) return

        // Obtener fecha actual
        const year = fecha.getFullYear()
        // const month = fecha.getMonth() // OJO: 0 = Enero, 11 = Diciembre
        const nombreMes = fecha.toLocaleString("es-ES", { month: "short" }).toUpperCase()

        // Crear libro y hoja
        const workbook = new ExcelJS.Workbook()
        const sheet = workbook.addWorksheet(nombreMes + " " + year)
        // const sheet = workbook.addWorksheet("Vacaciones hoja")

        // ------------------------------
        // 🟩 1. Construir encabezados ordenando "Usuario/a" primero
        // ------------------------------
        const allKeys = Object.keys(vacacionesData[0])

        const headers = [
            "Usuario/a",
            ...allKeys.filter(k => k !== "Usuario/a")  // resto de columnas (1,2,3...)
        ]

        // ------------------------------
        // 🟩 2. Añadir encabezados a la hoja
        // ------------------------------
        sheet.addRow(headers)

        // ------------------------------
        // 🟩 3. Añadir filas siempre respetando el orden de headers
        // ------------------------------
        vacacionesData.forEach(row => {
            const values = headers.map(h => row[h]) // <--- mantiene el orden
            sheet.addRow(values)
        })

        // Pintar las casillas con V en rojo
        sheet.eachRow((row, rowIndex) => {
            row.eachCell((cell, colIndex) => {
                if (cell.value === "V") {
                    cell.fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: "FFFF0000" } // rojo
                    }
                    cell.font = {
                        color: { argb: "FFFFFFFF" }, // blanco
                        bold: true
                    }
                    cell.alignment = { horizontal: "center" }
                }
            })
        })

        // // Ajustar ancho de columnas automáticamente
        // sheet.columns.forEach(col => {
        //     let maxLength = 12
        //     col.eachCell(cell => {
        //         const len = cell.value ? cell.value.toString().length : 0
        //         if (len > maxLength) maxLength = len
        //     })
        //     col.width = maxLength + 2
        // })

        // Generar y descargar
        const buffer = await workbook.xlsx.writeBuffer()
        saveAs(new Blob([buffer]), "vacaciones.xlsx")

    }

    //  Renombrar columnas
    const formatted = (usuario, eventos) => {
        // Eventos ya están filtrados por mes de la fecha
        // Obtener año y mes para el nombre de la pestaña Excel
        const year = eventos[0].start.getFullYear()
        const month = eventos[0].start.getMonth() // OJO: 0 = Enero, 11 = Diciembre

        // Obtener número de días del mes actual
        const daysMonth = new Date(year, month + 1, 0).getDate() 

        // Crea array con los días del mes
        const tempMonth = []
        for (let index = 0; index < daysMonth; index++) {
            tempMonth.push(index+1)
        }
        // test dias: crea el objeto { 1: 1, 2: 2, 3: 3, ... }
        // const dias = Object.fromEntries(tempMonth.map(x => [x, x]))

        // { Usuario: 12, 1: "", 2: "V", 3: "", 4: "V", 5: "", ...}
            // Usuario: user.id → añade el ID del usuario.
            // ...Object.fromEntries(...) → añade una clave por cada día del mes:
            // Recorre cada dia del 1 al daysMonth.
            // Busca en events si existe algún evento cuyo start coincida con el día (getDate()).
            // Si hay evento → "V", si no → "".
        const hoja = {
            "Usuario/a": usuario.nombre_apellidos,
            ...Object.fromEntries(
                tempMonth.map(dia => {
                    const tieneEvento = eventos.some(evento => {
                        // Pregunta extraña en la asignación pero es debida a que sino crea un día
                        // con "V" si el usuario no tiene eventos, aunque realmente se crea uno obligatoriamente
                        // para aparecer su línea en vacaciones, pero con event_id = nulo
                        const diaEvento = evento.event_id !== null ? new Date(evento.start).getDate() : ""
                        return diaEvento === dia
                    })
                    // Que hace return
                    //     Crea un array de dos elementos, ejemplo: [1, ""] ó [3, "V"]:
                            // Primer elemento → clave (dia)
                            // Segundo elemento → valor ("V" o "")
                    // Ese array [clave, valor] es el formato que espera Object.fromEntries para formar un objeto
                            //  {1: "V"}, {2: ""}, {3: "V"}
                    return [dia, tieneEvento ? "V" : ""]
            }))
        }
        console.log("Hoja: ", hoja)
        // {1: "", 2: "", 3: "V", usuario: 93, ...} <- objeto de usuario y los días del mes
        return hoja // OJO DEVOLVEMOS OBJETO, NO ARRAY QUE ES LO QUE SE NECESITA
    }

    const formattedAll = (eventosAll, fechaAll) => {
            // Ordenar eventos por nombre
        const eventosOrdenados = [...eventosAll].sort((a, b) =>
            a.nombre_apellidos.localeCompare(b.nombre_apellidos)
        )
        // Recorrer agrupando por usuario
        let hojas = []
        let usuarioActual = null
        let eventosUsuario = []

        for (const evento of eventosOrdenados) {
            const nombre = evento.nombre_apellidos;

            // si cambiamos de usuario, guardamos la hoja anterior
            if (usuarioActual !== nombre && usuarioActual !== null) {
                hojas.push(
                    formatted({ nombre_apellidos: usuarioActual }, eventosUsuario, fechaAll)
                )
                eventosUsuario = [] // reset
            }

            usuarioActual = nombre
            eventosUsuario.push(evento)
        }

        // Procesar el último usuario pendiente ya que no se compara al salir del "for"
        if (usuarioActual !== null) {
            hojas.push(
                formatted({ nombre_apellidos: usuarioActual }, eventosUsuario, fechaAll)
            )
        }
        console.log("HOJAS ALL: ", hojas)
        return hojas
    }


    return {
        exportVacacionesToExcel, formatted, formattedAll
    }
}

export default useExcelHolidays;