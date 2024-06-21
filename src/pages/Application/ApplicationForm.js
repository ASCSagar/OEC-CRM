import React, { useEffect, useReducer, useState } from "react";
import { Button } from "react-bootstrap";
import "react-select-search/style.css";
import FileUpload from "../../components/UI/Form/FileUpload";
import SelectionBox from "../../components/UI/Form/SelectionBox";
import { ajaxCall, ajaxCallWithHeaderOnly } from "../../helpers/ajaxCall";
import { useDispatch, useSelector } from "react-redux";
import LoadingData from "../../components/UI/LoadingData";
import { useNavigate } from "react-router-dom";
import { uiAction } from "../../store/uiStore";
import ApplicantDetails from "./ApplicantDetails";

const initialState = {
  enqId: null,
  tenthMarksheet: null,
  twelvethMarksheet: null,
  diplomaMarksheet: null,
  bachelorMarksheet: null,
  masterMarksheet: null,
  lor: null,
  resume: null,
  languageExam: null,
  passport: null,
  assignedUser: null,
  status: null,

  sop: null,
  rcvd_offer_letter: null,
  university_interested: "",
  course_interested: "",
  intake_interested: "",
  level_applying_for: "",
};

const reducerFile = (state, action) => {
  if (action?.all) {
    return {
      enqId: action.data.enqId,
      tenthMarksheet: action.data.tenthMarksheet,
      twelvethMarksheet: action.data.twelvethMarksheet,
      diplomaMarksheet: action.data.diplomaMarksheet,
      bachelorMarksheet: action.data.bachelorMarksheet,
      masterMarksheet: action.data.masterMarksheet,
      lor: action.data.lor,
      resume: action.data.resume,
      languageExam: action.data.languageExam,
      passport: action.data.passport,
      assignedUser: action.data.assignedUser,
      status: action.data.status,

      sop: action.data.sop,
      rcvd_offer_letter: action.data.rcvd_offer_letter,
      university_interested: action.data.university_interested,
      course_interested: action.data.course_interested,
      intake_interested: action.data.intake_interested,
      level_applying_for: action.data.level_applying_for,
    };
  }
  return { ...state, [action.type]: action.value };
};

