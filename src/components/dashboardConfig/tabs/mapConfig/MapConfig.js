import React, { useState, useEffect,useMemo, useCallback } from "react";
import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";
import Container from "reactstrap/lib/Container";
import RolesDropdown from "components/commonComps/RolesDropdown";
import PortalItemForm from "./verticalTabs/PortalItemForm";
import Login from "./loginGeoserver";
import Button from "reactstrap/lib/Button";
import { Form, FormGroup, Label, Input } from "reactstrap";
import GeoJSON from "ol/format/GeoJSON";
import VectorSource from "ol/source/Vector";
import SelectTableComponent from "./geoserverLayerslist";
import MapWrapper from "./mapcomponent";
import { Layer } from "recharts";
import LayersData from "./List";
import LayerList from "@arcgis/core/widgets/LayerList";
import { layer } from "@fortawesome/fontawesome-svg-core";
import VectorLayer from "ol/layer/Vector";
const MapConfig = () => {
  const [roleId, setRoleId] = useState("");
  const [selectedRole, setSelectedRole] = useState("Select a role");
  const [token, setToken] = useState();
  const [layers, setLayers] = useState();
  const [selectedLayers, setSelectedLayers] = useState([]);
  const [featuresLayer, setFeaturesLayer] = useState();
  const [map, setMap] = useState();
  // const { token, setToken } = useToken();

  useEffect(() => {
    handleAddlayer();
  }, [selectedLayers]);

  const handleAddlayer = useCallback(() => {
    console.log(selectedLayers,'...selected')
    let layersArray = [];

    //remove layers if there intially exist any
    if (selectedLayers.length==0) {
     if(map) {removeLayers(map);
     console.log(map.getLayers())}
    }

    //make array of layers by creating vector layer for each selected Layer
    if (selectedLayers && selectedLayers.length > 0) {
      layersArray = selectedLayers.map((layer) => {
        return new VectorLayer({
          source: new VectorSource({
            url: layer.wfsLayer,
            format: new GeoJSON(), // make sure features is an array
          }),
        });
      });
      console.log(layersArray,'...layersArray')

      if (map) {
        // remove previous selected layers so that it will not overcount
        const existedLayers = map.getLayers().getArray();
        if (existedLayers && existedLayers.length > 1) {
          //console.log(existedLayers);
          existedLayers.forEach((layer, index) => {
           if(index!=0) map.removeLayer(layer);
          });
          console.log(map.getLayers(),'after deletion')
        }
      //add layer in map individually
        if (layersArray && layersArray.length > 0) {
          layersArray.forEach((layer) => {
            map.addLayer(layer);
          });
        }
        console.log(layersArray,'...layersArray')
         console.log(map.getLayers())
      }
    }
  },[selectedLayers]);


  const removeLayers = (map) => {
    const existedLayers = map.getLayers().getArray();
        if (existedLayers && existedLayers.length > 1) {
          existedLayers.forEach((layer, index) => {
            if (index != 0) map.removeLayer(layer);
          });
        }
  }

  const handleCallback = (layers) => {
    setLayers(layers);
  };
  const handleSelectCallback = (layers) => {
    setSelectedLayers(layers);
  };

  const handleFeature = (layers) => {
    setFeaturesLayer(layers);
  };

  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (
    <>
      <Container fluid>
        <FormGroup className="text-center">
          <Button color="primary">Connect to Geoserver</Button>
        </FormGroup>
        <Login></Login>
        <FormGroup className="text-center">
          <Button color="primary">Layer list</Button>
        </FormGroup>
        <LayersData
          layers={layers}
          addLayer={handleCallback}
          featuresLayer={featuresLayer}
          selectedLayers={selectedLayers}
          selectLayers={handleSelectCallback}
        />
        {/* <SelectTableComponent></SelectTableComponent> */}
        <FormGroup className="text-center">
          <Button color="primary">Layers on Map</Button>
        </FormGroup>
        <FormGroup>
          <MapWrapper
            map={map}
            setMap={setMap}
            addFeaturesLayer={handleFeature}
            featuresLayer={featuresLayer}
          ></MapWrapper>
        </FormGroup>
        <FormGroup className="text-center">
          <Row>
            <Col className="pl-0">
              <RolesDropdown
                setRoleId={setRoleId}
                selectedRole={selectedRole}
                setSelectedRole={setSelectedRole}
              />
            </Col>
          </Row>
        </FormGroup>

        <FormGroup>
          <Row>
            <Col>
              <PortalItemForm selectedLayers={selectedLayers} roleId={roleId} selectedRole={selectedRole}/>
            </Col>
          </Row>
        </FormGroup>
      </Container>
    </>
  );
};

export default MapConfig;
