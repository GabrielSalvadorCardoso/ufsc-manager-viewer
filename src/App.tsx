import React, { useState, useEffect, useRef } from 'react';
import 'ol/ol.css';
import './App.css';
import logo from "./assets/brasao_UFSC_vertical_sigla_fundo_escuro.png"
import MapContainer from './components/view/MapContainer';
import ResizableDrawer from './components/view/ResizableDrawer';
import { Box, AppBar, Toolbar, IconButton, Typography, Button } from '@mui/material';

type Anchor = 'top' | 'left' | 'bottom' | 'right';
// 0050a0
function App() {
    // const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const [solicitationsData, setSolicitationsData] = useState<any[]>([])
    const [imoveisData, setImoveisData] = useState<any[]>([])
    const [currentBuilding, setCurrentBuilding] = useState<any>(null)

    return (
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" style={{ backgroundColor: '#0050a0' }}>
                    <Toolbar>
                        <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                            {/* <MenuIcon /> */}
                        </IconButton>
                        {/* <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}> News </Typography> */}
                        <img style={{height: 64}} src={logo} />
                        {/* <Button color="inherit">Login</Button> */}
                    </Toolbar>
                </AppBar>
            </Box>
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
        </div>
    );
}

export default App;