function ApplicationForm(props) {
  const [appData, setAppData] = useState([]);
  const [fileData, dispatchFile] = useReducer(reducerFile, initialState);
  const [loadError, setLoadError] = useState({
    isLoading: false,
    isError: false,
    isSubmitting: false,
  });
  const [throwErr, setThrowErr] = useState(null);
  const authData = useSelector((state) => state.authStore);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (fileName, file) => {
    dispatchFile({ type: fileName, value: file });
  };

  useEffect(() => {
    if (throwErr) throw throwErr;
  }, [throwErr]);

  const data = async () => {
    const response = await ajaxCallWithHeaderOnly(
      `get/courseinfo/?courseinfo_id=${props.appId}`,
      {
        Authorization: `Bearer ${authData.accessToken}`,
      },
      "POST",
      null
    );
    if (response?.isNetwork) {
      setThrowErr({ ...response, page: "appForm" });
      return;
    }
    if (response?.status === 401 || response?.status === 204) {
      setThrowErr({ ...response, page: "appForm" });
      return;
    }
    if (response?.status === 404) {
      setThrowErr({ ...response, status: 204, page: "appForm" });
      return;
    }
    setAppData(response.results[0]);
    const mainResponse = response.results[0];
    dispatchFile({
      all: true,
      data: {
        enqId: mainResponse?.student_info?.name?.id,
        tenthMarksheet: mainResponse.student_info?.Tenth_Marksheet,
        twelvethMarksheet: mainResponse.student_info?.Twelveth_Marksheet,
        diplomaMarksheet: mainResponse.student_info?.Diploma_Marksheet,
        bachelorMarksheet: mainResponse.student_info?.Bachelor_Marksheet,
        masterMarksheet: mainResponse.student_info?.Master_Marksheet,
        passport: mainResponse.student_info?.passport,
        lor: mainResponse.student_info?.Lor,
        resume: mainResponse.student_info?.Resume,
        languageExam: mainResponse.student_info?.Language_Exam,
        assignedUser: mainResponse?.assigned_users?.id,
        status: mainResponse?.status?.id,

        sop: mainResponse?.Sop,
        rcvd_offer_letter: mainResponse?.rcvd_offer_letter,
        university_interested: mainResponse?.university_interested?.id,
        course_interested: mainResponse?.course_interested?.id,
        intake_interested: mainResponse?.intake_interested?.id,
        level_applying_for: mainResponse?.level_applying_for?.id,
      },
    });
    setLoadError({
      ...loadError,
      isLoading: false,
      isError: false,
      isSubmitting: false,
    });
  };
  useEffect(() => {
    if (!props.edit) {
      if (props.enqID) {
        dispatchFile({ type: "enqId", value: props.enqID });
      }
      return;
    }
    setLoadError({
      ...loadError,
      isLoading: true,
      isError: false,
      isSubmitting: false,
    });
    try {
      data();
    } catch (e) {
      setThrowErr({ e, page: "enquiries" });
      return;
    }
  }, [props.appId]);
  const submitApp = async function () {
    try {
      if (!fileData.enqId) {
        setLoadError({
          ...loadError,
          isError: "Please Select Student Name",
          isLoading: false,
          isSubmitting: false,
        });
        return;
      }
      let err = "Please upload ",
        isErr = false;
      if (!fileData.tenthMarksheet) {
        err += "10th Marksheet";
        isErr = true;
      }
      if (!fileData.twelvethMarksheet) {
        err += isErr ? ", " : "";
        err += "12th Marsksheet";
        isErr = true;
      }
      if (!fileData.passport) {
        err += isErr ? ", " : "";
        err += "passport";
        isErr = true;
      }
      if (!fileData.sop) {
        err += isErr ? ", " : "";
        err += "sop";
        isErr = true;
      }
      if (!fileData.lor) {
        err += isErr ? ", " : "";
        err += "lor";
        isErr = true;
      }
      if (!fileData.resume) {
        err += isErr ? ", " : "";
        err += "resume";
        isErr = true;
      }
      if (err.length > 14) {
        setLoadError({
          ...loadError,
          isError: err + " document.",
          isLoading: false,
          isSubmitting: false,
        });
        return;
      }
      setLoadError({
        ...loadError,
        isLoading: false,
        isError: false,
        isSubmitting: true,
      });

      const fdata = new FormData();
      fdata.append("name", fileData.enqId);

      if (fileData.tenthMarksheet instanceof File)
        fdata.append("Tenth_Marksheet", fileData.tenthMarksheet);
      if (fileData.diplomaMarksheet instanceof File)
        fdata.append("Diploma_Marksheet", fileData.diplomaMarksheet);
      if (fileData.twelvethMarksheet instanceof File)
        fdata.append("Twelveth_Marksheet", fileData.twelvethMarksheet);
      if (fileData.bachelorMarksheet instanceof File)
        fdata.append("Bachelor_Marksheet", fileData.bachelorMarksheet);
      if (fileData.masterMarksheet instanceof File)
        fdata.append("Master_Marksheet", fileData.masterMarksheet);
      if (fileData.lor instanceof File) fdata.append("Lor", fileData.lor);

      if (fileData.resume instanceof File)
        fdata.append("Resume", fileData.resume);
      if (fileData.languageExam instanceof File)
        fdata.append("Language_Exam", fileData.languageExam);

      if (fileData.passport instanceof File)
        fdata.append("passport", fileData.passport);
      fdata.append("university_interested", fileData.university_interested);
      fdata.append("course_interested", fileData.course_interested);
      fdata.append("intake_interested", fileData.intake_interested);
      fdata.append("level_applying_for", fileData.level_applying_for);
      if (fileData.assignedUser)
        fdata.append("assigned_users", fileData.assignedUser);
      if (fileData.status) fdata.append("status", fileData.status);
      if (fileData.sop instanceof File) fdata.append("Sop", fileData.sop);
      if (fileData.rcvd_offer_letter instanceof File)
        fdata.append("rcvd_offer_letter", fileData.rcvd_offer_letter);
      let url, method;
      if (props.edit) {
        url = `create/app/courseinfo/${appData?.application}/?course_id=${props.appId}`;
        method = "PATCH";
      } else {
        url = "create/app/courseinfo/";
        method = "POST";
      }
      const response = await ajaxCall(
        url,
        {
          Authorization: `Bearer ${authData.accessToken}`,
        },
        method,
        fdata
      );
      if (response?.isNetwork) {
        setThrowErr({ ...response, page: "enqForm" });
        return;
      }
      if (response?.status === 401 || response?.status === 204) {
        setThrowErr({ ...response, page: "enqForm" });
        return;
      }
      if (response?.status === 400) {
        setLoadError((data) => {
          return {
            ...data,

            isError: "Please check all form fields and try again",
            isSubmitting: false,
          };
        });
        return;
      }
      setLoadError((data) => {
        return {
          ...data,
          isError: false,
          isSubmitting: false,
        };
      });
      if (props.edit) {
        dispatch(
          uiAction.setNotification({
            show: true,
            heading: "Application",
            msg: `Application Id <strong>${fileData.enqId}</strong> edited successfully`,
          })
        );
      } else
        dispatch(
          uiAction.setNotification({
            show: true,
            heading: "Application",
            msg: `Application created successfully`,
          })
        );
      navigate(`/applications/`);
    } catch (e) {
      setThrowErr({ e, page: "enquiries" });
      return;
    }
  };

  if (loadError.isLoading) return <LoadingData className="loading-spinner" />;

  return (
    <>
      <div className="row">
        <div id="tabsSimple" className={`layout-spacing col-md-12`}>
          <div className="row">
            <div className="col-md-6">
              <div className="neumorphism-box">
                <div className="statbox box box-shadow">
                  <div className="widget-header">
                    <div className="row">
                      <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                        <h4>{props.title}</h4>
                      </div>
                    </div>
                  </div>

                  <div className="widget-content widget-content-area">
                    <div className="row">
                      <SelectionBox
                        disabled={props.edit}
                        groupClass={`mb-3 selectbox`}
                        groupId="enqId"
                        label="Name"
                        value={fileData.enqId}
                        onChange={handleChange.bind(null, "enqId")}
                        name="enqId"
                        url={
                          props.edit
                            ? fileData.enqId
                              ? `view-enquiry/?id=${fileData.enqId}`
                              : ""
                            : `view-enquiry/`
                        }
                        isSearch={true}
                        objKey="student_name"
                      />
                      <div className="row ">
                        <FileUpload
                          appId={props.appId}
                          uploadId="passport"
                          isEdit={props.edit}
                          onChange={handleChange.bind(null, "passport")}
                          groupId="passport"
                          groupClassName="mb-3 dragDropUpload col-md-4"
                          label="Passport"
                          fieldName="passportIP"
                          minUploadSize="0.005"
                          maxUploadSize="10"
                          afile={fileData.passport}
                        />
                        <FileUpload
                          appId={props.appId}
                          uploadId="Tenth_Marksheet"
                          isEdit={props.edit}
                          onChange={handleChange.bind(null, "tenthMarksheet")}
                          groupId="tenthMarksheet"
                          groupClassName="mb-3 col-md-4 dragDropUpload"
                          label="10th Marksheet"
                          fieldName="tenthMarksheetIp"
                          minUploadSize="0.005"
                          maxUploadSize="10"
                          afile={fileData.tenthMarksheet}
                        />
                        <FileUpload
                          appId={props.appId}
                          uploadId="Twelveth_Marksheet"
                          isEdit={props.edit}
                          onChange={handleChange.bind(
                            null,
                            "twelvethMarksheet"
                          )}
                          groupId="twelthMarksheet"
                          groupClassName="mb-3  dragDropUpload col-md-4"
                          label="12th Marksheet"
                          fieldName="twelthMarksheetIp"
                          minUploadSize="0.005"
                          maxUploadSize="10"
                          afile={fileData.twelvethMarksheet}
                        />

                        <FileUpload
                          appId={props.appId}
                          uploadId="Resume"
                          isEdit={props.edit}
                          onChange={handleChange.bind(null, "resume")}
                          groupId="resumeFile"
                          groupClassName="mb-3 dragDropUpload col-md-6"
                          label="Resume"
                          fieldName="resumeFileIp"
                          minUploadSize="0.005"
                          maxUploadSize="10"
                          afile={fileData.resume}
                        />

                        <FileUpload
                          appId={props.appId}
                          uploadId="Lor"
                          isEdit={props.edit}
                          onChange={handleChange.bind(null, "lor")}
                          groupId="lorFile"
                          groupClassName="mb-3  dragDropUpload col-md-6"
                          label="Lor"
                          fieldName="lorFileIp"
                          minUploadSize="0.005"
                          maxUploadSize="10"
                          afile={fileData.lor}
                        />
                        <hr />
                        <FileUpload
                          appId={props.appId}
                          uploadId="Diploma_Marksheet"
                          isEdit={props.edit}
                          onChange={handleChange.bind(null, "diplomaMarksheet")}
                          groupId="diplomaMarksheet"
                          groupClassName="mb-3  dragDropUpload col-md-6"
                          label="Diploma Marksheet"
                          fieldName="diplomaMarksheetIp"
                          minUploadSize="0.005"
                          maxUploadSize="10"
                          afile={fileData.diplomaMarksheet}
                        />

                        <FileUpload
                          appId={props.appId}
                          uploadId="Bachelor_Marksheet"
                          isEdit={props.edit}
                          onChange={handleChange.bind(
                            null,
                            "bachelorMarksheet"
                          )}
                          groupId="bachlorMarksheet"
                          groupClassName="mb-3  dragDropUpload col-md-6"
                          label="Bachelor Marksheet"
                          fieldName="bachlorMarksheetIp"
                          minUploadSize="0.005"
                          maxUploadSize="10"
                          afile={fileData.bachelorMarksheet}
                        />

                        <FileUpload
                          appId={props.appId}
                          uploadId="Master_Marksheet"
                          isEdit={props.edit}
                          onChange={handleChange.bind(null, "masterMarksheet")}
                          groupId="masterMarksheet"
                          groupClassName="mb-3  dragDropUpload col-md-6"
                          label="Master Marksheet"
                          fieldName="masterMarksheetIp"
                          minUploadSize="0.005"
                          maxUploadSize="10"
                          afile={fileData.masterMarksheet}
                        />

                        <FileUpload
                          appId={props.appId}
                          uploadId="Language_Exam"
                          isEdit={props.edit}
                          onChange={handleChange.bind(null, "languageExam")}
                          groupId="languageExam"
                          groupClassName="mb-3 dragDropUpload col-md-6"
                          label="Language Exam"
                          fieldName="languageExamIp"
                          minUploadSize="0.005"
                          maxUploadSize="10"
                          afile={fileData.languageExam}
                        />
                      </div>

                      <div className="col-md-12">
                        <Button
                          variant="primary"
                          type="submit"
                          onClick={submitApp}
                          disabled={loadError.isSubmitting}
                        >
                          {loadError.isSubmitting ? "Submitting" : "Submit"}
                        </Button>
                        {loadError.isError ? (
                          <p className="dengor">{loadError.isError}</p>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {fileData.enqId ? (
              <div className="col-md-6">
                <div className="neumorphism-box">
                  <ApplicantDetails
                    enqId={fileData.enqId}
                    sop={fileData.sop}
                    rcvd_offer_letter={fileData.rcvd_offer_letter}
                    university_interested={fileData.university_interested}
                    course_interested={fileData.course_interested}
                    intake_interested={fileData.intake_interested}
                    level_applying_for={fileData.level_applying_for}
                    dispatchFunction={dispatchFile}
                    handleChange={handleChange}
                    assignedUser={fileData.assignedUser}
                    status={fileData.status}
                  />
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ApplicationForm;
