import React, { useState, useEffect } from "react";
import Table from "reactstrap/lib/Table";
import axios from "axios";
import SelectTableComponent from "./geoserverLayerslist";



export default function LayersData({addLayer,layers,selectLayers,selectedLayers,featuresLayer}) {

  const myHeaders = new Headers();
  myHeaders.append("Authorization", "Basic YWRtaW46Z2Vvc2VydmVy");

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  // const getData = () => {
  //   fetch("http://localhost:8080/geoserver/rest/layers", requestOptions)
  //     .then((response) => response.json())
  //     .then((result) => {
  //       console.log(result.layers.layer,'.....');
  //       fetchLayers(result.layers.layer);
  //     })
  //     .catch((error) => console.log("error", error));
  // };

  //////////////
  const getData = () => {
    const config = {
      method: "get",
    //   url: "http://localhost:8080/geoserver/rest/layers",
      headers: {
        Authorization: "Basic YWRtaW46Z2Vvc2VydmVy",
      },
    };

    fetch("http://localhost:8080/geoserver/rest/layers",config)
      .then((response) => response.json())
      .then((result) => {
        const layerlistdata = [];

        let nameslist = result.layers.layer;
        nameslist.map((lyr, index) => {
        //   console.log(lyr, "....lyr");
        let lyrobj = {};
        lyrobj.id=index;
        lyrobj.selected=false;
          let lyrname = lyr.name;
          lyrobj.layername = lyrname
          let lyrsplit = lyrname.split(":");
          var config1 = {
            method: "get",
            url: lyr.href,
            headers: {
              Authorization: "Basic YWRtaW46Z2Vvc2VydmVy",
            },
          };
          axios(config1).then((resp) => {
            // console.log(resp, ".....resp");
            if (resp.data.layer.type === "VECTOR") {

            //   lyrobj.layername = lyrname;
              lyrobj.wfsLayer =
                "http://localhost:8080/geoserver/" +
                lyrsplit[0] +
                "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
                lyrname +
                "&outputFormat=application/json";
              
            }
          });
          layerlistdata.push(lyrobj);
        });
        console.log(layerlistdata, "....layerlistdata");
        addLayer(layerlistdata);
      });
  };
  // });
  ///////////////////////

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {/* <h2>React Fetch API Example</h2>
      <ul>
        {Layers.map((item, i) => {
          return <li key={i}>{item.layername}</li>;
        })}
      </ul> */}
      <SelectTableComponent selectLayers={selectLayers} selectedLayers={selectedLayers}  data= {layers}></SelectTableComponent>
    </>

    // <div className="App">
    //   <header className="App-header">
    //     <Table>
    //       <thead>
    //         <tr>
    //           {/* <th>Workingspace</th> */}
    //           <th>Layer name</th>
    //           <th>Layer URL</th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {Layers.length ? (
    //           Layers.map((todo) => {
    //             <tr>
    //               <td>{todo.name}</td>
    //               {/* <td>{todo.lyrname}</td> */}
    //               <td>{todo.href}</td>
    //             </tr>;
    //           })
    //         ) : (
    //           <tr>
    //             <td>-</td>
    //             <td>-</td>
    //             {/* <td>-</td>
    //             <td>-</td> */}
    //           </tr>
    //         )}
    //       </tbody>
    //     </Table>
    //   </header>
    // </div>
  );
}
