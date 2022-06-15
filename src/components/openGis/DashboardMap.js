import "./dashboardMap.css";
import React, { useRef, useEffect, useState, useContext } from "react";
import Map from "ol/Map";
import OSM from "ol/source/OSM";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faTools } from "@fortawesome/free-solid-svg-icons";
//import TileLayer from "ol/layer/Tile";
import View from "ol/View";
import TileWMS from "ol/source/TileWMS";

import { fromLonLat } from "ol/proj";
import { createEmpty, extend } from "ol/extent";
import { Button, FormGroup, Input, Label } from "reactstrap";
import GeoJSON from "ol/format/GeoJSON";
import VectorSource from "ol/source/Vector";
import { Stroke, Style } from "ol/style";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { bbox as bboxStrategy } from "ol/loadingstrategy";
import $ from "jquery";
import ButtonGroup from "reactstrap/lib/ButtonGroup";
import { useLayoutEffect } from "react";
import MapFilter from "./MapFilter";
import Bookmark, { BookmarkModal, MyBookmarks } from "./bookmark";
// Co-ordinate display
import MousePosition from "ol/control/MousePosition";
import { createStringXY } from "ol/coordinate";
// import { defaults as defaultControls } from "ol/control";
import {
  ScaleLine,
  ZoomSlider,
  ZoomToExtent,
  defaults as defaultControls,
} from "ol/control";
import Draw from "ol/interaction/Draw";

import "datatables.net";
// import "datatables.net-dt/css/jquery.dataTables.css";

//layerswitcher with basemap
// import "ol/ol.css";
import "ol-layerswitcher/dist/ol-layerswitcher.css";
import LayerGroup from "ol/layer/Group";
import LayerTile from "ol/layer/Tile";
import SourceOSM from "ol/source/OSM";
import XYZ from "ol/source/XYZ";
import LayerSwitcher from "ol-layerswitcher";
import { BaseLayerOptions, GroupLayerOptions } from "ol-layerswitcher";
import Overlay from "ol/Overlay";
import { toLonLat } from "ol/proj";
import { toStringHDMS } from "ol/coordinate";
import Popup from "ol-popup";
import { transform } from "ol/proj";
import "ol-popup/src/ol-popup.css";
// import "./node_modules/ol-popup/src/ol-popup.css";
import sortTable from "../../utils/sorting";
import SearchData from "../../utils/Search";
import { SearchNotEqual, SearchEqual } from "../../utils/EqualAndNotEqual";
import "./Table.css";
import { funcContext } from "../../GlobalState";
import Draggable from "react-draggable";
import axios from "axios";

import { getLayersByRoleId } from "../../network/ApiAxios";

