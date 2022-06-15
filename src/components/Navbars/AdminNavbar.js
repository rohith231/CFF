import imageForRole from "commonFunctions/imageForRole";
import React from "react";
import { useMutation } from "react-query";
import { Link, useHistory } from "react-router-dom";
// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Navbar,
  Nav,
  Container,
  Media,
} from "reactstrap";
import { logout } from "../../network/ApiAxios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignRight, faBars } from "@fortawesome/free-solid-svg-icons";

const AdminNavbar = (props) => {
  let username = JSON.parse(localStorage.getItem("user")).first_name;
  const avatar = localStorage.getItem("avatar");
  const mutation = useMutation(logout);
  const history = useHistory();
  const logOut = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      mutation.mutate(token, {
        onSuccess: (response) => {
          const { data } = response;
          if (data.success) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("role_id");
            localStorage.removeItem("avatar");
            localStorage.removeItem("client_id");
            // esriId.destroyCredentials();
            history.push("/auth/login");
          }
        },
      });
    }
  };

  return (
    <>
      <Navbar
        className="navbar-top navbar-dark bg-gradient-info"
        id="navbar-main"
      >
        <Container fluid>
          {props.setToggle ? (
            <div
              className="navbar-brand"
              id="sidebar-toggle"
              onClick={() => {
                props.setToggle((prevState) => !prevState);
              }}
            >
              <FontAwesomeIcon
                icon={props.toggle ? faBars : faAlignRight}
                style={{ cursor: "pointer" }}
              />
            </div>
          ) : null}

          <Link
            className="h4 mb-0 text-white text-uppercase d-lg-inline-block"
            to="/"
          >
            {props.brandText}
          </Link>
          <Nav className="align-items-center  d-md-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                    <img alt="profile" src={avatar ? avatar : imageForRole()} />
                  </span>
                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold">
                      {username}
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Welcome!</h6>
                </DropdownItem>
                <DropdownItem
                  to="/admin/profile-management/user-profile"
                  tag={Link}
                >
                  <i className="ni ni-single-02" />
                  <span>My profile</span>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-settings-gear-65" />
                  <span>Settings</span>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-calendar-grid-58" />
                  <span>Activity</span>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-support-16" />
                  <span>Support</span>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem href="#pablo" onClick={logOut}>
                  <i className="ni ni-user-run" />
                  <span>Logout</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
