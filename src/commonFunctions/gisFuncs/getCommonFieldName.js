const getCommonFieldName = (lyrTitle) => {
  if (lyrTitle === "primary_conductor_field1") {
    return "PrimaryCon";
  } else if (lyrTitle === "service_location_field1") {
    return "ServiceLoc";
  } else if (lyrTitle === "support_structure_field1") {
    return "SupportStr";
  } else if (lyrTitle === "ghostpoint_field1") {
    return "GhostPoint";
  } else if (lyrTitle === "secondary_conductor_field1") {
    return "SecondaryC";
  } else if (lyrTitle === "span_field1") {
    return "SpanGUID";
  } else if (lyrTitle === "station_field1") {
    return "StationGUI";
  } else if (lyrTitle === "surface_structure_field1") {
    return "MapNumber";
  } else {
    return null;
  }
};

export default getCommonFieldName;
