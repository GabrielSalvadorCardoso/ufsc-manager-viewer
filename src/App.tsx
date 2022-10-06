import React, { useState, useEffect, useRef } from 'react';
import { Map, View } from 'ol';
import {OSM, Vector as VectorSource} from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import 'ol/ol.css';
import './App.css';
import axios from 'axios';
import {altKeyOnly, click, pointerMove} from 'ol/events/condition';
import Overlay from 'ol/Overlay';
import Select from 'ol/interaction/Select';
import { Box, Divider, Drawer, FormControl, InputLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, SelectChangeEvent, Select as MuiSelect } from '@mui/material';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import SolicitationsTable from './components/view/SolicitationsTable';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

function App() {
    const [map, setMap] = useState<any>();
    const mapElement = useRef<any>();
    const mapRef = useRef();
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const [solicitationsData, setSolicitationsData] = useState<any[]>([])
    const [imoveisData, setImoveisData] = useState<any[]>([])
    const [currentBuilding, setCurrentBuilding] = useState<any>(null)
    
    mapRef.current = map;

    const image = new CircleStyle({
        radius: 5,
        fill: undefined,
        stroke: new Stroke({color: 'red', width: 1}),
    });
    const styles:any = {
        'Point': new Style({
            image: image,
        }),
        'LineString': new Style({
            stroke: new Stroke({
                color: 'green',
                width: 1,
            }),
        }),
        'MultiLineString': new Style({
            stroke: new Stroke({
                color: 'green',
                width: 1,
            }),
        }),
        'MultiPoint': new Style({
            image: image,
        }),
        'MultiPolygon': new Style({
            stroke: new Stroke({
                color: 'blue',
                width: 1,
            }),
            fill: new Fill({
                color: 'rgba(255, 255, 0, 0.0)',
            }),
        }),
        'Polygon': new Style({
            stroke: new Stroke({
                color: 'green',
                lineDash: [4],
                width: 3,
          }),
          fill: new Fill({
                color: 'rgba(0, 0, 255, 0.1)',
          }),
        }),
        'GeometryCollection': new Style({
            stroke: new Stroke({
                color: 'magenta',
                width: 2,
            }),
            fill: new Fill({
                color: 'magenta',
            }),
            image: new CircleStyle({
                radius: 10,
                fill: undefined,
                stroke: new Stroke({
                    color: 'magenta',
                }),
            }),
        }),
        'Circle': new Style({
            stroke: new Stroke({
                color: 'red',
                width: 2,
            }),
            fill: new Fill({
                color: 'rgba(255,0,0,0.2)',
            }),
        }),
    };

    const styleSolicitations:any = {
        // "status": "Aberto" | "Em andamento" | "Finalizado"

        'Aberto': new Style({
            image: new CircleStyle({
                radius: 5,
                fill: new Fill({
                    color: 'red'
                }),
                stroke: new Stroke({color: 'red', width: 3}),
            })
        }),
        'Em andamento': new Style({
            image: new CircleStyle({
                radius: 5,
                fill: new Fill({
                    color: 'yellow'
                }),
                stroke: new Stroke({color: 'yellow', width: 3}),
            })
        }),
        'Finalizado': new Style({
            image: new CircleStyle({
                radius: 5,
                fill: new Fill({
                    color: 'green'
                }),
                stroke: new Stroke({color: 'green', width: 3}),
            })
        }),
    };

    const styleFunction = function (feature:any) {
        let status = feature.get("status")
        if(status) {
            return styleSolicitations[status]
        }

        return styles[feature.getGeometry().getType()];
    };
    
    let defaultStyle = new Style({
        stroke: new Stroke({
            color: 'blue',
            width: 3
        }),
        fill: new Fill({
            color: 'rgba(0, 0, 255, 0.1)'
        })
    })
    

    useEffect(() => {

        axios.get("http://localhost:8070/imoveis")
        .then((imoveisResponse) => {

            axios.get("http://localhost:8070/solicitacao")
            .then((solicitationsResponse) => {
                setSolicitationsData(solicitationsResponse.data["features"])
                setImoveisData(imoveisResponse.data["features"])

                const solicitationsGeojsonObject = {
                    'type': 'FeatureCollection',
                    'crs': {
                      'type': 'name',
                      'properties': {
                        'name': 'EPSG:4674',
                      },
                    },
                    'features': [
                        {
                            "type": "Feature",
                            "properties": {
                                "nSolicitacao": "001",
                                "tipoManutencao": "Elétrica",
                                "status": "Aberto"
                            },
                            "geometry": {
                              "type": "Point",
                              "coordinates": [
                                -48.519734144210815,
                                -27.60110715979902
                              ]
                            }
                          },
                          {
                            "type": "Feature",
                            "properties": {
                                "nSolicitacao": "002",
                                "tipoManutencao": "Encanamento",
                                "status": "Em andamento"
                            },
                            "geometry": {
                              "type": "Point",
                              "coordinates": [
                                -48.51983070373535,
                                -27.601649105160302
                              ]
                            }
                          },
                          {
                            "type": "Feature",
                            "properties": {
                                "nSolicitacao": "003",
                                "tipoManutencao": "Elétrica",
                                "status": "Finalizado"
                            },
                            "geometry": {
                              "type": "Point",
                              "coordinates": [
                                -48.51963758468628,
                                -27.60135436327869
                              ]
                            }
                          },
                          {
                            "type": "Feature",
                            "properties": {
                                "nSolicitacao": "001",
                                "tipoManutencao": "Pintura",
                                "status": "Em andamento"
                            },
                            "geometry": {
                              "type": "Point",
                              "coordinates": [
                                -48.51954102516174,
                                -27.60092651074969
                              ]
                            }
                          }
                      
                    ],
                };
    
                const vectorSource = new VectorSource({
                    features: new GeoJSON().readFeatures(imoveisResponse.data),
                });            
                const vectorLayer = new VectorLayer({
                    source: vectorSource,
                    style: styleFunction,
                });
    
                const solicitationsVectorSource = new VectorSource({
                    features: new GeoJSON().readFeatures(solicitationsResponse.data),
                });
                const solicitationsVectorLayer = new VectorLayer({
                    source: solicitationsVectorSource,
                    style: styleFunction,
                });
    
                const initialMap = new Map({
                    target: mapElement.current,
                    layers: [
                        new TileLayer({
                            source: new OSM(),
                        }),
                        vectorLayer,
                    ],
                    
                    view: new View({
                        center: [-50.45, -27.24],
                        zoom: 8,
                        projection: 'EPSG:4326',
                    }),
                });
    
    
                const selected = new Style({
                    fill: new Fill({
                        color: 'rgba(255, 255, 255, 0)',
                    }),
                    stroke: new Stroke({
                        color: 'rgba(255, 0, 0, 0.7)',
                        width: 2,
                    }),
                });
                
                function selectStyle(feature:any) {
                    const color = feature.get('COLOR') || 'rgba(255, 255, 255, 0)';
                    selected.getFill().setColor(color);
                    return selected;
                }
    
                const selectClick = new Select({
                    condition: click,
                    style: selectStyle,
                });
                initialMap.addInteraction(selectClick);
    
                const highlightStyle = new Style({
                    stroke: new Stroke({
                      color: 'rgba(80, 80, 80, 1)',
                      width: 2,
                    }),
                });
                const featureOverlay:any = new VectorLayer({
                    source: new VectorSource(),
                    map: initialMap,
                    style: highlightStyle,
                });
    
                let highlight:any;
                const displayFeatureInfo = function (pixel:any) {
                    vectorLayer.getFeatures(pixel).then(function (features:any) {
                        const feature = features.length ? features[0] : undefined;

                        setCurrentBuilding(feature)
                        const info = document.getElementById('info') as HTMLElement;
                        initialMap.addLayer(solicitationsVectorLayer)
                        setDrawerOpen(true)
                      if (features.length) {
                        info.innerHTML = feature.get('nome') + ': ' + feature.get('nome');
                        
                      } else {
                        info.innerHTML = '&nbsp;';
                      }
                  
                      if (feature !== highlight) {
                        if (highlight) {
                          featureOverlay.getSource().removeFeature(highlight);
                        }
                        if (feature) {
                          featureOverlay.getSource().addFeature(feature);
                        }
                        highlight = feature;
                      }
                    });
                };
                initialMap.on('click', function (evt) {
                    displayFeatureInfo(evt.pixel);
                });
                setMap(initialMap);
            })

            

            // initialMap.addLayer(solicitationsVectorLayer)

            
        })

        
    }, []);

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

    const getColorForStatus = (status:string) => {
        if(status === "Aberto") {
            return "red"
        } else if(status === "Em andamento") {
            return "yellow"
        } else if(status === "Finalizado") {
            return "green"
        }
    }

    const list = (anchor: Anchor) => (
        <Box  sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
              role="presentation"
              onClick={toggleDrawer(anchor, false)}
              onKeyDown={toggleDrawer(anchor, false)}
        >
          <List>
            {["Escola de Educação Básica Victor Hering"].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={"Escola de Educação Básica Victor Hering"} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {["Aberto", "Em andamento", "Finalizado"].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                    <div style={{
                      backgroundColor: getColorForStatus(text),
                      width: 25,
                      height: 25,
                      borderRadius: "50%",
                      display: "flex"
                      
                      
                  }}></div>
                  </ListItemIcon>
                  <ListItemText primary={text + (text === "Em andamento"?" (2)":"")} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
    );

    const handleChange = (event: SelectChangeEvent) => {
        const buildignName = event.target.value as string
        const feature = imoveisData.find((imovelFeature) => imovelFeature["properties"]["nome"] === buildignName)
        setCurrentBuilding(feature);
    };

    const filterSolicitationsByBuilding = () => {
        if(currentBuilding&&currentBuilding["properties"]) {
            return solicitationsData.filter((solicitationFeature) => solicitationFeature["properties"]["imovel_id"] === currentBuilding["properties"]["id"])
        } else {
            return []
        }
    }

    return (
        <div>
            {/* <div id="info">&nbsp;</div> */}
            <div style={{height:'100vh',width:'100%'}} ref={mapElement} className="map-container" />
            <Drawer
                sx={{
                        width: 1000,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: 1000,
                            boxSizing: 'border-box',
                        },
                }}
                anchor={"left"}
                
                open={drawerOpen}
                variant="persistent"
                onClose={toggleDrawer("left", false)}
            >
                {/* {list("left")} */}
                <Box sx={{ minWidth: 120 }} style={{marginTop: 10}}>
                    <FormControl fullWidth>
                        <InputLabel id="imovel-select-label">Imóvel</InputLabel>
                        <MuiSelect  labelId="imovel-select-label"
                                    id="imovel-select-id"
                                    value={currentBuilding&&currentBuilding["properties"]?currentBuilding["properties"]["nome"]:""}
                                    label="Imóvel"
                                    onChange={handleChange}
                        >
                            {imoveisData.map((imovelFeature) => <MenuItem value={imovelFeature["properties"]["nome"]}>{imovelFeature["properties"]["nome"]}</MenuItem>)}
                        </MuiSelect>
                    </FormControl>
                </Box>
                <SolicitationsTable solicitationsData={filterSolicitationsByBuilding()} />
            </Drawer>
        </div>
    );
}

export default App;