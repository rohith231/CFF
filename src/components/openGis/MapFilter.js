import React, { useEffect, useState, useRef, useCallback } from "react";
import Draggable from "react-draggable";
import "./mapFilter.css";
import Dropdown from "react-bootstrap/Dropdown";
import axios from "axios";

const mapFilterOptions = [
  { value: "poles", label: "Poles" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];
function MapFilter(props) {
  const [show, setShow] = useState(false);
  const [dropDownValue, setDropDownValue] = useState("");
  const LayerRef = useRef(null);
  const propertyRef = useRef(null);
  const conditionref = useRef(null);
  const valueRef = useRef(null);
  const [dropDownItems, setDropDownItems] = useState([]);
  const [selected,setSelected] = useState(true);
  let {
    layer,
    property,
    layerName,
    totalFeatures,
    setLayerName,
    extractproperty,
    layerConditions,
    depproperty,
    setdepProperty,
    handleAddlayer,
    currentWfsLayer,
    setCurrentWfsLayer,
    handleClearLayer,
    querySource,
  } = props;

  const handleSelection = (value) => {
    setDropDownValue(value);
    setShow(false);
  };

  const addDropDownItem = (e) => {
    e.preventDefault();
    let property = propertyRef.current.value;
    let condition = conditionref.current.value;
    let value = valueRef.current.value;
    let index = 0;
    let dropvalue = `${property}` + `${condition}` + `${value}`;

    if (dropDownItems.length > 0) {
      index = dropDownItems.findIndex(
        (item) =>
          item.property == property &&
          item.condition == condition &&
          item.value == value
      );
    } else {
      setDropDownItems([{ property, condition, value }]);
      setDropDownValue(dropvalue);
    }
    if (index == -1) {
      setDropDownItems([...dropDownItems, { property, condition, value }]);
      setDropDownValue(dropvalue);
    }

    return;
  };

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <div
      className="dropdownStyle"
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
        setShow(true);
      }}
    >
      {children}
    </div>
  ));

  //res.data.features[0].properties
  // forwardRef again here!
  // Dropdown needs access to the DOM of the Menu to measure it
  const CustomMenu = React.forwardRef(
    ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
      const [value, setValue] = useState("");

      return (
        <div
          ref={ref}
          style={style}
          className={className}
          aria-labelledby={labeledBy}
        >
          <ul className="list-unstyled">
            {React.Children.toArray(children).filter((child) =>
              child.props.children.toLowerCase().startsWith(value)
            )}
          </ul>
        </div>
      );
    }
  );
  const handleChange = (e) => {
    let url = e.target.value.split(",")[0];
    setLayerName(e.target.value.split(",")[1]);
    extractproperty(url);
    setCurrentWfsLayer(url);
    setDropDownItems([]);
  };

  const onClear = (e) => {
    e.preventDefault();
    setDropDownItems([]);
    setLayerName("");
    setDropDownValue("");
    onClearLayer();
  };

  const handleFilterMapSubmit = async (e) => {
    e.preventDefault();
    console.log(currentWfsLayer, dropDownValue, "..logs");
    if (currentWfsLayer && dropDownValue) {
      const str = dropDownValue.split(conditionref.current.value);
      console.log(str, ".split");
      const query = "&CQL_FILTER" + "=" + str[0] + "=" + `'${str[1]}'`;
      console.log(query, "query");
      handleAddlayer(currentWfsLayer + query);
      props.hideMapFilter();
    }
  };

  const removeHandler = (e) => {
    e.preventDefault();
    if (dropDownValue) {
      let dropdown = dropDownItems.filter((item) => {
        let value = `${item.property}` + `${item.condition}` + `${item.value}`;
        return !dropDownValue.includes(value);
      });
      setDropDownItems(dropdown);
      setDropDownValue("");
    }
  };
  const onClearLayer = () => {
    if(querySource)
    {
      setSelected(true);
    querySource.clear();
  }
    
  };

  return (
    <div>
      <Draggable>
        <dialog open={props.mapFilter} className="dialog-box">
          <header className="header">
            <h1>Map Filter</h1>
            <button
              onClick={() => {
                props.hideMapFilter();
              }}
              className="icon"
            >
              <i className="fas fa-times"></i>
            </button>
          </header>
          <form
            role={"contentinfo"}
            onSubmit={(e) => {
              handleFilterMapSubmit(e);
            }}
          >
            <div className="input_container">
              <label>Layer</label>
              {/* <Select options={mapFilterOptions} /> */}
              <select
                ref={LayerRef}
                onChange={handleChange}
                name="selection"
                className="selection"
              >
                <option value="none" selected disabled hidden>
                  Select a layer
                </option>
                {layer &&
                  layer.map((el, index) => (
                    <option
                      key={index}
                      value={el.wfsLayer + "," + el.layername}
                      accessKey={el.layername}
                    >
                      {el.layername}
                    </option>
                  ))}
              </select>
            </div>
            <div className="input_container flex">
              <div>
                <label>Property</label>
                <select
                  name="property"
                  onChange={(e) =>
                    setdepProperty({
                      key: e.target.value,
                      type: layerConditions[e.target.value].type,
                    })
                  }
                  ref={propertyRef}
                >
                  <option value="none" selected disabled hidden>
                    Select
                  </option>
                  {property &&
                    property.map((el, index) => (
                      <option key={index} value={el.value}>
                        {el.label}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label>Condition</label>
                <select name="condition" ref={conditionref}>
                  <option value="none" selected disabled hidden>
                    Select
                  </option>
                  {depproperty && depproperty.type == "number" ? (
                    <>
                      <option value={">"}>Greater than</option>
                      <option value={"<"}>Lesser than</option>
                      <option value={"="}>Equal to</option>
                    </>
                  ) : (
                    <>
                      <option value={"="}>Equal to</option>
                    </>
                  )}
                </select>
              </div>
              <div>
                <label>Value</label>
                <input type="text" list="cars" name="value" ref={valueRef} />
                <datalist id="cars">
                  <option value="none" selected disabled hidden>
                    Select
                  </option>
                  {depproperty &&
                    depproperty.key &&
                    layerConditions &&
                    layerConditions[depproperty.key] &&
                    layerConditions[depproperty.key].arr &&
                    layerConditions[depproperty.key].arr.map((el, index) => (
                      <option key={index} value={el}>
                        {el}
                      </option>
                    ))}
                </datalist>
                {/* <select name="value" ref={valueRef}>
                  <option value="none" selected disabled hidden>
                    Select
                  </option>
                  {depproperty &&
                    depproperty.key &&
                    layerConditions &&
                    layerConditions[depproperty.key] &&
                    layerConditions[depproperty.key].arr &&
                    layerConditions[depproperty.key].arr.map((el, index) => (
                      <option key={index} value={el}>
                        {el}
                      </option>
                    ))}
                </select> */}
              </div>
            </div>
            <div className="input_container option_button">
              <button className="add" onClick={addDropDownItem}>
                Add
              </button>
              <button className="remove" onClick={removeHandler}>
                Remove
              </button>
            </div>

            <div className="dropdown_container">
              <Dropdown show={show} className="dropdownlist">
                <Dropdown.Toggle
                  as={CustomToggle}
                  id="dropdown-custom-components"
                >
                  {dropDownValue}
                </Dropdown.Toggle>

                {dropDownItems.length > 0 && (
                  <Dropdown.Menu as={CustomMenu} className="dropDownMenu">
                    {dropDownItems.map((item, index) => {
                      let value =
                        `${item.property}` +
                        `${item.condition}` +
                        `${item.value}`;
                      // console.log(LayerRef.current)

                      let label = `${layerName}:` + `(${value})`;

                      return (
                        <Dropdown.Item
                          onClick={() => handleSelection(value)}
                          className="dropdownitem"
                          key={index}
                          eventKey={`${index}`}
                        >
                          {label}
                        </Dropdown.Item>
                      );
                    })}
                  </Dropdown.Menu>
                )}
              </Dropdown>
            </div>
            <p className="text-center mt-4">
              {totalFeatures} features selected
            </p>
            <footer>
              <div className="input_container  option_button">
                <button className="clear" onClick={onClear}>
                  Clear
                </button>
                <button
                  className="preview"
                  onClick={(e) => {
                    handleFilterMapSubmit(e);
                  }}
                >
                  Preview
                </button>
              </div>
            </footer>
          </form>
        </dialog>
      </Draggable>
    </div>
  );
}

export default MapFilter;
