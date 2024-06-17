import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import LoadingData from "../components/UI/LoadingData";
import { ajaxCallWithHeaderOnly } from "../helpers/ajaxCall";
import { useSelector } from "react-redux";

const Enquriy = () => {
  const authData = useSelector((state) => state.authStore);
  const [contactData, setContactData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // for pagination
  const [pageNo, setPageNo] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    setPageNo(page);
    setContactData([]);
  };

  const uniColumns = [
    {
      name: "First Name",
      selector: (row) => row.firstname,
      sortable: true,
    },
    {
      name: "Last Name",
      selector: (row) => row.lastname,
      sortable: true,
    },
    {
      name: "Country Interested",
      selector: (row) => row.country_interested,
      sortable: true,
    },
    {
      name: "Intake year",
      selector: (row) => row.intake_year,
      sortable: true,
    },
    {
      name: "Level Applying For",
      selector: (row) => row.level_applying,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
      sortable: true,
    },
    {
      name: "Notes",
      selector: (row) => row.notes,
      sortable: true,
    },
  ];

  const getData = async function () {
    setIsLoading(true);
    let url = `create/contactus/?p=${pageNo}&records=${perPage}`;
    const response = await ajaxCallWithHeaderOnly(
      `${url}`,
      {
        Authorization: `Bearer ${authData.accessToken}`,
      },
      "GET",
      null
    );
    if (response?.results?.length > 0) {
      setTotalRows(response?.count);
      setContactData(response?.results);
    } else {
      setTotalRows(0);
      setContactData([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    try {
      getData();
    } catch (e) {
      console.log("Error");
      return;
    }
  }, [perPage, pageNo]);

  return (
    <div className="row layout-spacing">
      <div className="neumorphism-box nmb">
        <div className="col-lg-12">
          <DataTable
            onChangePage={(page) => {
              setPageNo(page);
              setContactData([]);
            }}
            columns={uniColumns}
            data={contactData}
            onChangeRowsPerPage={handlePerRowsChange}
            pagination
            paginationServer
            progressPending={isLoading}
            progressComponent={<LoadingData className="loading-spinner-flex" />}
            paginationTotalRows={totalRows}
          />
        </div>
      </div>
    </div>
  );
};

export default Enquriy;
