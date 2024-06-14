import React, { useEffect, useReducer, useRef, useState } from "react";
import {
  Form,
  InputGroup,
  OverlayTrigger,
  Popover,
  ProgressBar,
} from "react-bootstrap";
import SelectionBox from "../components/UI/Form/SelectionBox";
import LoaderUni from "../components/UI/Layouts/LoaderUni";
import { ajaxCallWithHeaderOnly } from "../helpers/ajaxCall";
import { useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import LoadingData from "../components/UI/LoadingData";
import { useNavigate } from "react-router-dom";
import CourseLists from "../components/University/CourseLists";
// import CourseLists from "../components/University/CourseLists";

function University() {
  const [throwErr, setThrowErr] = useState(null);
  const [uniData, setUniData] = useState([]);
  const [searchUni, setSearchUni] = useState("");
  const [isUniLoadingData, setIsUniLoadingData] = useState(false);

  // for pagination
  const [pageNo, setPageNo] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  // for go to courses
  const [loadCourse, setLoadCourse] = useState({
    loadCourse: false,
    uniId: -1,
  });

  const handlePerRowsChange = (newPerPage, page) => {
    // console.log("per row is changed and data is", newPerPage, page);
    setPerPage(newPerPage);
    setPageNo(page);
    setUniData([]);
  };
  // pagination over

  const navigate = useNavigate();
  useEffect(() => {
    if (throwErr) throw throwErr;
  }, [throwErr]);
  const authData = useSelector((state) => state.authStore);
  const filter = useRef();

  const goToCoursePage = function (uniId, courseType) {
    setLoadCourse({ loadCourse: true, uniId, type: courseType });
    console.log("time to load courses");
    // navigate("/enquiry/create", {
    //   state: {
    //     uniId,
    //   },
    // });
  };
  // const isAll = uniState.ielts || uniState.ielts || uniState.ielts;
  const uniColumns = [
    {
      name: "University Name",
      selector: (row) => row.univ_name,
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => (
        <>
          <span
            className="btn-primary btn"
            onClick={() => {
              goToCoursePage(row.id, 2);
            }}
          >
            Apply For UG Course
          </span>
          <span
            className="btn-primary btn ml30"
            onClick={() => {
              goToCoursePage(row.id, 1);
            }}
          >
            Apply For PG Course
          </span>
        </>
      ),
    },
  ];
  const getData = async function () {
    setIsUniLoadingData(true);
    let courseUrl = `get/unilistapply/?p=${pageNo}&records=${perPage}`;
    if (searchUni?.length) courseUrl += `&search=${searchUni}`;
    const response = await ajaxCallWithHeaderOnly(
      `${courseUrl}`,
      {
        Authorization: `Bearer ${authData.accessToken}`,
      },
      "POST",
      null
    );
    console.log(response);
    if (response?.isNetwork) {
      setThrowErr({ ...response, page: "enquiries" });
      return;
    }
    if (response?.status === 401) {
      setThrowErr({ ...response, page: "enquiries" });
      return;
    }
    if (response?.status) {
      setThrowErr({ ...response, page: "enquiries" });
      return;
    }
    if (response?.results?.length > 0) {
      // const data = response.results.map((data) => {
      //   return {
      //     ...data,
      //     uniId: data?.id,
      //     univ: data?.course_name,
      //     uniId: data?.university?.id,
      //     uniName: data?.university?.univ_name,
      //   };
      // });
      setTotalRows(response.count);
      setUniData(response?.results);
    } else {
      setTotalRows(0);
      setUniData([]);
    }
    setIsUniLoadingData(false);
  };

  useEffect(() => {
    try {
      getData();
    } catch (e) {
      setThrowErr({ e, page: "enquiries" });
      return;
    }
  }, [perPage, pageNo, searchUni]);
  return (
    <div className="row layout-spacing">
      <div className="neumorphism-box nmb">
        <div className="col-lg-12">
          {loadCourse.loadCourse ? (
            <CourseLists
              uniId={loadCourse.uniId}
              courseLevel={loadCourse.type}
              goToCourse={() => {
                setLoadCourse({ loadCourse: false, uniId: -1, type: -1 });
              }}
            />
          ) : (
            <>
              <Form.Group className="mb-3 col-md-4" controlId="uniSearch">
                <Form.Control
                  type="text"
                  name="uniSearch"
                  placeholder="Search University"
                  value={searchUni}
                  onChange={(e) => setSearchUni(e.target.value)}
                />
              </Form.Group>
              <DataTable
                onChangePage={(page) => {
                  // console.log("new Page numbner is", page);
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default University;
