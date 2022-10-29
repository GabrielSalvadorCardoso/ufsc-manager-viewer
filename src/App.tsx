import React, { useState, useEffect, useRef } from 'react';
import 'ol/ol.css';
import './App.css';
import Overlay from 'ol/Overlay';
// import Select from 'ol/interaction/Select';
import { Box, Divider, Drawer, FormControl, InputLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, SelectChangeEvent, Select as MuiSelect } from '@mui/material';
import SolicitationsTable from './components/view/SolicitationsTable';
import MapContainer from './components/view/MapContainer';
import ResizableDrawer from './components/view/ResizableDrawer';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

function App() {
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const [solicitationsData, setSolicitationsData] = useState<any[]>([])
    const [imoveisData, setImoveisData] = useState<any[]>([])
    const [currentBuilding, setCurrentBuilding] = useState<any>(null)
    
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const toggleDrawer = (anchor: Anchor, open: boolean) =>
        (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
            (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    // const handleChange = (event: SelectChangeEvent) => {
    //     const buildignName = event.target.value as string
    //     const feature = imoveisData.find((imovelFeature) => imovelFeature["properties"]["cod"] === buildignName)
    //     setCurrentBuilding(feature);
    // };

    // const filterSolicitationsByBuilding = () => {
    //     if(currentBuilding&&currentBuilding["properties"]) {
    //         return solicitationsData.filter((solicitationFeature) => solicitationFeature["properties"]["imovel_id"] === currentBuilding["properties"]["id"])
    //     } else {
    //         return []
    //     }
    // }

    return (
        <div>
            <MapContainer   imoveisData={imoveisData} setImoveisData={setImoveisData}
                            solicitationsData={solicitationsData} setSolicitationsData={setSolicitationsData}
                            setDrawerOpen={setDrawerOpen} setCurrentBuilding={setCurrentBuilding}
                             />
            {/* <Drawer
                sx={{
                        width: 700,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: 700,
                            boxSizing: 'border-box',
                        },
                }}
                anchor={"left"}
                
                open={drawerOpen}
                variant="persistent"
                onClose={toggleDrawer("left", false)}
            >
                <Box sx={{ minWidth: 120 }} style={{marginTop: 10}}>
                    <FormControl fullWidth>
                        <InputLabel id="imovel-select-label">Imóvel</InputLabel>
                        <MuiSelect  labelId="imovel-select-label"
                                    id="imovel-select-id"
                                    value={currentBuilding&&currentBuilding["properties"]?currentBuilding["properties"]["cod"]:""}
                                    label="Imóvel"
                                    onChange={handleChange}
                        >
                            {imoveisData.map((imovelFeature) => <MenuItem value={imovelFeature["properties"]["cod"]}>{imovelFeature["properties"]["cod"]}</MenuItem>)}
                        </MuiSelect>
                    </FormControl>
                </Box>
                <SolicitationsTable solicitationsData={filterSolicitationsByBuilding()} />
            </Drawer> */}
            <ResizableDrawer currentBuilding={currentBuilding} solicitationsData={solicitationsData}
                             imoveisData={imoveisData}
                             setCurrentBuilding={setCurrentBuilding} />
        </div>
    );
}

export default App;