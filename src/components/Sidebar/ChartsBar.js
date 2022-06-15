import {
  faBullseye,
  faChartBar,
  faChartLine,
  faChartPie,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { chartContext } from "GlobalState";
import { getChartsByRole } from "network/ApiAxios";
import React, { useContext } from "react";
import { useQuery } from "react-query";
import Card from "reactstrap/lib/Card";
import Col from "reactstrap/lib/Col";
import ListGroup from "reactstrap/lib/ListGroup";
import ListGroupItem from "reactstrap/lib/ListGroupItem";
import Row from "reactstrap/lib/Row";

const ChartsBar = () => {
  const roleId = localStorage.getItem("role_id");
  const [chartState, chartDispatch] = useContext(chartContext);
  const { data, isSuccess } = useQuery(
    ["getChartsByRole"],
    () => getChartsByRole(roleId),
    {
      select: (getChartsByRole) => getChartsByRole.data,
    }
  );

  const iconByChartType = (type) => {
    if (type === "line") {
      return faChartLine;
    } else if (type === "bar") {
      return faChartBar;
    } else if (type === "pie") {
      return faChartPie;
    } else {
      return faChevronRight;
    }
  };

  const renderList = () => {
    if (data.charts.length > 0) {
      return data.charts.map((chart) => {
        return (
          <ListGroupItem
            key={chart.id}
            onClick={() =>
              chartDispatch({ type: "toggleFuncs", payload: chart.id })
            }
            style={
              chartState[chart.id]
                ? {
                    backgroundColor: "#b2dfdb",
                    border: "solid 1px #80cbc4",
                  }
                : {}
            }
          >
            <Row>
              <Col sm="3" xs="2">
                <FontAwesomeIcon
                  icon={iconByChartType(chart.chart_type)}
                  className="mr-5"
                />
              </Col>
              <Col sm="9" xs="10" style={{ textAlign: "start" }}>
                {chart.chart_name} 
              </Col>
            </Row>
          </ListGroupItem>
        );
      });
    }
  };
  return (
    <Card className="mt--2 pt-3">
      <Row className="text-center">
        <Col
          sm="3"
          xs="2"
          style={{ fontSize: "28px", paddingLeft: "30px" }}
          className="text-muted"
        >
          <FontAwesomeIcon icon={faBullseye} />
        </Col>
        <Col
          sm="9"
          xs="10"
          className="h3 text-muted pl-4"
          style={{ textAlign: "start" }}
        >
          Reports
        </Col>
      </Row>
      <ListGroup className="mt-3">
        {isSuccess && data.success && renderList()}
      </ListGroup>
    </Card>
  );
};

export default ChartsBar;
