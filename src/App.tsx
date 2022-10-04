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
import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

function App() {
    const [map, setMap] = useState<any>();
    const mapElement = useRef<any>();
    const mapRef = useRef();
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    
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

        axios.get("http://localhost:8070/SC")
        .then((response) => {
            // const _geojsonObject = {
            //     'type': 'FeatureCollection',
            //     'crs': {
            //       'type': 'name',
            //       'properties': {
            //         'name': 'EPSG:3857'
            //       }
            //     },
            //     'features': [{"type": "Feature", "geometry": response.data["geometry"], "properties": response.data["properties"]}]
            // };

            const geojsonObject = {
                'type': 'FeatureCollection',
                'crs': {
                  'type': 'name',
                  'properties': {
                    'name': 'EPSG:4674',
                  },
                },
                'features': [
                    {
                        'type': 'Feature',
                        'geometry': response.data["geometry"],
                        "properties": response.data["properties"]
                    },
                    {
                        "type": "Feature",
                        "properties": {
                            "nome": "Escola de Educação Básica Victor Hering"
                        },
                        "geometry": {
                          "type": "Polygon",
                          "coordinates": [
                            [
                              [
                                -49.09093201160431,
                                -26.90756680904838
                              ],
                              [
                                -49.09071743488312,
                                -26.907872962500463
                              ],
                              [
                                -49.09057259559631,
                                -26.907786856925988
                              ],
                              [
                                -49.09044921398163,
                                -26.907963851646738
                              ],
                              [
                                -49.089269042015076,
                                -26.907452001289798
                              ],
                              [
                                -49.089301228523254,
                                -26.907275005766593
                              ],
                              [
                                -49.089531898498535,
                                -26.906930581250432
                              ],
                              [
                                -49.09093201160431,
                                -26.90756680904838
                              ]
                            ]
                          ]
                        }
                    }
                  
                ],
            };

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
                            -49.08987522125244,
                            -26.907198467076025
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
                            -49.090567231178284,
                            -26.90773423682035
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
                            -49.08946752548218,
                            -26.90746635226601
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
                            -49.089977145195,
                            -26.90749027055563
                          ]
                        }
                      }
                  
                ],
            };

            const vectorSource = new VectorSource({
                features: new GeoJSON().readFeatures(geojsonObject),
            });            
            const vectorLayer = new VectorLayer({
                source: vectorSource,
                style: styleFunction,
            });

            const solicitationsVectorSource = new VectorSource({
                features: new GeoJSON().readFeatures(solicitationsGeojsonObject),
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
                  const info = document.getElementById('info') as HTMLElement;
                  // let newMap = {...map}
                    // map.addLayer(solicitationsVectorLayer)
                    // setMap(newMap)
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

            // initialMap.addLayer(solicitationsVectorLayer)

            setMap(initialMap);
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
        <Box
          sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
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

    return (
        <div>
            {/* <div id="info">&nbsp;</div> */}
            <div style={{height:'100vh',width:'100%'}} ref={mapElement} className="map-container" />
            <Drawer
                anchor={"left"}
                open={drawerOpen}
                variant="persistent"
                onClose={toggleDrawer("left", false)}
            >
                {list("left")}
            </Drawer>
        </div>
    );
}

export default App;