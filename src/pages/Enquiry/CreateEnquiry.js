import React, { useReducer, useState } from "react";
import EnquiryForm from "./EnquiryForm";
import { useLocation } from "react-router-dom";

function CreateEnquiry(props) {
  // not needed for now as showing in popup
  // const { state } = useLocation();
  // console.log(state);
  return (
    <>
      <EnquiryForm
        type="create"
        title="Create Enquiry"
        edit={false}
        isFlow={props ? true : false}
        level={props?.levelId}
        intake={props?.intake}
        courseId={props?.courseId}
        uniId={props?.uniId}
      />
    </>
  );
}

export default CreateEnquiry;
