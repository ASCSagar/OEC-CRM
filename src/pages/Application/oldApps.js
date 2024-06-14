import React, { useEffect, useRef, useState } from "react";
import { Button, Form, OverlayTrigger, Popover } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ColumnFilter from "../../components/Filter/ColumnFilter";
import LoadingData from "../../components/UI/LoadingData";
import UiModal from "../../components/UI/UiModal";
import {
  ajaxCall,
  ajaxCallWithHeaderOnly,
  ajaxCallWithoutBody,
} from "../../helpers/ajaxCall";
import { uiAction } from "../../store/uiStore";
import OptionFilter from "./OptionFilter";
import SelectSearch from "react-select-search";
import { FileUploader } from "react-drag-drop-files";
import UploadOfferLetter from "../../components/app/UploadOfferLetter";

const allColumns = [
  { name: "Name", id: "enqId" },
  { name: "Tenth Marksheet", id: "tenthMarksheet" },
  { name: "Twelveth Marksheet", id: "twelvethMarksheet" },
  { name: "Diploma Marksheet", id: "diplomaMarksheet" },
  { name: "Bachelor Marksheet", id: "bachelorMarksheet" },
  { name: "Master Marksheet", id: "masterMarksheet" },
  { name: "LOR", id: "lor" },
  { name: "SOP", id: "sop" },
  { name: "Resume", id: "resume" },
  { name: "Language Exam", id: "languageExam" },
  { name: "Assigned User", id: "assignedUser" },
  { name: "Status", id: "status" },
  { name: "Added By", id: "addedBy" },
  { name: "University Interested", id: "uniI" },
  { name: "Course Interested", id: "courseI" },
  { name: "Application Date", id: "date" },
  { name: "Passport", id: "passport" },
];

