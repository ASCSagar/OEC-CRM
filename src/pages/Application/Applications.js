import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ColumnFilter from "../../components/Filter/ColumnFilter";
import LoadingData from "../../components/UI/LoadingData";
import UiModal from "../../components/UI/UiModal";
import {
  ajaxCallWithHeaderOnly,
  ajaxCallWithoutBody,
} from "../../helpers/ajaxCall";
import { uiAction } from "../../store/uiStore";
import OptionFilter from "./OptionFilter";
import UploadDoc from "../../components/app/UploadDoc";
import DocumentRow from "../../components/app/DocumentRow";
import useExportPDF from "../../hook/useExportPDF";
import ChangeAssignUser from "../../components/enq/ChangeAssignUser";
import SelectionBox from "../../components/UI/Form/SelectionBox";
import AddedByPopup from "../../components/app/AddedByPopup";
import CommentPopup from "../../components/enq/CommentPopup";
import ExportPDF from "../../components/app/ExportPDF";
import ChangeStatus from "../../components/app/ChangeStatus";

const allColumns = [
  { name: "Name", id: "enqId" },
  { name: "Tenth Marksheet", id: "tenthMarksheet" },
  { name: "Twelveth Marksheet", id: "twelvethMarksheet" },
  { name: "Diploma Marksheet", id: "diplomaMarksheet" },
  { name: "Bachelor Marksheet", id: "bachelorMarksheet" },
  { name: "Master Marksheet", id: "masterMarksheet" },
  { name: "LOR", id: "lor" },
  { name: "Resume", id: "resume" },
  { name: "Language Exam", id: "languageExam" },
  { name: "Assigned User", id: "assignedUser" },
  { name: "Status", id: "status" },
  { name: "Added By", id: "addedBy" },
  { name: "Application Date", id: "date" },
  { name: "Passport", id: "passport" },
];

