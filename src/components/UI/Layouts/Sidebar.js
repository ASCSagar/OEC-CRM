import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import CollapsableComponent from "../CollapsableComponent";
import { authAction } from "../../../store/authStore";
import { deleteFromLocalStorage } from "../../../helpers/helperFunctions";
function NavBar(props) {
  const authData = useSelector((state) => state.authStore);
  const dispatch = useDispatch();
  const locaton = useLocation();
  const navigate = useNavigate();
  const logout = () => {
    dispatch(
      authAction.setAuthStatus({
        userName: "",
        loggedIn: false,
        accessToken: null,
        refreshToken: null,
        userId: null,
        user_type: null,
        timeOfLogin: null,
        logInOperation: -1,
      })
    );
    deleteFromLocalStorage("loginInfo");
    navigate(`/`);
  };
  return (
    <div className="sidebar-wrapper sidebar-theme">
      <nav id="sidebar">
        <div className="navbar-nav theme-brand flex-row  text-center">
          <div className="nav-logo">
            <div className="nav-item theme-text">
              <NavLink to="/">
                <img
                  src="https://www.oecindia.com/assets/images/finalpic.png"
                  className="navbar-logo"
                  alt="logo"
                />
              </NavLink>
            </div>
          </div>
          <div className="nav-item sidebar-toggle">
            <div
              className="btn-toggle sidebarCollapse"
              onClick={() => props.sidebarStateChange((state) => !state)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="feather feather-chevrons-left"
              >
                <polyline points="11 17 6 12 11 7"></polyline>
                <polyline points="18 17 13 12 18 7"></polyline>
              </svg>
            </div>
          </div>
        </div>

        {/* <div className="shadow-bottom"></div> */}
        <ul className="list-unstyled menu-categories" id="accordionExample">
          <li className={`menu ${locaton.pathname === "/" ? "active" : ""}`}>
            <NavLink to="/" className="dropdown-toggle">
              <div className="">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="feather feather-home"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                <span>Dashboard</span>
              </div>
            </NavLink>
          </li>
          {authData.user_type !== "staff" ? (
            <>
              <li
                className={`menu ${
                  locaton.pathname === "/search" ? "active" : ""
                }`}
              >
                <NavLink to="/search" className="dropdown-toggle">
                  <div className="">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="feather feather-search"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <span>Search Courses</span>
                  </div>
                </NavLink>
              </li>

              <li
                className={`menu ${
                  locaton.pathname === "/university" ? "active" : ""
                }`}
              >
                <NavLink to="/university" className="dropdown-toggle">
                  <div className="">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="feather feather-layers"
                    >
                      <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                      <polyline points="2 17 12 22 22 17"></polyline>
                      <polyline points="2 12 12 17 22 12"></polyline>
                    </svg>
                    <span>Search University</span>
                  </div>
                </NavLink>
              </li>

              <li
                className={`menu ${
                  locaton.pathname === "/website-enquiry" ? "active" : ""
                }`}
              >
                <NavLink to="/website-enquiry" className="dropdown-toggle">
                  <div className="heading">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="feather feather-clipboard"
                    >
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                      <rect
                        x="8"
                        y="2"
                        width="8"
                        height="4"
                        rx="1"
                        ry="1"
                      ></rect>
                    </svg>
                    <span>Website Enquiry</span>
                  </div>
                </NavLink>
              </li>
              <li className="menu">
                <a
                  href="https://oecindia.com/oeccrm/help/index.html"
                  className="dropdown-toggle"
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="feather feather-help-circle"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <span>Help</span>
                  </div>
                </a>
              </li>
              <li className="menu menu-heading">
                <div className="heading">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="feather feather-minus"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  <span>Enquiries</span>
                </div>
              </li>

              <CollapsableComponent
                svg={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="feather feather-clipboard"
                  >
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  </svg>
                }
                name="Enquiries"
                subMenu={[
                  { name: "All Enquiries", link: "/enquiries" },
                  { name: "Create Enquiry", link: "/enquiry/create" },
                ]}
              />
            </>
          ) : (
            ""
          )}
          <li className="menu menu-heading">
            <div className="heading">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="feather feather-minus"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>Applications</span>
            </div>
          </li>
          <CollapsableComponent
            svg={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-file"
              >
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                <polyline points="13 2 13 9 20 9"></polyline>
              </svg>
            }
            name="Applications"
            subMenu={
              authData.user_type !== "staff"
                ? [
                    { name: "All Applications", link: "/applications" },
                    { name: "Create Application", link: "/application/create" },
                  ]
                : [{ name: "All Applications", link: "/applications" }]
            }
          />

          <li className="menu menu-heading">
            <div className="heading">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="feather feather-minus"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>USER</span>
            </div>
          </li>

          <li className="menu">
            <NavLink
              to="/user-profile"
              data-bs-toggle="collapse"
              aria-expanded="false"
              className="dropdown-toggle"
            >
              <div className="">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="feather feather-users"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span>Profile</span>
              </div>
            </NavLink>
          </li>
        </ul>
        <div className="logout-container" onClick={logout}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-log-out"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <p className="logoutBtn">Logout</p>
        </div>
      </nav>
    </div>
  );
}

export default NavBar;