const parseData = function (response, setModalStatus) {
  // console.log("response is", response);
  if (response?.results?.length) {
    return response.results.map((data) => {
      const dateObj = new Date(data?.created_at);
      const day = dateObj.getDate();
      const month = dateObj.getMonth() + 1; // Months are zero-based, so we add 1
      const year = dateObj.getFullYear();
      const formattedDate = `${day < 10 ? "0" + day : day}-${
        month < 10 ? "0" + month : month
      }-${year}`;
      return {
        ...data,
        created_at: formattedDate,
        name: data?.name?.student_name,
        status: data?.status?.App_status,
        added_by: data?.added_by?.username,
        assigned_users: data?.assigned_users?.username,
        Tenth_Marksheet: data?.Tenth_Marksheet ? (
          <img
            onClick={() => {
              setModalStatus({
                showModal: true,
                showHeader: true,
                headerContent: "Tenth Marksheet",
                bodyContent: (
                  <img
                    src={data?.Tenth_Marksheet}
                    alt="Tenth Marksheet (click to open)"
                    className="app-img"
                  />
                ),
                showFooter: true,
                footerContent: (
                  <>
                    <button
                      class="btn btn-outline-primary mb-2 me-4"
                      onClick={() => {
                        window.open(data?.Tenth_Marksheet);
                      }}
                    >
                      Open Image &nbsp;
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M10 6v2H5v11h11v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6zm11-3v9l-3.794-3.793l-5.999 6l-1.414-1.414l5.999-6L12 3h9z"
                        />
                      </svg>
                    </button>
                    <a
                      className="btn btn-outline-primary mb-2 me-4"
                      target="_blank"
                      rel="noreferrer"
                      href={data?.Tenth_Marksheet}
                      download
                    >
                      Download Document
                    </a>
                  </>
                ),
              });
            }}
            src={data?.Tenth_Marksheet}
            alt="Tenth Marksheet"
            style={{ width: "100%" }}
          />
        ) : (
          "-"
        ),
        passport: data?.passport ? (
          <img
            onClick={() => {
              setModalStatus({
                showModal: true,
                showHeader: true,
                headerContent: "Passport",
                bodyContent: (
                  <img
                    src={data?.passport}
                    alt="Passport (click to open)"
                    className="app-img"
                  />
                ),
                showFooter: true,
                footerContent: (
                  <>
                    <button
                      class="btn btn-outline-primary mb-2 me-4"
                      onClick={() => {
                        window.open(data?.passport);
                      }}
                    >
                      Open Image &nbsp;
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M10 6v2H5v11h11v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6zm11-3v9l-3.794-3.793l-5.999 6l-1.414-1.414l5.999-6L12 3h9z"
                        />
                      </svg>
                    </button>
                    <a
                      className="btn btn-outline-primary mb-2 me-4"
                      target="_blank"
                      rel="noreferrer"
                      href={data?.passport}
                      download
                    >
                      Download Document
                    </a>
                  </>
                ),
              });
            }}
            src={data?.passport}
            alt="Passport"
            style={{ width: "100%" }}
          />
        ) : (
          "-"
        ),
        Twelveth_Marksheet: data?.Twelveth_Marksheet ? (
          <img
            src={data?.Twelveth_Marksheet}
            alt="Twelveth Marksheet"
            style={{ width: "100%" }}
            onClick={() => {
              setModalStatus({
                showModal: true,
                showHeader: true,
                headerContent: "Twelveth Marksheet",
                bodyContent: (
                  <img
                    src={data?.Twelveth_Marksheet}
                    alt="Twelveth Marksheet"
                    className="app-img"
                  />
                ),
                showFooter: true,
                footerContent: (
                  <>
                    <button
                      class="btn btn-outline-dark mb-2 me-4"
                      onClick={() => {
                        window.open(data?.Twelveth_Marksheet);
                      }}
                    >
                      Open Image &nbsp;
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M10 6v2H5v11h11v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6zm11-3v9l-3.794-3.793l-5.999 6l-1.414-1.414l5.999-6L12 3h9z"
                        />
                      </svg>
                    </button>
                    <a
                      className="btn btn-outline-primary mb-2 me-4"
                      href={data?.Twelveth_Marksheet}
                      download
                    >
                      Download Document
                    </a>
                  </>
                ),
              });
            }}
          />
        ) : (
          "-"
        ),
        Diploma_Marksheet: data?.Diploma_Marksheet ? (
          <img
            src={data?.Diploma_Marksheet}
            alt="Diploma Marksheet(Click to open)"
            style={{ width: "100%" }}
            onClick={() => {
              setModalStatus({
                showModal: true,
                showHeader: true,
                headerContent: "Diploma Marksheet",
                bodyContent: (
                  <img
                    src={data?.Diploma_Marksheet}
                    alt="Diploma Marksheet"
                    className="app-img"
                  />
                ),
                showFooter: true,
                footerContent: (
                  <>
                    <button
                      class="btn btn-outline-dark mb-2 me-4"
                      onClick={() => {
                        window.open(data?.Diploma_Marksheet);
                      }}
                    >
                      Open Image &nbsp;
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M10 6v2H5v11h11v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6zm11-3v9l-3.794-3.793l-5.999 6l-1.414-1.414l5.999-6L12 3h9z"
                        />
                      </svg>
                    </button>
                    <a
                      className="btn btn-outline-primary mb-2 me-4"
                      href={data?.Diploma_Marksheet}
                      download
                    >
                      Download Document
                    </a>
                  </>
                ),
              });
            }}
          />
        ) : (
          "-"
        ),
        Bachelor_Exam: data?.Bachelor_Exam ? (
          <img
            src={data?.Bachelor_Exam}
            alt="Bachelor Exam"
            style={{ width: "100%" }}
            onClick={() => {
              setModalStatus({
                showModal: true,
                showHeader: true,
                headerContent: "Bachelor Exam",
                bodyContent: (
                  <img
                    src={data?.Bachelor_Exam}
                    alt="Bachelor Exam (click to open)"
                    className="app-img"
                  />
                ),
                showFooter: true,
                footerContent: (
                  <>
                    <button
                      class="btn btn-outline-dark mb-2 me-4"
                      onClick={() => {
                        window.open(data?.Bachelor_Exam);
                      }}
                    >
                      Open Image &nbsp;
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M10 6v2H5v11h11v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6zm11-3v9l-3.794-3.793l-5.999 6l-1.414-1.414l5.999-6L12 3h9z"
                        />
                      </svg>
                    </button>
                    <a
                      className="btn btn-outline-primary mb-2 me-4"
                      href={data?.Bachelor_Exam}
                      download
                    >
                      Download Document
                    </a>
                  </>
                ),
              });
            }}
          />
        ) : (
          "-"
        ),
        Master_Marksheet: data?.Master_Marksheet ? (
          <img
            src={data?.Master_Marksheet}
            alt="Master Marksheet (Click to open)"
            style={{ width: "100%" }}
            onClick={() => {
              setModalStatus({
                showModal: true,
                showHeader: true,
                headerContent: "Master Marksheet",
                bodyContent: (
                  <img
                    src={data?.Master_Marksheet}
                    alt="Master Marksheet"
                    className="app-img"
                  />
                ),
                showFooter: true,
                footerContent: (
                  <>
                    <button
                      class="btn btn-outline-dark mb-2 me-4"
                      onClick={() => {
                        window.open(data?.Master_Marksheet);
                      }}
                    >
                      Open Image &nbsp;
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M10 6v2H5v11h11v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6zm11-3v9l-3.794-3.793l-5.999 6l-1.414-1.414l5.999-6L12 3h9z"
                        />
                      </svg>
                    </button>
                    <a
                      className="btn btn-outline-primary mb-2 me-4"
                      href={data?.Master_Marksheet}
                      download
                    >
                      Download Document
                    </a>
                  </>
                ),
              });
            }}
          />
        ) : (
          "-"
        ),
        Lor: data?.Lor ? (
          <img
            src={data?.Lor}
            alt="Lor (Click to open)"
            style={{ width: "100%" }}
            onClick={() => {
              setModalStatus({
                showModal: true,
                showHeader: true,
                headerContent: "Lor",
                bodyContent: (
                  <img src={data?.Lor} alt="Lor" className="app-img" />
                ),
                showFooter: true,
                footerContent: (
                  <button
                    class="btn btn-outline-dark mb-2 me-4"
                    onClick={() => {
                      window.open(data?.Lor);
                    }}
                  >
                    Open Image &nbsp;
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M10 6v2H5v11h11v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6zm11-3v9l-3.794-3.793l-5.999 6l-1.414-1.414l5.999-6L12 3h9z"
                      />
                    </svg>
                  </button>
                ),
              });
            }}
          />
        ) : (
          "-"
        ),
        Sop: data?.Sop ? (
          <img
            src={data?.Sop}
            alt="Sop (Click to open)"
            style={{ width: "100%" }}
            onClick={() => {
              setModalStatus({
                showModal: true,
                showHeader: true,
                headerContent: "Sop",
                bodyContent: (
                  <img src={data?.Sop} alt="Sop" className="app-img" />
                ),
                showFooter: true,
                footerContent: (
                  <>
                    <button
                      class="btn btn-outline-dark mb-2 me-4"
                      onClick={() => {
                        window.open(data?.Sop);
                      }}
                    >
                      Open Image &nbsp;
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M10 6v2H5v11h11v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6zm11-3v9l-3.794-3.793l-5.999 6l-1.414-1.414l5.999-6L12 3h9z"
                        />
                      </svg>
                    </button>
                    <a
                      className="btn btn-outline-primary mb-2 me-4"
                      href={data?.Master_Marksheet}
                      download
                    >
                      Download Document
                    </a>
                  </>
                ),
              });
            }}
          />
        ) : (
          "-"
        ),
        Resume: data?.Resume ? (
          <img
            src={data?.Resume}
            alt="Resume(Click to open)"
            style={{ width: "100%" }}
            onClick={() => {
              setModalStatus({
                showModal: true,
                showHeader: true,
                headerContent: "Resume",
                bodyContent: (
                  <img src={data?.Resume} alt="Resume" className="app-img" />
                ),
                showFooter: true,
                footerContent: (
                  <>
                    <button
                      class="btn btn-outline-dark mb-2 me-4"
                      onClick={() => {
                        window.open(data?.Resume);
                      }}
                    >
                      Open Image &nbsp;
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M10 6v2H5v11h11v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6zm11-3v9l-3.794-3.793l-5.999 6l-1.414-1.414l5.999-6L12 3h9z"
                        />
                      </svg>
                    </button>
                    <a
                      className="btn btn-outline-primary mb-2 me-4"
                      href={data?.Resume}
                      download
                    >
                      Download Document
                    </a>
                  </>
                ),
              });
            }}
          />
        ) : (
          "-"
        ),
        Language_Exam: data?.Language_Exam ? (
          <img
            src={data?.Language_Exam}
            alt="Language Exam"
            style={{ width: "100%" }}
            onClick={() => {
              setModalStatus({
                showModal: true,
                showHeader: true,
                headerContent: "Language Exam",
                bodyContent: (
                  <img
                    src={data?.Language_Exam}
                    alt="Language Exam(click to open)"
                    className="app-img"
                  />
                ),
                showFooter: true,
                footerContent: (
                  <>
                    <button
                      class="btn btn-outline-dark mb-2 me-4"
                      onClick={() => {
                        window.open(data?.Language_Exam);
                      }}
                    >
                      Open Image &nbsp;
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M10 6v2H5v11h11v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6zm11-3v9l-3.794-3.793l-5.999 6l-1.414-1.414l5.999-6L12 3h9z"
                        />
                      </svg>
                    </button>
                    <a
                      className="btn btn-outline-primary mb-2 me-4"
                      href={data?.Language_Exam}
                      download
                    >
                      Download Document
                    </a>
                  </>
                ),
              });
            }}
          />
        ) : (
          "-"
        ),
      };
    });
  } else return [];
};
function Applications(props) {
  const [enqData, setEnqData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [promptStatus, setPromptStatus] = useState(false);
  const [modalStatus, setModalStatus] = useState({
    showModal: false,
    showHeader: false,
    headerContent: null,
    bodyContent: null,
    showFooter: false,
    footerContent: null,
  });
  const [appFilter, setAppFilter] = useState({
    enquiry_status: null,
  });
  const [selectedRows, setSelectedRows] = useState([]);
  // data table code starts
  const [pageNo, setPageNo] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [throwErr, setThrowErr] = useState(null);
  const [refreshNeeded, setRefresherNeeded] = useState(true);
  // ref for ref
  const totalData = useRef();
  // console.log("page no and per page data is", pageNo, perPage);

  const handlePerRowsChange = (newPerPage, page) => {
    // console.log("per row is changed and data is", newPerPage, page);
    setPerPage(newPerPage);
    setPageNo(page);
    setEnqData([]);
    setRefresherNeeded(true);
  };
  const dispatch = useDispatch();
  const authData = useSelector((state) => state.authStore);
  const columnData = useSelector((store) => store.appColumn);
  const [offerLetterUpload, setOfferLetterUpload] = useState({
    show: false,
    id: null,
    name: "",
  });
  const navigate = useNavigate();
  const deleteAppDetails = useRef({});

  // useEffect(() => {
  //   if (fileUpload instanceof File) {
  //   }
  // }, [fileUpload]);

  const columns = [
    {
      cell: (row) => (
        <>
          <button
            className="enquiryAction"
            title="Edit Enquiry"
            href="fdf"
            onClick={() => {
              // console.log(row);
              navigate(`/application/edit/${row.id}`);
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
              class="feather feather-edit-2 p-1 br-8 mb-1"
            >
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
          </button>
          <button
            className="enquiryAction"
            title="Delete Application"
            onClick={() => {
              promptDelete(row.name, row.id);
              // deleteEnquiry(row.id);
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
              class="feather feather-trash p-1 br-8 mb-1"
            >
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },

    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      omit: columnData.enqId,
    },
    {
      name: "University Interested",
      selector: (row) => row.university_interested,
      omit: columnData.uniI,
    },
    {
      name: "Course Inerested",
      selector: (row) => row.course_interested,
      omit: columnData.courseI,
    },
    {
      name: "Application Date",
      selector: (row) => row.created_at,
      omit: columnData.date,
    },
    {
      name: "Offer Letter",
      cell: (row) =>
        row.rcvd_offer_letter ? (
          <a href={row.rcvd_offer_letter} download className="btn btn-primary">
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
              class="feather feather-arrow-down-circle"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="8 12 12 16 16 12"></polyline>
              <line x1="12" y1="8" x2="12" y2="16"></line>
            </svg>
          </a>
        ) : (
          <div
            className="btn btn-danger"
            onClick={() => {
              setOfferLetterUpload({ show: true, id: row.id, name: row.name });
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
              class="feather feather-arrow-up-circle"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="16 12 12 8 8 12"></polyline>
              <line x1="12" y1="16" x2="12" y2="8"></line>
            </svg>
          </div>
        ),
      // selector: (row) => row.rcvd_offer_letter ? ,
      omit: columnData.languageExam,
    },
    {
      name: "Tenth Marksheet",
      selector: (row) => row.Tenth_Marksheet,
      omit: columnData.tenthMarksheet,
    },
    {
      name: "Twelveth Marksheet",
      selector: (row) => row.Twelveth_Marksheet,
      omit: columnData.twelvethMarksheet,
      grow: 1,
    },
    {
      name: "Passport",
      selector: (row) => row.passport,
      omit: columnData.passport,
    },
    {
      name: "SOP",
      selector: (row) => row.Sop,
      omit: columnData.sop,
    },
    {
      name: "Diploma Marksheet",
      selector: (row) => row.Diploma_Marksheet,
      omit: columnData.diplomaMarksheet,
    },
    {
      name: "Bachelor Marksheet",
      selector: (row) => row.Bachelor_Exam,
      omit: columnData.bachelorMarksheet,
    },
    {
      name: "Master Marksheet",
      selector: (row) => row.Master_Marksheet,
      omit: columnData.masterMarksheet,
    },
    {
      name: "LOR",
      selector: (row) => row.Lor,
      omit: columnData.lor,
    },

    {
      name: "Resume",
      selector: (row) => row.Resume,
      omit: columnData.resume,
    },
    {
      name: "Language Exam",
      selector: (row) => row.Language_Exam,
      omit: columnData.languageExam,
    },

    {
      name: "Assigned Users",
      selector: (row) => row.assigned_users,
      omit: columnData.assignedUser,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      omit: columnData.status,
    },
    {
      name: "Added By",
      selector: (row) => row.added_by,
      omit: columnData.addedBy,
    },
  ];
  const handleChange = ({ selectedRows }) => {
    // You can set state or dispatch with something like Redux so we can use the retrieved data
    // console.log("Selected Rows: ", selectedRows);
    setSelectedRows(selectedRows);
  };
  // useEffect(() => {
  //   if (!enqData.length) {
  //     const data = async () => {
  //       const response = await ajaxCallWithHeaderOnly(
  //         "applications/",
  //         {
  //           Authorization: `Bearer ${authData.accessToken}`,
  //         },
  //         "POST",
  //         null
  //       );
  //       console.log(response);
  //       if (response?.count) {
  //         const data = response.results.map((data) => {
  //           return {
  //             ...data,
  //             name: data.name.student_name,
  //             status: data.status.App_status,
  //             added_by: data.added_by.username,
  //             assigned_users: data.assigned_users.username,
  //             Tenth_Marksheet: data.Tenth_Marksheet ? (
  //               <img
  //                 onClick={() => {
  //                   setModalStatus({
  //                     showModal: true,
  //                     showHeader: true,
  //                     headerContent: "Tenth Marksheet",
  //                     bodyContent: (
  //                       <img
  //                         src={data.Tenth_Marksheet}
  //                         alt="Tenth Marksheet (click to open)"
  //                         className="app-img"
  //                       />
  //                     ),
  //                     showFooter: true,
  //                     footerContent: (
  //                       <button
  //                         class="btn btn-outline-dark mb-2 me-4"
  //                         onClick={() => {
  //                           window.open(data.Tenth_Marksheet);
  //                         }}
  //                       >
  //                         Open Image &nbsp;
  //                         <svg
  //                           xmlns="http://www.w3.org/2000/svg"
  //                           width="24"
  //                           height="24"
  //                           viewBox="0 0 24 24"
  //                         >
  //                           <path
  //                             fill="currentColor"
  //                             d="M10 6v2H5v11h11v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6zm11-3v9l-3.794-3.793l-5.999 6l-1.414-1.414l5.999-6L12 3h9z"
  //                           />
  //                         </svg>
  //                       </button>
  //                     ),
  //                   });
  //                 }}
  //                 src={data.Tenth_Marksheet}
  //                 alt="Tenth Marksheet"
  //                 style={{ width: "100%" }}
  //               />
  //             ) : (
  //               "-"
  //             ),
  //             Twelveth_Marksheet: data.Twelveth_Marksheet ? (
  //               <img
  //                 src={data.Twelveth_Marksheet}
  //                 alt="Twelveth Marksheet"
  //                 style={{ width: "100%" }}
  //                 onClick={() => {
  //                   setModalStatus({
  //                     showModal: true,
  //                     showHeader: true,
  //                     headerContent: "Twelveth Marksheet",
  //                     bodyContent: (
  //                       <img
  //                         src={data.Twelveth_Marksheet}
  //                         alt="Twelveth Marksheet"
  //                         className="app-img"
  //                       />
  //                     ),
  //                     showFooter: true,
  //                     footerContent: (
  //                       <button
  //                         class="btn btn-outline-dark mb-2 me-4"
  //                         onClick={() => {
  //                           window.open(data.Twelveth_Marksheet);
  //                         }}
  //                       >
  //                         Open Image &nbsp;
  //                         <svg
  //                           xmlns="http://www.w3.org/2000/svg"
  //                           width="24"
  //                           height="24"
  //                           viewBox="0 0 24 24"
  //                         >
  //                           <path
  //                             fill="currentColor"
  //                             d="M10 6v2H5v11h11v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6zm11-3v9l-3.794-3.793l-5.999 6l-1.414-1.414l5.999-6L12 3h9z"
  //                           />
  //                         </svg>
  //                       </button>
  //                     ),
  //                   });
  //                 }}
  //               />
  //             ) : (
  //               "-"
  //             ),
  //             Diploma_Marksheet: data.Diploma_Marksheet ? (
  //               <img
  //                 src={data.Diploma_Marksheet}
  //                 alt="Diploma Marksheet(Click to open)"
  //                 style={{ width: "100%" }}
  //                 onClick={() => {
  //                   setModalStatus({
  //                     showModal: true,
  //                     showHeader: true,
  //                     headerContent: "Diploma Marksheet",
  //                     bodyContent: (
  //                       <img
  //                         src={data.Diploma_Marksheet}
  //                         alt="Diploma Marksheet"
  //                         className="app-img"
  //                       />
  //                     ),
  //                     showFooter: true,
  //                     footerContent: (
  //                       <button
  //                         class="btn btn-outline-dark mb-2 me-4"
  //                         onClick={() => {
  //                           window.open(data.Diploma_Marksheet);
  //                         }}
  //                       >
  //                         Open Image &nbsp;
  //                         <svg
  //                           xmlns="http://www.w3.org/2000/svg"
  //                           width="24"
  //                           height="24"
  //                           viewBox="0 0 24 24"
  //                         >
  //                           <path
  //                             fill="currentColor"
  //                             d="M10 6v2H5v11h11v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6zm11-3v9l-3.794-3.793l-5.999 6l-1.414-1.414l5.999-6L12 3h9z"
  //                           />
  //                         </svg>
  //                       </button>
  //                     ),
  //                   });
  //                 }}
  //               />
  //             ) : (
  //               "-"
  //             ),
  //             Bachelor_Exam: data.Bachelor_Exam ? (
  //               <img
  //                 src={data.Bachelor_Exam}
  //                 alt="Bachelor Exam"
  //                 style={{ width: "100%" }}
  //                 onClick={() => {
  //                   setModalStatus({
  //                     showModal: true,
  //                     showHeader: true,
  //                     headerContent: "Bachelor Exam",
  //                     bodyContent: (
  //                       <img
  //                         src={data.Bachelor_Exam}
  //                         alt="Bachelor Exam (click to open)"
  //                         className="app-img"
  //                       />
  //                     ),
  //                     showFooter: true,
  //                     footerContent: (
  //                       <button
  //                         class="btn btn-outline-dark mb-2 me-4"
  //                         onClick={() => {
  //                           window.open(data.Bachelor_Exam);
  //                         }}
  //                       >
  //                         Open Image &nbsp;
  //                         <svg
  //                           xmlns="http://www.w3.org/2000/svg"
  //                           width="24"
  //                           height="24"
  //                           viewBox="0 0 24 24"
  //                         >
  //                           <path
  //                             fill="currentColor"
  //                             d="M10 6v2H5v11h11v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6zm11-3v9l-3.794-3.793l-5.999 6l-1.414-1.414l5.999-6L12 3h9z"
  //                           />
  //                         </svg>
  //                       </button>
  //                     ),
  //                   });
  //                 }}
  //               />
  //             ) : (
  //               "-"
  //             ),
  //             Master_Marksheet: data.Master_Marksheet ? (
  //               <img
  //                 src={data.Master_Marksheet}
  //                 alt="Master Marksheet (Click to open)"
  //                 style={{ width: "100%" }}
  //                 onClick={() => {
  //                   setModalStatus({
  //                     showModal: true,
  //                     showHeader: true,
  //                     headerContent: "Master Marksheet",
  //                     bodyContent: (
  //                       <img
  //                         src={data.Master_Marksheet}
  //                         alt="Master Marksheet"
  //                         className="app-img"
  //                       />
  //                     ),
  //                     showFooter: true,
  //                     footerContent: (
  //                       <button
  //                         class="btn btn-outline-dark mb-2 me-4"
  //                         onClick={() => {
  //                           window.open(data.Master_Marksheet);
  //                         }}
  //                       >
  //                         Open Image &nbsp;
  //                         <svg
  //                           xmlns="http://www.w3.org/2000/svg"
  //                           width="24"
  //                           height="24"
  //                           viewBox="0 0 24 24"
  //                         >
  //                           <path
  //                             fill="currentColor"
  //                             d="M10 6v2H5v11h11v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6zm11-3v9l-3.794-3.793l-5.999 6l-1.414-1.414l5.999-6L12 3h9z"
  //                           />
  //                         </svg>
  //                       </button>
  //                     ),
  //                   });
  //                 }}
  //               />
  //             ) : (
  //               "-"
  //             ),
  //             Lor: data.Lor ? (
  //               <img
  //                 src={data.Lor}
  //                 alt="Lor (Click to open)"
  //                 style={{ width: "100%" }}
  //                 onClick={() => {
  //                   setModalStatus({
  //                     showModal: true,
  //                     showHeader: true,
  //                     headerContent: "Lor",
  //                     bodyContent: (
  //                       <img src={data.Lor} alt="Lor" className="app-img" />
  //                     ),
  //                     showFooter: true,
  //                     footerContent: (
  //                       <button
  //                         class="btn btn-outline-dark mb-2 me-4"
  //                         onClick={() => {
  //                           window.open(data.Lor);
  //                         }}
  //                       >
  //                         Open Image &nbsp;
  //                         <svg
  //                           xmlns="http://www.w3.org/2000/svg"
  //                           width="24"
  //                           height="24"
  //                           viewBox="0 0 24 24"
  //                         >
  //                           <path
  //                             fill="currentColor"
  //                             d="M10 6v2H5v11h11v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6zm11-3v9l-3.794-3.793l-5.999 6l-1.414-1.414l5.999-6L12 3h9z"
  //                           />
  //                         </svg>
  //                       </button>
  //                     ),
  //                   });
  //                 }}
  //               />
  //             ) : (
  //               "-"
  //             ),
  //             Sop: data.Sop ? (
  //               <img
  //                 src={data.Sop}
  //                 alt="Sop (Click to open)"
  //                 style={{ width: "100%" }}
  //                 onClick={() => {
  //                   setModalStatus({
  //                     showModal: true,
  //                     showHeader: true,
  //                     headerContent: "Sop",
  //                     bodyContent: (
  //                       <img src={data.Sop} alt="Sop" className="app-img" />
  //                     ),
  //                     showFooter: true,
  //                     footerContent: (
  //                       <button
  //                         class="btn btn-outline-dark mb-2 me-4"
  //                         onClick={() => {
  //                           window.open(data.Sop);
  //                         }}
  //                       >
  //                         Open Image &nbsp;
  //                         <svg
  //                           xmlns="http://www.w3.org/2000/svg"
  //                           width="24"
  //                           height="24"
  //                           viewBox="0 0 24 24"
  //                         >
  //                           <path
  //                             fill="currentColor"
  //                             d="M10 6v2H5v11h11v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6zm11-3v9l-3.794-3.793l-5.999 6l-1.414-1.414l5.999-6L12 3h9z"
  //                           />
  //                         </svg>
  //                       </button>
  //                     ),
  //                   });
  //                 }}
  //               />
  //             ) : (
  //               "-"
  //             ),
  //             Resume: data.Resume ? (
  //               <img
  //                 src={data.Resume}
  //                 alt="Resume(Click to open)"
  //                 style={{ width: "100%" }}
  //                 onClick={() => {
  //                   setModalStatus({
  //                     showModal: true,
  //                     showHeader: true,
  //                     headerContent: "Resume",
  //                     bodyContent: (
  //                       <img
  //                         src={data.Resume}
  //                         alt="Resume"
  //                         className="app-img"
  //                       />
  //                     ),
  //                     showFooter: true,
  //                     footerContent: (
  //                       <button
  //                         class="btn btn-outline-dark mb-2 me-4"
  //                         onClick={() => {
  //                           window.open(data.Resume);
  //                         }}
  //                       >
  //                         Open Image &nbsp;
  //                         <svg
  //                           xmlns="http://www.w3.org/2000/svg"
  //                           width="24"
  //                           height="24"
  //                           viewBox="0 0 24 24"
  //                         >
  //                           <path
  //                             fill="currentColor"
  //                             d="M10 6v2H5v11h11v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6zm11-3v9l-3.794-3.793l-5.999 6l-1.414-1.414l5.999-6L12 3h9z"
  //                           />
  //                         </svg>
  //                       </button>
  //                     ),
  //                   });
  //                 }}
  //               />
  //             ) : (
  //               "-"
  //             ),
  //             Language_Exam: data.Language_Exam ? (
  //               <img
  //                 src={data.Language_Exam}
  //                 alt="Tenth Marksheet"
  //                 style={{ width: "100%" }}
  //                 onClick={() => {
  //                   setModalStatus({
  //                     showModal: true,
  //                     showHeader: true,
  //                     headerContent: "Language Exam",
  //                     bodyContent: (
  //                       <img
  //                         src={data.Language_Exam}
  //                         alt="Language Exam(click to open)"
  //                         className="app-img"
  //                       />
  //                     ),
  //                     showFooter: true,
  //                     footerContent: (
  //                       <button
  //                         class="btn btn-outline-dark mb-2 me-4"
  //                         onClick={() => {
  //                           window.open(data.Language_Exam);
  //                         }}
  //                       >
  //                         Open Image &nbsp;
  //                         <svg
  //                           xmlns="http://www.w3.org/2000/svg"
  //                           width="24"
  //                           height="24"
  //                           viewBox="0 0 24 24"
  //                         >
  //                           <path
  //                             fill="currentColor"
  //                             d="M10 6v2H5v11h11v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6zm11-3v9l-3.794-3.793l-5.999 6l-1.414-1.414l5.999-6L12 3h9z"
  //                           />
  //                         </svg>
  //                       </button>
  //                     ),
  //                   });
  //                 }}
  //               />
  //             ) : (
  //               "-"
  //             ),
  //           };
  //         });
  //         setEnqData(data);
  //       }
  //     };
  //     data();
  //   }
  // }, [enqData]);
  useEffect(() => {
    if (throwErr) throw throwErr;
  }, [throwErr]);
  const getAppData = async (url) => {
    setIsLoadingData(true);
    const response = await ajaxCallWithHeaderOnly(
      url,
      {
        Authorization: `Bearer ${authData.accessToken}`,
      },
      "POST",
      null
    );
    if (response?.isNetwork) {
      setThrowErr({ ...response, page: "applications" });
      return;
    }
    if (response?.status === 401 || response?.status > 500) {
      setThrowErr({ ...response, page: "applications" });
      return;
    }
    const enqParsed = parseData(response, setModalStatus);
    setEnqData(enqParsed);
    setTotalRows(response.count);
    setIsLoadingData(false);
    setRefresherNeeded(false);
  };
  useEffect(() => {
    try {
      if (refreshNeeded && !searchText?.length) {
        let url = `applications/?ordering=-created_at&p=${pageNo}&records=${perPage}`;
        if (appFilter.enquiry_status)
          url += `&status=${appFilter.enquiry_status}`;
        getAppData(url);
      }
      // console.log(response);
    } catch (e) {
      setThrowErr({ e, page: "enquiries" });
      return;
    }
  }, [
    enqData,
    appFilter.enquiry_status,
    refreshNeeded,
    pageNo,
    perPage,
    searchText,
  ]);
  const promptDelete = (student_name, deleteId) => {
    setPromptStatus(true);
    deleteAppDetails.current = { name: student_name, id: deleteId };
  };
  const deleteApp = async function (deleteId) {
    try {
      setSearchText("");
      setIsLoadingData(true);
      const response = await ajaxCallWithoutBody(
        `update-application/${deleteId}/`,
        {
          Authorization: `Bearer ${authData.accessToken}`,
        },
        "DELETE"
      );
      // console.log("response is ", response);
      if (response !== true) {
        setThrowErr({ ...response, page: "applications" });
        return;
      }
      dispatch(
        uiAction.setNotification({
          show: true,
          heading: "Application Deleted Successfully",
          msg: `<strong>${deleteAppDetails.current.name}</strong> Application Deleted successfully`,
        })
      );
      deleteAppDetails.current = {};
      setEnqData([]);
    } catch (e) {
      setThrowErr({ e, page: "enquiries" });
      return;
    }
  };

  const clearSearch = function () {
    if (searchText?.length) setEnqData([]);
    setSearchText("");
    setRefresherNeeded(true);
  };
  const hideModal = () =>
    setModalStatus({
      showModal: false,
      showHeader: false,
      headerContent: null,
      bodyContent: null,
      showFooter: false,
      footerContent: null,
    });

  const filterSelectionChanged = function (filterName, val) {
    setAppFilter((oldFilter) => {
      // copying object
      const filterData = JSON.parse(JSON.stringify(oldFilter));
      filterData[filterName] = val;
      return filterData;
    });
    setPageNo(1);
    setRefresherNeeded(true);
    setEnqData([]);
  };
  const clearFilter = function () {
    setAppFilter({
      enquiry_status: null,
    });
    setEnqData([]);
    setPageNo(1);
  };
  const searchThroughText = (e) => {
    try {
      e.preventDefault();
      if (searchText) {
        setPageNo(1);
        getAppData(
          `applications/?created_at=-date_created&p=1&records=${perPage}&search=${searchText}`
        );
      }
    } catch (e) {
      setThrowErr({ e, page: "enquiries" });
      return;
    }
  };

  const exportPDF = (val) => {
    if (val === "exp") {
      if (selectedRows.length > 1) {
        dispatch(
          uiAction.setNotification({
            show: true,
            heading: "Error",
            msg: `Please select only 1 application at a time to export as pdf`,
          })
        );
      } else {
        window.open(
          `https://smhri.com/oeccrm/pdf/${selectedRows[0].id}/`,
          "_blank"
        );
      }
    }
  };
  return (
    <>
      <div className="row layout-spacing">
        <div className="neumorphism-box nmb">
          <div className="col-lg-12">
            <div className="row">
              <OptionFilter
                filterSelectionChanged={filterSelectionChanged}
                appFilter={appFilter}
                searchText={searchText}
                setSearchText={setSearchText}
                clearSearch={clearSearch}
                searchEnq={searchThroughText}
                refreshTable={setRefresherNeeded}
              />
              <Form.Group
                className="mb-3 col-md-4 selectbox"
                controlId="exportPDF"
              >
                <Form.Label>Export</Form.Label>
                <SelectSearch
                  options={[
                    { name: "Select Option", value: "" },
                    { name: "Export as pdf", value: "exp" },
                  ]}
                  value=""
                  onChange={exportPDF}
                  name="Select"
                />
              </Form.Group>
            </div>
          </div>
        </div>
        <div className="neumorphism-box">
          <div className="col-lg-12">
            <div className="statbox widget box box-shadow">
              <div className="widget-content widget-content-area">
                {" "}
                <ColumnFilter
                  allColumns={allColumns}
                  showFilterBtn={appFilter.enquiry_status}
                  filterOnClick={clearFilter}
                  filterStore="appColumn"
                />
                <DataTable
                  onChangePage={(page) => {
                    // console.log("new Page numbner is", page);
                    setPageNo(page);
                    setEnqData([]);
                    setRefresherNeeded(true);
                  }}
                  onChangeRowsPerPage={handlePerRowsChange}
                  columns={columns}
                  data={enqData}
                  selectableRows
                  onSelectedRowsChange={handleChange}
                  progressPending={isLoadingData}
                  progressComponent={
                    <LoadingData className="loading-spinner-flex" />
                  }
                  paginationTotalRows={totalRows}
                  key={totalRows}
                  pagination
                  paginationServer
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {modalStatus.showModal ? (
        <UiModal
          setModalStatus={hideModal}
          showStatus={modalStatus.showModal}
          showHeader={modalStatus.showHeader}
          title={modalStatus.headerContent}
          body={modalStatus.bodyContent}
          showFooter={modalStatus.showFooter}
          footerContent={modalStatus.footerContent}
        />
      ) : (
        ""
      )}
      {promptStatus ? (
        <UiModal
          setModalStatus={() => {
            setPromptStatus(false);
          }}
          showStatus={promptStatus}
          showHeader={false}
          body={
            <div className="delete-modal text-center">
              <div className="delete-modal__icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="80"
                  height="80"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#f15e5e"
                    d="M8.27 3L3 8.27v7.46L8.27 21h7.46C17.5 19.24 21 15.73 21 15.73V8.27L15.73 3M9.1 5h5.8L19 9.1v5.8L14.9 19H9.1L5 14.9V9.1m6 5.9h2v2h-2v-2m0-8h2v6h-2V7"
                  />
                </svg>
              </div>
              <div className="delete-modal__text">
                <h3>Are you sure?</h3>
                <p>
                  Do you really want to delete
                  <strong> {deleteAppDetails.current.name} ?</strong>
                </p>
              </div>
              <div className="delete-modal__action">
                <button
                  class="btn btn-light-dark mb-2 me-4"
                  onClick={() => {
                    setPromptStatus(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  class="btn btn-danger mb-2 me-4"
                  onClick={() => {
                    deleteApp(deleteAppDetails.current.id);
                    setPromptStatus(false);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          }
          showFooter={false}
          footerContent=""
        />
      ) : (
        ""
      )}
      {offerLetterUpload.show ? (
        <UploadOfferLetter
          changeMode={setOfferLetterUpload}
          name={offerLetterUpload.name}
          resetApp={() => {
            setEnqData([]);
          }}
          id={offerLetterUpload.id}
        />
      ) : (
        ""
      )}
    </>
  );
}

export default Applications;
