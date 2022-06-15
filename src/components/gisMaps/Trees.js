import Header from "components/Headers/Header";
import React, { useEffect, useRef } from "react";
import Card from "reactstrap/lib/Card";
import Col from "reactstrap/lib/Col";
import Container from "reactstrap/lib/Container";
import Row from "reactstrap/lib/Row";
import Map from "@arcgis/core/Map";
import SceneView from "@arcgis/core/views/SceneView";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Legend from "@arcgis/core/widgets/Legend";

const Trees = () => {
  const viewDiv = useRef();
  const renderer = {
    type: "simple", // autocasts as new SimpleRenderer()
    symbol: {
      type: "web-style", // autocasts as new WebStyleSymbol()
      styleName: "esriRealisticTreesStyle",
      name: "Other",
    },
    label: "tree",
    visualVariables: [
      {
        type: "size",
        axis: "height",
        field: "Height", // tree height
        valueUnit: "feet",
      },
      {
        type: "color",
        field: "C_Storage", // Carbon storage
        stops: [
          {
            value: 0,
            color: "#f7fcb9",
          }, // features with zero carbon
          {
            value: 10000,
            color: "#31a354",
          }, // features with 800 carbon
        ],
        legendOptions: {
          title: "Carbon Storage",
        },
      },
    ],
  };
  useEffect(() => {
    const treesLayer = new FeatureLayer({
      url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Landscape_Trees/FeatureServer/0",
      renderer: renderer,
      outFields: ["*"],
      popupTemplate: {
        // autocasts as new PopupTemplate()
        title: "{Cmn_Name}",
        content:
          "<i>{Sci_Name}</i><br>" +
          "This tree is in {Condition} condition and is {Height} feet in height.",
      },
    });

    const map = new Map({
      basemap: "osm",
      ground: "world-elevation",
      layers: [treesLayer],
    });

    const view = new SceneView({
      container: viewDiv.current,
      map: map,
      camera: {
        position: {
          x: -9177356,
          y: 4246783,
          z: 723,
          spatialReference: {
            wkid: 3857,
          },
        },
        heading: 0,
        tilt: 83,
      },
      // Set dock options on the view's popup
      popup: {
        dockEnabled: true,
        dockOptions: {
          breakpoint: false,
        },
      },
      // enable shadows to be cast from the features
      environment: {
        lighting: {
          directShadowsEnabled: true,
        },
      },
    });

    const legend = new Legend({
      view: view,
    });
    view.ui.add(legend, "top-right");
  }, []);
  return (
    <>
      <Header />
      <Container className="mt-5" fluid>
        <Row>
          <Col className="mb-5 " xl="12">
            <Card className="shadow" style={{ height: "800px" }}>
              <div
                ref={viewDiv}
                style={{
                  padding: 0,
                  margin: 0,
                  height: "800px",
                  width: "100%",
                }}
              ></div>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Trees;
