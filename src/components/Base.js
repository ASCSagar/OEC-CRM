import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "./UI/Layouts/Header";
import Sidebar from "./UI/Layouts/Sidebar";
import Notification from "./UI/Notification";
import UiModal from "./UI/UiModal";
import EnquiryForm from "../pages/Enquiry/EnquiryForm";
import { uiAction } from "../store/uiStore";

function Base() {
  const navigate = useNavigate();
  // const navigate = useNavigate();
  useEffect(() => {
    window.addEventListener("keydown", function (event) {
      if (event.shiftKey && (event.key === "a" || event.key === "A")) {
        navigate("/application/create");
      }
      if (event.shiftKey && (event.key === "e" || event.key === "E")) {
        navigate("/enquiry/create");
      }
      if (event.shiftKey && (event.key === "p" || event.key === "P")) {
        navigate("/user-profile");
      }
      if (event.shiftKey && (event.key === "s" || event.key === "S")) {
        navigate("/search");
      }
    });
  }, []);
  const uiData = useSelector((state) => state.uiStore);
  const authData = useSelector((state) => state.authStore);

  const dispatch = useDispatch();
  const [sideBarStatus, setSideBarStatus] = useState(false);
  const [modalStatus, setModalStatus] = useState(false);
  // checking whether staff try to go to other pages

  const location = useLocation();
  console.log(location.pathname);
  const checkRestrictedStaffPath = function () {
    if (
      location.pathname === "/search" ||
      location.pathname === "/university" ||
      location.pathname === "/enquiries" ||
      location.pathname === "/enquiry/create" ||
      location.pathname === "/application/create"
    ) {
      return true;
    }
    return false;
  };
  useEffect(() => {
    if (authData.user_type === "staff" && checkRestrictedStaffPath()) {
      dispatch(
        uiAction.setNotification({
          show: true,
          heading: "Authentication Error",
          msg: `You do not have permission to view that page`,
        })
      );
      navigate("/");
    }
  }, []);
  return (
    <>
      <div
        className={`main-container ${
          sideBarStatus && window.innerWidth > 760
            ? "sidebar-closed sbar-open"
            : ""
        } ${sideBarStatus && window.innerWidth <= 760 ? "sbar-open" : ""}`}
        id="container"
      >
        <Sidebar sidebarStateChange={setSideBarStatus} />
        <div id="content" className="main-content">
          <div className="layout-px-spacing">
            <div className="middle-content p-0">
              <div className="container-fluid">
                <Header />
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Notification
        show={uiData.notification.show}
        heading={uiData.notification.heading}
        msg={uiData.notification.msg}
      />
      {/* <div
        className="fixed-footer"
        title="Create Enquiry"
        onClick={() => {
          // navigate(`/enquiry/create`)}
          setModalStatus(true);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="60"
          height="60"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4361ee"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="feather feather-plus-circle"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="16"></line>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
      </div> */}

      {/* <UiModal
        setModalStatus={() => {
          setModalStatus(false);
        }}
        modalClass="fullEnq"
        showStatus={modalStatus}
        showHeader={true}
        title=""
        body={
          <EnquiryForm
            closeIt={() => {
              setModalStatus(false);
            }}
            type="create"
            title="Create Enquiry"
            isModal={true}
            edit={false}
          />
        }
        showFooter={false}
        // footerContent={modalStatus.footerContent}
      /> */}
    </>
  );
}

export default Base;
