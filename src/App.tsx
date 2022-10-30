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
// 0050a0
function App() {
    // const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const [solicitationsData, setSolicitationsData] = useState<any[]>([])
    const [imoveisData, setImoveisData] = useState<any[]>([])
    const [currentBuilding, setCurrentBuilding] = useState<any>(null)

    return (
        <div>
            <MapContainer   imoveisData={imoveisData} setImoveisData={setImoveisData}
                            solicitationsData={solicitationsData} setSolicitationsData={setSolicitationsData}
                            // setDrawerOpen={setDrawerOpen}
                            currentBuilding={currentBuilding}
                            setCurrentBuilding={setCurrentBuilding}
                             />

            <ResizableDrawer currentBuilding={currentBuilding} solicitationsData={solicitationsData}
                             imoveisData={imoveisData}
                             setCurrentBuilding={setCurrentBuilding} />
        </div>
    );
}

export default App;