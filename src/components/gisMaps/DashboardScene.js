import React, { useRef, useEffect, useState, useContext } from "react";
import WebScene from "@arcgis/core/WebScene";
import SceneView from "@arcgis/core/views/SceneView";
import { funcContext } from "GlobalState";
import funcsConditions from "./funcsConditions";
import dashboardFuncs from "./dashboardFuncs";

const DashboardScene = (props) => {
  const [layerList, setLayerList] = useState();
  const [compass, setCompass] = useState();
  const [locate, setLocate] = useState();
  const [search, setSearch] = useState();
  const [directions, setDirections] = useState();
  const [home, setHome] = useState();
  const [state] = useContext(funcContext);
  const [view, setView] = useState();
  const mapDiv = useRef(null);
  useEffect(() => {
    const scene = new WebScene({
      portalItem: {
        id: props.piId,
      },
    });

    const tempView = new SceneView({
      map: scene,
      container: mapDiv.current,
    });
    setView(tempView);
  }, [props.piId]);

  useEffect(() => {
    view?.when(() => {
      dashboardFuncs(
        view,
        setLayerList,
        setSearch,
        setCompass,
        setLocate,
        setDirections,
        setHome
      );
    });
  }, [view]);
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
    <div>
      <div
        ref={mapDiv}
        className="esri-widget"
        style={{ padding: 0, margin: 0, height: "500px", width: "100%" }}
      ></div>
    </div>
  );
};

export default DashboardScene;
