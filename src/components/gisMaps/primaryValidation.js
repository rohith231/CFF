import CustomContent from "@arcgis/core/popup/content/CustomContent";
import Graphic from "@arcgis/core/Graphic";

const primaryValidation = async (
  primaryValidation,
  webmap,
  lyrTitle,
  view,
  defaultPopupTemp,
  featTable
) => {
  debugger
  if (primaryValidation) {
    const foundLayer = webmap.allLayers.find(function (layer) {
      return layer.title === lyrTitle;
    });

    const queryNullFeatures = new CustomContent({
      outFields: ["*"],
      creator: async (feature) => {
        var rows = "";
        if (feature) {
          if (feature.graphic.attributes) {
            var attributes = feature.graphic.attributes;
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
                  if (attributes[key] === null) {
                    rows =
                      rows +
                      `<tr class="diff-row"><td>${key}</td><td>${attributes[key]}</td><td><button id="popupBtn"><i class="fas fa-exclamation-triangle"></i></button></td></tr>`;
                  } else {
                    rows =
                      rows +
                      `<tr><td>${key}</td><td>${attributes[key]}</td><td></td></tr>`;
                  }
                }
              }
            }
          }
        }
        const div = document.createElement("div");
        div.innerHTML = `<table class="styled-table">
              <thead>
              <tr><th>Name</th><th>Value</th><th></th></tr>
              </thead>
              ${rows}
              </table>`;
        return div;
      },
    });

    let nullQuery = "";
    await foundLayer.fields.forEach((field, index) => {
      if (foundLayer.fields.length - 1 === index) {
        nullQuery = nullQuery + `${field.name} is null `;
      } else {
        nullQuery = nullQuery + `${field.name} is null or `;
      }
    });
    await foundLayer
      .load()
      .then(() => {
        const query = foundLayer.createQuery();
        query.returnDistinctValues = true;
        query.where = nullQuery;
        query.outFields = ["*"];
        return foundLayer.queryFeatures(query);
      })
      .then(async (response) => {
        const { features } = response;
        features.forEach((feature) => {
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

        featTable.selectRows(features);
      });

    const popupTemplate = {
      title: "Primary Validation",
      content: [queryNullFeatures],
      outFields: ["*"],
      overwriteActions: true,
    };
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

export default primaryValidation;
