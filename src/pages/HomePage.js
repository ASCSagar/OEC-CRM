import React, { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import LoadingData from "../components/UI/LoadingData";
import { ajaxCallWithHeaderOnly } from "../helpers/ajaxCall";

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
      </div>
    </>
  );
}

export default HomePage;
