import React, { useState } from "react";
import { Container, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authAction } from "../../../store/authStore";
import { deleteFromLocalStorage } from "../../../helpers/helperFunctions";
function Header(props) {
  const [notificationStatus, setNotificationStatus] = useState(false);
  const [userProfileStatus, setUserProfileStatus] = useState(false);

  const location = useLocation().pathname;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const breadcrumb = () => {
    if (location === "/") return "Home";
    let currentLink = "";
    const path = location
      .split("/")
      .filter((path) => path.length !== 0)
      .map((crumb, index) => {
        let newCrumb;
        if (index > 0)
          newCrumb = ` / ${crumb[0].toUpperCase() + crumb.substring(1)}`;
        else newCrumb = crumb[0].toUpperCase() + crumb.substring(1);
        currentLink += `/${crumb}`;
        return <Link to={currentLink}>{newCrumb}</Link>;
      });
    path.unshift(<Link to="/">Home / </Link>);
    return path;
  };

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
    <>
      {/* <Navbar
        collapseOnSelect
        bg="light"
        expand="lg"
        sticky="top"
        className="topbar"
      >
        <Container fluid>
          <Navbar.Brand as={Link} to="/">
            <img
              src="https://flyurdream.online/static/images/logo.png"
              className="navbar-logo"
              alt="logo"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto navbarRightside flex-grow-1 pe-3">
              <Nav.Link as={NavLink} to="/" activeKey={location}>
                Home
              </Nav.Link>
              <NavDropdown
                title="Enquiries"
                id="basic-nav-dropdown"
                activeKey={location}
              >
                <NavDropdown.Item as={NavLink} to="/enquiry/create">
                  Create Enquiry
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/enquiries">
                  All Enquiries
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Application" id="basic-nav-dropdown">
                <NavDropdown.Item as={NavLink} to="/application/create">
                  Create Application
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/applications">
                  All Applications
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown
                title="Profile"
                id="basic-nav-dropdown"
                data-toggle="dropdown"
              >
                <NavDropdown.Item as={NavLink} to="/user-profile">
                  Change Password
                </NavDropdown.Item>
                <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link as={NavLink} to="/search" activeKey={location}>
                Search
              </Nav.Link>
            </Nav>
            {/* <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-success">Search</Button> */}
      {/* </Form> */}
      {/* </Navbar.Collapse>
        </Container>
      </Navbar> */}
      <div className="main-content ">
        <header className="header breadcrumb navbar navbar-expand-sm expand-header">
          <div className="search-animated toggle-search">
            <span className="badge badge-secondary">{breadcrumb()}</span>
          </div>
          {location === "/enquiries" ? (
            <div className="flexRight">
              <Link className="btn btn-primary" to="/enquiry/create">
                Create Enquiry
              </Link>
            </div>
          ) : location === "/applications" ? (
            <div className="flexRight">
              <Link className="btn btn-primary" to="/application/create">
                Create Application
              </Link>
            </div>
          ) : (
            ""
          )}

          {/*  <ul className="navbar-item flex-row ms-lg-auto ms-0">
             <li className="nav-item dropdown notification-dropdown">
            <a
              href="#"
              className={`nav-link dropdown-toggle ${
                notificationStatus ? "show" : ""
              }`}
              id="notificationDropdown"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              onClick={() => setNotificationStatus((status) => !status)}
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
                className="feather feather-bell"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span className="badge badge-success"></span>
            </a>

            <div
              className={`dropdown-menu position-absolute ${
                notificationStatus ? "show" : ""
              }`}
              aria-labelledby="notificationDropdown"
            >
              <div className="drodpown-title message">
                <h6 className="d-flex justify-content-between">
                  <span className="align-self-center">Messages</span>
                  <span className="badge badge-primary">9 Unread</span>
                </h6>
              </div>
              <div className="notification-scroll">
                <div className="dropdown-item">
                  <div className="media server-log">
                    <img
                      src="src/assets/img/profile-16.jpeg"
                      className="img-fluid me-2"
                      alt="avatar"
                    />
                    <div className="media-body">
                      <div className="data-info">
                        <h6 className="">Kara Young</h6>
                        <p className="">1 hr ago</p>
                      </div>

                      <div className="icon-status">
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
                          className="feather feather-x"
                        >
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="dropdown-item">
                  <div className="media ">
                    <img
                      src="src/assets/img/profile-15.jpeg"
                      className="img-fluid me-2"
                      alt="avatar"
                    />
                    <div className="media-body">
                      <div className="data-info">
                        <h6 className="">Daisy Anderson</h6>
                        <p className="">8 hrs ago</p>
                      </div>

                      <div className="icon-status">
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
                          className="feather feather-x"
                        >
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="dropdown-item">
                  <div className="media file-upload">
                    <img
                      src="src/assets/img/profile-21.jpeg"
                      className="img-fluid me-2"
                      alt="avatar"
                    />
                    <div className="media-body">
                      <div className="data-info">
                        <h6 className="">Oscar Garner</h6>
                        <p className="">14 hrs ago</p>
                      </div>

                      <div className="icon-status">
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
                          className="feather feather-x"
                        >
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="drodpown-title notification mt-2">
                  <h6 className="d-flex justify-content-between">
                    <span className="align-self-center">Notifications</span>{" "}
                    <span className="badge badge-secondary">16 New</span>
                  </h6>
                </div>

                <div className="dropdown-item">
                  <div className="media server-log">
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
                      className="feather feather-server"
                    >
                      <rect
                        x="2"
                        y="2"
                        width="20"
                        height="8"
                        rx="2"
                        ry="2"
                      ></rect>
                      <rect
                        x="2"
                        y="14"
                        width="20"
                        height="8"
                        rx="2"
                        ry="2"
                      ></rect>
                      <line x1="6" y1="6" x2="6" y2="6"></line>
                      <line x1="6" y1="18" x2="6" y2="18"></line>
                    </svg>
                    <div className="media-body">
                      <div className="data-info">
                        <h6 className="">Server Rebooted</h6>
                        <p className="">45 min ago</p>
                      </div>

                      <div className="icon-status">
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
                          className="feather feather-x"
                        >
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="dropdown-item">
                  <div className="media file-upload">
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
                      className="feather feather-file-text"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    <div className="media-body">
                      <div className="data-info">
                        <h6 className="">Kelly Portfolio.pdf</h6>
                        <p className="">670 kb</p>
                      </div>

                      <div className="icon-status">
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
                          className="feather feather-x"
                        >
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="dropdown-item">
                  <div className="media ">
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
                      className="feather feather-heart"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <div className="media-body">
                      <div className="data-info">
                        <h6 className="">Licence Expiring Soon</h6>
                        <p className="">8 hrs ago</p>
                      </div>

                      <div className="icon-status">
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
                          className="feather feather-x"
                        >
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>

          <li className="nav-item dropdown user-profile-dropdown  order-lg-0 order-1">
            <a
              href="#"
              className={`nav-link dropdown-toggle user ${
                userProfileStatus ? "show" : ""
              }`}
              id="userProfileDropdown"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              onClick={() => setUserProfileStatus((status) => !status)}
            >
              <div className="avatar-container">
                <div className="avatar avatar-sm avatar-indicators avatar-online">
                  <img
                    alt="avatar"
                    src="https://e7.pngegg.com/pngimages/779/586/png-clipart-letter-case-u-alphabet-word-us-letter-size-english-rectangle.png"
                    className="rounded-circle"
                  />
                </div>
              </div>
            </a>

            <div
              className=""
              className={`dropdown-menu position-absolute ${
                userProfileStatus ? "show" : ""
              }`}
              aria-labelledby="userProfileDropdown"
            >
              <div className="user-profile-section">
                <div className="media mx-auto">
                  <div className="emoji me-2">&#x1F44B;</div>
                  <div className="media-body">
                    <h5>Shaun Park</h5>
                    <p>Project Leader</p>
                  </div>
                </div>
              </div>
              <div className="dropdown-item">
                <a href="user-profile.html">
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
                    className="feather feather-user"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>{" "}
                  <span>Profile</span>
                </a>
              </div>
              <div className="dropdown-item">
                <a href="app-mailbox.html">
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
                    className="feather feather-inbox"
                  >
                    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
                    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
                  </svg>{" "}
                  <span>Inbox</span>
                </a>
              </div>
              <div className="dropdown-item">
                <a href="auth-boxed-lockscreen.html">
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
                    className="feather feather-lock"
                  >
                    <rect
                      x="3"
                      y="11"
                      width="18"
                      height="11"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>{" "}
                  <span>Lock Screen</span>
                </a>
              </div>
              <div className="dropdown-item">
                <a href="auth-boxed-signin.html">
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
                    className="feather feather-log-out"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>{" "}
                  <span>Log Out</span>
                </a>
              </div>
            </div>
          </li> 
          </ul> */}
        </header>
      </div>{" "}
      <hr />
    </>
  );
}

export default Header;
