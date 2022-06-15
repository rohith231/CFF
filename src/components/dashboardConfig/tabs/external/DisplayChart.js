import React, { useState } from "react";
import Col from "reactstrap/lib/Col";
import FormGroup from "reactstrap/lib/FormGroup";
import Input from "reactstrap/lib/Input";
import Label from "reactstrap/lib/Label";
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
import AxisDropdown from "./AxisDropdown";

const DisplayChart = (props) => {
  const renderSelectedChart = () => {
    const axisPanel = () => {
      return (
        <>
          <FormGroup inline check>
            <Label>x-axis:</Label>
            <AxisDropdown
              options={props.data?.details[0]}
              setAxis={props.setXAxis}
            />
          </FormGroup>
          <FormGroup inline check>
            <Label>y-axis:</Label>
            <AxisDropdown
              options={props.data?.details[0]}
              setAxis={props.setYAxis}
            />
          </FormGroup>
          <FormGroup className="mt-3">
            <Input
              placeholder="chart name"
              value={props.chartName}
              onChange={(e) => {
                props.setChartName(e.target.value);
              }}
            />
          </FormGroup>
        </>
      );
    };
    if (props.selectedChart === "line") {
      return (
        <Row>
          <Col md="8">
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <LineChart
                  width={500}
                  height={400}
                  data={props.data?.details}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={props.xAxis} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey={props.yAxis}
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Col>
          <Col md="4">{axisPanel()}</Col>
        </Row>
      );
    } else if (props.selectedChart === "bar") {
      return (
        <Row>
          <Col md="8">
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart
                  width={500}
                  height={300}
                  data={props.data?.details}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={props.xAxis} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey={props.yAxis} fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Col>
          <Col md="4">{axisPanel()}</Col>
        </Row>
      );
    } else if (props.selectedChart === "pie") {
      return (
        <Row>
          <Col md="8">
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Tooltip />
                  <Legend />
                  <Pie
                    dataKey={props.yAxis}
                    nameKey={props.xAxis}
                    data={props.data?.details}
                    fill="#8884d8"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Col>
          <Col md="4">
            <FormGroup inline check>
              <Label>label:</Label>
              <AxisDropdown
                options={props.data?.details[0]}
                setAxis={props.setXAxis}
              />
            </FormGroup>
            <FormGroup inline check>
              <Label>value:</Label>
              <AxisDropdown
                options={props.data?.details[0]}
                setAxis={props.setYAxis}
              />
            </FormGroup>
            <FormGroup className="mt-3">
              <Input
                placeholder="chart name"
                value={props.chartName}
                onChange={(e) => {
                  props.setChartName(e.target.value);
                }}
              />
            </FormGroup>
          </Col>
        </Row>
      );
    }
  };
  return <div>{renderSelectedChart()}</div>;
};

export default DisplayChart;
