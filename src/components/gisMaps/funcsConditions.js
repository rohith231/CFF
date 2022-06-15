const funcsConditions = (
  view,
  state,
  layerList,
  search,
  compass,
  locate,
  directions,
  home
) => {
  view?.when(() => {
    //layerList
    if (state.layerList === true) {
      view.ui.add(layerList, "top-left");
    } else if (state.layerList === false) {
      view.ui.remove(layerList);
    }
    //compass
    if (state.compass === true) {
      view.ui.add(compass, "top-left");
    } else if (state.compass === false) {
      view.ui.remove(compass);
    }
    //search
    if (state.search === true) {
      view.ui.add(search, "top-right");
    } else if (state.search === false) {
      view.ui.remove(search);
    }
    //locate
    if (state.locate === true) {
      view.ui.add(locate, "top-left");
    } else if (state.locate === false) {
      view.ui.remove(locate);
    }
    //directions
    if (state.directions === true) {
      view.ui.add(directions, "top-right");
    } else if (state.directions === false) {
      view.ui.remove(directions);
    }
    //home
    if (state.home === true) {
      view.ui.add(home, "top-left");
    } else if (state.home === false) {
      view.ui.remove(home);
    }
  });
};

export default funcsConditions;
