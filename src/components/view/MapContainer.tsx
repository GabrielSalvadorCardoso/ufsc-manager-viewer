import axios from "axios";
import { useEffect, useRef, useState } from "react";
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {altKeyOnly, click, pointerMove} from 'ol/events/condition';
import {OSM, Vector as VectorSource} from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import { Map, View } from 'ol';
import Select from 'ol/interaction/Select';

type MapContainerProps = {
    imoveisData: any[],
    solicitationsData: any[],
    setDrawerOpen: (drawerOpen:boolean) => void,
    setCurrentBuilding: (buildingFeature:any) => void,
    setImoveisData: (imoveisFeatureCollection:any[]) => void,
    setSolicitationsData: (solicitationsFeatureCollection:any[]) => void,
}

const MapContainer = (props:MapContainerProps) => {
    const mapElement = useRef<any>();
    // const [solicitationsData, setSolicitationsData] = useState<any[]>([])
    // const [imoveisData, setImoveisData] = useState<any[]>([])
    const [map, setMap] = useState<any>();
    const mapRef = useRef();
    mapRef.current = map;
    
    const image = new CircleStyle({
        radius: 5,
        fill: undefined,
        stroke: new Stroke({color: 'red', width: 1}),
    });

    const styleSolicitations:any = {
        // "status": "Aberto" | "Em andamento" | "Finalizado"

        'JUSTIFICADA': new Style({
            image: new CircleStyle({
                radius: 5,
                fill: new Fill({
                    color: 'red'
                }),
                stroke: new Stroke({color: 'red', width: 3}),
            })
        }),
        'ANDAMENTO': new Style({
            image: new CircleStyle({
                radius: 5,
                fill: new Fill({
                    color: 'yellow'
                }),
                stroke: new Stroke({color: 'yellow', width: 3}),
            })
        }),
        'FINALIZADA': new Style({
            image: new CircleStyle({
                radius: 5,
                fill: new Fill({
                    color: 'green'
                }),
                stroke: new Stroke({color: 'green', width: 3}),
            })
        }),
    };

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

    const styleFunction = function (feature:any) {
        let status = feature.get("historico_status")
        if(status&&status.length>0) {
            return styleSolicitations[status[status.length-1].status]
        }

        return styles[feature.getGeometry().getType()];
    };

    useEffect(() => {

        axios.get("http://localhost:8070/imoveis")
        .then((imoveisResponse) => {

            axios.get("http://localhost:8070/solicitacao")
            .then((solicitationsResponse) => {
                props.setSolicitationsData(solicitationsResponse.data["features"])
                props.setImoveisData(imoveisResponse.data["features"])
    
                const vectorSource = new VectorSource({
                    features: new GeoJSON().readFeatures(imoveisResponse.data),
                });            
                const vectorLayer = new VectorLayer({
                    source: vectorSource,
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
                const displayFeatureInfo = (pixel:any) => {
                    vectorLayer.getFeatures(pixel).then((features:any) => {
                        const feature = features.length ? features[0] : undefined;
                        // const layers = initialMap.getLayers().getArray()

                        initialMap.getLayers().forEach((layer:any) => {
                            if (layer.get('name') && layer.get('name') == 'foobar'){
                                initialMap.removeLayer(layer)
                            }
                        });
                        
                        let featureCollection:any = {
                            crs: solicitationsResponse.data["crs"],
                            type: "FeatureCollection",
                            features: []
                        }

                        for(let i=0; i<solicitationsResponse.data.features.length; i++) {
                            if(solicitationsResponse.data.features[i].properties.imovel_id === feature.get("id")) {
                                featureCollection.features.push(solicitationsResponse.data.features[i])
                            }
                            
                        }

                        const solicitationsVectorSource = new VectorSource({
                            features: new GeoJSON().readFeatures(featureCollection),
                            
                        });
                        const solicitationsVectorLayer = new VectorLayer({
                            source: solicitationsVectorSource,
                            style: styleFunction,
                        });
                        solicitationsVectorLayer.set('name', 'foobar')
                        
                        let imovelFeature = {
                            "type": "Feature",
                            "properties": {
                                "id": feature.get("id"),
                                "code": feature.get("cod"),
                            },
                            "geometry": {
                                "type": "Polygon",
                                "coordinates": feature.getGeometry().getCoordinates()
                            }
                        }
                        props.setCurrentBuilding(imovelFeature)
                        initialMap.addLayer(solicitationsVectorLayer)
                        props.setDrawerOpen(true)
                  
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
        })

        
    }, []);
    
    return (
        <div style={{height:'100vh',width:'100%'}} ref={mapElement} className="map-container" />
    )
}

export default MapContainer