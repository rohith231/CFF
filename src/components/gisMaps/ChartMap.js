import React, { useRef, useEffect, useState } from "react";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import FeatureTable from "@arcgis/core/widgets/FeatureTable";
import * as watchUtils from "@arcgis/core/core/watchUtils.js";
import * as promiseUtils from "@arcgis/core/core/promiseUtils";
import { Chart } from "chart.js";
import "./chartMap.css";
import Container from "reactstrap/lib/Container";
import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";
import Card from "reactstrap/lib/Card";
import Header from "components/Headers/Header";
const ChartMap = () => {
  const mapDiv = useRef(null);
  const tableDiv = useRef();
  const [webmap, setWebmap] = useState();
  const [view, setView] = useState();
  const [selectedFeature, setSelectedFeature] = useState();
  const [id, setId] = useState();

  let yearChart,
    ageChart,
    dispositionChart,
    genderChart,
    raceChart,
    totalNumber,
    avgAge,
    avgOpenTime;
  const features = [];
  //   useEffect(() => {
  //     const runAsync = async () => {
  //       const response = await getActiveWebmap();
  //       if (response.data.success) {
  //         setData(response.data.webmap);
  //       }
  //     };
  //     runAsync();
  //   }, []);
  useEffect(() => {
    if (mapDiv.current) {
      const webmap = new WebMap({
        portalItem: {
          id: "96cf806c32874026bef5f586315f098c",
        },
      });
      const view = new MapView({
        container: mapDiv.current,
        map: webmap,
        // zoom: 3,
        // center: [-98, 38.5],
        constraints: {
          minScale: 300000,
        },
        highlightOptions: {
          color: "black",
          haloOpacity: 0.65,
          fillOpacity: 0.45,
        },
      });
      setWebmap(webmap);
      setView(view);
    }
  }, []);
  useEffect(() => {
    const whenViewLoad = async () => {
      const loadedView = await view?.when();
      if (loadedView) {
        const featureLayer = webmap.findLayerById("homicide_wp_time_8111");
        featureLayer.title = "Homicides by status";
        featureLayer.outFields = ["*"];
        const featureTable = new FeatureTable({
          view: view,
          layer: featureLayer,
          attachmentsEnabled: true,
          // editingEnabled: true,
          fieldConfigs: [
            { name: "city", label: "city" },
            { name: "state", label: "state" },
            { name: "victim_first", label: "victim_first" },
          ],
          container: tableDiv.current,
        });
        featureTable.on("selection-change", (changes) => {
          // If row is unselected in table, remove it from the features array
          changes.removed.forEach((item) => {
            const data = features.find((data) => {
              return data.feature === item.feature;
            });
          });

          // If a row is selected, add to the features array
          changes.added.forEach((item) => {
            const feature = item.feature;
            features.push({
              feature: feature,
            });

            // Listen for row selection in the feature table. If the popup is open and a row is selected that is not the same feature as opened popup, close the existing popup.
            if (
              feature.attributes.OBJECTID !== id &&
              view.popup.visible === true
            ) {
              featureTable.deselectRows(selectedFeature);
              view.popup.close();
            }
          });
        });
        watchUtils.watch(view.popup.viewModel, "active", (graphic) => {
          // selectedFeature = view.popup.selectedFeature;
          setSelectedFeature(view.popup.selectedFeature);
          if (selectedFeature !== null && view.popup.visible !== false) {
            featureTable.clearSelection();
            featureTable.selectRows(view.popup.selectedFeature);
            setId(selectedFeature?.getObjectId());
            // id = selectedFeature.getObjectId();
          }
        });
      }
    };
    whenViewLoad();
  }, [view]);

  var queryStatsOnDrag = promiseUtils.debounce(function (layerView, event) {
    // create a query object for the highlight and the statistics query

    const query = layerView.layer.createQuery();
    query.geometry = view.toMap(event); // converts the screen point to a map point
    query.distance = 1; // queries all features within 1 mile of the point
    query.units = "miles";

    const statsQuery = query.clone();

    // date used to calculate the average time a case has been opened

    const dataDownloadDate = Date.UTC(2018, 6, 5);

    // Create the statistic definitions for querying stats from the layer view
    // the `onStatisticField` property can reference a field name or a SQL expression
    // `outStatisticFieldName` is the name of the statistic you will reference in the result
    // `statisticType` can be sum, avg, min, max, count, stddev
    const statDefinitions = [
      // Age of crime since it was reported in years

      {
        onStatisticField:
          "(" +
          dataDownloadDate +
          " - milliseconds) / (1000 * 60 * 60 * 24 * 365.25)",
        outStatisticFieldName: "avg_open_time_years",
        statisticType: "avg",
      },

      // total homicides

      {
        onStatisticField: "1",
        outStatisticFieldName: "total",
        statisticType: "count",
      },

      // total homicides by year
      //
      // Since separate fields don't exist for each year, we can use
      // an expression to return a 1 or a 0 for each year and sum up the
      // results to get the total.

      {
        onStatisticField: "CASE WHEN reported_year = 2008 THEN 1 ELSE 0 END",
        outStatisticFieldName: "total_2008",
        statisticType: "sum",
      },
      {
        onStatisticField: "CASE WHEN reported_year = 2009 THEN 1 ELSE 0 END",
        outStatisticFieldName: "total_2009",
        statisticType: "sum",
      },
      {
        onStatisticField: "CASE WHEN reported_year = 2010 THEN 1 ELSE 0 END",
        outStatisticFieldName: "total_2010",
        statisticType: "sum",
      },
      {
        onStatisticField: "CASE WHEN reported_year = 2011 THEN 1 ELSE 0 END",
        outStatisticFieldName: "total_2011",
        statisticType: "sum",
      },
      {
        onStatisticField: "CASE WHEN reported_year = 2012 THEN 1 ELSE 0 END",
        outStatisticFieldName: "total_2012",
        statisticType: "sum",
      },
      {
        onStatisticField: "CASE WHEN reported_year = 2013 THEN 1 ELSE 0 END",
        outStatisticFieldName: "total_2013",
        statisticType: "sum",
      },
      {
        onStatisticField: "CASE WHEN reported_year = 2014 THEN 1 ELSE 0 END",
        outStatisticFieldName: "total_2014",
        statisticType: "sum",
      },
      {
        onStatisticField: "CASE WHEN reported_year = 2015 THEN 1 ELSE 0 END",
        outStatisticFieldName: "total_2015",
        statisticType: "sum",
      },
      {
        onStatisticField: "CASE WHEN reported_year = 2016 THEN 1 ELSE 0 END",
        outStatisticFieldName: "total_2016",
        statisticType: "sum",
      },
      {
        onStatisticField: "CASE WHEN reported_year = 2017 THEN 1 ELSE 0 END",
        outStatisticFieldName: "total_2017",
        statisticType: "sum",
      },

      // crime disposition (aka crime statu)
      //
      // Since this is a string field, we can use a similar technique to sum
      // the total of each status of the crime

      {
        onStatisticField:
          "CASE WHEN disposition = 'Closed by arrest' THEN 1 ELSE 0 END",
        outStatisticFieldName: "num_closed_arrest",
        statisticType: "sum",
      },
      {
        onStatisticField:
          "CASE WHEN disposition = 'Open/No arrest' THEN 1 ELSE 0 END",
        outStatisticFieldName: "num_open",
        statisticType: "sum",
      },
      {
        onStatisticField:
          "CASE WHEN disposition = 'Closed without arrest' THEN 1 ELSE 0 END",
        outStatisticFieldName: "num_closed_no_arrest",
        statisticType: "sum",
      },

      // average victim age
      //
      // Some victim ages are unknown and indicated with a -99. We'll
      // use an expression to treat those unknown ages as 0. This will
      // skew the average age slightly downward since we can't exclude those
      // values without a where clause. Do use a where clause, we could execute
      // a separate query

      {
        onStatisticField:
          "CASE WHEN victim_age_years = -99 THEN 0 ELSE victim_age_years END",
        outStatisticFieldName: "avg_age",
        statisticType: "avg",
      },

      // victim age brackets

      {
        onStatisticField: "CASE WHEN victim_age_years = -99 THEN 1 ELSE 0 END",
        outStatisticFieldName: "age_unknown",
        statisticType: "sum",
      },
      {
        onStatisticField:
          "CASE WHEN victim_age_years >= 0 AND victim_age_years <= 18 THEN 1 ELSE 0 END",
        outStatisticFieldName: "age_18_under",
        statisticType: "sum",
      },
      {
        onStatisticField:
          "CASE WHEN victim_age_years >= 19 AND victim_age_years <= 30 THEN 1 ELSE 0 END",
        outStatisticFieldName: "age_19_30",
        statisticType: "sum",
      },
      {
        onStatisticField:
          "CASE WHEN victim_age_years >= 31 AND victim_age_years <= 44 THEN 1 ELSE 0 END",
        outStatisticFieldName: "age_31_44",
        statisticType: "sum",
      },
      {
        onStatisticField:
          "CASE WHEN victim_age_years >= 45 AND victim_age_years <= 65 THEN 1 ELSE 0 END",
        outStatisticFieldName: "age_45_64",
        statisticType: "sum",
      },
      {
        onStatisticField: "CASE WHEN victim_age_years >= 65 THEN 1 ELSE 0 END",
        outStatisticFieldName: "age_65_over",
        statisticType: "sum",
      },

      // victim gender

      {
        onStatisticField: "CASE WHEN victim_sex = 'Male' THEN 1 ELSE 0 END",
        outStatisticFieldName: "num_males",
        statisticType: "sum",
      },
      {
        onStatisticField: "CASE WHEN victim_sex = 'Female' THEN 1 ELSE 0 END",
        outStatisticFieldName: "num_females",
        statisticType: "sum",
      },
      {
        onStatisticField: "CASE WHEN victim_sex = 'Unknown' THEN 1 ELSE 0 END",
        outStatisticFieldName: "num_unknown_gender",
        statisticType: "sum",
      },

      // victim race

      {
        onStatisticField: "CASE WHEN victim_race = 'Asian' THEN 1 ELSE 0 END",
        outStatisticFieldName: "num_asian",
        statisticType: "sum",
      },
      {
        onStatisticField: "CASE WHEN victim_race = 'Black' THEN 1 ELSE 0 END",
        outStatisticFieldName: "num_black",
        statisticType: "sum",
      },
      {
        onStatisticField:
          "CASE WHEN victim_race = 'Hispanic' THEN 1 ELSE 0 END",
        outStatisticFieldName: "num_hispanic",
        statisticType: "sum",
      },
      {
        onStatisticField: "CASE WHEN victim_race = 'White' THEN 1 ELSE 0 END",
        outStatisticFieldName: "num_white",
        statisticType: "sum",
      },
    ];

    // add the stat definitions to the the statistics query object cloned earlier
    statsQuery.outStatistics = statDefinitions;

    // execute the query for all features in the layer view
    const allStatsResponse = layerView.queryFeatures(statsQuery).then(
      function (response) {
        const stats = response.features[0].attributes;
        return stats;
      },
      function (e) {
        console.error(e);
      }
    );

    const openStatsQuery = statsQuery.clone();
    openStatsQuery.where = "disposition = 'Open/No arrest'";

    // execute the query for only unsolved homicides in the layer view
    const unsolvedStatsResponse = layerView.queryFeatures(openStatsQuery).then(
      function (response) {
        const stats = response.features[0].attributes;
        return stats;
      },
      function (e) {
        console.error(e);
      }
    );

    // highlight all features within the query distance
    layerView.queryObjectIds(query).then(function (ids) {
      if (highlightHandle) {
        highlightHandle.remove();
        highlightHandle = null;
      }
      highlightHandle = layerView.highlight(ids);
    });

    // Return the promises that will resolve to each set of statistics
    return promiseUtils.eachAlways([allStatsResponse, unsolvedStatsResponse]);
  });

  function updateCharts(responses) {
    const allStats = responses[0].value;
    const unsolvedStats = responses[1].value;

    const yearChartStats = {
      solved: [
        allStats.total_2008 - unsolvedStats.total_2008,
        allStats.total_2009 - unsolvedStats.total_2009,
        allStats.total_2010 - unsolvedStats.total_2010,
        allStats.total_2011 - unsolvedStats.total_2011,
        allStats.total_2012 - unsolvedStats.total_2012,
        allStats.total_2013 - unsolvedStats.total_2013,
        allStats.total_2014 - unsolvedStats.total_2014,
        allStats.total_2015 - unsolvedStats.total_2015,
        allStats.total_2016 - unsolvedStats.total_2016,
        allStats.total_2017 - unsolvedStats.total_2017,
      ],
      unsolved: [
        unsolvedStats.total_2008,
        unsolvedStats.total_2009,
        unsolvedStats.total_2010,
        unsolvedStats.total_2011,
        unsolvedStats.total_2012,
        unsolvedStats.total_2013,
        unsolvedStats.total_2014,
        unsolvedStats.total_2015,
        unsolvedStats.total_2016,
        unsolvedStats.total_2017,
      ],
    };
    updateChart(yearChart, yearChartStats);

    const ageChartStats = {
      solved: [
        allStats.age_65_over - unsolvedStats.age_65_over,
        allStats.age_45_64 - unsolvedStats.age_45_64,
        allStats.age_31_44 - unsolvedStats.age_31_44,
        allStats.age_19_30 - unsolvedStats.age_19_30,
        allStats.age_18_under - unsolvedStats.age_18_under,
        allStats.age_unknown - unsolvedStats.age_unknown,
      ],
      unsolved: [
        unsolvedStats.age_65_over,
        unsolvedStats.age_45_64,
        unsolvedStats.age_31_44,
        unsolvedStats.age_19_30,
        unsolvedStats.age_18_under,
        unsolvedStats.age_unknown,
      ],
    };
    updateChart(ageChart, ageChartStats);

    const dispositionStats = [
      allStats.num_closed_arrest,
      allStats.num_closed_no_arrest,
      allStats.num_open,
    ];
    updateChart(dispositionChart, dispositionStats);

    const genderStats = [
      allStats.num_males - unsolvedStats.num_males,
      unsolvedStats.num_males,
      allStats.num_females - unsolvedStats.num_females,
      unsolvedStats.num_females,
    ];
    updateChart(genderChart, genderStats);

    const raceStats = [
      allStats.num_asian - unsolvedStats.num_asian,
      unsolvedStats.num_asian,
      allStats.num_black - unsolvedStats.num_black,
      unsolvedStats.num_black,
      allStats.num_hispanic - unsolvedStats.num_hispanic,
      unsolvedStats.num_hispanic,
      allStats.num_white - unsolvedStats.num_white,
      unsolvedStats.num_white,
    ];
    updateChart(raceChart, raceStats);

    // Update the total numbers in the title UI element
    avgAge.innerHTML = Math.round(allStats.avg_age);
    totalNumber.innerHTML = allStats.total;
    avgOpenTime.innerHTML = unsolvedStats.avg_open_time_years.toFixed(1);
  }

  function updateChart(chart, dataValues) {
    if (chart.config.type === "doughnut") {
      chart.data.datasets[0].data = dataValues;
    } else {
      chart.data.datasets[0].data = dataValues.solved;
      chart.data.datasets[1].data = dataValues.unsolved;
    }
    chart.update();
  }

  /**
   * Creates 5 charts for summarizing homicide data
   */
  function createCharts() {
    totalNumber = document.getElementById("num-homicides");
    avgAge = document.getElementById("avg-age");
    avgOpenTime = document.getElementById("avg-open-time");

    const yearCanvas = document.getElementById("year-chart");
    yearChart = new Chart(yearCanvas.getContext("2d"), {
      type: "bar",
      data: {
        labels: [
          "2008",
          "2009",
          "2010",
          "2011",
          "2012",
          "2013",
          "2014",
          "2015",
          "2016",
          "2017",
        ],
        datasets: [
          {
            label: "Solved by 2017",
            backgroundColor: "#149dcf",
            stack: "Stack 0",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          },
          {
            label: "Remains unsolved",
            backgroundColor: "#ed5050",
            stack: "Stack 0",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          },
        ],
      },
      options: {
        responsive: false,
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Homicides by year",
        },
        scales: {
          xAxes: [
            {
              stacked: true,
            },
          ],
          yAxes: [
            {
              stacked: true,
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });

    const ageCanvas = document.getElementById("age-chart");
    ageChart = new Chart(ageCanvas.getContext("2d"), {
      type: "horizontalBar",
      data: {
        labels: ["65+", "45-64", "31-44", "18-30", "0-18", "Not sure"],
        datasets: [
          {
            label: "Solved by 2017",
            backgroundColor: "#149dcf",
            stack: "Stack 0",
            data: [0, 0, 0, 0, 0, 0],
          },
          {
            label: "Remains unsolved",
            backgroundColor: "#ed5050",
            stack: "Stack 0",
            data: [0, 0, 0, 0, 0, 0],
          },
        ],
      },
      options: {
        responsive: false,
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Homicides by age",
        },
        scales: {
          xAxes: [
            {
              stacked: true,
              ticks: {
                beginAtZero: true,
              },
            },
          ],
          yAxes: [
            {
              stacked: true,
            },
          ],
        },
      },
    });

    const dispositionCanvas = document.getElementById("disposition-chart");
    dispositionChart = new Chart(dispositionCanvas.getContext("2d"), {
      type: "doughnut",
      data: {
        labels: ["Closed by arrest", "Closed without arrest", "Open/No arrest"],
        datasets: [
          {
            backgroundColor: ["#149dcf", "#a6c736", "#ed5050"],
            borderColor: "rgb(255, 255, 255)",
            borderWidth: 1,
            data: [0, 0, 0],
          },
        ],
      },
      options: {
        responsive: false,
        cutoutPercentage: 35,
        legend: {
          position: "bottom",
        },
        title: {
          display: true,
          text: "Status of the case",
        },
      },
    });

    const genderCanvas = document.getElementById("gender-chart");
    genderChart = new Chart(genderCanvas.getContext("2d"), {
      type: "doughnut",
      data: {
        labels: [
          "Male (solved)",
          "Male (unsolved)",
          "Female (solved)",
          "Female (unsolved)",
        ],
        datasets: [
          {
            backgroundColor: ["#149dcf", "#0a4d66", "#ed5050", "#7c2525"],
            borderColor: "rgb(255, 255, 255)",
            borderWidth: 1,
            data: [0, 0, 0, 0],
          },
        ],
      },
      options: {
        responsive: false,
        cutoutPercentage: 35,
        legend: {
          position: "bottom",
        },
        title: {
          display: true,
          text: "Gender of the victim",
        },
      },
    });

    const raceCanvas = document.getElementById("race-chart");
    raceChart = new Chart(raceCanvas.getContext("2d"), {
      type: "doughnut",
      data: {
        labels: [
          "Asian (solved)",
          "Asian (unsolved)",
          "Black (solved)",
          "Black (unsolved)",
          "Hispanic (solved)",
          "Hispanic (unsolved)",
          "White (solved)",
          "White (unsolved)",
        ],
        datasets: [
          {
            backgroundColor: [
              "#ed5050",
              "#7c2525",
              "#149dcf",
              "#0a4d66",
              "#a6c736",
              "#52631a",
              "#fc9220",
              "#7c470d",
            ],
            borderColor: "rgb(255, 255, 255)",
            borderWidth: 1,
            data: [0, 0, 0, 0, 0, 0, 0, 0],
          },
        ],
      },
      options: {
        responsive: false,
        cutoutPercentage: 35,
        legend: {
          position: "bottom",
        },
        title: {
          display: true,
          text: "Race of the victim",
        },
      },
    });
  }
  let highlightHandle = null;
  view?.when().then(function () {
    // Create the charts when the view is ready
    createCharts();

    const layer = webmap.layers.getItemAt(0);
    layer.outFields = [
      "victim_age_years",
      "victim_race",
      "victim_sex",
      "reported_year",
      "disposition",
      "milliseconds",
    ];

    view.whenLayerView(layer).then(function (layerView) {
      watchUtils.whenFalseOnce(layerView, "updating", function (val) {
        // Query layer view statistics as the user clicks
        // or drags the pointer across the view.
        view.on(["click", "drag"], function (event) {
          // disables navigation by pointer drag
          event.stopPropagation();
          queryStatsOnDrag(layerView, event)
            .then(updateCharts)
            .catch(function (error) {
              if (error.name !== "AbortError") {
                console.error(error);
              }
            });
        });
      });
    });
  });

  return (
    <>
      <Header />
      <Container className="mt-5" fluid>
        <Row>
          <Col className="mb-5 " xl="12">
            <Card className="shadow" style={{ height: "800px" }}>
              <div
                id="viewDiv"
                // style={{ padding: 0, margin: 0, height: "500px", width: "100%" }}
                ref={mapDiv}
              ></div>
              <div id="panel">
                <div style={{ padding: "15px" }}>
                  <canvas id="year-chart" height="250" width="550"></canvas>
                  <canvas id="age-chart" height="250" width="550"></canvas>
                  <canvas
                    id="disposition-chart"
                    width="200"
                    height="350"
                    style={{ float: "left" }}
                  ></canvas>
                  <canvas
                    id="gender-chart"
                    width="200"
                    height="350"
                    style={{ float: "left" }}
                  ></canvas>
                  <canvas
                    id="race-chart"
                    width="200"
                    height="350"
                    style={{ float: "left" }}
                  ></canvas>
                </div>
              </div>
              <div
                ref={tableDiv}
                style={{
                  width: "100%",
                  height: "400px",
                }}
              ></div>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ChartMap;