const parseData = function (response) {
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
        name: data?.student_info?.name?.student_name,
        email: data?.student_info?.name?.student_email,
        phone: data?.student_info?.name?.student_phone,
        address: data?.student_info?.name?.student_address,
        country_interested: data?.student_info?.name?.country_interested,
        current_edu: data?.student_info?.name?.current_education,
        status: data?.status?.App_status ? data?.status?.App_status : "-",
        statusId: data?.status?.id,
        added_by: data?.added_by?.username,
        added_byId: data?.added_by?.id,
        assigned_users: data.assigned_users?.username
          ? data?.assigned_users?.username
          : "-",
        assigned_usersId: data?.assigned_users?.id,
        Tenth_Marksheet: data?.student_info?.Tenth_Marksheet,
        passport: data?.student_info?.passport,
        Twelveth_Marksheet: data?.student_info?.Twelveth_Marksheet,
        Diploma_Marksheet: data?.student_info?.Diploma_Marksheet,
        Bachelor_Exam: data?.student_info?.Bachelor_Marksheet,
        Master_Marksheet: data?.student_info?.Master_Marksheet,
        Lor: data?.student_info?.Lor,
        Resume: data?.student_info?.Resume,
        Language_Exam: data?.student_info?.Language_Exam,
      };
    });
  } else return [];
};
function Applications() {
  const [enqData, setEnqData] = useState([]);
  const [allEnq, setAllEnq] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [assignUsrData, setAssignUsrData] = useState([]);
  const [allStatus, setAllStatus] = useState([]);
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
    assigned_usr: null,
  });
  const [generatedPdfUrl, setGeneratedPdfUrl] = useExportPDF();
  // data table code starts
  const [pageNo, setPageNo] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [throwErr, setThrowErr] = useState(null);
  const [refreshNeeded, setRefresherNeeded] = useState(true);
  const [showCommentPopup, setShowCommentPopup] = useState({
    show: false,
    enqId: null,
    name: null,
  });
  // ref for ref

  const assignedUserFilter = () => {
    setAllEnq((status) => !status);
    setRefresherNeeded(true);
    setPageNo(1);
  };

  const handlePerRowsChange = (newPerPage, page) => {
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
  const deleteAppDetails = useRef({});

  const getAssignUsrData = useCallback(
    async function () {
      const response = await ajaxCallWithHeaderOnly("userlist/", {
        Authorization: `Bearer ${authData.accessToken}`,
      });
      if (response?.isNetwork) {
        setThrowErr({ ...response, page: "enquiries" });
        return;
      }
      if (response?.status === 401) {
        setThrowErr({ ...response, page: "enquiries" });
        return;
      }
      if (!response?.length) {
        setThrowErr({ ...response, page: "enquiries" });
        return;
      }
      setAssignUsrData((data) => {
        return response.map((option) => {
          return { value: option.id, name: option.username };
        });
      });
    },
    [authData.accessToken]
  );

  const getAllStatusData = useCallback(
    async function () {
      const response = await ajaxCallWithHeaderOnly("appstatus/", {
        Authorization: `Bearer ${authData.accessToken}`,
      });
      if (response?.isNetwork) {
        setThrowErr({ ...response, page: "enquiries" });
        return;
      }
      if (response?.status === 401) {
        setThrowErr({ ...response, page: "enquiries" });
        return;
      }
      if (!response?.length) {
        setThrowErr({ ...response, page: "enquiries" });
        return;
      }
      setAllStatus((data) => {
        return response.map((option) => {
          return { value: option.id, name: option.App_status };
        });
      });
    },
    [authData.accessToken]
  );
  // to show the comment popup
  const showComments = function (enqId, name) {
    setShowCommentPopup({ show: true, enqId, name });
  };

  const columnsAll = [
    {
      cell: (row) => (
        <>
          <ExportPDF data={row} />
          <Link
            to={`/application/edit/${row.id}`}
            className="enquiryAction"
            title="Edit Application"
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
          </Link>
          {authData.user_type === "superuser" ? (
            <button
              className="enquiryAction"
              title="Delete Application"
              onClick={() => {
                promptDelete(row.name, row.id);
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
          ) : (
            ""
          )}
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "Name",
      selector: (row) => (
        <Link to={`/student/${row?.student_info?.name?.id}`}>{row.name}</Link>
      ),
      sortable: true,
      omit: columnData.enqId,
    },
    {
      name: "Application Date",
      selector: (row) => row.created_at,
      omit: columnData.date,
    },
    {
      name: "University Interested",
      selector: (row) => row.university_interested?.univ_name,
      omit: columnData.date,
    },
    {
      name: "Course Interested",
      selector: (row) => row.course_interested?.course_name,
      omit: columnData.date,
    },
    {
      name: "Intake Interested",
      selector: (row) =>
        row.intake_interested?.intake_month +
        " " +
        row.intake_interested?.intake_year,
      omit: columnData.date,
    },
    {
      name: "Assigned Users",
      selector: (row) => (
        <ChangeAssignUser
          enqName={row.name}
          allUser={assignUsrData}
          name={row.assigned_users}
          assignId={row.assigned_usersId}
          courseId={row.id}
        />
      ),
      omit: columnData.assignedUser,
    },
    {
      name: "SOP",
      cell: (row) => (
        <DocumentRow
          id={row.id}
          docType="SOP"
          name={row.name}
          document={row.Sop}
          uploadKey="Sop"
          setRefresherNeeded={setRefresherNeeded}
        />
      ),
      omit: columnData.tenthMarksheet,
    },
    {
      name: "Offer Letter",
      cell: (row) => (
        <DocumentRow
          id={row.id}
          docType="Offer Letter"
          name={row.name}
          document={row?.rcvd_offer_letter}
          uploadKey="rcvd_offer_letter"
          setRefresherNeeded={setRefresherNeeded}
        />
      ),
      omit: columnData.tenthMarksheet,
    },
    {
      name: "Tenth Marksheet",
      cell: (row) => (
        <DocumentRow
          id={row.application}
          docType="Tenth Marksheet"
          name={row.name}
          document={row.Tenth_Marksheet}
          uploadKey="Tenth_Marksheet"
          setRefresherNeeded={setRefresherNeeded}
        />
      ),
      omit: columnData.tenthMarksheet,
    },
    {
      name: "Twelveth Marksheet",
      cell: (row) => (
        <DocumentRow
          id={row.application}
          docType="Twelveth Marksheet"
          name={row.name}
          document={row.Twelveth_Marksheet}
          uploadKey="Twelveth_Marksheet"
          setRefresherNeeded={setRefresherNeeded}
        />
      ),
      omit: columnData.twelvethMarksheet,
      grow: 1,
    },
    {
      name: "Passport",
      cell: (row) => (
        <DocumentRow
          id={row.application}
          docType="Passport"
          name={row.name}
          document={row.passport}
          uploadKey="passport"
          setRefresherNeeded={setRefresherNeeded}
        />
      ),
      omit: columnData.passport,
    },
    {
      name: "Diploma Marksheet",
      cell: (row) => (
        <DocumentRow
          id={row.application}
          docType="Diploma Marksheet"
          name={row.name}
          document={row.Diploma_Marksheet}
          uploadKey="Diploma_Marksheet"
          setRefresherNeeded={setRefresherNeeded}
        />
      ),
      omit: columnData.diplomaMarksheet,
    },
    {
      name: "Bachelor Marksheet",
      cell: (row) => (
        <DocumentRow
          id={row.application}
          docType="Bachelor Marksheet"
          name={row.name}
          document={row.Bachelor_Marksheet}
          uploadKey="Bachelor_Marksheet"
          setRefresherNeeded={setRefresherNeeded}
        />
      ),
      omit: columnData.bachelorMarksheet,
    },
    {
      name: "Master Marksheet",
      cell: (row) => (
        <DocumentRow
          id={row.application}
          docType="Master Marksheet"
          name={row.name}
          document={row.Master_Marksheet}
          uploadKey="Master_Marksheet"
          setRefresherNeeded={setRefresherNeeded}
        />
      ),
      omit: columnData.masterMarksheet,
    },
    {
      name: "LOR",
      cell: (row) => (
        <DocumentRow
          id={row.application}
          docType="LOR"
          name={row.name}
          document={row.Lor}
          uploadKey="Lor"
          setRefresherNeeded={setRefresherNeeded}
        />
      ),
      omit: columnData.lor,
    },

    {
      name: "Resume",
      cell: (row) => (
        <DocumentRow
          id={row.application}
          docType="Resume"
          name={row.name}
          document={row.Resume}
          uploadKey="Resume"
          setRefresherNeeded={setRefresherNeeded}
        />
      ),
      omit: columnData.resume,
    },
    {
      name: "Language Exam",
      cell: (row) => (
        <DocumentRow
          id={row.application}
          docType="Language Exam"
          name={row.name}
          document={row.Language_Exam}
          uploadKey="Language_Exam"
          setRefresherNeeded={setRefresherNeeded}
        />
      ),
      omit: columnData.languageExam,
    },
    {
      name: "Status",
      selector: (row) => (
        <ChangeStatus
          enqName={row.name}
          allStatus={allStatus}
          name={row.status}
          statusId={row.statusId}
          courseId={row.id}
        />
      ),
      omit: columnData.status,
    },
    {
      name: "Added By",
      cell: (row) => <AddedByPopup id={row.added_byId} name={row.added_by} />,
      omit: columnData.addedBy,
    },
    {
      name: "Comments",
      selector: (row) => (
        <p className="pointer" onClick={() => showComments(row.id, row.name)}>
          check
        </p>
      ),
      omit: columnData.comments,
    },
  ];

  const columns =
    authData.user_type === "superuser"
      ? columnsAll
      : columnsAll.filter((col) => col.name !== "Assigned Users");

  useEffect(() => {
    if (enqData.length && !assignUsrData.length) {
      getAssignUsrData();
    }
  }, [assignUsrData.length, enqData, getAssignUsrData]);

  useEffect(() => {
    if (enqData.length && !allStatus.length) {
      getAllStatusData();
    }
  }, [allStatus.length, enqData, getAllStatusData]);

  useEffect(() => {
    if (throwErr) throw throwErr;
  }, [throwErr]);

  const getAppData = useCallback(
    async (url) => {
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
    },
    [authData.accessToken]
  );

  useEffect(() => {
    try {
      if (refreshNeeded && !searchText?.length) {
        let url = `get/courseinfo/?ordering=-created_at&p=${pageNo}&records=${perPage}`;
        if (appFilter.enquiry_status)
          url += `&status=${appFilter.enquiry_status}`;
        if (appFilter.assigned_usr)
          url += `&assigned_users=${appFilter.assigned_usr}`;
        url +=
          authData.user_type === "superuser"
            ? !allEnq
              ? "&assigned_usersf=1"
              : ""
            : "";
        getAppData(url);
      }
    } catch (e) {
      setThrowErr({ e, page: "enquiries" });
      return;
    }
  }, [
    enqData,
    appFilter.enquiry_status,
    appFilter.assigned_usr,
    appFilter.agent_created,
    appFilter.uni_interested,
    appFilter.intake_interested,
    appFilter.level_interested,
    refreshNeeded,
    pageNo,
    perPage,
    searchText,
    authData.user_type,
    allEnq,
    getAppData,
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
        `get/courseinfo/${deleteId}/`,
        {
          Authorization: `Bearer ${authData.accessToken}`,
        },
        "DELETE"
      );
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
      setRefresherNeeded(true);
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
        const partURL =
          authData.user_type === "superuser"
            ? !allEnq
              ? "&assigned_usersf=1"
              : ""
            : "";
        setPageNo(1);
        getAppData(
          `get/courseinfo/?created_at=-date_created&p=1&records=${perPage}&search=${searchText}${partURL}`
        );
      }
    } catch (e) {
      setThrowErr({ e, page: "enquiries" });
      return;
    }
  };

  useEffect(() => {
    if (generatedPdfUrl) {
      try {
        window.open(generatedPdfUrl, "_blank").focus();
        setGeneratedPdfUrl("");
        dispatch(
          uiAction.setNotification({
            show: true,
            heading: `Export PDF`,
            msg: `PDF Exported`,
          })
        );
      } catch {
        dispatch(
          uiAction.setNotification({
            show: true,
            heading: `Export PDF`,
            msg: `Some Problem occured while exporting pdf please try again.`,
          })
        );
        setGeneratedPdfUrl("");
      }
    }
  }, [dispatch, generatedPdfUrl, setGeneratedPdfUrl]);

  return (
    <>
      <div className="row layout-spacing">
        <div className="neumorphism-box nmb">
          <div className="col-lg-12">
            <div className="row">
              <OptionFilter
                isAdmin={authData.user_type === "superuser"}
                filterSelectionChanged={filterSelectionChanged}
                appFilter={appFilter}
                searchText={searchText}
                setSearchText={setSearchText}
                clearSearch={clearSearch}
                searchEnq={searchThroughText}
                refreshTable={setRefresherNeeded}
              />
              {authData.user_type === "superuser" ? (
                <SelectionBox
                  groupClass="mb-3 col-md-4 selectbox"
                  groupId="assignedUsr"
                  label="Assigned User"
                  onChange={filterSelectionChanged.bind(null, "assigned_usr")}
                  name="assUser"
                  value={appFilter.assigned_usr}
                  url="userlist/?course_related=true"
                  isSearch={true}
                  objKey="username"
                />
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <div className="neumorphism-box">
          <div className="col-lg-12">
            <div className="statbox widget box box-shadow">
              <div className="widget-content widget-content-area">
                {authData.user_type === "superuser" ? (
                  <div className="text-center mb-3">
                    <Button
                      variant={`${allEnq ? "primary" : "outline-primary"}`}
                      className="mr-3"
                      onClick={assignedUserFilter}
                    >
                      All Applications
                    </Button>
                    <Button
                      variant={`${allEnq ? "outline-primary" : "primary"}`}
                      onClick={assignedUserFilter}
                    >
                      Applications With No Assigned User
                    </Button>
                  </div>
                ) : (
                  ""
                )}
                <ColumnFilter
                  allColumns={allColumns}
                  showFilterBtn={appFilter.enquiry_status}
                  filterOnClick={clearFilter}
                  filterStore="appColumn"
                />
                <DataTable
                  onChangePage={(page) => {
                    setPageNo(page);
                    setEnqData([]);
                    setRefresherNeeded(true);
                  }}
                  onChangeRowsPerPage={handlePerRowsChange}
                  columns={columns}
                  data={enqData}
                  selectableRows
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
        <UploadDoc
          changeMode={setOfferLetterUpload}
          name={offerLetterUpload.name}
          resetApp={() => {
            setEnqData([]);
          }}
          id={offerLetterUpload.id}
        />
      ) : (
        ""
      )}{" "}
      {showCommentPopup.show ? (
        <CommentPopup
          id={showCommentPopup.enqId}
          title={showCommentPopup.name}
          onHide={() => {
            setShowCommentPopup({ show: false, enqId: null, name: null });
          }}
        />
      ) : (
        ""
      )}
    </>
  );
}

export default Applications;
