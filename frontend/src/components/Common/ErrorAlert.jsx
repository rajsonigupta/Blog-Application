import React from "react";

const ErrorAlert = ({ message, onDismiss }) => (
  <div className="alert alert-danger alert-dismissible" role="alert">
    {message}
    {onDismiss && (
      <button
        type="button"
        className="btn-close"
        onClick={onDismiss}
        aria-label="Close"
      ></button>
    )}
  </div>
);

export default ErrorAlert;
