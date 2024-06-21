import React, { useEffect, useReducer, useState } from "react";
import { Form } from "react-bootstrap";
import SelectionBox from "../components/UI/Form/SelectionBox";
import { ajaxCallWithHeaderOnly } from "../helpers/ajaxCall";
import { useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import LoadingData from "../components/UI/LoadingData";
import CreateEnquiry from "./Enquiry/CreateEnquiry";
import UiModal from "../components/UI/UiModal";

const initialState = {
  name: null,
  examGiven: null,
  marks: null,
  engWaiver: null,
  levelId: null,
  levelName: null,
  intakeId: null,
  intakeName: null,
  ielts: null,
  toefl: null,
  pte: null,
  cSearch: null,
  university: { id: null, name: null },
  loadPercent: 0,
  loadText: "Fill all Details to load Courses",
  isAll: 0,
  filter: null,
  refresh: 0,
};

const reducer = (state, action) => {
  if (action.type === "resetRefresh") {
    return {
      ...state,
      refresh: 0,
    };
  }

  if (action.type === "checkThings") {
    let loadText = "Fill all Details to load Courses";
    let load = 0;
    let isAll = 1;
    if (state.ielts || state.toefl || state.pte) {
      load += 25;
    }
    if (state.intakeId) {
      load += 25;
    }
    if (state.levelId) {
      load += 25;
    }
    if (state.cSearch) {
      load += 25;
    }
    isAll = isAll && (state.ielts || state.toefl || state.pte);
    isAll = isAll && state.intakeId;
    isAll = isAll && state.levelId && state.cSearch;
    isAll = isAll ? 1 : 0;
    if (load) {
      const remainSteps = 4 - load / 25;

      loadText = `${remainSteps} steps remains to get list of courses`;
    }
    let filter = `?course_name=${state.cSearch}`;
    return {
      ...state,
      loadPercent: load,
      isAll,
      loadText,
      filter,
    };
  }
  let value = action.value;
  if (!action.value) {
    value = null;
  }

  return {
    ...state,
    [action.type]: value,
    refresh: 1,
  };
};
function Search() {
  const [throwErr, setThrowErr] = useState(null);
  const [uniData, setUniData] = useState([]);
  const [isUniLoadingData, setIsUniLoadingData] = useState(false);

  // for pagination
  const [pageNo, setPageNo] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  // for showing popup
  const [enqPopup, setEnqPopup] = useState({ show: false, data: {} });
  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    setPageNo(page);
    setUniData([]);
  };
  // pagination over
  const [uniState, dispatchUniState] = useReducer(reducer, initialState);

  useEffect(() => {
    if (throwErr) throw throwErr;
  }, [throwErr]);

  const authData = useSelector((state) => state.authStore);
  const goToEnqPage = function (uniId, courseId, course_levels) {
    setEnqPopup({
      show: true,
      data: {
        levelId: course_levels,
        intake: uniState.intakeId,
        uniId,
        courseId,
      },
    });
  };

  const uniColumns = [
    {
      name: "University Name",
      selector: (row) => row.uniName,
      sortable: true,
    },
    {
      name: "Course Name",
      selector: (row) => row.courseName,
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => (
        <span
          className="btn-primary btn"
          onClick={() => {
            goToEnqPage(row.uniId, row.courseId, row.course_levels);
          }}
        >
          Apply To This Course
        </span>
      ),
      sortable: true,
    },
  ];
  const getData = async function () {
    let courseUrl = `courseslistsuni/${uniState.filter}&p=${pageNo}&records=${perPage}`;
    if (uniState.intakeId) {
      courseUrl += `&intake=${uniState.intakeId}`;
    }
    if (uniState.levelId) {
      courseUrl += `&course_levels=${uniState.levelId}`;
    }
    setIsUniLoadingData(true);

    const response = await ajaxCallWithHeaderOnly(
      `${courseUrl}`,
      {
        Authorization: `Bearer ${authData.accessToken}`,
      },
      "POST",
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
          courseId: data?.id,
          courseName: data?.course_name,
          uniId: data?.university?.id,
          uniName: data?.university?.univ_name,
        };
      });
      setTotalRows(response.count);
      setUniData(data);
    } else {
      setTotalRows(0);
      setUniData([]);
    }
    setIsUniLoadingData(false);
    dispatchUniState({
      type: "resetRefresh",
    });
  };
  useEffect(() => {
    try {
      if (uniState.cSearch) getData();
    } catch (e) {
      setThrowErr({ e, page: "enquiries" });
      return;
    }
  }, [
    uniState.isAll,
    uniState.refresh,
    uniState.levelId,
    uniState.intakeId,
    uniState.ielts,
    uniState.toefl,
    uniState.pte,
    uniState.cSearch,
    perPage,
    pageNo,
  ]);

  // level and intake filter
  const selectValueChanged = function (typeId, typeName, val, name) {
    if (name) {
      dispatchUniState({
        type: typeId,
        value: val,
      });
      dispatchUniState({
        type: typeName,
        value: name.name,
      });
      dispatchUniState({
        type: "checkThings",
      });

      // reset the data table
      dispatchUniState({
        type: "resetRefresh",
      });
    }
  };
  return (
    <div class="row layout-spacing">
      <div class="neumorphism-box nmb">
        <div class="col-lg-12 flex-main">
          <Form.Group className="mb-3 col-md-6" controlId="cSearch">
            <Form.Label>Search Course</Form.Label>
            <Form.Control
              type="text"
              name="cSearch"
              value={uniState.cSearch}
              onChange={(e) => {
                dispatchUniState({
                  type: "cSearch",
                  value: e.target.value,
                });
                dispatchUniState({
                  type: "checkThings",
                });
              }}
            />
          </Form.Group>
        </div>
      </div>
      <div class="neumorphism-box nmb">
        <div class="col-lg-12">
          {uniState.cSearch ? (
            <>
              <div className="row">
                <SelectionBox
                  groupClass="mb-3 col-md-2 selectbox"
                  groupId="levelApplying"
                  value={uniState.levelId}
                  label="Level"
                  onChange={selectValueChanged.bind(
                    null,
                    "levelId",
                    "levelName"
                  )}
                  name="levelApplying"
                  url="courselevels/"
                  isSearch={false}
                  objKey="levels"
                />
                <SelectionBox
                  label="Intake"
                  groupClass="mb-3 col-md-2 selectbox"
                  groupId="intakeInterested"
                  value={uniState.intakeId}
                  onChange={selectValueChanged.bind(
                    null,
                    "intakeId",
                    "intakeName"
                  )}
                  name="intakeInterested"
                  url="intakes/"
                  isSearch={true}
                  objKey="it's different"
                />
              </div>
              <DataTable
                onChangePage={(page) => {
                  setPageNo(page);
                  setUniData([]);
                }}
                columns={uniColumns}
                data={uniData}
                onChangeRowsPerPage={handlePerRowsChange}
                pagination
                paginationServer
                progressPending={isUniLoadingData}
                progressComponent={
                  <LoadingData className="loading-spinner-flex" />
                }
                paginationTotalRows={totalRows}
              />
              {enqPopup.show ? (
                <UiModal
                  setModalStatus={() => setEnqPopup({ show: false, data: {} })}
                  showStatus={enqPopup.show}
                  showHeader={true}
                  title=""
                  body={
                    <CreateEnquiry
                      levelId={enqPopup.data.levelId}
                      intake={enqPopup.data.intake}
                      uniId={enqPopup.data.uniId}
                      courseId={enqPopup.data.courseId}
                    />
                  }
                  showFooter={false}
                  footerContent=""
                  size="xl"
                />
              ) : (
                ""
              )}
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;
