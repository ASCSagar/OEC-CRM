import React, { useEffect, useReducer, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { Form, Button } from "react-bootstrap";
import "react-select-search/style.css";
import { ajaxCall, ajaxCallWithHeaderOnly } from "../../helpers/ajaxCall";
import { useDispatch, useSelector } from "react-redux";
import SelectionBox from "../../components/UI/Form/SelectionBox";
import { useNavigate } from "react-router-dom";
import { uiAction } from "../../store/uiStore";
import LoadingData from "../../components/UI/LoadingData";
import CountryStateCity from "../../components/form/CountryStateCity";
import FileUpload from "../../components/UI/Form/FileUpload";
import SelectSearch from "react-select-search";

const InitialState = {
  stuName: "",
  stuPhone: "",
  stuEmail: "",
  stuAddress: "",
  stuState: "",
  stuStateISO: "",
  stuCountry: "India",
  stuCountryISO: "IN",
  stuZip: "",
  stuCity: "",
  stuCityISO: "",
  previousVisaRefusal: false,
  refusalDoc: null,
  currentEducation: "",
  countryInterested: 1,
  notes: "",
  enqStatus: "",
  passportNum: "",
  married: "",
  nationality: "",
  dob: null,
};

const reducer = (state, action) => {
  if (action?.all) {
    return {
      stuName: action.data.stuName,
      stuPhone: action.data.stuPhone,
      stuEmail: action.data.stuEmail,
      stuAddress: action.data.stuAddress,
      currentEducation: action.data.currentEducation,
      countryInterested: action.data.countryInterested
        ? action.data.countryInterested
        : 1,
      notes: action.data.notes,
      passportNum: action.data.passportNum,
      married: action.data.married,
      nationality: action.data.nationality,
      dob: action.data.dob,
      stuState: action.data.stuState,
      stuStateISO: action.data.stuStateISO,
      stuCountry: action.data.stuCountry,
      stuCountryISO: action.data.stuCountryISO,
      stuZip: action.data.stuZip,
      stuCity: action.data.stuCity,
      stuCityISO: action.data.stuCityISO,
      previousVisaRefusal: action.data.previousVisaRefusal,
      refusalDoc: action.data.refusalDoc,
    };
  }
  return { ...state, [action.type]: action.value };
};
function EnquiryForm(props) {
  const [enqData, setEnqData] = useState([]);
  const [loadError, setLoadError] = useState({
    isLoading: false,
    isError: false,
    isSubmitting: false,
  });
  const [throwErr, setThrowErr] = useState(null);
  const authData = useSelector((state) => state.authStore);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (throwErr) throw throwErr;
  }, [throwErr]);

  useEffect(() => {
    try {
      if (!props.edit) return;
      setLoadError({ isLoading: true, isError: false, isSubmitting: false });
      const data = async () => {
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
        setEnqData(response);
        dispatchInputChange({
          all: true,
          data: {
            stuName: response?.student_name,
            stuPhone: response?.student_phone,
            stuEmail: response?.student_email,
            stuAddress: response?.student_address,
            currentEducation: response?.current_education?.id,
            countryInterested: response?.country_interested?.id,
            notes: response?.notes,
            passportNum: response?.passport_number,
            married: response?.married,
            nationality: response?.nationality,
            dob: response?.dob,
            stuCountry: response?.country,
            stuCountryISO: response?.countryIso,
            stuState: response?.state,
            stuStateISO: response?.stateIso,
            stuCity: response?.city,
            stuCityISO: response?.cityIso,
            stuZip: response?.zipcode,
            previousVisaRefusal: response?.visa_refusal,
            refusalDoc: response?.visa_file,
          },
        });
        setLoadError({ isLoading: false, isError: false, isSubmitting: false });
      };
      data();
    } catch (e) {
      setThrowErr({ e, page: "enquiries" });
      return;
    }
  }, [props.enqId]);

  const [key, setKey] = useState(0);

  const [formData, dispatchInputChange] = useReducer(reducer, InitialState);
  const selectionBoxChanged = (fieldName, val, allVal) => {
    dispatchInputChange({
      type: fieldName,
      value: allVal.value,
    });
  };

  const addressChanged = (fieldName1, fieldName2, val, allVal) => {
    dispatchInputChange({
      type: fieldName1,
      value: allVal.value,
    });
    dispatchInputChange({
      type: fieldName2,
      value: allVal.name,
    });
  };
  const submitEnquiry = function (e) {
    e.preventDefault();
    try {
      const validateEmail = (email) => {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
      };
      if (!formData.stuName && !formData.stuName.trim()?.length) {
        setLoadError({
          isLoading: false,
          isSubmitting: false,
          isError: "Please write student name",
        });
        return;
      }
      if (!formData.stuName && formData.stuName.trim()?.length > 100) {
        setLoadError({
          isLoading: false,
          isSubmitting: false,
          isError: "Student Name should have max 100 characters",
        });
        return;
      }
      if (!formData.stuPhone && !formData.stuPhone.trim()?.length) {
        setLoadError({
          isLoading: false,
          isSubmitting: false,
          isError: "Please write student phone number",
        });
        return;
      }
      if (!formData.stuPhone && formData.stuPhone.trim()?.length > 20) {
        setLoadError({
          isLoading: false,
          isSubmitting: false,
          isError: "Phone Number should be max 20 digits.",
        });
        return;
      }

      if (!validateEmail(formData.stuEmail)) {
        setLoadError({
          isLoading: false,
          isSubmitting: false,
          isError: "Please enter correct email id",
        });
        return;
      }
      if (!formData.stuAddress.trim()?.length) {
        setLoadError({
          isLoading: false,
          isSubmitting: false,
          isError: "Please write student address",
        });
        return;
      }
      if (
        !formData.stuStateISO ||
        !formData.stuCountryISO ||
        !formData.stuCityISO ||
        !formData.stuZip ||
        !formData.currentEducation ||
        !formData.married ||
        !formData.nationality ||
        !formData.countryInterested ||
        !formData.dob
      ) {
        setLoadError({
          isLoading: false,
          isSubmitting: false,
          isError:
            "All fields are mandatory, Please fill all details to add Enquiry",
        });
        return;
      }
      const enqData = new FormData();
      enqData.append("student_name", formData.stuName);
      enqData.append("student_phone", formData.stuPhone);
      enqData.append("student_email", formData.stuEmail);
      enqData.append("student_address", formData.stuAddress);
      enqData.append("current_education", formData.currentEducation);
      enqData.append("country_interested", formData.countryInterested);
      enqData.append("notes", formData.notes);
      if (formData.passportNum)
        enqData.append("passport_number", formData.passportNum);
      enqData.append("married", formData.married);
      enqData.append("nationality", formData.nationality);
      enqData.append("dob", formData.dob);
      enqData.append("country", formData.stuCountry);
      enqData.append("countryIso", formData.stuCountryISO);
      enqData.append("state", formData.stuState);
      enqData.append("stateIso", formData.stuStateISO);
      enqData.append("city", formData.stuCity);
      enqData.append("cityIso", formData.stuCityISO);
      if (formData.stuZip) enqData.append("zipcode", +formData.stuZip);
      enqData.append("visa_refusal", formData.previousVisaRefusal);
      if (formData.refusalDoc && formData.refusalDoc instanceof File)
        enqData.append("visa_file", formData.refusalDoc);

      setLoadError({ isLoading: false, isError: false, isSubmitting: true });
      let url, method;
      if (props.edit) {
        url = `update-enquiry/${props.enqId}/`;
        method = "PATCH";
      } else {
        url = "add-enquiry/";
        method = "POST";
      }
      const data = async () => {
        const response = await ajaxCall(
          url,
          {
            Authorization: `Bearer ${authData.accessToken}`,
          },
          method,
          enqData
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
          setLoadError({
            isLoading: false,
            isSubmitting: false,
            isError: "Please check all form fields and try again",
          });
          return;
        }
        if (!response?.status) {
          if (props.edit) {
            dispatch(
              uiAction.setNotification({
                show: true,
                heading: "Enquiry",
                msg: `<strong>${formData.stuName}</strong> enquiry edited successfully`,
              })
            );
          } else
            dispatch(
              uiAction.setNotification({
                show: true,
                heading: "Enquiry",
                msg: `<strong>${formData.stuName}</strong> enquiry created successfully`,
              })
            );
          if (props?.isModal) {
            props?.closeIt();
          } else {
            navigate(`/enquiries/`);
          }
          setLoadError({
            isLoading: false,
            isError: false,
            isSubmitting: false,
          });
        } else {
          setThrowErr({ ...response, general: true, page: "enqForm" });
          return;
        }
      };
      data();
    } catch (e) {
      setThrowErr({ e, page: "enquiries" });
      return;
    }
  };

  const handleFileChange = (fileName, file) => {
    dispatchInputChange({ type: fileName, value: file });
  };
  if (loadError.isLoading) return <LoadingData className="loading-spinner" />;

  return (
    <div id="tabsSimple" className="col-xl-12 col-12 layout-spacing">
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
            <Form onSubmit={submitEnquiry}>
              <Tabs
                activeKey={key}
                onSelect={(k) => setKey(+k)}
                id="controlled-tab-example"
                className="mb-3"
              >
                <Tab eventKey={0} title="Student Info">
                  <div className="row">
                    <Form.Group className="mb-3 col-md-6" controlId="stuName">
                      <Form.Label>Student Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="stuName"
                        value={formData.stuName}
                        onChange={(e) =>
                          dispatchInputChange({
                            type: "stuName",
                            value: e.target.value,
                          })
                        }
                      />
                    </Form.Group>

                    <Form.Group className="mb-3 col-md-6" controlId="stuPhone">
                      <Form.Label>Student Phone</Form.Label>
                      <Form.Control
                        name="stuPhone"
                        type="text"
                        value={formData.stuPhone}
                        onChange={(e) =>
                          dispatchInputChange({
                            type: "stuPhone",
                            value: e.target.value,
                          })
                        }
                      />
                    </Form.Group>

                    <Form.Group className="mb-3 col-md-6" controlId="stuEmail">
                      <Form.Label>Student Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="stuEmail"
                        value={formData.stuEmail}
                        onChange={(e) =>
                          dispatchInputChange({
                            type: "stuEmail",
                            value: e.target.value,
                          })
                        }
                      />
                    </Form.Group>

                    <Form.Group
                      className="mb-3 col-md-6"
                      controlId="stuAddress"
                    >
                      <Form.Label>Student Address</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="stuAddress"
                        value={formData.stuAddress}
                        onChange={(e) =>
                          dispatchInputChange({
                            type: "stuAddress",
                            value: e.target.value,
                          })
                        }
                      />
                    </Form.Group>

                    <CountryStateCity
                      countryVal={formData.stuCountryISO}
                      stateVal={formData.stuStateISO}
                      cityVal={formData.stuCityISO}
                      countryChange={addressChanged.bind(
                        null,
                        "stuCountryISO",
                        "stuCountry"
                      )}
                      stateChange={addressChanged.bind(
                        null,
                        "stuStateISO",
                        "stuState"
                      )}
                      cityChange={addressChanged.bind(
                        null,
                        "stuCityISO",
                        "stuCity"
                      )}
                    />
                    <Form.Group
                      className="mb-3 col-md-6"
                      controlId="stuAddressZip"
                    >
                      <Form.Label>Student Zip Code</Form.Label>
                      <Form.Control
                        type="text"
                        name="stuAddressZip"
                        value={formData.stuZip}
                        onChange={(e) =>
                          dispatchInputChange({
                            type: "stuZip",
                            value: e.target.value,
                          })
                        }
                      />
                    </Form.Group>

                    <Form.Group
                      className="mb-3 col-md-6"
                      controlId="passportnum"
                    >
                      <Form.Label>passport Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="passportnum"
                        value={formData.passportNum}
                        onChange={(e) =>
                          dispatchInputChange({
                            type: "passportNum",
                            value: e.target.value,
                          })
                        }
                      />
                    </Form.Group>

                    <SelectionBox
                      groupClass="mb-3 col-md-6 selectbox"
                      groupId="married"
                      label="Married"
                      value={formData.married}
                      onChange={selectionBoxChanged.bind(null, "married")}
                      name="married"
                      isSearch={false}
                      col={[
                        { name: "Select Options", value: "" },
                        { name: "Yes", value: "True" },
                        { name: "No", value: "False" },
                      ]}
                    />

                    <Form.Group
                      className="mb-3 col-md-6"
                      controlId="nationality"
                    >
                      <Form.Label>Nationality</Form.Label>
                      <Form.Control
                        type="text"
                        name="nationality"
                        value={formData.nationality}
                        onChange={(e) =>
                          dispatchInputChange({
                            type: "nationality",
                            value: e.target.value,
                          })
                        }
                      />
                    </Form.Group>

                    <Form.Group className="mb-3 col-md-6" controlId="dob">
                      <Form.Label>Date Of Birth</Form.Label>
                      <Form.Control
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={(e) =>
                          dispatchInputChange({
                            type: "dob",
                            value: e.target.value,
                          })
                        }
                        max={new Date().toJSON().split("T")[0]}
                      />
                    </Form.Group>

                    <SelectionBox
                      groupClass="mb-3 col-md-6 selectbox"
                      groupId="currentEdu"
                      label="Current education"
                      value={formData.currentEducation}
                      onChange={selectionBoxChanged.bind(
                        null,
                        "currentEducation"
                      )}
                      name="currentEdu"
                      url="currenteducation/"
                      isSearch={true}
                      objKey="current_education"
                    />

                    <SelectionBox
                      groupClass="mb-3 col-md-6 selectbox"
                      groupId="countryInterested"
                      label="Country Interested"
                      value={formData.countryInterested}
                      onChange={selectionBoxChanged.bind(
                        null,
                        "countryInterested"
                      )}
                      name="countryInterested"
                      url="countries/"
                      isSearch={true}
                      objKey="country_name"
                    />
                    <Form.Group
                      className="mb-3 col-md-6 selectbox"
                      controlId="notes"
                    >
                      <Form.Label>
                        Do you have any previous visa refusal?
                      </Form.Label>
                      <SelectSearch
                        options={[
                          { name: "Yes", value: true },
                          { name: "No", value: false },
                        ]}
                        value={formData.previousVisaRefusal}
                        onChange={selectionBoxChanged.bind(
                          null,
                          "previousVisaRefusal"
                        )}
                        name="previousVisaRefusal"
                      />
                    </Form.Group>
                    {formData.previousVisaRefusal ? (
                      <>
                        <FileUpload
                          appId={props.appId}
                          uploadId="refusalDoc"
                          isEdit={props.edit}
                          onChange={handleFileChange.bind(null, "refusalDoc")}
                          groupId="refusalDoc"
                          groupClassName="mb-3 col-md-6 dragDropUpload noHeight"
                          label="Upload Document"
                          fieldName="refusalDoc"
                          minUploadSize="0.005"
                          maxUploadSize="0.5"
                          afile={formData.refusalDoc}
                        />
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="col-md-6">
                    <Form.Group className="mb-3 col-md-8" controlId="notes">
                      <Form.Label>Notes</Form.Label>
                      <Form.Control
                        as="textarea"
                        value={formData.notes}
                        name="notes"
                        onChange={(e) =>
                          dispatchInputChange({
                            type: "notes",
                            value: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </div>
                </Tab>
              </Tabs>
              <div className="col-md-12 flex-col-btns">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={loadError.isSubmitting}
                >
                  {loadError.isSubmitting ? "Submitting" : "Submit"}
                </Button>
              </div>
              <div className="col-md-12 text-center">
                {loadError.isError ? (
                  <p className="dengor">{loadError.isError}</p>
                ) : (
                  ""
                )}
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnquiryForm;
