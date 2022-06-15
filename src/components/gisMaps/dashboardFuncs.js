import LayerList from "@arcgis/core/widgets/LayerList";
import Search from "@arcgis/core/widgets/Search";
import Compass from "@arcgis/core/widgets/Compass";
import Locate from "@arcgis/core/widgets/Locate";
import Directions from "@arcgis/core/widgets/Directions";
import Home from "@arcgis/core/widgets/Home";

const dashboardFuncs = (
  view,
  setLayerList,
  setSearch,
  setCompass,
  setLocate,
  setDirections,
  setHome
) => {
  const compassWidget = new Compass({
    view: view,
  });
  setCompass(compassWidget);

  const layerListWidget = new LayerList({
    view: view,
  });
  setLayerList(layerListWidget);

  const searchWidget = new Search({
    view: view,
  });
  setSearch(searchWidget);

  const locateWidget = new Locate({
    view: view,
  });
  setLocate(locateWidget);

  const directionsWidget = new Directions({
    view: view,
  });
  setDirections(directionsWidget);

  const homeWidget = new Home({
    view: view,
  });
  setHome(homeWidget);
};

export default dashboardFuncs;
