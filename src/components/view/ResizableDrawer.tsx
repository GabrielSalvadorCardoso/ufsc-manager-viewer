import React, { useCallback, useEffect } from "react";
// import ListItemIcon from "@material-ui/core/ListItemIcon";

// import InboxIcon from "@material-ui/icons/MoveToInbox";
// import MailIcon from "@material-ui/icons/Mail";
import AbcIcon from '@mui/icons-material/Abc';
import { Box, Divider, Drawer, FormControl, InputLabel, List, ListItem, ListItemIcon, SelectChangeEvent, ListItemText, MenuItem, Select as MuiSelect} from "@mui/material";
import { makeStyles } from '@mui/styles';
import SolicitationsTable from "./SolicitationsTable";

export const defaultDrawerWidth = 240;
const minDrawerWidth = 50;
const maxDrawerWidth = 1000;

const useStyles = makeStyles(() => ({
  drawer: {
    flexShrink: 0
  },
  // toolbar: theme.mixins.toolbar,
  dragger: {
    width: "5px",
    cursor: "ew-resize",
    padding: "4px 0 0",
    borderTop: "1px solid #ddd",
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    backgroundColor: "#f4f7f9"
  }
}));

type ResizableDrawerProps = {
    currentBuilding: any,
    solicitationsData: any[],
    imoveisData: any[],
    setCurrentBuilding: (buildingFeature:any) => void,
}

const ResizableDrawer = (props:ResizableDrawerProps) => {
  
    const classes = useStyles();
    const [drawerWidth, setDrawerWidth] = React.useState(defaultDrawerWidth);

    useEffect(() => {
        console.log(props.currentBuilding)
    }, [props.currentBuilding])

    const handleMouseDown = (e:any) => {
        document.addEventListener("mouseup", handleMouseUp, true);
        document.addEventListener("mousemove", handleMouseMove, true);
    };

    const handleMouseUp = () => {
        document.removeEventListener("mouseup", handleMouseUp, true);
        document.removeEventListener("mousemove", handleMouseMove, true);
    };

    const handleMouseMove = useCallback((e:any) => {
        const newWidth = e.clientX - document.body.offsetLeft;
        if (newWidth > minDrawerWidth && newWidth < maxDrawerWidth) {
            setDrawerWidth(newWidth);
        }
    }, []);

    const filterSolicitationsByBuilding = () => {
        if(props.currentBuilding&&props.currentBuilding["properties"]) {
            return props.solicitationsData.filter((solicitationFeature) => solicitationFeature["properties"]["imovel_id"] === props.currentBuilding["properties"]["id"])
        } else {
            return []
        }
    }

    const handleChange = (event: SelectChangeEvent) => {
        const buildignName = event.target.value as string
        const feature = props.imoveisData.find((imovelFeature) => imovelFeature["properties"]["cod"] === buildignName)
        props.setCurrentBuilding(feature);
    };

    return (
        <Drawer className={classes.drawer} variant="permanent" PaperProps={{ style: { width: drawerWidth } }} >
        {/* <div className={classes.toolbar} /> */}
        <div onMouseDown={e => handleMouseDown(e)} className={classes.dragger} />
        <Box sx={{ minWidth: 120 }} style={{marginTop: 10}}>
            <FormControl fullWidth>
                <InputLabel id="imovel-select-label">Imóvel</InputLabel>
                <MuiSelect  labelId="imovel-select-label"
                            id="imovel-select-id"
                            value={props.currentBuilding&&props.currentBuilding["properties"]?props.currentBuilding["properties"]["cod"]:"Nenhum imóvel selecionado"}
                            label="Imóvel"
                            onChange={handleChange}
                >
                    {props.imoveisData.map((imovelFeature) => {
                        return <MenuItem value={imovelFeature["properties"]["cod"]}>{imovelFeature["properties"]["cod"]}</MenuItem>
                        
                    })}
                </MuiSelect>
            </FormControl>
        </Box>
        <SolicitationsTable solicitationsData={filterSolicitationsByBuilding()} />
        <Divider />
      </Drawer>
  );
}

export default ResizableDrawer
