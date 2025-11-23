import React, { useState } from "react";
import { Box, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import MenuBarComponent from '../components/MenuBarComponent';
import imagenFondo from "../assets/images/cuerda.jpg";

const columns = [
  { field: 'id', headerName: 'Activo', width: 70 },
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  { field: 'age', headerName: 'Age', type: 'number', width: 90 },
//   {
//     field: 'fullName',
//     headerName: 'Full name',
//     description: 'This column has a value getter and is not sortable.',
//     sortable: false,
//     width: 160,
//     valueGetter: (params) => `${params.row.firstName || ''} ${params.row.lastName || ''}`,
//   },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

const paginationModel = { page: 0, pageSize: 5 };

const AdminPage = () => {
  const [selectedRows, setSelectedRows] = useState([]);
    // const [rowSelectionModel, setRowSelectionModel] = useState({})
  const [rowSelectionModel, setRowSelectionModel] = useState({
    type: "include",
    ids: new Set(),
  });
  const handleSelectionChange = (newModel) => {
    // newModel es { type: 'include' | 'exclude'; ids: Set }
    const { type, ids } = newModel;
    debugger

    // Transformar Set a array para trabajar
    const newIdsArray = Array.from(ids || []);
    const oldIdsArray = Array.from(rowSelectionModel.ids || []);

    const added = newIdsArray.filter(id => !oldIdsArray.includes(id));
    const removed = oldIdsArray.filter(id => !newIdsArray.includes(id));

    if (added.length > 0) console.log("✔️ ID marcado:", added);
    if (removed.length > 0) console.log("❌ ID desmarcado:", removed);

    setRowSelectionModel(newModel);
  };

  return (
    <Box sx={{
      backgroundImage: `url(${imagenFondo})`,
      backgroundSize: "cover",
      minHeight: "100vh",
      backgroundPosition: "top center",
      backgroundAttachment: "fixed",
      paddingTop: "60px",
    }}>
      <MenuBarComponent />

      <Box sx={{
        height: "75vh",
        width: { xs: '90%', sm: "50%", md: "30%" },
        mx: 'auto',
        my: 4,
        py: 3,
        px: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'left',
        gap: 2,
        border: "1px solid grey",
        borderRadius: '10px',
        boxShadow: '10px 10px 15px 5px grey',
        backgroundColor: '#f0f0f0',
      }}>
        <Paper sx={{ height: "100%", width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
          rowSelectionModel={rowSelectionModel}
          onRowSelectionModelChange={handleSelectionChange}
          disableRowSelectionExcludeModel // para que siempre use el modelo 'include'
        />
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminPage;
