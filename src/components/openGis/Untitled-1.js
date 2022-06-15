
import "./dashboardMap.css";
import React, { useRef, useEffect, useState } from "react";
import Map from "ol/Map";
import OSM from "ol/source/OSM";
import TileLayer from "ol/layer/Tile";
import View from "ol/View";
import TileWMS from "ol/source/TileWMS";
import { getLayersByRoleId } from "network/ApiAxios";
import { fromLonLat } from "ol/proj";
import { createEmpty, extend } from "ol/extent";
import { Button, FormGroup, Input, Label } from "reactstrap";

const DashboardMap = () => {
  const mapElement = useRef();
  const llbody = useRef();
  const [map, setMap] = useState();
  const roleId = localStorage.getItem("role_id");
  const [lyrGroup, setLyrGroup] = useState();
  var baselayer = new TileLayer({
    source: new OSM(),
  });
  const [display, setDisplay] = useState("none");

  useEffect(() => {
    const runAsync = async () => {
      const res = await getLayersByRoleId(roleId);
      if (res.data) {
        if (res.data.success && res.data.layers) {
          if (res.data.layers.length > 0) {
            var { layers } = res.data;
            layers = layers.map((layer) => {
              return new TileLayer({
                source: new TileWMS({
                  url: layer.url,
                  params: {
                    service: "WMS",
                    VERSION: "1.1.0",
                  },
                  serverType: "geoserver",
                }),
              });
            });
            layers.forEach((l) => {
              if (l.getSource().urls[0].search("layers") > 0) {
                let url = l.getSource().urls[0];
                url.split("&").forEach((elem) => {
                  if (elem.search("layers") >= 0) {
                    l.set("name", elem.slice(7));
                  }
                });
              }
            });

            setLyrGroup(layers);
          }
        }
      }
    };
    runAsync();
  }, []);

  //   const geoURL =
  //     "https://182.18.181.115/ctrls/geoserver/SDC/wms?request=GetMap&layers=SDC:Subcounties_2019";

  useEffect(() => {
    const initialMap = new Map({
      target: mapElement.current,
      layers: [baselayer],
      view: new View({
        center: fromLonLat([32.51684538495738, 1.5744890820508601]),
        zoom: 5,
      }),
    });

    setMap(initialMap);
  }, []);

  useEffect(() => {
    var layers;
    if (lyrGroup) {
      layers = [baselayer, ...lyrGroup];
      map.setLayers(layers);
      //   var extent = new createEmpty();
      //   lyrGroup.forEach(function (layer) {
      //     extend(extent, layer.getSource().tmpExtent_);
      //   });
      //   map.getView().fit(extent, map.getSize(), { duration: 1000 });
    }
  }, [lyrGroup]);

  const handleCheckboxes = (l) => {
    map.getLayers().forEach((lyr) => {
      if (lyr && lyr.get("name") === l.get("name")) {
        lyr.setVisible(!lyr.getVisible());
      }
    });
  };

  const renderLyrList = () => {
    if (map) {
      if (lyrGroup) {
        let list = [];
        map.getLayers().forEach((l) => {
          if (l.get("name")) {
            list.push(
              <div>
                <FormGroup check inline>
                  <Input
                    type="checkbox"
                    value={l.get("name")}
                    defaultChecked={true}
                    onChange={() => handleCheckboxes(l)}
                  />
                  <Label check>{l.get("name")}</Label>
                </FormGroup>
              </div>
            );
          }
        });
        if (list.length > 0) {
          return list;
        }
      } else {
        return <p>No layers</p>;
      }
    }
  };

  return (
    <>
      <div ref={mapElement} id="mapElement" className="map-container"></div>
      <div>
        <Button
          size="sm"
          id="llIcon"
          onClick={() => {
            setDisplay((prevState) => {
              if (prevState === "none") {
                return "block";
              } else if (prevState === "block") {
                return "none";
              }
            });
          }}
        >
          <i class="fas fa-layer-group"></i>
        </Button>
        <div id="layerList" style={{ display: display }}>
          <h4 id="llHeader">Layer List</h4>
          <div id="llBody" ref={llbody}>
            {renderLyrList()}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardMap;

