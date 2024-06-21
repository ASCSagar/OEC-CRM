import React, { useEffect, useState } from "react";
import { ajaxCallWithHeaderOnly } from "../../helpers/ajaxCall";
import { useSelector } from "react-redux";
import LoadingData from "../../components/UI/LoadingData";
import SelectionBox from "../../components/UI/Form/SelectionBox";
import FileUpload from "../../components/UI/Form/FileUpload";

function ApplicantDetails(props) {
  // states and reducers
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const authData = useSelector((state) => state.authStore);
  const [throwErr, setThrowErr] = useState(null);

  useEffect(() => {
    if (throwErr) throw throwErr;
  }, [throwErr]);

  const getEnqdata = async () => {
    const response = await ajaxCallWithHeaderOnly(
      `enquiries/${props.enqId}/`,
      {
        Authorization: `Bearer ${authData.accessToken}`,
      },
      "POST",
      null
    );
    if (response?.isNetwork) {
      setThrowErr({ ...response, page: "enqForm" });
      return;
    }
    if (
      response?.status === 401 ||
      response?.status === 204 ||
      response?.status === 404
    ) {
      setThrowErr({ ...response, page: "enqForm" });
      return;
    }
    if (response?.status) {
      setThrowErr({ ...response, page: "enquiries" });
      return;
    }
    setData(response);
    setIsLoading(false);
  };
  useEffect(() => {
    if (props.enqId) {
      setIsLoading(true);
      getEnqdata();
    }
  }, [props.enqId]);

  if (isLoading) {
    return <LoadingData className="text-center" />;
  }

  return (
    <div className="applicantDetailsApp">
      <h2 className="mb-3 text-center">Applicant Details</h2>
      <span>Name</span> : <span>{data.student_name}</span>
      <span>Phone</span> : <span>{data.student_phone}</span>
      <span>Email Id</span> : <span>{data.student_email}</span>
      <span>Address</span> :
      <span>
        {data.student_address}, {data.city}, {data.state}, {data.zipcode} -
        {data.country}
      </span>
      <span>Current Education</span> :
      <span>{data.current_education?.current_education}</span>{" "}
      <span>Previous Visa Refusal</span> :
      <span>{data.visa_refusal ? "YES" : "NO"}</span>
      <span>Visa Refusal File</span> :
      <span>
        {data.visa_file ? (
          <a href={data.visa_file} target="_blank" rel="noreferrer">
            Download File
          </a>
        ) : (
          "-"
        )}
      </span>
      <span>DOB</span> : <span>{data.dob.split("-").reverse().join("-")}</span>
      <span>Passport Number</span> : <span>{data.passport_number}</span>
      <span>Is Married</span> : <span>{data.married ? "Yes" : "No"}</span>
      <span>Enquiry Date</span> :
      <span>{data.date_created.split("-").reverse().join("-")}</span>
      <span>University Interested</span> :
      <span>
        {
          <SelectionBox
            groupClass="mb-3 col-md-12 selectbox"
            groupId="uniInterested"
            value={props.university_interested}
            onChange={(val) => {
              props.dispatchFunction({
                type: "university_interested",
                value: val,
              });
            }}
            name="uniInterested"
            url={`universitieslists/?country=${data.country_interested.id}`}
            isSearch={true}
            objKey="univ_name"
          />
        }
      </span>
      <span>Intake Interested</span> :
      <span>
        {
          <SelectionBox
            groupClass="mb-3 col-md-12 selectbox"
            groupId="intakeInterested"
            value={props.intake_interested}
            onChange={(val) => {
              props.dispatchFunction({
                type: "intake_interested",
                value: val,
              });
            }}
            name="intakeInterested"
            url="intakes/"
            isSearch={true}
            objKey="it's different"
          />
        }
      </span>
      <span>Level Applying For</span> :
      <span>
        <SelectionBox
          groupClass="mb-3 col-md-12 selectbox"
          groupId="levelApplying"
          value={props.level_applying_for}
          onChange={(val) => {
            props.dispatchFunction({
              type: "level_applying_for",
              value: val,
            });
          }}
          name="levelApplying"
          url="courselevels/"
          isSearch={true}
          objKey="levels"
        />
      </span>
      <span>Course Interested</span>:
      <span>
        {
          <SelectionBox
            groupClass="mb-3 col-md-12 selectbox"
            groupId="courseIntersted"
            value={props.course_interested}
            onChange={(val) => {
              props.dispatchFunction({
                type: "course_interested",
                value: val,
              });
            }}
            name="courseInterested"
            url={
              props.university_interested && props.level_applying_for
                ? `courseslists/?university=${props.university_interested}&course_levels=${props.level_applying_for}`
                : ""
            }
            isSearch={true}
            objKey="course_name"
          />
        }
      </span>
      <span>SOP</span>:
      <span>
        <FileUpload
          appId={props.appId}
          uploadId="Sop"
          isEdit={true}
          onChange={(val) => {
            props.dispatchFunction({
              type: "sop",
              value: val,
            });
          }}
          groupId="sopFile"
          groupClassName="mb-3  dragDropUpload col-md-12"
          fieldName="sopFileIp"
          minUploadSize="0.005"
          maxUploadSize="10"
          afile={props.sop}
        />
      </span>
      <span>Offer Letter</span>:
      <span>
        <FileUpload
          appId={props.appId}
          uploadId="rcvd_offer_letter"
          isEdit={true}
          onChange={(val) => {
            props.dispatchFunction({
              type: "rcvd_offer_letter",
              value: val,
            });
          }}
          groupId="rcvd_offer_letter"
          groupClassName="mb-3  dragDropUpload col-md-12"
          fieldName="rcvd_offer_letterIP"
          minUploadSize="0.005"
          maxUploadSize="10"
          afile={props.rcvd_offer_letter}
        />
      </span>
      {authData.user_type === "superuser" ? (
        <>
          <span>Assigned Users</span> :
          <SelectionBox
            groupClass={`mb-3 selectbox `}
            groupId="assignedUser"
            onChange={props.handleChange.bind(null, "assignedUser")}
            name="assignedUser"
            url="userlist/"
            value={props.assignedUser}
            isSearch={true}
            objKey="username"
          />
        </>
      ) : (
        ""
      )}
      {authData.user_type !== "Agent" ? (
        <>
          <span>Status</span> :
          <SelectionBox
            groupClass={`mb-3 selectbox `}
            groupId="status"
            onChange={props.handleChange.bind(null, "status")}
            name="status"
            url="appstatus/"
            value={props.status}
            objKey="App_status"
          />
        </>
      ) : (
        ""
      )}
      <span>Comments</span> : <span>{data?.notes ? data.notes : ""}</span>
    </div>
  );
}

export default ApplicantDetails;
