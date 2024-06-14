import React, { useEffect, useState } from "react";
import { Button, Col, Form, InputGroup, Row, Alert } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import LoadingData from "../components/UI/LoadingData";
import {
  ajaxCallWithHeaderOnly,
  ajaxCallWithoutBody,
} from "../helpers/ajaxCall";
import HomeStatisticsData from "../components/homepage/HomeStatisticsData";

function HomePage() {
  const [enqData, setEnqData] = useState([]);
  const [appData, setAppData] = useState([]);
  const [msgData, setMsgData] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [isEnqLoadingData, setIsEnqLoadingData] = useState(false);
  const [isMsgLoadingData, setIsMsgLoadingData] = useState(false);
  const [isAppLoadingData, setIsAppLoadingData] = useState(false);
  const [isActivityLoadingData, setIsActivityLoadingData] = useState(false);
  const [throwErr, setThrowErr] = useState(null);
  const authData = useSelector((state) => state.authStore);
  const navigate = useNavigate();
  const columnData = useSelector((store) => store.enqColumn);
  const dispatch = useDispatch();
  const enqColumns = [
    {
      name: "Student Name",
      selector: (row) => (
        <Link to={`enquiry/edit/${row.id}`}>{row.student_name}</Link>
      ),
      sortable: true,
    },
    {
      name: "Student Phone",
      selector: (row) => (
        <Link to={`enquiry/edit/${row.id}`}>{row.student_phone}</Link>
      ),
    },
    {
      name: "Student Email",
      selector: (row) => (
        <Link to={`enquiry/edit/${row.id}`}>{row.student_email}</Link>
      ),
    },
    {
      name: "Current Education",
      selector: (row) => (
        <Link to={`enquiry/edit/${row.id}`}>{row.current_education}</Link>
      ),
    },
    {
      name: "Enq Date",
      selector: (row) => (
        <Link to={`enquiry/edit/${row.id}`}>
          {row.date_created.split("-").reverse().join("-")}
        </Link>
      ),
    },
  ];
  const appcolumns = [
    {
      name: "Name",
      selector: (row) => (
        <Link to={`application/edit/${row.id}`}>
          {row.student_info?.name?.student_name}
        </Link>
      ),
      sortable: true,
    },
    {
      name: "University Interested",
      selector: (row) => (
        <Link to={`application/edit/${row.id}`}>
          {row.university_interested?.univ_name}
        </Link>
      ),
    },
    {
      name: "Course Interested",
      selector: (row) => (
        <Link to={`application/edit/${row.id}`}>
          {row.course_interested?.course_name}
        </Link>
      ),
    },
    {
      name: "Intake Interested",
      selector: (row) => (
        <Link to={`application/edit/${row.id}`}>
          {row.intake_interested?.intake_month +
            " " +
            row.intake_interested?.intake_year}
        </Link>
      ),
    },
  ];
  useEffect(() => {
    if (throwErr) throw throwErr;
  }, [throwErr]);
  const getEnqData = async () => {
    try {
      setIsEnqLoadingData(true);
      const response = await ajaxCallWithHeaderOnly(
        `enquiries/?ordering=-date_created&p=1&records=5`,
        {
          Authorization: `Bearer ${authData.accessToken}`,
        },
        "GET",
        null
      );
      if (response?.isNetwork) {
        setThrowErr({ ...response, page: "enquiries" });
        return;
      }
      if (response?.status === 401) {
        setThrowErr({ ...response, page: "enquiries" });
        return;
      }
      // console.log(response);
      if (response?.results?.length > 0) {
        const data = response.results.map((data) => {
          return {
            ...data,
            added_by: data?.added_by?.username,
            intake_interested: data?.intake_interested?.intake_month
              ? data?.intake_interested?.intake_month +
                " " +
                data?.intake_interested?.intake_year
              : "",
            assigned_users: data?.assigned_users?.username,
            country_interested: data?.country_interested?.country_name,
            course_interested: data?.course_interested?.course_name,
            current_education: data?.current_education?.current_education,
            enquiry_status: data?.enquiry_status?.status,
            level_applying_for: data?.level_applying_for?.levels,
            university_interested: data?.university_interested?.univ_name,
          };
        });

        setEnqData(data);
      }
      setIsEnqLoadingData(false);
    } catch (e) {
      setThrowErr({ e, page: "enquiries" });
      return;
    }
  };
  const getAppData = async () => {
    try {
      setIsAppLoadingData(true);
      const response = await ajaxCallWithHeaderOnly(
        `get/courseinfo/?created_at=-date_created&p=1&records=5`,
        {
          Authorization: `Bearer ${authData.accessToken}`,
        },
        "GET",
        null
      );
      if (response?.isNetwork) {
        setThrowErr({ ...response, page: "enquiries" });
        return;
      }
      if (response?.status === 401) {
        setThrowErr({ ...response, page: "enquiries" });
        return;
      }
      // console.log(response);
      if (response?.results?.length > 0) {
        const data = response.results.map((data) => {
          return {
            ...data,
            name: data?.name?.student_name,
            status: data?.status?.App_status,
            added_by: data?.added_by?.username,
            assigned_users: data?.assigned_users?.username,
          };
        });
        setAppData(data);
      }
      setIsAppLoadingData(false);
    } catch (e) {
      setThrowErr({ e, page: "enquiries" });
      return;
    }
  };
  const getActivityData = async () => {
    try {
      setIsActivityLoadingData(true);
      const response = await ajaxCallWithHeaderOnly(
        `recent-actions`,
        {
          Authorization: `Bearer ${authData.accessToken}`,
        },
        "GET",
        null
      );
      if (response?.isNetwork) {
        setThrowErr({ ...response, page: "enquiries" });
        return;
      }
      if (response?.status === 401) {
        setThrowErr({ ...response, page: "enquiries" });
        return;
      }
      // console.log(response);
      if (response?.length) {
        const data = response.map((data) => {
          const date = new Date(data.action_time);
          const datetime =
            date.getDate() +
            "/" +
            (date.getMonth() + 1) +
            "/" +
            date.getFullYear() +
            " @ " +
            date.getHours() +
            ":" +
            date.getMinutes() +
            ":" +
            date.getSeconds();
          const type = data.content_type.app_content.split("|");
          // console.log(type);
          let actionUrl;
          if (data.action_flag != 3)
            actionUrl = `${type[0].trim()}/edit/${data.object_id}`;
          else actionUrl = false;
          return {
            mapId: data.id,
            actionPersonName: data?.object_repr,
            isUerNeeded: authData?.user_type === "superuser" ? true : false,
            actionUser: data?.user?.object_id,
            actionStatusCode: data?.action_flag,
            actionStatusText:
              data?.action_flag === 1
                ? "Created"
                : data?.action_flag === 2
                ? "Updated"
                : "Deleted",
            // added_by: data.added_by.username,
            whoDid: data?.user?.username,
            actionId: data?.object_id,
            dateTime: date.toLocaleString(),
            actionTypeText: type[0].trim(),
            actionTypeCode: type[0].trim() === "enquiry" ? 1 : 2,
            actionUrl,
          };
        });
        setActivityData(data);
      }
      setIsActivityLoadingData(false);
    } catch (e) {
      setThrowErr({ e, page: "enquiries" });
      return;
    }
  };
  const getMsgData = async () => {
    try {
      setIsMsgLoadingData(true);
      const response = await ajaxCallWithHeaderOnly(
        `broadcast-message`,
        {
          Authorization: `Bearer ${authData.accessToken}`,
        },
        "GET",
        null
      );
      if (response?.isNetwork) {
        setThrowErr({ ...response, page: "enquiries" });
        return;
      }
      if (response?.status === 401) {
        setThrowErr({ ...response, page: "enquiries" });
        return;
      }
      // console.log(response);
      if (response?.length) {
        const data = response
          .map((data) => {
            const date2 = new Date(data.end_time);
            const date1 = new Date();
            if (date2 > date1)
              return {
                msg: data?.message,
                id: data?.id,
                stDate: data?.start_time,
              };
            else return null;
          })
          .filter((data) => (data ? true : false));
        setMsgData(data);
      }
      setIsMsgLoadingData(false);
    } catch (e) {
      setThrowErr({ e, page: "enquiries" });
      return;
    }
  };
  useEffect(() => {
    try {
      getEnqData();
      getAppData();
      getActivityData();
      getMsgData();
    } catch (e) {
      setThrowErr({ e, page: "enquiries" });
      return;
    }
  }, []);

  // for activity log svg
  const activitySVG = {
    enquiry: [
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
        class="feather feather-folder-plus"
      >
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        <line x1="12" y1="11" x2="12" y2="17"></line>
        <line x1="9" y1="14" x2="15" y2="14"></line>
      </svg>,
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
        class="feather feather-folder"
      >
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
      </svg>,
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
        class="feather feather-folder-minus"
      >
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        <line x1="9" y1="14" x2="15" y2="14"></line>
      </svg>,
    ],
    application: [
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
        class="feather feather-file-plus"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="12" y1="18" x2="12" y2="12"></line>
        <line x1="9" y1="15" x2="15" y2="15"></line>
      </svg>,
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
      </svg>,
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
        class="feather feather-file-minus"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="9" y1="15" x2="15" y2="15"></line>
      </svg>,
    ],
  };
  const covertToReadableDate = (startDate) => {
    const date = new Date(startDate);
    return (
      date.getDate() +
      "/" +
      (date.getMonth() + 1) +
      "/" +
      date.getFullYear() +
      " @ " +
      date.getHours() +
      ":" +
      date.getMinutes() +
      ":" +
      date.getSeconds()
    );
  };
  return (
    <>
      {/* <HomeStatisticsData /> */}
      <div className="dashboard row layout-spacing">
        {!isMsgLoadingData ? (
          msgData?.length ? (
            <div className="col-lg-12">
              <div className="neumorphism-box">
                <div className="widget widget-six DashboardContainer">
                  <div className="widget-heading">
                    <h2 className="">Broadcast Messages</h2>
                  </div>
                  <div>
                    {msgData.map((msg) => (
                      <Alert id={msg.id} variant="success">
                        {/* <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feather feather-message-circle"
                      >
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg> */}
                        <Alert.Heading>{msg.msg}</Alert.Heading>
                        <p>Date Posted {covertToReadableDate(msg.stDate)}</p>
                      </Alert>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )
        ) : (
          <div className="loading-spinner-dashboard">
            <LoadingData />
          </div>
        )}
        <div className="col-lg-12 DashboardContainer">
          {authData.user_type !== "staff" ? (
            <div className="neumorphism-box">
              <div className="statbox box box-shadow DashboardContainer">
                <div className="widget-heading">
                  <h2 className="wHeadingMain">Recent Enquiries</h2>
                </div>

                <div className="widget-content widget-content-area">
                  <DataTable
                    columns={enqColumns}
                    data={enqData}
                    progressPending={isEnqLoadingData}
                    progressComponent={
                      <LoadingData className="loading-spinner-flex" />
                    }
                  />
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="neumorphism-box">
            <div className="statbox box box-shadow">
              <div className="widget-heading">
                <h2 className="wHeadingMain">Recent Applications</h2>
              </div>
              <div className="widget-content widget-content-area">
                <DataTable
                  columns={appcolumns}
                  data={appData}
                  progressPending={isAppLoadingData}
                  progressComponent={
                    <LoadingData className="loading-spinner-flex" />
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* <div className="col-lg-4 widgetAreaDashboard gutter-sidebar-5">
          <div className="neumorphism-box">
            <div className="widget widget-activity-five">
              <div className="widget-content">
                <h2 className="wHeadingMain">Activity Log</h2>
                <div className="w-shadow-top"></div>

                <div className="mt-container mx-auto activity-log ">
                  {!isActivityLoadingData ? (
                    <div className="timeline-line">
                      {activityData.map((activity) => (
                        <div
                          key={activity.mapId}
                          className="item-timeline timeline-new"
                        >
                          <div className="t-dot">
                            <div className="t-secondary">
                              {
                                activitySVG[activity.actionTypeText][
                                  activity.actionStatusCode - 1
                                ]
                              }
                            </div>
                          </div>
                          <div className="t-content">
                            <div className="t-uppercontent">
                              <h5 className="activityLogHeading">
                                <Link to={activity.actionUrl}>
                                  {activity.actionTypeText}{" "}
                                  {activity.actionStatusText} For{" "}
                                  {activity.actionPersonName}
                                </Link>
                                {activity.isUerNeeded ? (
                                  <span> [By {activity.whoDid}]</span>
                                ) : (
                                  ""
                                )}
                              </h5>
                            </div>
                            <p>{activity.dateTime}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="loading-spinner-dashboard">
                      <LoadingData />
                    </div>
                  )}
                </div>

                <div className="w-shadow-bottom"></div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
}

export default HomePage;
