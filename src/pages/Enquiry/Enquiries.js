import React, { useEffect, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import LoadingData from "../../components/UI/LoadingData";
import UiModal from "../../components/UI/UiModal";
import {
  ajaxCallWithHeaderOnly,
  ajaxCallWithoutBody,
} from "../../helpers/ajaxCall";
import { uiAction } from "../../store/uiStore";
import EnquiryColumnFilter from "./EnquiryColumnFilter";
import EnquiryFilter from "./EnquiryFilter";
import CommentPopup from "../../components/enq/CommentPopup";

function Enquiries() {
  const [enqData, setEnqData] = useState([]);
  const [allEnq, setAllEnq] = useState(true);
  const [refreshNeeded, setRefresherNeeded] = useState(true);
  const [assignUsrData, setAssignUsrData] = useState([]);
  const [enqFilter, setEnqFilter] = useState({
    university_interested: null,
    level_applying_for: null,
    intake_interested: null,
    enquiry_status: null,
    assigned_usr: null,
  });

  // data table code starts
  const [pageNo, setPageNo] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [showCommentPopup, setShowCommentPopup] = useState({
    show: false,
    enqId: null,
    name: null,
  });

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    setPageNo(page);
    setEnqData([]);
    setRefresherNeeded(true);
  };
  // data table code ended
  // normal vars to set the student Name and id
  const deleteEntryDetails = useRef({});
  const [searchText, setSearchText] = useState("");
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [promptStatus, setPromptStatus] = useState(false);
  const authData = useSelector((state) => state.authStore);
  const navigate = useNavigate();
  const [throwErr, setThrowErr] = useState(null);
  const columnData = useSelector((store) => store.enqColumn);
  const dispatch = useDispatch();
  const promptDelete = (student_name, deleteId) => {
    setPromptStatus(true);
    deleteEntryDetails.current = { name: student_name, id: deleteId };
  };
  const deleteEnquiry = async function (deleteId) {
    try {
      setSearchText("");
      setIsLoadingData(true);
      const response = await ajaxCallWithoutBody(
        `update-enquiry/${deleteId}/`,
        {
          Authorization: `Bearer ${authData.accessToken}`,
        },
        "DELETE"
      );
      if (response !== true) {
        setThrowErr({ ...response, page: "enquiries" });
        return;
      }
      dispatch(
        uiAction.setNotification({
          show: true,
          heading: "Enquiry Deleted Successfully",
          msg: `<strong>${deleteEntryDetails.current.name}</strong> enquiry Deleted successfully`,
        })
      );
      deleteEntryDetails.current = {};
      setEnqData([]);
      setRefresherNeeded(true);
      setPageNo(1);
    } catch (e) {
      setThrowErr({ e, page: "enquiries" });
      return;
    }
  };

  const columns = [
    {
      cell: (row) => (
        <>
          {row?.application_id ? (
            <Link to={`/student/${row.id}`} alt="Go To Dashboard">
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
                class="feather feather-home"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </Link>
          ) : (
            <Link to={`/application/create/${row.id}`} alt="Create Application">
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
              </svg>
            </Link>
          )}

          <button
            className="enquiryAction"
            title="Edit Enquiry"
            onClick={() => {
              navigate(`/enquiry/edit/${row.id}`);
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
            title="Delete Enquiry"
            onClick={() => {
              promptDelete(row.student_name, row.id);
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
      name: "Student Name",
      selector: (row) => row.student_name,
      sortable: true,
      omit: columnData.name,
    },
    {
      name: "Student Phone",
      selector: (row) => row.student_phone,
      omit: columnData.phone,
    },
    {
      name: "Student Email",
      selector: (row) => row.student_email,
      grow: 1,
      omit: columnData.email,
    },
    {
      name: "Current Education",
      selector: (row) => row.current_education,
      omit: columnData.current_edu,
    },
    {
      name: "Country Interested",
      selector: (row) => row.country_interested,
      omit: columnData.country_interested,
    },
    {
      name: "Enq Date",
      selector: (row) => row.date_created,
      omit: columnData.date,
    },
    {
      name: "Added By",
      selector: (row) => row.added_by,
      omit: columnData.added_by,
    },
    {
      name: "Notes",
      selector: (row) => row.notes,
      omit: columnData.notes,
    },
  ];
  useEffect(() => {
    if (throwErr) throw throwErr;
  }, [throwErr]);

  const getAssignUsrData = async function () {
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
  };
  useEffect(() => {
    if (enqData.length && !assignUsrData.length) {
      getAssignUsrData();
    }
  }, [enqData]);

  const getEnqDTData = async (url) => {
    setIsLoadingData(true);
    const response = await ajaxCallWithHeaderOnly(
      url,
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
          date_created: data?.date_created.split("-").reverse().join("-"),
          added_by: data?.added_by?.username,
          intake_interested: data?.intake_interested?.intake_month
            ? `${data?.intake_interested?.intake_month} ${data?.intake_interested?.intake_year}`
            : "",
          assigned_users: data?.assigned_users?.username
            ? data?.assigned_users?.username
            : "-",
          assigned_usersId: data?.assigned_users?.id,
          country_interested: data?.country_interested?.country_name,
          course_interested: data?.course_interested?.course_name,
          current_education: data?.current_education?.current_education,
          current_educationId: data?.current_education?.id,
          enquiry_status: data?.enquiry_status?.status,
          level_applying_for: data?.level_applying_for?.levels,
          university_interested: data?.university_interested?.univ_name,
        };
      });
      if (data?.length) setEnqData(data);
      setTotalRows(response.count);
    } else {
      setEnqData([]);
    }
    setIsLoadingData(false);
    setRefresherNeeded(false);
  };

  useEffect(() => {
    if (refreshNeeded) {
      let url = `enquiries/?ordering=-date_created&p=${pageNo}&records=${perPage}`;
      url += enqFilter.university_interested
        ? `&university_interested=${enqFilter.university_interested}`
        : "";
      url += enqFilter.level_applying_for
        ? `&level_applying_for=${enqFilter.level_applying_for}`
        : "";
      url += enqFilter.intake_interested
        ? `&intake_interested=${enqFilter.intake_interested}`
        : "";
      url += enqFilter.enquiry_status
        ? `&enquiry_status=${enqFilter.enquiry_status}`
        : "";
      url += enqFilter.assigned_usr
        ? `&assigned_users=${enqFilter.assigned_usr}`
        : "";
      url +=
        authData.user_type === "superuser"
          ? !allEnq
            ? "&assigned_usersf=1"
            : ""
          : "";
      try {
        getEnqDTData(url);
      } catch (e) {
        setThrowErr({ e, page: "enquiries" });
        return;
      }
      setRefresherNeeded(false);
    }
  }, [enqFilter, refreshNeeded, allEnq, pageNo, perPage]);

  const filterSelectionChanged = function (filterName, val) {
    setEnqFilter((oldFilter) => {
      // copying object
      const filterData = JSON.parse(JSON.stringify(oldFilter));
      filterData[filterName] = val;
      return filterData;
    });
    setRefresherNeeded(true);
    setPageNo(1);
  };

  const searchEnq = (e) => {
    try {
      e.preventDefault();
      if (searchText?.length) {
        const partURL =
          authData.user_type === "superuser"
            ? !allEnq
              ? "&assigned_usersf=1"
              : ""
            : "";
        setIsLoadingData(true);
        setPageNo(1);
        let url = `enquiries/?ordering=-date_created&search=${searchText}${partURL}`;
        getEnqDTData(url);
      }
    } catch (e) {
      setThrowErr({ e, page: "enquiries" });
      return;
    }
  };

  const clearFilter = function () {
    setEnqFilter({
      university_interested: null,
      level_applying_for: null,
      intake_interested: null,
      enquiry_status: null,
      assigned_usr: null,
    });
    setEnqData([]);
    setPageNo(1);
    setRefresherNeeded(true);
  };
  const clearSearch = function () {
    if (searchText?.length) {
      setEnqData([]);
      setRefresherNeeded(true);
      setPageNo(1);
    }
    setSearchText("");
  };

  return (
    <>
      <div className="row layout-spacing">
        <div className="neumorphism-box nmb">
          <div className="col-lg-12">
            <div className="row">
              <EnquiryFilter
                isAdmin={authData.user_type === "superuserr"}
                filterSelectionChanged={filterSelectionChanged}
                enqFilter={enqFilter}
                searchText={searchText}
                setSearchText={setSearchText}
                clearSearch={clearSearch}
                searchEnq={searchEnq}
                refreshNeeded={setRefresherNeeded}
              />
            </div>
          </div>
        </div>
        <div className="neumorphism-box">
          <div className="col-lg-12">
            <div className="statbox widget box box-shadow">
              <div className="widget-content widget-content-area">
                <EnquiryColumnFilter
                  showFilterBtn={false}
                  filterStore="enqColumn"
                  enqFilter={enqFilter}
                  filterOnClick={clearFilter}
                />
                <DataTable
                  autoResetPage={true}
                  onChangePage={(page) => {
                    setPageNo(page);
                    setEnqData([]);
                    setRefresherNeeded(true);
                  }}
                  columns={columns}
                  data={enqData}
                  onChangeRowsPerPage={handlePerRowsChange}
                  selectableRows
                  pagination
                  paginationServer
                  progressPending={isLoadingData}
                  progressComponent={
                    <LoadingData className="loading-spinner-flex" />
                  }
                  paginationTotalRows={totalRows}
                  key={totalRows}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
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
                  <strong> {deleteEntryDetails.current.name} ?</strong>
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
                    deleteEnquiry(deleteEntryDetails.current.id);
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

export default Enquiries;
