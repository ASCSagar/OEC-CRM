import React from "react";
import { Button } from "react-bootstrap";
import "react-select-search/style.css";
import FileUpload from "../../components/UI/Form/FileUpload";
import SelectionBox from "../../components/UI/Form/SelectionBox";
import ApplicationForm from "./ApplicationForm";
import { useParams } from "react-router-dom";
function CreateApplication() {
  const enqId = useParams().appID;
  return (
    <ApplicationForm
      type="create"
      title="Create Application"
      edit={false}
      enqID={enqId}
      enqSelectionDisable={enqId ? true : false}
    />
  );
}

export default CreateApplication;
