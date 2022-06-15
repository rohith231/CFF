import React, { useRef, useEffect, useState, useContext } from "react";
import "./dashboard.css";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import FeatureTable from "@arcgis/core/widgets/FeatureTable";
import { funcContext } from "GlobalState";
import funcsConditions from "./funcsConditions";
import dashboardFuncs from "./dashboardFuncs";
import Expand from "@arcgis/core/widgets/Expand";
import fieldValidation from "./fieldValidation";
import LayerList from "@arcgis/core/widgets/LayerList";
import Legend from "@arcgis/core/widgets/Legend";
import BasemapToggle from "@arcgis/core/widgets/BasemapToggle";
import _ from "lodash";
import Query from "@arcgis/core/rest/support/Query";
import primaryValidation from "./primaryValidation";
import "./dataVerfPopupContent.css";
import getPrmryLyrTitle from "commonFunctions/gisFuncs/getPrmryLyrTitle";
import getCommonFieldName from "commonFunctions/gisFuncs/getCommonFieldName";

const DashboardMap = (props) => {
  const mapDiv = useRef(null);
  const tableDiv = useRef();
  const [webmap, setWebmap] = useState();
  const [view, setView] = useState();
  const [layerList, setLayerList] = useState();
  const [search, setSearch] = useState();
  const [compass, setCompass] = useState();
  const [locate, setLocate] = useState();
  const [directions, setDirections] = useState();
  const [home, setHome] = useState();
  const [state, dispatch] = useContext(funcContext);
  const [lyrTitle, setLyrTitle] = useState("ghostpoint_field1"); //have to change!!
  const [defaultPopupTemp, setDefaultPopupTemp] = useState();
  const [featTable, setFeatTable] = useState();
  const [updatedRes, setUpdatedRes] = useState();

  // var template =
  //   '<div data-itemid="{id}" class="card block" draggable="true">' +
  //   '<figure class="card-image-wrap"><img class="card-image" src="{thumbnailUrl}" alt="Card Thumbnail">' +
  //   '<figcaption class="card-image-caption">{title}</figcaption>' +
  //   "</figure>" +
  //   // '<div class="card-content">' +
  //   // "<li>Published Date:</li>" +
  //   // "{created}" +
  //   // "<li>Owner:</li>" +
  //   // "{owner}" +
  //   // "</div>" +
  //   "</div>";

  useEffect(() => {
    if (mapDiv.current) {
      if (props.piId) {
        const webmap = new WebMap({
          portalItem: {
            id: props.piId,
          },
        });

        const view = new MapView(
          {
            container: mapDiv.current,
            map: webmap,
            constraints: {
              snapToZoom: true,
            },
          },
          []
        );
        view.when(() => {
          webmap.layers.forEach((layer) => {
            layer.visible = false;
          });
        });

        //layerList widget
        let layerList = new LayerList({
          view: view,
        });
        let layerListExpand = new Expand({
          expandIconClass: "esri-icon-layers",
          expandTooltip: "LayerList",
          view: view,
          content: layerList,
        });
        view.ui.add(layerListExpand, {
          position: "top-left",
        });
        //legend widget
        let legend = new Legend({
          view: view,
        });
        let legendExpand = new Expand({
          expandIconClass: "esri-icon-legend",
          expandTooltip: "Legend",
          view: view,
          content: legend,
        });
        view.ui.add(legendExpand, "bottom-left");

        let basemapToggle = new BasemapToggle({
          view: view,
          nextBasemap: "hybrid",
        });
        view.ui.add(basemapToggle, "top-right");

        if (!view.ui.find("expand")) {
          let expand = new Expand({
            view: view,
            expandTooltip: "Query Layers",
            content: document.getElementById("addDiv"),
          });
          view.ui.add(expand, "bottom-right");
        }
        setWebmap(webmap);
        setView(view);
      }
    }
  }, [props.piId]);

  //for not getting repetitive html
  useEffect(() => {
    if (document.getElementById("tableDiv").innerHTML) {
      document.getElementById("tableDiv").innerHTML = null;
    }
    // for drag and drop
    // if (document.querySelector(".cards-list").innerHTML) {
    //   document.querySelector(".cards-list").innerHTML = null;
    // }
    if (document.getElementById("layerList")?.innerHTML) {
      document.getElementById("layerList").innerHTML = null;
    }
    // if (document.getElementById("fieldList")?.innerHTML) {
    //   document.getElementById("fieldList").innerHTML = null;
    // }
  }, [props.piId, view]);
  useEffect(() => {
    const whenViewLoad = async () => {
      const loadedView = await view?.when();
      if (loadedView) {
        if (props.piId) {
          //for functionalities(widgets)
          dashboardFuncs(
            view,
            setLayerList,
            setSearch,
            setCompass,
            setLocate,
            setDirections,
            setHome
          );
        }
      }
    };
    whenViewLoad();
  }, [view]);

  //for field validation
  useEffect(() => {
    const whenViewLoad = async () => {
      const loadedView = await view?.when();
      if (loadedView) {
        if (props.piId) {
          if (state.fieldValidation) {
            if (state.primaryValidation) {
              dispatch({ type: "toggleFuncs", payload: "primaryValidation" });
            }
          }
          fieldValidation(
            state.fieldValidation,
            webmap,
            lyrTitle,
            defaultPopupTemp,
            view,
            featTable
          );
        }
      }
    };
    whenViewLoad();
    return () => {
      view?.graphics.removeAll();
      featTable?.clearSelection();
    };
  }, [view, state.fieldValidation, updatedRes, lyrTitle]);

  //for applyEdits on accept click in field validation
  useEffect(() => {
    var lsnr1, lsnr2;
    const whenViewLoad = async () => {
      const loadedView = await view?.when();
      if (loadedView) {
        let tempGraphic;
        lsnr1 = view.popup.watch("selectedFeature", (graphic) => {
          if (graphic) {
            tempGraphic = graphic;
          }
        });
        lsnr2 = view.popup.on("trigger-action", async (event) => {
          if (event.action.id === "accept-this") {
            if (tempGraphic) {
              //to send  feature to applyEdits
              var ommitedFieldAttr = _.omit(tempGraphic.attributes, [
                "FID",
                "ObjectID",
                "OID",
                "OBJECTID",
              ]);
              let query = new Query({
                outFields: ["*"],
                where:
                  `${getCommonFieldName(lyrTitle)}=` +
                  "'" +
                  tempGraphic.attributes[getCommonFieldName(lyrTitle)] +
                  "'", //have to take name dynamically
                returnGeometry: true,
              });
              const prmryLayer = await webmap.allLayers.find(function (layer) {
                return layer.title === getPrmryLyrTitle(lyrTitle);
              });
              const res = await prmryLayer.queryFeatures(query);
              var prmryAttributes;
              if (res) {
                prmryAttributes = await res.features[0].attributes;
              }
              const resultantprmryAttr = await _.merge(
                {},
                prmryAttributes,
                ommitedFieldAttr
              );
              var resultantFeature = await res.features[0];
              resultantFeature.attributes = resultantprmryAttr;
              prmryLayer.editingEnabled = true;
              await prmryLayer
                .applyEdits({
                  updateFeatures: [resultantFeature],
                })
                .then(async (res) => {
                  const { updateFeatureResults } = await res;
                  if (!updateFeatureResults[0].error) {
                    setUpdatedRes(updateFeatureResults[0]);
                  }
                });
            }
          }
          if (event.action.id === "reject-this") {
            alert("reject-this");
          }
        });
      }
    };
    whenViewLoad();
    return () => {
      if (lsnr1 && lsnr2) {
        lsnr1.remove();
        lsnr2.remove();
      }
    };
  }, [view, lyrTitle]);
  //field validation
  useEffect(() => {
    const whenViewLoad = async () => {
      const loadedView = await view?.when();
      if (loadedView) {
        if (lyrTitle) {
          const foundLayer = webmap.allLayers.find(function (layer) {
            return layer.title === lyrTitle;
          });
          setDefaultPopupTemp(foundLayer.popupTemplate);
        }
      }
    };
    whenViewLoad();
  }, [view, lyrTitle]);

  //primary validation
  useEffect(() => {
    const whenViewLoad = async () => {
      const loadedView = await view?.when();
      if (loadedView) {
        if (state.primaryValidation) {
          if (state.fieldValidation) {
            dispatch({ type: "toggleFuncs", payload: "fieldValidation" });
          }
        }
        primaryValidation(
          state.primaryValidation,
          webmap,
          lyrTitle,
          view,
          defaultPopupTemp,
          featTable
        );
      }
    };
    whenViewLoad();
    return () => {
      view?.graphics.removeAll();
      featTable?.clearSelection();
    };
  }, [view, state.primaryValidation, lyrTitle]);

  //feature table and custom widget
  useEffect(() => {
    let lyrName;
    let featureTable;
    const whenViewLoad = async () => {
      const loadedView = await view?.when();
      if (loadedView) {
        if (props.piId) {
          let features = [];

          let featureLayer;

          //function for layerlist change
          const layerListChange = (e) => {
            const layerTarget = e.target;
            const selectedIndex = layerTarget.options.selectedIndex;
            const layerName = layerTarget.options[selectedIndex].textContent;
            setLyrTitle(layerName);
            document.getElementById("tableDiv").innerHTML = null;
            // document.getElementById("fieldList").innerHTML = null;

            //checking layer
            const foundLayer = webmap.allLayers.find((layer) => {
              return layer.title === layerName;
            });

            //setting visibility for the layers
            webmap.layers.forEach((layer) => {
              layer.visible = true;
              if (layer.title !== layerName) {
                layer.visible = false;
              }
            });

            //adding feature table widget
            featureTable = new FeatureTable({
              layer: foundLayer,
              container: tableDiv.current,
              view: view,
              highlightOnRowSelectEnabled: true,
            });
            setFeatTable(featureTable);
            // foundLayer?.fields.forEach((field) => {
            //   let fieldList = document.getElementById("fieldList");
            //   let option = document.createElement("option");
            //   option.textContent = field.name;
            //   fieldList.appendChild(option);
            // });

            featureLayer = foundLayer;

            // Listen for the table's selection-change event
            featureTable.on("selection-change", featureTableChange);
          };

          //function for Feature table selection change

          const featureTableChange = (changes) => {
            // If the selection is removed, remove the feature from the array
            changes.removed.forEach((item) => {
              const data = features.find((data) => {
                return data.feature === item.feature;
              });
              if (data) {
                features.splice(features.indexOf(data), 1);
              }
            });

            // If the selection is added, push all added selections to array
            changes.added.forEach((item) => {
              const feature = item.feature;
              features.push({
                feature: feature,
              });
            });

            const query = featureLayer.createQuery();
            // Iterate through the features and grab the feature's objectID
            const featureIds = features.map((result) => {
              return result.feature.getAttribute(featureLayer.objectIdField);
            });
            // Set the query's objectId
            query.objectIds = featureIds;
            // Make sure to return the geometry to zoom to
            query.returnGeometry = true;
            query.outSpatialReference = view.spatialReference;
            // Call queryFeatures on the feature layer and zoom to the resulting features
            featureLayer.queryFeatures(query).then((results) => {
              view.goTo(results.features).catch((error) => {
                if (error.name !== "AbortError") {
                  console.error(error);
                }
              });
            });
          };

          //function for show all layers in the widget
          const showLayers = (event) => {
            lyrName = document.getElementById("layerList");
            let layerValue = lyrName.value;

            if (!layerValue) {
              alert("Layer not added to the Map");
            }
            webmap.layers.forEach((layer) => {
              layer.visible = true;
            });
            // document.getElementById("tableDiv").innerHTML = null;
          };

          let showLyr = document.getElementById("showLayers");
          showLyr?.addEventListener("click", showLayers);

          webmap.layers.forEach((layer) => {
            let layerList = document.getElementById("layerList");
            let option = document.createElement("option");
            option.textContent = layer.title;
            option.className = "layerListOps";
            layerList.appendChild(option);
          });
          //getting first layer
          featureLayer = webmap.layers.getItemAt(0);

          featureTable = new FeatureTable({
            layer: featureLayer,
            container: tableDiv.current,
            view: view,
            highlightOnRowSelectEnabled: true,
          });

          featureTable.on("selection-change", featureTableChange);

          //to create field list
          lyrName = document.getElementById("layerList");
          lyrName.addEventListener("change", layerListChange);
        }
      }
    };
    whenViewLoad();
    return () => {
      var elem = document.getElementById("layerList");
      elem.replaceWith(elem.cloneNode(true));
    };
  }, [view, props.piId, webmap]);

  // useEffect(() => {
  //   const whenViewLoad = async () => {
  //     const loadedView = await view?.when();
  //     if (loadedView) {
  //       if (props.piId) {
  //         //for drag and drop
  //         props.portal.load().then(function () {
  //           const queryParams = new PortalQueryParams({
  //             query: "owner:" + props.portal.user.username,
  //             num: 20,
  //           });
  //           props.portal.queryItems(queryParams).then((res) => {
  //             const layerItems = [];
  //             res.results.forEach((item) => {
  //               if (item.isLayer) {
  //                 layerItems.push(item.id);
  //               }
  //             });
  //             var portalItems = layerItems.map(function (itemid) {
  //               return new PortalItem({
  //                 id: itemid,
  //               }).load();
  //             });

  //             promiseUtils.eachAlways(portalItems).then(function (items) {
  //               var docFrag = document.createDocumentFragment();
  //               items.map(function (result) {
  //                 var item = result.value;
  //                 var card = intl.substitute(template, item);
  //                 var elem = document.createElement("div");
  //                 elem.innerHTML = card;
  //                 // This is a technique to turn a DOM string to a DOM element.
  //                 var target = elem.firstChild;
  //                 docFrag.appendChild(target);
  //                 target.addEventListener("dragstart", function (event) {
  //                   var id = event.currentTarget.getAttribute("data-itemid");
  //                   event.dataTransfer.setData("text", id);
  //                 });
  //               });
  //               document.querySelector(".cards-list")?.appendChild(docFrag);
  //               view.container.addEventListener("dragover", function (event) {
  //                 event.preventDefault();
  //                 event.dataTransfer.dropEffect = "copy";
  //               });

  //               view.container.addEventListener("drop", function (event) {
  //                 event.preventDefault();
  //                 var id = event.dataTransfer.getData("text");
  //                 var resultItem = items.find(function (x) {
  //                   return x.value.id === id;
  //                 });
  //                 var item = resultItem?.value;
  //                 if (item && item.isLayer) {
  //                   Layer.fromPortalItem({
  //                     portalItem: item,
  //                   }).then(function (layer) {
  //                     webmap.add(layer);
  //                     view.extent = item.extent;
  //                   });
  //                 }
  //               });
  //             });
  //           });
  //         });
  //       }
  //     }
  //   };
  //   whenViewLoad();
  // }, [view]);

  //for functionalities
  useEffect(() => {
    funcsConditions(
      view,
      state,
      layerList,
      search,
      compass,
      locate,
      directions,
      home
    );
  }, [view, state]);

  return (
    <>
      {/* <Row> */}
      {/* <Col md={2} className="pr-0"> */}
      {/* for drag and drop */}
      {/* <div id="itemDiv" className="esri-widget">
            <label className="description">
              <b>Instructions:</b>
              <br />
            </label>
            <label className="description">
              Drag Layers to the Map
              <br />
            </label>
            <label className="description"></label>
            <div className="cards-list"></div>
          </div> */}
      {/* </Col> */}
      {/* <Col md={10} className="pl-0"> */}
      <div ref={mapDiv} id="mapDiv"></div>
      <div ref={tableDiv} id="tableDiv"></div>
      {/* query modal on map */}
      <div id="addDiv" className="esri-widget">
        <div className="mlrtb">
          <h3 className="MarginTopBottom">Query Layers</h3>
          <div className="MarginTopBottom">Layer Name</div>
          <select id="layerList"></select>
          {/* <div className="MarginTopBottom" style={{ marginTop: "5px" }}>
            Field Name
          </div>
          <select id="fieldList"></select> */}
          <button id="showLayers" className="esri-button">
            Show All Layers
          </button>
        </div>
      </div>

      {/* </Col> */}
      {/* </Row> */}
    </>
  );
};

export default DashboardMap;
