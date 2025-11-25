import { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const useExcelHolidays = () => {
    // vacacionesData debe ser un array
    const exportVacacionesToExcel = (vacacionesData) => {
        if (vacacionesData.length === 0) return

        // Tomar primera fila para ordenar encabezados
        const firstRow = vacacionesData[0]

        // Forzar que "Usuario" sea la primera columna
        const cabeceras = ["Usuario", ...Object.keys(firstRow).filter(k => k !== "Usuario")]

        // 1. Convertimos JSON → Hoja Excel (creamos hoja y respetamos el orden)
        const worksheet = XLSX.utils.json_to_sheet(vacacionesData, {header: cabeceras})

        // 2. Creamos el libro de Excel
        const workbook = {
            Sheets: { "Vacaciones": worksheet },
            SheetNames: ["Vacaciones"]
        };

        // 3. Lo convertimos a un buffer
        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        })

        // 4. Lo descargamos
        const blob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        })

        saveAs(blob, "vacaciones.xlsx")
    }

    return {
        exportVacacionesToExcel
    }
}

export default useExcelHolidays;