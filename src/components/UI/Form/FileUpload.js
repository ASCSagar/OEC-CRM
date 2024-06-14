import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { FileUploader } from "react-drag-drop-files";
import SideImgForm from "./SideImgForm";
import { ajaxCall } from "../../../helpers/ajaxCall";
import { useSelector } from "react-redux";
// import axios from "axios";
const fileTypes = ["pdf"];
function FileUpload(props) {
  // console.log(props.afile);
  const [file, setFile] = useState(null);
  // const handleChange = (file) => {
  //   setFile(file);
  // };
  const authData = useSelector((state) => state.authStore);
  const fileName =
    props.isEdit && !(props.afile instanceof File)
      ? props.afile
        ? props.afile.split("/").reduce((acc, path) => {
            return path;
          }, "")
        : "No file uploaded yet"
      : props.afile
      ? `File name: ${props.afile.name}`
      : "No files uploaded yet";
  // console.log("filee name is", fileName);

  // const onChangeFile = async function (file) {
  //   const url = `update-application/${props.appId}/`;
  //   const method = "PATCH";
  //   const fdata = new FormData();
  //   fdata.append(props.uploadId, file);
  //   // const response = await ajaxCall(
  //   //   url,
  //   //   {
  //   //     Authorization: `Bearer ${authData.accessToken}`,
  //   //   },
  //   //   method,
  //   //   fdata
  //   // );
  //   // axios
  //   //   .patch({
  //   //     url,
  //   //     data: fdata,
  //   //     headers: {
  //   //       "Content-Type": "multipart/form-data",
  //   //     },
  //   //     onUploadProgress: (p) => {
  //   //       console.log(p);
  //   //       //this.setState({
  //   //       //fileprogress: p.loaded / p.total
  //   //       //})
  //   //     },
  //   //   })
  //   //   .then((data) => {
  //   //     console.log(data);
  //   //     //this.setState({
  //   //     //fileprogress: 1.0,
  //   //     //})
  //   //   });

  //   // console.log(response);
  // };
  return (
    <>
      <Form.Group controlId={props.groupId} className={props.groupClassName}>
        {props?.label ? (
          <Form.Label className="reesumeLabel">
            {props.label}
            {props.label === "Resume" ? (
              <>
                {" / "}
                <a href="https://getcv.me" target="_blank" rel="noreferrer">
                  Create Resume Now
                </a>
              </>
            ) : (
              ""
            )}
          </Form.Label>
        ) : (
          ""
        )}

        <div className="neumorphism-box uploadBox">
          <FileUploader
            handleChange={props.onChange}
            // handleChange={onChangeFile}
            onDrop={(file) => {
              // console.log("file is", file);
            }}
            onSelect={(file) => {
              // console.log("file is", file);
            }}
            name={props.fieldName}
            types={fileTypes}
            hoverTitle={props.title}
            minSize={0.00005}
            maxSize={0.5}
          />
        </div>
        {props.isEdit && props.afile && !(props.afile instanceof File) ? (
          <a
            className="appDownload"
            target="_blank"
            rel="noreferrer"
            href={props.afile}
            download
          >
            {fileName}
          </a>
        ) : (
          <p>{fileName}</p>
        )}
      </Form.Group>
    </>
  );
}

export default FileUpload;
