import { createChart } from "network/ApiAxios";
import { getExtData } from "network/ApiAxios";
import React, { useState } from "react";
import { useMutation } from "react-query";
import Button from "reactstrap/lib/Button";
import Col from "reactstrap/lib/Col";
import Container from "reactstrap/lib/Container";
import FormGroup from "reactstrap/lib/FormGroup";
import Input from "reactstrap/lib/Input";
import InputGroup from "reactstrap/lib/InputGroup";
import Label from "reactstrap/lib/Label";
import Row from "reactstrap/lib/Row";
import DisplayChart from "./DisplayChart";

const External = () => {
  const [webUrl, setWebUrl] = useState("");
  const [error, setError] = useState("");
  const [chartName, setChartName] = useState("");
  const [data, setData] = useState(null);
  const [xAxis, setXAxis] = useState(null);
  const [yAxis, setYAxis] = useState(null);
  const [selectedChart, setSelectedChart] = useState(null);
  const mutation = useMutation(createChart);
  const onAddClick = async () => {
    if (webUrl) {
      try {
        const res = await getExtData(webUrl);
        if (res) {
          setData(res.data);
          setError("");
        }
      } catch (error) {
        setError("invalid Url");
        setData(null);
      }
    } else {
      setError("make sure to fill the input");
    }
  };

  const onSetClick = () => {
    if (
      xAxis &&
      yAxis &&
      data.details &&
      selectedChart &&
      webUrl &&
      chartName
    ) {
      mutation.mutate(
        {
          chartType: selectedChart,
          data: JSON.stringify(data.details),
          x: xAxis,
          y: yAxis,
          url: webUrl,
          chartName,
        },
        {
          onSuccess: (response) => {
            const { data } = response;
            if (!data.success) {
              setError(data.msg);
              return;
            }
            setError("");
            setXAxis(null);
            setYAxis(null);
            setData(null);
            setSelectedChart(null);
            setWebUrl("");
            setChartName("");
          },
        }
      );
    } else {
      setError("make sure to fill all the inputs");
    }
  };

  const renderContent = () => {
    if (webUrl) {
      if (data) {
        if (data.details) {
          return (
            <div>
              <div
                onChange={(e) => {
                  setSelectedChart(e.target.value);
                }}
                className="mt-5"
              >
                <Row>
                  <Col>
                    <FormGroup check>
                      <Input name="radio1" type="radio" value="line" />
                      <Label check>Line chart</Label>
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup check>
                      <Input name="radio1" type="radio" value="bar" />
                      <Label check>Bar chart</Label>
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup check>
                      <Input name="radio1" type="radio" value="pie" />
                      <Label check>Pie chart</Label>
                    </FormGroup>
                  </Col>
                </Row>
              </div>
              <div className="mt-5">
                <DisplayChart
                  selectedChart={selectedChart}
                  data={data}
                  xAxis={xAxis}
                  yAxis={yAxis}
                  setXAxis={setXAxis}
                  setYAxis={setYAxis}
                  setChartName={setChartName}
                  chartName={chartName}
                />
              </div>
            </div>
          );
        } else {
          return (
            <>
              <p>Not structured in required way</p>
            </>
          );
        }
      }
    }
  };

  return (
    <Container fluid>
      <InputGroup>
        <Input
          placeholder="web service url"
          type="text"
          value={webUrl}
          onChange={(e) => {
            setWebUrl(e.target.value);
          }}
        />
        <Button color="primary" onClick={onAddClick}>
          add
        </Button>
      </InputGroup>
      {renderContent()}
      <FormGroup>
        {error ? (
          <div className="text-muted font-italic">
            <small>
              error: <span className="text-red font-weight-700">{error}</span>
            </small>
          </div>
        ) : null}
      </FormGroup>
      <FormGroup style={{ textAlign: "center" }} className="mt-3">
        <Button color="primary" onClick={onSetClick}>
          SET
        </Button>
      </FormGroup>
    </Container>
  );
};

export default External;
