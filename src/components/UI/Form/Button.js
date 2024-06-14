import React from "react";

function Button(props) {
  return (
    <div className={props.divClassName}>
      <button
        className={props.btnClassName}
        onClick={props.onClick}
        disabled={props.disabled}
      >
        {props.btnLabel}
      </button>
    </div>
  );
}

export default Button;
