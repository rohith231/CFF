import { getChartsByRole } from "network/ApiAxios";
import { getAllCharts } from "network/ApiAxios";
import React, { useEffect, useState } from "react";
import Card from "reactstrap/lib/Card";
import CardHeader from "reactstrap/lib/CardHeader";
import FormGroup from "reactstrap/lib/FormGroup";
import Input from "reactstrap/lib/Input";
import Table from "reactstrap/lib/Table";

const ChartsTable = (props) => {
  const [charts, setCharts] = useState([]);

  useEffect(() => {
    const runAsync = async () => {
      const res = await getAllCharts();
      if (res.data) {
        if (res.data.success) {
          setCharts(res.data.charts);
          // const temp = {};
          // res.data.charts.forEach((chart) => {
          //   temp[chart.id] = false;
          // });
          // props.setPermittedFunc(temp);
        }
      }
    };
    runAsync();
  }, []);
  useEffect(() => {
    const runAsync = async () => {
      if (props.roleId) {
        const res = await getChartsByRole(props.roleId);
        if (res.data) {
          if (res.data.success) {
            if (res.data.charts.length > 0) {
              const temp = {};
              res.data.charts.forEach((chart) => {
                temp[chart.id] = true;
              });
              props.setExistingCharts(temp);
              props.setPermittedFunc(temp);
            }
          }
        }
      }
    };
    runAsync();
    return () => {
      props.setPermittedFunc({});
    };
  }, [props.roleId]);
  const handleCheckboxes = (id) => {
    props.setPermittedFunc((prevState) => {
      return {
        ...prevState,
        [id]: !prevState[id],
      };
    });
  };
  const renderTableBody = () => {
    if (charts) {
      if (charts.length > 0) {
        return charts.map((chart, i) => {
          return (
            <tr
              key={chart.id}
              style={
                props.permittedFunc[chart.id]
                  ? {
                      backgroundColor: "#e3f2fd",
                      borderBottom: "1.1px #90caf9 solid",
                    }
                  : null
              }
            >
              <td>{i + 1}</td>
              <td>{chart.chart_name}</td>
              <td>{chart.chart_type}</td>
              <td>{chart.url}</td>
              <td>
                {chart.x}, {chart.y}
              </td>
              <td>
                <FormGroup check inline>
                  <Input
                    type="checkbox"
                    value={chart.id}
                    checked={!!props.permittedFunc[chart.id]}
                    onChange={() => handleCheckboxes(chart.id)}
                  />
                </FormGroup>
              </td>
            </tr>
          );
        });
      }
    }
  };
  return (
    <>
      <Card className="shadow" style={{ maxHeight: "388px" }}>
        <CardHeader style={{ textAlign: "center" }}>
          <h3 className="text-muted">Charts</h3>
        </CardHeader>
        <Table className="align-items-center table-flush" responsive>
          <thead className="thead-light">
            <tr>
              <th scope="col">S.No</th>
              <th scope="col">Chart name</th>
              <th scope="col">Chart Type</th>
              <th scope="col">url</th>
              <th scope="col">details</th>
              <th scope="col">Permission</th>
            </tr>
          </thead>
          <tbody>{renderTableBody()}</tbody>
        </Table>
      </Card>
    </>
  );
};

export default ChartsTable;
