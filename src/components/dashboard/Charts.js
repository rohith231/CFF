import { chartContext } from "GlobalState";
import { getChartsByRole } from "network/ApiAxios";
import React, { useContext } from "react";
import { useQuery } from "react-query";
import Card from "reactstrap/lib/Card";
import Col from "reactstrap/lib/Col";
import Container from "reactstrap/lib/Container";
import Row from "reactstrap/lib/Row";
import { Pie } from "recharts";
import { BarChart } from "recharts";
import { Bar } from "recharts";
import { PieChart } from "recharts";
import { ResponsiveContainer } from "recharts";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const Charts = () => {
  const roleId = localStorage.getItem("role_id");
  const [chartState] = useContext(chartContext);
  const { data } = useQuery(
    ["getChartsByRole"],
    () => getChartsByRole(roleId),
    {
      select: (getChartsByRole) => getChartsByRole.data,
    }
  );
  const renderChart = (chart) => {
    if (chart) {
      if (chart.chart_type === "bar") {
        return (
          <div style={{ width: "100%", height: 300 }} className="mt-3 ml--2">
            <ResponsiveContainer>
              <BarChart
                width={500}
                height={300}
                data={chart.data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={chart.x} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={chart.y} fill="#4db6ac" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      } else if (chart.chart_type === "line") {
        return (
          <div style={{ width: "100%", height: 300 }} className="mt-3 ml--2">
            <ResponsiveContainer>
              <LineChart
                width={500}
                height={400}
                data={chart.data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={chart.x} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey={chart.y}
                  stroke="#4db6ac"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      } else if (chart.chart_type === "pie") {
        return (
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Tooltip />
                <Legend />
                <Pie
                  dataKey={chart.y}
                  nameKey={chart.x}
                  data={chart.data}
                  fill="#4db6ac"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      }
    }
  };
  const renderCharts = () => {
    if (data) {
      if (data.charts) {
        if (data.charts.length > 0) {
          return data.charts.map((chart) => {
            if (chartState[chart.id]) {
              return (
                <Col key={chart.id} md="6">
                  <Card style={{ borderColor: "#b2dfdb" }}>
                    {renderChart(chart)}
                  </Card>
                </Col>
              );
            } else {
              return null;
            }
          });
        }
      }
    }
  };

  return (
    <Container fluid className="mt-5">
      <Row>{renderCharts()}</Row>
    </Container>
  );
};

export default Charts;
