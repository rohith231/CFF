import React, { useState } from "react";
import Button from "reactstrap/lib/Button";
import Container from "reactstrap/lib/Container";
import FormGroup from "reactstrap/lib/FormGroup";
import Input from "reactstrap/lib/Input";
import InputGroup from "reactstrap/lib/InputGroup";
import { useHistory } from "react-router-dom";
import { useMutation } from "react-query";
import { InsertOrUpdateLayers } from "network/ApiAxios";
import Table from 'react-bootstrap/Table'
import axios from 'axios'
const PortalItemForm = (props) => {
  let { selectedLayers } = props;
  const [portalItems, setPortalItems] = useState([
    { url: "", type: "", key: 0 },
  ]);
  const [error, setError] = useState("");
  const mutation = useMutation(InsertOrUpdateLayers);
  const history = useHistory();
  const [loading,setLoading] = useState(false);
  const [success,setSuccess] = useState('');
/* 
  const removeFuncFields = (i) => {
    let newPortalItems = [...portalItems];
    newPortalItems.splice(i, 1);
    setPortalItems(newPortalItems);
  }; */
 /*  const addFuncFields = (e) => {
    setPortalItems([...portalItems, { url: "", type: "", key: e.timeStamp }]);
  }; */

  // const mapLayers = async function (credentials) {
  //   console.log(credentials, "...credentials");
  //   var base64encodedData = Buffer.from(username + ":" + password).toString(
  //     "base64"
  //   );
  //   axios
  //     .get({
  //       baseURL: "http://localhost:8080/geoserver/rest/layers",
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: "Basic " + base64encodedData,
  //       },
  //     })
  //     .then((data) => data.json);
  // };

  const onAddClick = async() => {
    let extractedlayer={};
    if(selectedLayers && selectedLayers.length > 0){
      setLoading(true);
      extractedlayer = selectedLayers.map((layer) => {
        return {url:layer.wfsLayer,type:'layer',key:layer.id}
      })
      extractedlayer['roleId'] = 44;
     console.log(extractedlayer,'...extractedlayer')
      try {
        const url = 'http://182.18.181.115:5100/api/layers'
       const res = await axios.put(url, {
        headers: {
          Authorization: "Basic YWRtaW46Z2Vvc2VydmVy",
        },
        data: extractedlayer,
      });
      console.log(res,'...res')
      if(res.status == 200){
        setSuccess('Layers added successfully');
      }
      

      } catch (error) {
        console.log(error);
        setError(error,'eerrroe');
        
      }finally{
        setLoading(false);
      }
      
      

    }



    
   /*  if (
      portalItems.every((portalItem) => {
        return portalItem.url.length > 0;
      })
    ) {
      if (props.roleId) {
        mutation.mutate(
          {
            portalItems,
            roleId: props.roleId,
          },
          {
            onSuccess: (response) => {
              const { data } = response;
              console.log("addClick", response.data);

              if (data.success) {
                setError("");
                setPortalItems.axios([{ url: "", type: "", key: 0 }]);
                history.push("/admin/index");
              } else {
                setError(data.msg);
              }
            },
          }
        );
      } else {
        setError("select role id to allocate");
      }
    } else {
      setError("Please enter URL");
    } */
  };

  const onInputChange = async (e, index) => {
    let newPortalItems = [...portalItems];
    newPortalItems[index][e.target.name] = e.target.value;
    newPortalItems[index]["type"] = props.selectedRole;
    // try {
    // } catch (error) {
    //   newPortalItems[index].type = error.message;
    // }
    setPortalItems(newPortalItems);
  };
  return (
    <Container>
      {/*  {portalItems.map((portalItem, index) => {
        return (
          <div key={portalItem.key}>
            <FormGroup>
              <p>{portalItem.type}</p>
            </FormGroup>
            <InputGroup className="mb-2">
              <Input
                placeholder="URL"
                name="url"
                type="text"
                value={portalItem.piId}
                onChange={(e) => onInputChange(e, index)}
              />
              {index ? (
                <Button size="sm" onClick={() => removeFuncFields(index)}>
                  <i className="fas fa-minus"></i>
                </Button>
              ) : null}
            </InputGroup>
          </div>
        );
      })}
      <FormGroup>
        <Button color="primary" size="sm" onClick={addFuncFields}>
          add more..
        </Button>
      </FormGroup> */}
      {/* <div>
        {error ? (
          <div className="text-muted font-italic">
            <small>
              error: <span className="text-red font-weight-700">{error}</span>
            </small>
          </div>
        ) : null}
      </div> */}

      {selectedLayers && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Layer Name</th>
              <th>Url</th>
            </tr>
          </thead>
          <tbody>
            {selectedLayers.map((layer, index) => {
              return (
                <tr>
                  <td>{index + 1}</td>
                  <td>{layer?.layername}</td>
                  <td>{layer?.wfsLayer}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
      <br/>
      <br/>
      <FormGroup className="text-center">
        <Button color="primary" onClick={()=>onAddClick()}>
        {!loading ? <>ADD</> : <>loading...</> }
        </Button>
      </FormGroup>
      <br/>
      <br/>
      {success && <div>{success}</div>}
      {error && <div>Error : {error}</div>}
    </Container>
  );
};

export default PortalItemForm;
