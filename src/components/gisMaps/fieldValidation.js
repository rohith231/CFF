import Query from "@arcgis/core/rest/support/Query";
import CustomContent from "@arcgis/core/popup/content/CustomContent";
import _ from "lodash";
import Graphic from "@arcgis/core/Graphic";
import getPrmryLyrTitle from "commonFunctions/gisFuncs/getPrmryLyrTitle";
import getCommonFieldName from "commonFunctions/gisFuncs/getCommonFieldName";

const fieldValidation = async (
  fieldValidation,
  webmap,
  lyrTitle,
  defaultPopupTemp,
  view,
  featTable
) => {
  if (fieldValidation) {
    const compareFeatures = new CustomContent({
      outFields: ["*"],
      creator: async (feature) => {
        var rows = "";
        if (feature) {
          if (feature.graphic.attributes) {
            var attributes = feature.graphic.attributes;
            let query = new Query({
              outFields: ["*"],
              where:
                `${getCommonFieldName(lyrTitle)}=` +
                "'" +
                attributes[getCommonFieldName(lyrTitle)] +
                "'", //have to take name dynamically
              returnGeometry: true,
            });
            const res = await prmryLyr.queryFeatures(query);
            var prmryAttributes;
            if (res) {
              if (res.features.length > 0) {
                prmryAttributes = await res.features[0].attributes;
                for (var key in attributes) {
                  if (attributes.hasOwnProperty(key)) {
                    if (
                      key !== "FID" &&
                      key !== "ObjectID" &&
                      key !== "OID" &&
                      key !== "OBJECTID" &&
                      key !== "SHAPE_Leng" &&
                      key !== "Shape__Length"
                    ) {
                      if (prmryAttributes[key] === attributes[key]) {
                        rows =
                          rows +
                          `<tr><td>${key}</td><td>${prmryAttributes[key]}</td><td>${attributes[key]}</td><td></td></tr>`;
                      } else {
                        rows =
                          rows +
                          `<tr class="diff-row"><td>${key}</td><td>${prmryAttributes[key]}</td><td>${attributes[key]}</td><td><button id="popupBtn"><i class="fas fa-exclamation-triangle"></i></button></td></tr>`;
                      }
                    }
                  }
                }
              } else {
                for (var key in attributes) {
                  if (attributes.hasOwnProperty(key)) {
                    if (
                      key !== "FID" &&
                      key !== "ObjectID" &&
                      key !== "OID" &&
                      key !== "OBJECTID" &&
                      key !== "SHAPE_Leng" &&
                      key !== "Shape__Length"
                    ) {
                      rows =
                        rows +
                        `<tr><td>${key}</td><td  id="nullCol"> - </td><td>${attributes[key]}</td><td></td></tr>`;
                    }
                  }
                }
              }
            }
          }
        }

        const div = document.createElement("div");
        div.innerHTML = `<table class="styled-table">
              <thead>
              <tr><th>Name</th><th>Primary Value</th><th>Field Value</th><th></th></tr>
              </thead>
              ${rows}
              </table>`;
        return div;
      },
    });
    var comparedFeatures = [];
    const popupTemplate = {
      title: "Field Validation",
      content: [compareFeatures],
      outFields: ["*"],
      actions: [
        {
          title: "Reject",
          id: "reject-this",
          className: "btn btn-secondary",
        },
        {
          title: "Accept",
          id: "accept-this",
          className: "btn btn-primary",
        },
      ],
      overwriteActions: true,
    };

    const foundLayer = webmap.allLayers.find(function (layer) {
      return layer.title === lyrTitle;
    });
    // //for highlighting the features of found layer on map
    // let query = new Query({
    //   outFields: ["*"],
    //   where: "1=1",
    // });
    // const res = await foundLayer.queryFeatures(query);
    const prmryLyr = webmap.allLayers.find(function (layer) {
      return layer.title === getPrmryLyrTitle(lyrTitle); //have to take name dynamically
    });
    var prmryRes = await prmryLyr
      .load()
      .then(() => {
        const query = prmryLyr.createQuery();
        query.returnDistinctValues = true;
        query.where = "FID>0";
        query.outFields = ["*"];
        return prmryLyr.queryFeatures(query);
      })
      .then((response) => {
        return response;
      });
    foundLayer
      .load()
      .then(() => {
        const query = foundLayer.createQuery();
        query.returnDistinctValues = true;
        query.where = "FID>0";
        query.outFields = ["*"];
        return foundLayer.queryFeatures(query);
      })
      .then(async (res) => {
        const fieldFeatures = res.features;
        fieldFeatures.forEach((fF) => {
          let fieldAttr = fF.attributes;
          const prmryFeatures = prmryRes.features;
          var foundFeature = prmryFeatures.find((pF) => {
            let prmryAttr = pF.attributes;
            return (
              prmryAttr[getCommonFieldName(lyrTitle)] ===
              fieldAttr[getCommonFieldName(lyrTitle)]
            );
          });
          if (foundFeature) {
            let prmryAttr = foundFeature.attributes;
            var ommitedFieldAttr = _.omit(fieldAttr, [
              "FID",
              "Shape__Length",
              "SHAPE_Leng",
            ]);
            var ommitedPrmryAttr = _.omit(prmryAttr, [
              "FID",
              "Shape__Length",
              "SHAPE_Leng",
            ]);
            if (!_.isEqual(ommitedFieldAttr, ommitedPrmryAttr)) {
              comparedFeatures.push(fF);
            }
          } else {
            comparedFeatures.push(fF);
          }
        });
        // await view?.whenLayerView(foundLayer).then((layerView) => {
        //   setHighlight(layerView.highlight(comparedFeatures));
        // });
        comparedFeatures.forEach((feature) => {
          if (feature.geometry.type === "polyline") {
            const polylineSymbol = {
              type: "simple-line",
              color: [255, 255, 0, 0.5],
              width: 10,
            };
            let polylineGraphic = new Graphic({
              geometry: feature.geometry,
              symbol: polylineSymbol,
            });
            view.graphics.add(polylineGraphic);
          } else if (feature.geometry.type === "point") {
            const markerSymbol = {
              type: "simple-marker",
              color: [255, 255, 0, 0.5],
              size: 25,
            };
            let pointGraphic = new Graphic({
              geometry: feature.geometry,
              symbol: markerSymbol,
            });
            view.graphics.add(pointGraphic);
          }
        });
        featTable?.selectRows(comparedFeatures);
      });
    foundLayer.popupTemplate = popupTemplate;
  } else {
    if (webmap) {
      const foundLayer = webmap.allLayers.find(function (layer) {
        return layer.title === lyrTitle;
      });
      if (foundLayer) {
        foundLayer.popupTemplate = defaultPopupTemp;
      }
    }
    view.graphics.removeAll();
    if (featTable) {
      featTable.clearSelection();
    }
  }
};

export default fieldValidation;
