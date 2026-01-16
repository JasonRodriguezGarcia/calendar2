import { useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { colorOptions } from '../utils/EventColors';
const useExcelEvents = () => {

    // EventsData debe ser un array
    const exportEventsToExcel = async (EventsData, fecha) => {
        if (EventsData.length === 0) return
        // Obtener fecha actual
        const year = fecha.getFullYear()
        const nombreMes = fecha.toLocaleString("es-ES", { month: "short" }).toUpperCase()

        // Crear libro y hoja
        const workbook = new ExcelJS.Workbook()
        const sheet = workbook.addWorksheet(nombreMes + " " + year)

        // ------------------------------
        // 🟩 1. Construir encabezados 
        // ------------------------------
        const allKeys = Object.keys(EventsData[0])

        const headers = [
            // "Usuario/a",
            ...allKeys //.filter(k => k !== "Usuario/a")  // resto de columnas (1,2,3...)
        ]

        // ------------------------------
        // 🟩 2. Añadir encabezados a la hoja y anchura a las celdas
        // ------------------------------
        sheet.addRow(headers)
        headers.forEach((_, index) => {
            sheet.getColumn(index + 1).width = 14
        })
        // ------------------------------
        // 🟩 3. Añadir filas siempre respetando el orden de headers
        // ------------------------------
        EventsData.forEach(row => {
            const values = headers.map(h => row[h]) // <--- mantiene el orden
            sheet.addRow(values)
        })

        // Poniendo estilos a las celdas
        sheet.eachRow((row, rowIndex) => {
            row.eachCell((cell, colIndex) => {
                cell.alignment = {
                    ...cell.alignment,
                    wrapText: true,
                    vertical: "top"
                }
                // No es necesario ya que se pone en el textRich
                // cell.font = {
                //     ...cell.font,
                //     size: 10,
                // }
            })
        })

        // Generar y descargar
        const buffer = await workbook.xlsx.writeBuffer()
        saveAs(new Blob([buffer]), "Events.xlsx")

    }

    //  Renombrar columnas
    const formatted = (eventos, usuarios, espacios, programas) => {
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
            // "Usuario/a": usuario.nombre_apellidos,
            ...Object.fromEntries(
                tempMonth.map(dia => {
                    const hayEventos = eventos.filter(eventosF => 
                        new Date(eventosF.start).getDate()== dia
                    )
                    console.log("hayEventos: ", hayEventos)
                    let cadenaEventos = []
                    if (hayEventos.length > 0) {
                        const resultadosEventosDia = hayEventos.map(hayE => {
                            const programa = programas.find(programa => programa.programa_id === hayE.programa_id).descripcion
                            const usuario = usuarios.find(usuario => usuario.usuario_id === hayE.usuario_id)
                            debugger
                            const {nombre_apellidos, color} = usuario
                            const espacio = espacios.find(espacio => espacio.espacio_id === hayE.programa_id).descripcion
                            const texto = 
                                `${hayE.start.toLocaleString('es-ES', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })} ${hayE.end.toLocaleString('es-ES', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })} ${programa} ${nombre_apellidos} ${espacio}
                                \n`
                            // colores de MUI como blue[500], que son números hexadecimales tipo #2196F3, pero ExcelJS no acepta # ni 
                            // nombres CSS, solo ARGB sin #.
                            // Necesitamos convertir tu color MUI a formato ARGB que ExcelJS entiende.
                            const colorCelda = colorOptions[color]
                            const excelColor = "FF" + colorCelda.replace("#", "") // formato ARGB
                            // Generando el texto en formato richText para poder presentarlo en Excel
                            cadenaEventos.push({
                                text: texto,
                                font: {
                                    color: { argb: excelColor},
                                    size: 8 
                                }
                            })
                        })
                    }
                    debugger
                    const fechaDia = new Date(year, month, dia)
                    const opcionesFecha = { weekday: 'long' }

                // return [dia, { richText: cadenaEventos }]
                return [`${dia}  ${fechaDia.toLocaleDateString('es-ES', opcionesFecha).toUpperCase()}` , { richText: cadenaEventos }]
            }))
        }
        console.log("Hoja: ", hoja)
        // {1: "", 2: "", 3: "V", usuario: 93, ...} <- objeto de usuario y los días del mes
        return hoja // OJO DEVOLVEMOS OBJETO, NO ARRAY QUE ES LO QUE SE NECESITA
    }

    return {
        exportEventsToExcel, formatted
    }
}

export default useExcelEvents;