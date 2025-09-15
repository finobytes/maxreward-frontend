import React from "react";

const ErrorMsg = ({ message }) => {
  return message ? (
    <p className="text-red-500 text-xs mt-1">{message}</p>
  ) : null;
};

export default ErrorMsg;
