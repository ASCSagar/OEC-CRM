import React, { useEffect, useState } from "react";
import { ajaxCallWithHeaderOnly } from "../../helpers/ajaxCall";
import { useSelector } from "react-redux";
import LoadingData from "../../components/UI/LoadingData";
import SelectionBox from "../../components/UI/Form/SelectionBox";
import DocumentRow from "../app/DocumentRow";

function EnqDetails({ data }) {
  // states and reducers

  return (
    <>
      <div className="col-md-12">
        <h2 className="mb-3 text-center">Applicant Details</h2>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="applicantDetailsDashboard">
            <p>
              <span className="textBold">Name</span> :{" "}
              <span>{data.student_name}</span>
            </p>
            <p>
              <span className="textBold">Phone</span> :{" "}
              <span>{data.student_phone}</span>
            </p>
            <p>
              <span className="textBold">Email Id</span> :{" "}
              <span>{data.student_email}</span>
            </p>
            <p>
              <span className="textBold">Address</span> :
              <span>
                {data.student_address}, {data.city}, {data.state},{" "}
                {data.zipcode} -{data.country}
              </span>
            </p>
            <p>
              <span className="textBold">Current Education</span> :
              <span>{data.current_education?.current_education}</span>
            </p>
            <p>
              <span className="textBold">Notes</span> :{" "}
              <span>{data.notes}</span>
            </p>
            <p>
              <span className="textBold">Previous Visa Refusal</span> :
              <span>{data.visa_refusal ? "YES" : "NO"}</span>
            </p>
            <p>
              <span className="textBold">Visa Refusal File</span> :
              <span>
                {data.visa_file ? (
                  <a href={data.visa_file} target="_blank" rel="noreferrer">
                    Download File
                  </a>
                ) : (
                  "-"
                )}
              </span>
            </p>
            <p>
              <span className="textBold">DOB</span> :{" "}
              <span>{data.dob.split("-").reverse().join("-")}</span>
            </p>
            <p>
              <span className="textBold">Passport Number</span> :{" "}
              <span>{data.passport_number}</span>
            </p>
            <p>
              <span className="textBold">Is Married</span> :{" "}
              <span>{data.married ? "Yes" : "No"}</span>
            </p>{" "}
            <p>
              <span className="textBold">Country Interested</span> :{" "}
              <span>{data.country_interested?.country_name}</span>
            </p>
            <p>
              <span className="textBold">Enquiry Date</span> :
              <span>{data.date_created.split("-").reverse().join("-")}</span>
            </p>
          </div>
        </div>
        <div className="col-md-6 borderLeft">
          <div className="applicantDetailsDashboard">
            <div className="text-center">
              <p className="textBold">10th Marksheet</p>
              <DocumentRow
                id={data.application[0].id}
                docType="10th Marksheet"
                name={data.student_name}
                document={data.application[0]?.Tenth_Marksheet}
                uploadKey="Tenth_Marksheet"
                setRefresherNeeded={() => {}}
              />
            </div>
            <div className="text-center">
              <p className="textBold">12th Marksheet</p>
              <DocumentRow
                id={data.application[0].id}
                docType="12th Marksheet"
                name={data.student_name}
                document={data.application[0]?.Twelveth_Marksheet}
                uploadKey="Twelveth_Marksheet"
                setRefresherNeeded={() => {}}
              />
            </div>
            <div className="text-center">
              <p className="textBold">Diploma Marksheet</p>
              <DocumentRow
                id={data.application[0].id}
                docType="Diploma Marksheet"
                name={data.student_name}
                document={data.application[0]?.Diploma_Marksheet}
                uploadKey="Diploma_Marksheet"
                setRefresherNeeded={() => {}}
              />
            </div>

            <div className="text-center">
              <p className="textBold">Bachelor Marksheet</p>
              <DocumentRow
                id={data.application[0].id}
                docType="Bachelor_Marksheet"
                name={data.student_name}
                document={data.application[0]?.Bachelor_Marksheet}
                uploadKey="Bachelor_Marksheet"
                setRefresherNeeded={() => {}}
              />
            </div>
            <div className="text-center">
              <p className="textBold">Language Exam</p>
              <DocumentRow
                id={data.application[0].id}
                docType="Language_Exam"
                name={data.student_name}
                document={data.application[0]?.Language_Exam}
                uploadKey="Language_Exam"
                setRefresherNeeded={() => {}}
              />
            </div>
            <div className="text-center">
              <p className="textBold">Master Marksheet</p>
              <DocumentRow
                id={data.application[0].id}
                docType="Master_Marksheet"
                name={data.student_name}
                document={data.application[0]?.Master_Marksheet}
                uploadKey="Master_Marksheet"
                setRefresherNeeded={() => {}}
              />
            </div>

            <div className="text-center">
              <p className="textBold">Resume</p>
              <DocumentRow
                id={data.application[0].id}
                docType="Resume"
                name={data.student_name}
                document={data.application[0]?.Resume}
                uploadKey="Resume"
                setRefresherNeeded={() => {}}
              />
            </div>
            <div className="text-center">
              <p className="textBold">Lor</p>
              <DocumentRow
                id={data.application[0].id}
                docType="Lor"
                name={data.student_name}
                document={data.application[0]?.Lor}
                uploadKey="Lor"
                setRefresherNeeded={() => {}}
              />
            </div>
            <div className="text-center">
              <p className="textBold">passport</p>
              <DocumentRow
                id={data.application[0].id}
                docType="passport"
                name={data.student_name}
                document={data.application[0]?.passport}
                uploadKey="passport"
                setRefresherNeeded={() => {}}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EnqDetails;