const DashboardMap = (props) => {
  const mapElement = useRef();
  const popupContainer = useRef();
  const llbody = useRef();
  const [map, setMap] = useState();
  const roleId = localStorage.getItem("role_id");
  const [lyrGroup, setLyrGroup] = useState();
  const [Data, setData] = useState([]);
  const [header, setHeader] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTable, setSearchTable] = useState([]);
  const [mapFilter, setmapFilter] = useState(false);
  const [maplayer, setMaplayer] = useState();

  var baselayer = new TileLayer({
    source: new OSM(),
  });
  const [display, setDisplay] = useState("none");
  const [popupContent, setPopupContent] = useState();
  const [context, setContext] = useContext(funcContext);
  const [layer, setLayer] = useState();
  const [property, setProperty] = useState();
  const [layerName, setLayerName] = useState();
  const [totalFeatures, setTotalFeatures] = useState();
  const [loading, setLoading] = useState(false);
  const [layerConditions, setLayerConditions] = useState();
  const [depproperty, setdepProperty] = useState();
  const [currentWfsLayer, setCurrentWfsLayer] = useState("");
  const [querySource, setQuerySource] = useState();
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [showBMarksModal, setShowBMarkModal] = useState(false);
  const [showTools, setShowTools] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const res = await getLayersByRoleId(43);
    console.log(res, "res");
    const config = {
      method: "get",
      headers: {
        Authorization: "Basic YWRtaW46Z2Vvc2VydmVy",
      },
    };

    fetch("http://localhost:8080/geoserver/rest/layers", config)
      .then((response) => response.json())
      .then(async (result) => {
        const layerlistdata = [];

        let nameslist = result.layers.layer;
        console.log(nameslist, "..lidt");
        await Promise.all(
          nameslist.map((lyr, index) => {
            let lyrobj = {};
            lyrobj.id = index;
            lyrobj.selected = false;
            let lyrname = lyr.name;
            lyrobj.layername = lyrname;
            let lyrsplit = lyrname.split(":");
            var config1 = {
              method: "get",
              url: lyr.href,
              headers: {
                Authorization: "Basic YWRtaW46Z2Vvc2VydmVy",
              },
            };
            axios(config1).then((resp) => {
              if (resp.data.layer.type === "VECTOR") {
                lyrobj.wfsLayer =
                  "http://localhost:8080/geoserver/" +
                  lyrsplit[0] +
                  "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
                  lyrname +
                  "&outputFormat=application/json";
              }
            });
            layerlistdata.push(lyrobj);
          })
        );
        return layerlistdata.sort((a, b) => a.id - b.id);
      })
      .then((layerlistdata) => {
        console.log(layerlistdata, "layerlistdata");
        setMaplayer(layerlistdata);
      });
  };

  const loadMapFilters = () => {
    extractLayers();
    setmapFilter(true);
  };

  const extractLayers = () => {
    setLoading(true);
    let layers = [];
    console.log(maplayer, "..map");

    if (maplayer && maplayer.length > 0) {
      layers[0] = {
        layername: maplayer[1].layername,
        wfsLayer: maplayer[1].wfsLayer,
      };
      layers[1] = {
        layername: maplayer[2].layername,
        wfsLayer: maplayer[2].wfsLayer,
      };

      layers[2] = {
        layername: maplayer[8].layername,
        wfsLayer: maplayer[8].wfsLayer,
      };
    }
    console.log(layers, "...layers");
    if (layers && layers.length > 0) {
      extractproperty(layers[0].wfsLayer);
      setLayerName(layers[0].layername);
      setCurrentWfsLayer(layers[0].wfsLayer);
      setLayer(layers);
    }
    setLoading(false);
  };

  const extractproperty = async (url) => {
    let res;
    let layerProperty;
    let features;
    let layerConditionsObj = {};
    setLoading(true);
    try {
      if (url)
        res = await axios.get(url, {
          headers: {
            Authorization: "Basic YWRtaW46Z2Vvc2VydmVy",
          },
        });

      if (res) {
        layerProperty = res.data.features[0].properties;

        features = res.data.totalFeatures;
        let properties = [];
        if (layerProperty)
          for (const key in layerProperty) {
            properties.push({ value: key, label: key });
          }

        if (res.data.features && res.data.features.length > 0) {
          res.data.features.forEach((item, index) => {
            for (const key in item.properties) {
              if (index == 0) {
                layerConditionsObj[key] = { arr: [], type: "" };
                layerConditionsObj[key]["type"] = typeof item.properties[key];
                layerConditionsObj[key].arr.push(item.properties[key]);
              } else {
                layerConditionsObj[key].arr.push(item.properties[key]);
              }
            }
          });
        }
        let dep = properties[0].label;
        setLayerConditions(layerConditionsObj);
        setProperty(properties);
        if (dep && layerConditionsObj)
          setdepProperty({ key: dep, type: layerConditionsObj[dep].type });
        setTotalFeatures(features);
      }
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  // select options

  // useEffect(() => {
  //   const runAsync = async () => {
  //     const res = await getLayersByRoleId(roleId);
  //     if (res.data) {
  //       if (res.data.success && res.data.layers) {
  //         if (res.data.layers.length > 0) {
  //           var { layers } = res.data;
  //           layers = layers.map((layer) => {
  //             return new TileLayer({
  //               source: new TileWMS({
  //                 url: layer.url,
  //                 params: {
  //                   service: "WMS",
  //                   VERSION: "1.1.0",
  //                 },
  //                 serverType: "geoserver",
  //               }),
  //             });
  //           });
  //           layers.forEach((l) => {
  //             if (l.getSource().urls[0].search("layers") > 0) {
  //               let url = l.getSource().urls[0];
  //               url.split("&").forEach((elem) => {
  //                 if (elem.search("layers") >= 0) {
  //                   l.set("name", elem.slice(7));
  //                 }
  //               });
  //             }
  //           });

  //           setLyrGroup(layers);
  //         }
  //       }
  //     }
  //   };
  //   runAsync();
  // }, []);

  //   const geoURL =
  //     "https://182.18.181.115/ctrls/geoserver/SDC/wms?request=GetMap&layers=SDC:Subcounties_2019";

  // geoserver layer

  // Co-ordinate display
  const mousePositionControl = new MousePosition({
    coordinateFormat: createStringXY(4),
    projection: "EPSG:4326",
    // comment the following two lines to have the mouse position
    // be placed within the map.
    // className: "custom-mouse-position",
    target: document.getElementById("mouse-position"),
  });

  //add wfs layer
  //http://productplatform.digital.trccompanies.com/geoserver/tiger/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tiger%3Apoi&maxFeatures=50
  var serverUrl =
    // "http://localhost:8080//geoserver/tiger/wfs?service=WFS&";
    "http://productplatform.digital.trccompanies.com/geoserver/tiger/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=";

  var layersList = [
    "tiger%3Atiger_roads&",
    "tiger%3Apoly_landmarks&",
    "tiger%3Apoi&",
  ];

  var LyrcolorArr = [
    "rgba(0, 0, 255, 1.0)",
    "rgba(255, 0, 0, 1.0)",
    "rgba(0,255, 0, 1.0)",
  ];

  var lyrWidth = [2, 2, 10];

  /* const vectorSource = new VectorSource({
    format: new GeoJSON(),
    url: function (extent) {
      return (
        "https://ahocevar.com/geoserver/wfs?service=WFS&" +
        "version=1.1.0&request=GetFeature&typename=osm:water_areas&" +
        "outputFormat=application/json&srsname=EPSG:3857&" +
        "bbox=" +
        extent.join(",") +
        ",EPSG:3857"
      );
    },
    strategy: bboxStrategy,
  });

  const vector = new VectorLayer({
    source: vectorSource,
    style: new Style({
      stroke: new Stroke({
        color: "rgba(0, 0, 255, 1.0)",
        width: 2,
      }),
    }),
  });*/
  var layerArr = [];
  // layerArr.push(baselayer);

  // var overlays = new LayerGroup({
  //   title: "Overlays",
  //   layers: [],
  // });

  var i = 0;
  layersList.forEach((element) => {
    const vectorSource = new VectorSource({
      format: new GeoJSON(),
      url: function (extent) {
        return (
          serverUrl +
          element +
          "outputFormat=application/json&srsname=EPSG:3857&" +
          "bbox=" +
          extent.join(",") +
          ",EPSG:3857"
        );
      },
      strategy: bboxStrategy,
    });

    const vector = new VectorLayer({
      source: vectorSource,
      style: new Style({
        stroke: new Stroke({
          color: LyrcolorArr[i], //"rgba(0, 0, 255, 1.0)", //LyrcolorArr[i],
          width: lyrWidth[i], //2,
        }),
      }),
      name: decodeURIComponent(element).substring(0, element.length - 3), //`${i}`,
      surl:
        serverUrl +
        element +
        "outputFormat=application/json&srsname=EPSG:3857&",
    });
    if (i == 1) {
    }
    layerArr.push(vector);
    // overlays.getLayers().push(vector);

    i++;

    return layerArr;
  });

  //ends add wfs layer
  let popContainer = null;
  //useEffect(() => {
  const Container = () => {
    var id = document.getElementById("popup");

    return document.getElementById("popup");
  };
  Container();
  popContainer = Container();
  //}, []);
  /**
   * Create an overlay to anchor the popup to the map.
   */
  const popupOverlay = new Overlay({
    element: popContainer,
    autoPan: {
      animation: {
        duration: 250,
      },
    },
  });

  useEffect(() => {
    var base_maps = new LayerGroup({
      title: "Base maps",
      layers: [
        new LayerTile({
          title: "Satellite",
          type: "base",
          visible: true,
          source: new XYZ({
            attributions: [
              "Powered by Esri",
              "Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community",
            ],
            attributionsCollapsible: false,
            url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            maxZoom: 23,
          }),
        }),
        new LayerTile({
          title: "OSM",
          type: "base",
          visible: true,
          source: new SourceOSM(),
        }),
      ],
    });
    layerArr.unshift(base_maps);
    const initialMap = new Map({
      controls: defaultControls().extend([
        mousePositionControl,
        scaleBarLineControl,
        slider,
        zoom_ex,
      ]), // Co-ordinate display
      target: mapElement.current,
      layers: layerArr, //[baselayer, featureLayer],
      overlays: [popupOverlay],
      view: new View({
        center: fromLonLat([-73.95, 40.77]),
        zoom: 5,
      }),
    });

    setMap(initialMap);
  }, []);

  // useEffect(() => {
  //   var layers;
  //   if (lyrGroup) {
  //     layers = [baselayer, ...lyrGroup];
  //     map.setLayers(layers);
  //     //   var extent = new createEmpty();
  //     //   lyrGroup.forEach(function (layer) {
  //     //     extend(extent, layer.getSource().tmpExtent_);
  //     //   });
  //     //   map.getView().fit(extent, map.getSize(), { duration: 1000 });
  //   }
  // }, [lyrGroup]);

  const handleCheckboxes = (l) => {
    map.getLayers().forEach((lyr) => {
      if (lyr && lyr.get("name") === l.get("name")) {
        lyr.setVisible(!lyr.getVisible());
      }
    });
  };

  const onChangeQueryLyrLstSelect = (lyr) => {
    $.ajax({
      type: "GET",
      /*url: 'http://localhost:8080/geoserver/postgis_test/ows?service=WFS&' + 
      '    version=1.1.0&request=GetFeature&typeName=postgis_test:clusterresult&' + 
           'maxFeatures=500&SRS=EPSG:31370&outputFormat=text%2Fjavascript&'+ 
            'format_options=callback:getJson',*/
      /*url:
        "http://productplatform.digital.trccompanies.com/geoserver/tiger/wfs?service=WFS&" +
        "version=1.0.0&request=GetFeature&typeName=tiger%3Atiger_roads&" +
        "maxFeatures=500&SRS=EPSG:31370&outputFormat=application/json", // +
      //"format_options=callback:getJson",*/
      //'http://productplatform.digital.trccompanies.com/geoserver/tiger/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=tiger%3Apoly_landmarks&outputFormat=application/json&srsname=EPSG:3857&'
      url: lyr, //"http://productplatform.digital.trccompanies.com/geoserver/tiger/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=tiger%3Atiger_roads&maxFeatures=500&SRS=EPSG:31370&outputFormat=application/json",
      dataType: "json",
      //jsonpCallback: "getJson",
      success: function (data) {
        // If response is valid
        var geojsonFormat = new GeoJSON();
        var keys = [];
        var featAttributes = [];
        data.features.forEach(function (element) {
          featAttributes.push(element.properties);
          if (keys.length == 0) {
            keys = Object.keys(element.properties);
          }
        });
        setHeader(keys);
        setData(featAttributes);
        setSearchTable(featAttributes);
        // reads and converts GeoJSon to Feature Object
        //var features = geojsonFormat.readFeatures(data);
        //firstWFSsource.addFeatures(features);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        //   alert("Status: " + textStatus);
        //   alert("Error: " + errorThrown);
      },
    });
  };

  const renderLyrList = () => {
    if (map) {
      //if (lyrGroup) {
      let list = [];
      // let layerLst = document.getElementById("sel_lyrlist");
      // layerLst.innerText = null;
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
          // let option = document.createElement("option");
          // option.value = l.get("surl"); //.urls[0];
          // option.textContent = l.get("name");
          // layerLst.appendChild(option);
        }
      });
      if (list.length > 0) {
        return list;
      }
      /*} else {
        return <p>No layers</p>;
      }*/
    }
  };

  // scalebar line
  const scaleBarLineControl = new ScaleLine({
    units: "metric",
  });
  //zoom slider
  var slider = new ZoomSlider();
  // map.addControl(slider);

  //extent control
  var zoom_ex = new ZoomToExtent({
    extent: [65.9, 7.48, 98.96, 40.3],
  });

  if (map) {
    var base_maps = new LayerGroup({
      title: "Base maps",
      layers: [
        new LayerTile({
          title: "Satellite",
          type: "base",
          visible: true,
          source: new XYZ({
            attributions: [
              "Powered by Esri",
              "Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community",
            ],
            attributionsCollapsible: false,
            url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            maxZoom: 23,
          }),
        }),
        new LayerTile({
          title: "OSM",
          type: "base",
          visible: true,
          source: new SourceOSM(),
        }),
      ],
    });
    // map.addLayer(base_maps);
    // map.addLayer(overlays);
    var layerSwitcher = new LayerSwitcher({
      activationMode: "click",
      startActive: true,
      tipLabel: "Layers", // Optional label for button
      groupSelectStyle: "children", // Can be 'children' [default], 'group' or 'none'
      collapseTipLabel: "Collapse layers",
    });
    map.addControl(layerSwitcher);

    layerSwitcher.renderPanel();
  }

  //Draw features
  const drawSource = new VectorSource({ wrapX: false });

  const drawVector = new VectorLayer({
    source: drawSource,
  });
  // function addDrawVector() {
  //   map.addLayer(drawVector);
  // }
  // addDrawVector();
  // layerArr.push(drawVector);

  // this.state.map.addLayer(drawVector);
  if (map) {
    map.addLayer(drawVector);
  }
  let draw; // global so we can remove it later
  function addInteraction(value) {
    popup.hide();
    // alert(value);
    map.removeInteraction(draw);
    const typeSelectvalue = value;
    if (value !== "None") {
      draw = new Draw({
        source: drawSource,
        type: typeSelectvalue,
      });
      map.addInteraction(draw);
    }
  }

  function clearDraw() {
    drawSource.clear();
    map.removeInteraction(draw);
  }

  const layerListQuery = () => {
    if (map) {
      let layerLst = document.getElementById("sel_lyrlist");
      layerLst.innerText = null;
      map.getLayers().forEach((l) => {
        if (l.get("name") !== undefined) {
          let option = document.createElement("option");
          option.value = l.get("surl"); //.urls[0];
          option.textContent = l.get("name");
          layerLst.appendChild(option);
          // } else {
          //   return;
        }
      });
    }
  };

  /*if (map) {
    const layerSwitcher = new LayerSwitcher({
      reverse: true,
      groupSelectStyle: "group",
    });
    map.addControl(layerSwitcher);
  }*/
  //legend
  // if (map) {
  //   let layer = map.getLayers().get("tiger:Atiger_roads");
  //   // let head = document.createElement("p");

  //   // var txt = document.createTextNode(layer.get("name"));

  //   // head.appendChild(txt);
  //   let legendElement = document.getElementById("legend");
  //   // legendElement.appendChild(head);
  //   let img = new Image();
  //   img.src =layer.surl
  //     // "http://localhost:8084/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=" +
  //     // layer.get("name");
  //   // let src = document.getElementById("legend");
  //   legendElement.appendChild(img);
  // }

  //Elements that make up the popup.

  var container = popupContainer.current;
  // let content = document.getElementById("popup-content");
  const closer = document.getElementById("popup-closer");

  const Closer = () => {
    popupOverlay.setPosition(undefined);
    closer.blur();
    return false;
  };
  var popup = new Popup();

  if (map) {
    map.addOverlay(popup);
    // let popupContent = document.getElementById("popupTrial");
    // let popupText = documet.createElement("h1");

    map.on("singleclick", function (evt) {
      var prettyCoord = toStringHDMS(
        transform(evt.coordinate, "EPSG:3857", "EPSG:4326"),
        2
      );

      popup.show(
        evt.coordinate,
        "<div><h2>Coordinates</h2><p>" + prettyCoord + "</p></div>"
      );
      // let content = popupContainer.current;
      const coordinate = evt.coordinate;
      const hdms = toStringHDMS(toLonLat(coordinate));
      setPopupContent(hdms);
      // popupText.textContent =
      //   "<p>You clicked here:</p><code>" + hdms + "</code>";
      // popupContent.appendChild(popupText);
      // if (content)
      //   content.innerHTML = "<p>You clicked here:</p><code>" + hdms + "</code>";
      // popupOverlay.setPosition(coordinate);
    });
  }
  const deactivatePopup = () => {
    if (popup) {
      popup.hide();
    }
  };

  const hideMapFilter = () => {
    setmapFilter(false);
  };

  const handleFilterMapSubmit = (event) => {
    event.preventDefault();
  };

  const handleAddlayer = (featureLayer) => {
    const querySource = new VectorSource({
      url: featureLayer,
      format: new GeoJSON(), // make sure features is an array
    });

    setQuerySource(querySource);

    const queryVector = new VectorLayer({
      source: querySource,
    });
    /*  console.log('...hello')
    console.log(queryVector.getSource().getExtent(),'...extent') */
    if (map) {
      map.addLayer(queryVector);
      /* map.getView()
        .fit(queryVector.getSource().getExtent(), {
          padding: [100, 100, 100, 100],
          duration: 100,
          maxZoom: 19,
        }); */
    }
  };

  const handleClearLayer = () => {
    if (querySource) {
      querySource.clear();
    }
  };

  return (
    <>
      <Draggable>
        <MapFilter
          mapFilter={mapFilter}
          maplayer={maplayer}
          hideMapFilter={hideMapFilter}
          layer={layer}
          property={property}
          layerName={layerName}
          extractproperty={extractproperty}
          setLayerName={setLayerName}
          totalFeatures={totalFeatures}
          layerConditions={layerConditions}
          depproperty={depproperty}
          setdepProperty={setdepProperty}
          handleAddlayer={handleAddlayer}
          currentWfsLayer={currentWfsLayer}
          setCurrentWfsLayer={setCurrentWfsLayer}
          handleClearLayer={handleClearLayer}
          querySource={querySource}
        />
      </Draggable>
      {showMarkModal ? (
        <div className="bm-container">
          <BookmarkModal showModal={setShowMarkModal} />
        </div>
      ) : null}
      {/* {showMarkModal ? (
        <BookmarkModal
          showModal={setShowMarkModal}
          showBMarks={setShowBMarkModal}
        />
      ) : null}
      {showBMarksModal ? <MyBookmarks showModal={setShowBMarkModal} /> : null} */}
      <div ref={mapElement} id="mapElement" className="map-container"></div>
      {/* <div
        ref={popupContainer}
        id="popupContainer"
        className="popupStatic"
      ></div> */}
      {/* <div id="popupTrial" className="popupStatic">
        <h1>{popupContent}</h1>
      </div> */}
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
      {/* <div id="mouse-position" className="ol-mouse-position"></div> */}
      <div className="layer-list-position">
        <div className="tools-button">
          <button onClick={() => setShowTools(!showTools)}>
            <FontAwesomeIcon icon={faTools} />
          </button>
        </div>
        {showTools ? (
          <div className="t-box">
            <div className="bookmark-button t-btns">
              <Bookmark showModal={setShowMarkModal} />
            </div>
            <div className="filter_buttons t-btns">
              <button
                onClick={() => {
                  loadMapFilters();
                }}
              >
                {loading ? (
                  <>loading...</>
                ) : (
                  <FontAwesomeIcon icon={faFilter} />
                )}
              </button>
            </div>
          </div>
        ) : null}

        <div id="layerlist-query">
          <label>Layer List Query</label>
          <br></br>
          <select
            id="sel_lyrlist"
            onChange={(e, index) => {
              let lurl = e.target.value;
              onChangeQueryLyrLstSelect(lurl);
            }}
            /*{(e) => {
        }}*/
          >
            {layerListQuery()}
            {/* 
            if(map){map.getLayers().forEach((l) => {
            if (l.get("name")) {
              return <option>{l.get("name")}</option>;
            }
          })} */}
          </select>
        </div>
      </div>

      <div id="drawFeatures">
        <ButtonGroup className="mb-2 point-btns">
          <Button
            id="point"
            value="Point"
            onClick={(e) => {
              addInteraction(e.target.value);
            }}
          >
            Point
            {/* <i class="fa fa-circle" aria-hidden="true"></i> */}
          </Button>
          <Button
            id="line"
            value="LineString"
            onClick={(e) => {
              addInteraction(e.target.value);
            }}
          >
            Line
          </Button>
          <Button
            id="polygon"
            value="Polygon"
            onClick={(e) => {
              addInteraction(e.target.value);
            }}
          >
            Polygon
          </Button>
          <Button id="clear" onClick={clearDraw}>
            Clear
          </Button>
        </ButtonGroup>
      </div>
      {/* <Button onClick={deactivatePopup}>DeactivatePopup</Button> */}
      <div id="legend"></div>
      <div id="mouse-position" className="mouse-position"></div>
      <div id="popup" className="ol-popup">
        <a
          href="#"
          id="popup-closer"
          className="ol-popup-closer"
          onClick={Closer}
        ></a>
        <div id="popupcontent">{popupContent}</div>
      </div>

      {/* <div id="table" className="fixed-table">
        <table className="table table-striped">
          <thead className="table-success">
            <tr>
              {header.map((item, index) => {
                return <th key={index}>{item}</th>;
              })}
            </tr>
          </thead>

          <tbody>
            {Data.map((item) => {
              return (
                <tr style={{ color: "black" }}>
                  {Object.keys(item).map((ele) => {
                    return (
                      <>
                        <td>
                          {typeof item[ele] !== "object" ? item[ele] : ""}
                        </td>
                      </>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div> */}
      <div id="table" className="fixed-table">
        <table className="table table-striped">
          <thead className="table-success">
            <tr>
              {header.map((item, headerIndex) => {
                return (
                  <th key={headerIndex}>
                    {item}
                    <div
                      style={{ float: "right" }}
                      className="btn-group dropstart"
                    >
                      <button
                        type="button"
                        className="btn  dropdown-toggle dropdown-toggle-split"
                        id="dropdownMenuReference"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        data-bs-reference="parent"
                      >
                        <i className="fa fa-ellipsis-h" aria-hidden="true" />
                      </button>
                      <ul
                        className="dropdown-menu shorting-drop"
                        aria-labelledby="dropdownMenuReference"
                      >
                        <li>
                          <a
                            className="dropdown-item"
                            onClick={(e) =>
                              sortTable(
                                item,
                                setSortOrder,
                                searchTable,
                                "asc",
                                setSearchTable
                              )
                            }
                          >
                            Sort Ascending
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            onClick={(e) =>
                              sortTable(
                                item,
                                setSortOrder,
                                searchTable,
                                "desc",
                                setSearchTable
                              )
                            }
                          >
                            Sort Descending
                          </a>
                        </li>
                        <li>
                          <form className="form-inline p-2">
                            <input
                              className="form-control mr-sm-2"
                              type="search"
                              placeholder="Search"
                              aria-label="Search"
                              onChange={(event) =>
                                SearchData(
                                  item,
                                  event.target.value,
                                  Data,
                                  setSearchTable
                                )
                              }
                            />
                          </form>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <a className="dropdown-item dropstart" href="#">
                            Filter
                          </a>
                          <ul
                            className="dropdown-menu submanu"
                            aria-labelledby="dropdownMenuReference"
                          >
                            <li>
                              {" "}
                              <form className="form-inline p-2">
                                <p>Equal values:</p>
                                <input
                                  className="form-control mr-sm-2"
                                  type="search"
                                  placeholder="Search equal value"
                                  aria-label="Search"
                                  onChange={(event) =>
                                    SearchData(
                                      item,
                                      event.target.value,
                                      Data,
                                      setSearchTable
                                    )
                                  }
                                />
                              </form>
                            </li>
                            <li>
                              {" "}
                              <form className="form-inline p-2">
                                <p>Equal not values:</p>
                                <input
                                  className="form-control mr-sm-2"
                                  type="search"
                                  placeholder="Search not equal value"
                                  aria-label="Search"
                                  onChange={(event) =>
                                    SearchNotEqual(
                                      item,
                                      event.target.value,
                                      Data,
                                      setSearchTable
                                    )
                                  }
                                />
                              </form>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {/* {(searchTable ? searchTable : Data).map((item, rowIndex) => { */}
            {searchTable &&
              searchTable.map((item, rowIndex) => {
                return (
                  <tr
                    style={{ color: "black" }}
                    key={rowIndex}
                    className={`${
                      context && context.primaryValidation ? "bg-warning" : ""
                    }
                  `}
                  >
                    {Object &&
                      Object.keys(item).map((ele, colIndex) => {
                        return (
                          <td key={colIndex}>
                            {typeof item[ele] !== "object" ? item[ele] : ""}
                          </td>
                        );
                      })}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DashboardMap;
