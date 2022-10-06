import * as React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

const columns: GridColDef[] = [
    // { field: 'id', headerName: 'ID', width: 70 },
    // { field: 'firstName', headerName: 'First name', width: 130 },
    // { field: 'lastName', headerName: 'Last name', width: 130 },
    // { field: 'age', headerName: 'Age', type: 'number', width: 90, },
    // { field: 'fullName', headerName: 'Full name', description: 'This column has a value getter and is not sortable.', sortable: false, width: 160, valueGetter: (params: GridValueGetterParams) => `${params.row.firstName || ''} ${params.row.lastName || ''}`, },

    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'numero_os', headerName: 'Número da OS', width: 70 },
    { field: 'tipo', headerName: 'Tipo', width: 100 },
    { field: 'natureza', headerName: 'Natureza', width: 100 },
    { field: 'responsavel', headerName: 'Responsável', width: 200 },
    { field: 'data_abertura', headerName: 'Data Abertura', width: 200 },
    { field: 'interessado', headerName: 'Solicitante', width: 100 },
    { field: 'detalhamento', headerName: 'Descrição', width: 200 },
    { field: 'assunto', headerName: 'Assunto', width: 200 },
    { field: 'grupo_assunto', headerName: 'Grupo Assunto', width: 200 },
    { field: 'setor_origem', headerName: 'Setor Origem', width: 200 },
    { field: 'setor_responsavel', headerName: 'Setor Responsável', width: 200 },
    { field: 'imovel_id', headerName: 'ID Imóvel', width: 50 },
];

// const rows = [
//     { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
//     { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
//     { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
//     { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
//     { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
//     { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
//     { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
//     { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
//     { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
// ];

type SolicitationsTableProps = {
    solicitationsData: any[]
}
const SolicitationsTable = (props:SolicitationsTableProps) =>  {

    React.useEffect(()=> {
        console.log(props.solicitationsData)
    }, [props.solicitationsData])

    const getSolicitationsProps = () => {
        return props.solicitationsData.map((solicitationFeature:any) => {
            return {
                id: solicitationFeature["properties"].id,
                numero_os: solicitationFeature["properties"].numero_os,
                tipo: solicitationFeature["properties"].tipo,
                natureza: solicitationFeature["properties"].natureza,
                responsavel: solicitationFeature["properties"].responsavel,
                data_abertura: solicitationFeature["properties"].data_abertura,
                interessado: solicitationFeature["properties"].interessado,
                detalhamento: solicitationFeature["properties"].detalhamento,
                assunto: solicitationFeature["properties"].assunto,
                grupo_assunto: solicitationFeature["properties"].grupo_assunto,
                setor_origem: solicitationFeature["properties"].setor_origem,
                setor_responsavel: solicitationFeature["properties"].setor_responsavel,
                imovel_id: solicitationFeature["properties"].imovel_id,
            }
        })
    }
    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid   rows={getSolicitationsProps()}
                        columns={columns}
                        pageSize={2}
                        rowsPerPageOptions={[2]}
                        checkboxSelection
            />
        </div>
    );
}
export default SolicitationsTable