import React,{useState,useEffect} from "react";
import axios from "axios";
import { layer } from "@fortawesome/fontawesome-svg-core";
import WMSCapabilities from "ol/format/WMSCapabilities";

const Users = [
  {
    id: 1,
    selected: false,
    name: "Leanne Graham",
    email: "Sincere@april.biz",
    phone: "1-770-736-8031 x56442",
    website: "hildegard.org",
  },
  {
    id: 2,
    selected: false,
    name: "Ervin Howell",
    email: "Shanna@melissa.tv",
    phone: "010-692-6593 x09125",
    website: "anastasia.net",
  },
];

// let config = {
//     method: 'get',
//     url: 'http://localhost:8080/geoserver/rest/layers',
//     headers: {
//     'Authorization': 'Basic YWRtaW46Z2Vvc2VydmVy'
//     }
// };
const requestOptions = {
  method: "GET",
  redirect: "follow",
};
let result = [];
fetch(
  "http://productplatform.digital.trccompanies.com/geoserver/ows?service=wms&version=1.3.0&request=GetCapabilities",
  requestOptions
)
  .then((response) => response.text())
  .then((res) => {
    // const parser = new xml2js.Parser();
    var parser = new WMSCapabilities();
    // console.log(result,'.......');
    let xmlparser = parser.read(res);
    console.log(xmlparser, "....result111");
    let wmslayerslist = xmlparser.Capability.Layer.Layer;
    result = wmslayerslist.map((lyr, index) => {
      lyr.id = index;
      lyr.selected = false;
      return lyr;
    });
    console.log(result, "....insise]de");
    // result.push(wmslayerslist)
  });

function SelectTableComponent({data,selectLayers,selectedLayers}) { 
    const [List,setList] = useState(data)
    const [MasterChecked,setMasterChecked] = useState(false);

  useEffect(() => {
    if(data){
      setList(data);
    }
  }, [data])
  
  // Select/ UnSelect Table rows
  const onMasterCheck = (e) =>{
    let tempList = List;
    // Check/ UnCheck All Items
    tempList.map((user) => (user.selected = e.target.checked));

     setMasterChecked(e.target.checked)
     setList(tempList)
     selectLayers(()=>List.filter((e) => e.selected))    
  }

  // Update List Item's state and Master Checkbox State
  const onItemCheck=(e, item) => {
    let tempList = List;
    tempList.map((user) => {
      if (user.id === item.id) {
        user.selected = e.target.checked;
      }
      return user;
    });

    //To Control Master Checkbox State
    const totalItems = List.length;
    const totalCheckedItems = tempList.filter((e) => e.selected).length;

    // Update State
    setMasterChecked(()=>totalItems === totalCheckedItems)
    setList(tempList)
    selectLayers(()=>List.filter((e) => e.selected))    

  }

  // Event to get selected rows(Optional)
  /* getSelectedRows() {
    this.setState({
      selectedLayers: List.filter((e) => e.selected),
    });
    this.props.selectLayers(selectedLayers);
  }
 */
    
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={MasterChecked}
                      id="mastercheck"
                      onChange={onMasterCheck}
                    />
                  </th>
                  <th scope="col">LayerName</th>
                  {/* <th scope="col">URL</th> */}
                </tr>
              </thead>
              <tbody>
                {List && List.length > 0 && List.map((user) => (
                  <tr key={user.id} className={user.selected ? "selected" : ""}>
                    <th scope="row">
                      <input
                        type="checkbox"
                        checked={user.selected}
                        className="form-check-input"
                        id="rowcheck{user.id}"
                        onChange={(e) => onItemCheck(e, user)}
                      />
                    </th>
                    <td>{user.layername}</td>
                    {/* <td>{user.wfsurl}</td> */}
                  </tr>
                ))}
              </tbody>
            </table>
            {/* <button
              className="btn btn-primary"
              onClick={() => this.getSelectedRows()}
            >
              Get Selected Items {selectedLayers.length}
            </button>
            <div className="row">
              <b>All Row Items:</b>
              {/* <code>{JSON.stringify(List)}</code> 
            </div>
            <div className="row">
              <b>Selected Row Items:</b>
              <code>{JSON.stringify(selectedLayers)}</code>
              
            </div> */}
          </div>
        </div>
      </div>
    );
  }

export default SelectTableComponent;
