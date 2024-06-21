import React from "react";
import { Form } from "react-bootstrap";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["pdf"];
function FileUpload(props) {
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
