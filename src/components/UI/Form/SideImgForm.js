import React, { useState } from "react";
import UiModal from "../UiModal";

function SideImgForm(props) {
  // const [modalStatus, setModalStatus] = useState({
  //   showModal: false,
  //   showHeader: false,
  //   headerContent: null,
  //   bodyContent: null,
  //   showFooter: false,
  //   footerContent: null,
  // });

  // const hideModal = () =>
  //   setModalStatus({
  //     showModal: false,
  //     showHeader: false,
  //     headerContent: null,
  //     bodyContent: null,
  //     showFooter: false,
  //     footerContent: null,
  //   });

  // const openModal = () => {
  //   setModalStatus({
  //     showModal: true,
  //     showHeader: true,
  //     headerContent: props.fName,
  //     bodyContent: (
  //       <img src={props.afile} alt={props.fName} className="app-img" />
  //     ),
  //     showFooter: true,
  //     footerContent: (
  //       <>
  //         <button
  //           class="btn btn-outline-dark mb-2 me-4"
  //           onClick={() => {
  //             window.open(props.afile);
  //           }}
  //         >
  //           Open Image &nbsp;
  //           <svg
  //             xmlns="http://www.w3.org/2000/svg"
  //             width="24"
  //             height="24"
  //             viewBox="0 0 24 24"
  //           >
  //             <path
  //               fill="currentColor"
  //               d="M10 6v2H5v11h11v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6zm11-3v9l-3.794-3.793l-5.999 6l-1.414-1.414l5.999-6L12 3h9z"
  //             />
  //           </svg>
  //         </button>
  //         <a
  //           className="btn btn-outline-primary mb-2 me-4"
  //           href={props.afile}
  //           download
  //         >
  //           Download Document
  //         </a>
  //       </>
  //     ),
  //   });
  // };

  // return (
  //   <>
  //     <div className="col-md-4 text-center sideImgAppContainer">
  //       <img
  //         src={props.afile}
  //         className="sideImgApp"
  //         alt=""
  //         onClick={openModal}
  //       ></img>
  //     </div>
  //     {modalStatus.showModal ? (
  //       <UiModal
  //         setModalStatus={hideModal}
  //         showStatus={modalStatus.showModal}
  //         showHeader={modalStatus.showHeader}
  //         title={modalStatus.headerContent}
  //         body={modalStatus.bodyContent}
  //         showFooter={modalStatus.showFooter}
  //         footerContent={modalStatus.footerContent}
  //       />
  //     ) : (
  //       ""
  //     )}
  //   </>
  // );
  return (
    <div className="col-md-4 text-center sideImgAppContainer">
      <a
        className="btn btn-outline-primary mb-2 me-4"
        href={props.afile}
        target="_blank"
        rel="noreferrer"
        download
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
          class="feather feather-arrow-down-circle"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="8 12 12 16 16 12"></polyline>
          <line x1="12" y1="8" x2="12" y2="16"></line>
        </svg>
        Download Document
      </a>
    </div>
  );
}

export default SideImgForm;
