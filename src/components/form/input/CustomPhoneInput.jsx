import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const CustomPhoneInput = ({
  value,
  onChange,
  error,
  hint,
  disabled = false,
}) => {
  return (
    <div className="relative">
      <PhoneInput
        country={"bd"}
        value={value}
        onChange={onChange}
        disabled={disabled}
        specialLabel=""
        inputClass={`!h-11 !w-full !rounded-lg !border !px-4 !py-2.5 !text-sm 
           shadow-theme-xs placeholder:text-gray-400 focus:!outline-none
           ${
             disabled
               ? "!bg-gray-100 !text-gray-500 !cursor-not-allowed"
               : error
               ? "!border-error-500 focus:!border-error-300 !focus:ring-error-500/20"
               : "!bg-transparent !text-gray-800 !border-gray-300 focus:!border-brand-300 !focus:ring-brand-500/20"
           }`}
        buttonClass="!bg-transparent !border-gray-300 !rounded-l-lg"
        containerClass="w-full"
      />

      {hint && (
        <p
          className={`mt-1.5 text-xs ${
            error ? "text-error-500" : "text-gray-500"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default CustomPhoneInput;
