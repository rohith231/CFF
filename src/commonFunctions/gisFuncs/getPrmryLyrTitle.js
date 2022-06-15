const getPrmryLyrTitle = (lyrTitle) => {
  if (lyrTitle === "primary_conductor_field1") {
    return "primary_conductor1";
  } else if (lyrTitle === "service_location_field1") {
    return "service_location1";
  } else if (lyrTitle === "support_structure_field1") {
    return "support_structure1";
  } else if (lyrTitle === "ghostpoint_field1") {
    return "ghostpoint1";
  } else if (lyrTitle === "secondary_conductor_field1") {
    return "secondary_conductor1";
  } else if (lyrTitle === "span_field1") {
    return "span1";
  } else if (lyrTitle === "station_field1") {
    return "station1";
  } else if (lyrTitle === "surface_structure_field1") {
    return "surface_structure1";
  } else {
    return null;
  }
};

export default getPrmryLyrTitle;
