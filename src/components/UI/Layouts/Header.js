import React from "react";
import { Link, useLocation } from "react-router-dom";
function Header(props) {
  const location = useLocation().pathname;
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

  return (
    <>
      <div className="header-container container-xxl hideOnMobile">
        <header className="header navbar navbar-expand-sm "></header>
      </div>
      <div className="main-content ">
        <header className="header breadcrumb navbar navbar-expand-sm expand-header">
          <div className="search-animated toggle-search">
            <Link
              className="sidebarCollapse"
              onClick={() => {
                props.sidebarStateChange((old) => !old);
              }}
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
                className="feather feather-menu"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </Link>
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
        </header>
      </div>{" "}
      <hr />
    </>
  );
}

export default Header;
