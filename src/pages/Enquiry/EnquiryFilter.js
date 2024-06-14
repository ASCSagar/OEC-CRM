import React from "react";
import { Button, Form, InputGroup, NavLink } from "react-bootstrap";
import SelectionBox from "../../components/UI/Form/SelectionBox";
import { Link } from "react-router-dom";

function EnquiryFilter(props) {
  // const clss = props.isAdmin ? "col-md-6" : "col-md-12";
  const clss = "col-md-12";
  return (
    <div className="row nomp">
      {/* <SelectionBox
        groupClass="mb-3 col-md-4 selectbox"
        groupId="uniFilter"
        label="University"
        onChange={props.filterSelectionChanged.bind(
          null,
          "university_interested"
        )}
        value={props.enqFilter.university_interested}
        name="uniFilter"
        url="universitieslists/"
        isSearch={true}
        objKey="univ_name"
      />
      <SelectionBox
        groupClass="mb-3 col-md-4 selectbox"
        groupId="levelApplying"
        label="Level Applying For"
        name="levelApplying"
        url="courselevels/"
        value={props.enqFilter.level_applying_for}
        isSearch={true}
        objKey="levels"
        onChange={props.filterSelectionChanged.bind(null, "level_applying_for")}
      />
      <SelectionBox
        groupClass="mb-3 col-md-4 selectbox"
        groupId="intakeInterested"
        label="Intake Interested"
        name="intakeInterested"
        value={props.enqFilter.intake_interested}
        url="intakes/"
        isSearch={true}
        objKey="it's different"
        onChange={props.filterSelectionChanged.bind(null, "intake_interested")}
      /> */}
      {/* <SelectionBox
        groupClass="mb-3 col-md-3 selectbox"
        groupId="enqStatus"
        label="Enquiry Status"
        onChange={props.filterSelectionChanged.bind(null, "enquiry_status")}
        name="enqStatus"
        value={props.enqFilter.enquiry_status}
        url="enquirystatus/"
        isSearch={false}
        objKey="status"
      /> */}
      <Form onSubmit={props.searchEnq} className={clss}>
        <Form.Label className="text-center itsBlock">Search Enquiry</Form.Label>
        <InputGroup className="mb-3">
          <Form.Control
            placeholder="Search Name / Email / Phone Number"
            aria-label="Recipient's username"
            aria-describedby="basic-addon2"
            type="text"
            name="search"
            value={props.searchText}
            onChange={(e) => {
              props.setSearchText(e.target.value);
              if (!e.target.value?.length) {
                props.refreshNeeded(true);
              }
            }}
            className={`searchInput ${
              props.searchText?.length ? "nocontent" : ""
            }`}
          />
          {props.searchText?.length ? (
            <InputGroup.Text
              onClick={props.clearSearch}
              className="clear-search__btn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="m12 13.4l-4.9 4.9q-.275.275-.7.275q-.425 0-.7-.275q-.275-.275-.275-.7q0-.425.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7q0-.425.275-.7q.275-.275.7-.275q.425 0 .7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275q.425 0 .7.275q.275.275.275.7q0 .425-.275.7L13.4 12l4.9 4.9q.275.275.275.7q0 .425-.275.7q-.275.275-.7.275q-.425 0-.7-.275Z"
                />
              </svg>
            </InputGroup.Text>
          ) : (
            ""
          )}

          <Button
            type="submit"
            variant="outline-primary"
            id="button-addon2"
            className="searchBtnEnq"
            disabled={props.searchText?.length ? false : true}
            // onClick={props.searchEnq}
          >
            Search
          </Button>
        </InputGroup>
      </Form>
      {/* {props.isAdmin ? (
        <SelectionBox
          groupClass="mb-3 col-md-6 selectbox"
          groupId="assignedUsr"
          label="Assigned User"
          onChange={props.filterSelectionChanged.bind(null, "assigned_usr")}
          name="assUser"
          value={props.enqFilter.assigned_usr}
          url="userlist/"
          isSearch={true}
          objKey="username"
        />
      ) : (
        ""
      )} */}
    </div>
  );
}

export default EnquiryFilter;
