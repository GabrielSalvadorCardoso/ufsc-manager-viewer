import * as React from 'react';
import { DataGrid, GridCellParams, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Box } from '@mui/material';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'data_abertura', headerName: 'Data Abertura', width: 200 },
    { field: 'status', headerName: 'Status', width: 200 },
    { field: 'data_ultima_atualizacao', headerName: 'Data Última Atualização', width: 200 },
    { field: 'numero_os', headerName: 'Número da OS', width: 70 },
    { field: 'tipo', headerName: 'Tipo', width: 100 },
    { field: 'natureza', headerName: 'Natureza', width: 100 },
    { field: 'responsavel', headerName: 'Responsável', width: 200 },
    { field: 'interessado', headerName: 'Solicitante', width: 100 },
    { field: 'detalhamento', headerName: 'Descrição', width: 200 },
    { field: 'assunto', headerName: 'Assunto', width: 200 },
    { field: 'grupo_assunto', headerName: 'Grupo Assunto', width: 200 },
    { field: 'setor_origem', headerName: 'Setor Origem', width: 200 },
    { field: 'setor_responsavel', headerName: 'Setor Responsável', width: 200 },
    { field: 'imovel_id', headerName: 'ID Imóvel', width: 50 },    
];

type SolicitationsTableProps = {
    solicitationsData: any[]
}
const SolicitationsTable = (props:SolicitationsTableProps) =>  {

    React.useEffect(()=> {
        console.log(props.solicitationsData)
    }, [props.solicitationsData])

    const getSolicitationsProps = () => {
        return props.solicitationsData.map((solicitationFeature:any) => {
            let sortedHistStatus = solicitationFeature["properties"].historico_status.slice().sort(function(a:any,b:any) {
                return (new Date(a.data_hora) as any) - (new Date(b.data_hora) as any);
            });
            
            return {
                id: solicitationFeature["properties"].id,
                data_abertura: new Date(solicitationFeature["properties"].data_abertura).toLocaleDateString("pt-BR", {hour: '2-digit', minute:'2-digit'}),
                numero_os: solicitationFeature["properties"].numero_os,
                tipo: solicitationFeature["properties"].tipo,
                natureza: solicitationFeature["properties"].natureza,
                responsavel: solicitationFeature["properties"].responsavel,
                interessado: solicitationFeature["properties"].interessado,
                detalhamento: solicitationFeature["properties"].detalhamento,
                assunto: solicitationFeature["properties"].assunto,
                grupo_assunto: solicitationFeature["properties"].grupo_assunto,
                setor_origem: solicitationFeature["properties"].setor_origem,
                setor_responsavel: solicitationFeature["properties"].setor_responsavel,
                imovel_id: solicitationFeature["properties"].imovel_id,
                status: sortedHistStatus[sortedHistStatus.length -1].status,
                data_ultima_atualizacao: new Date(sortedHistStatus[sortedHistStatus.length -1].data_hora).toLocaleDateString("pt-BR", {hour: '2-digit', minute:'2-digit'})
            }
        })
    }
    return (
        
            <Box
                sx={{
                    height: 350,
                    width: '100%',
                    '& .statusAndamento': {
                        backgroundColor: '#FFFF0091',
                        color: "#000000",
                    },
                    '& .statusJustificada': {
                        backgroundColor: '#ff000075',
                        color: "#000000",
                    },
                    '& .statusFinalizada': {
                        backgroundColor: '#00FF0075',
                        color: "#000000",
                    },
                }}
            >
            <DataGrid   rows={getSolicitationsProps()}
                        columns={columns}
                        getCellClassName={(params: GridCellParams<string>) => {
                            if(params.value === "ANDAMENTO") {
                                return "statusAndamento"
                            } else if(params.value === "JUSTIFICADA") {
                                return "statusJustificada"
                            } else if(params.value === "FINALIZADA") {
                                return "statusFinalizada"
                            } else {
                                return ""
                            }
                        }}
                        pageSize={2}
                        rowsPerPageOptions={[2]}
                        checkboxSelection
            />
        </Box>
    );
}
export default SolicitationsTable