import React, { useState, useEffect } from 'react'
import axios from "axios";
import './index.css'

export default function MlPrediction(props) {
    const [data, setData] = useState([]);
    const [header, setHeader] = useState([]);
    const [highlight, setHighlight] = useState(false);
    const [isLoading, setLoading] = useState(false);
    // const [addText, setaddText] = useState('');
    const [fileName, setFileName] = useState("");
    const [selectedFile, setSelectedFile] = useState();

    const onImageChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
        console.log(e.target.files[0])

    };

    const onSubmitbtn = () => {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("fileName", fileName)
        // const path = formData ? formData : addText
        const path = formData;
        setLoading(true)
        try {
            axios.post(
                "http://localhost:8080/null_prediction", path,
                // "http://localhost:8080/file", path,
            ).then((response) => {
                console.log("data",response)
                const keys = Object.keys(response.data.table[0]);
                keys.pop("isInvalid");
                setHeader(keys);
                setData(response)
                setHighlight(true);
                console.log("res", response)
                console.log("header", header)
                document.getElementById("myFile").value=null; 
            })
        } catch (ex) {
            alert(`Error : ${ex}`)
        }

    }
    

    console.log("data111", data)
    console.log("header111", header)


    const mystyle1 = {
        backgroundColor: "#ff2f28",
    };

    const mystyleInaccurateData = {
        backgroundColor: "yellow",
    };

    return (
        <>
            <div className="header bg-gradient-info pt-5 pt-6"></div>
            <div className="mlprediction">
                <div className="container">
                    <div className="col-md-12" >
                        <label for="" style={{fontWeight:'bold'}}> Upload Dataset(FORMAT:CSV, Xlxs, Shapefile) </label><br />
                        <input type="file" id="myFile" name="filename" onChange={onImageChange} /><br /><br />
                        {/* <input className="configrationText" type="text" onChange={(e) => setaddText(e.target.value)} autoComplete="off" value={addText} placeholder="connection string" /><br /><br /> */}
                        <button
                            className="btn btn-secondary"
                            onClick={""}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                onSubmitbtn();
                            }}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
            <hr />
            <div className="table-responsive" style={{ height: "350px" }} >
                <table className="table table-striped">
                    <thead className="table-success">
                        <tr>
                            {header.map((item) => {
                                return <th>{item}</th>
                            })}
                        </tr>
                    </thead>

                    <tbody>
                        {data.data && data.data.table.map((item) => {
                            return (
                                <tr style={{ color: "black" }}>
                                    {Object.keys(item).map((ele) => {
                                        return (
                                            <>
                                                
                                                    <td
                                                        onClick={() =>
                                                            item?.isInvalid?.includes(
                                                                ele
                                                            )
                                                                ? ""(
                                                                    item?.FID,
                                                                    item?.isInvalid,
                                                                    ele
                                                                )
                                                                : item?.isInvalid?.includes(
                                                                    ele
                                                                )
                                                                    ? ""(
                                                                        item?.FID,
                                                                        item?.isInvalid,
                                                                        item?.isInvalid,
                                                                        ele
                                                                    )
                                                                    : ''
                                                        }
                                                        style={
                                                            item?.isInvalid?.includes(
                                                                ele
                                                            )
                                                                ? mystyle1
                                                                : item?.isInvalid?.includes(
                                                                    ele
                                                                )
                                                                    ? mystyleInaccurateData
                                                                    : null
                                                        }
                                                    >
                                                        {typeof item[ele] !== "object"
                                                            ? item[ele]
                                                            : ""}
                                                    </td>
                                               
                                                    {/* <td>
                                                        {typeof item[ele] !== "object"
                                                            ? item[ele]
                                                            : ""}
                                                    </td> */}
                                                
                                            </>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    )
}