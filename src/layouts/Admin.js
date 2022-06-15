import React, { useEffect, useState } from "react";
// reactstrap components
// core components
import routes from "routes.js";
import GlobalState from "GlobalState";
import MainContent from "components/mainContent/MainContent";
import { getExpByRole } from "network/ApiAxios";
import appRole from "commonFunctions/appRole";
import Iframe from "react-iframe";
import AdminNavbar from "components/Navbars/AdminNavbar";
import config from "config";
import { checkIfDataEntryRole } from "network/ApiAxios";
import DataEntry from "components/dataEntry/DataEntry";

const Admin = (props) => {
  const [expId, setExpId] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const roleId = localStorage.getItem("role_id");
  const [isDataEntryRole, setIsDataEntryRole] = useState(null);

  useEffect(() => {
    const runAsync = async () => {
      setIsLoading(true);
      const res = await getExpByRole(roleId);
      if (res) {
        setIsLoading(false);
        if (res.data) {
          if (res.data.exp) {
            if (res.data.exp.exp_id) {
              setExpId(res.data.exp.exp_id);
            }
          }
        }
      }
    };
    runAsync();
  }, []);

  useEffect(() => {
    const runAsync = async () => {
      const res = await checkIfDataEntryRole(roleId);
      if (res) {
        if (res.data) {
          if (res.data.success) {
            if (res.data.exists) {
              setIsDataEntryRole(true);
            }
          }
        }
      }
    };
    runAsync();
  }, []);

  const renderIfExpForDbUsers = () => {
    if (appRole(roleId) === "*") {
      if (isLoading) {
        return <p>Loading...</p>;
      } else if (isLoading === false) {
        if (expId) {
          return (
            <>
              <AdminNavbar brandText={"Dashboard"} />

              <Iframe
                url={`${config.EXP_BUILD_URL}/experience/${expId}/`}
                width="100%"
                height="86%"
                position="absolute"
              />
            </>
          );
        } else if (isDataEntryRole) {
          return (
            <>
              <AdminNavbar brandText={"Dashboard"} />
              <DataEntry />
            </>
          );
        } else {
          return (
            <>
              <GlobalState>
                <MainContent
                  {...props}
                  routes={routes}
                  logo={{
                    innerLink: "/admin/index",
                    imgSrc: require("assets/img/brand/tech-pro.jpg").default,
                    imgAlt: "...",
                  }}
                />
              </GlobalState>
            </>
          );
        }
      }
    } else {
      return (
        <>
          <GlobalState>
            <MainContent
              {...props}
              routes={routes}
              logo={{
                innerLink: "/admin/index",
                imgSrc: require("assets/img/brand/tech-pro.jpg").default,
                imgAlt: "...",
              }}
            />
          </GlobalState>
        </>
      );
    }
  };

  return (
    <>
      {}
      {renderIfExpForDbUsers()}
    </>
  );
};

export default Admin;
