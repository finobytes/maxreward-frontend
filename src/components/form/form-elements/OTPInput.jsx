import React, { useRef, useState, useEffect } from "react";

const OTPInput = ({ length = 6, onChange }) => {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    setOtp((prev) => {
      if (prev.length === length) return prev;
      return Array(length).fill("");
    });
  }, [length]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    // Allow replacing value
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Trigger onChange with the joined string
    if (onChange) {
      onChange(newOtp.join(""));
    }

    // focus next
    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "Tab" &&
      !/^[0-9]$/.test(e.key) &&
      !e.metaKey &&
      !e.ctrlKey
    ) {
      e.preventDefault();
    }

    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1].focus();
      } else if (otp[index]) {
        // If we have a value and hit backspace, clear it (default input behavior),
        // but we might want to also ensure we sync state.
        // The onChange handler handles the empty string update,
        // but we need to ensure we don't move focus unless empty.
        // Actually, let's rely on handleChange for clearing.
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    if (!/^\d+$/.test(text)) return;

    const digits = text.split("").slice(0, length);
    const newOtp = [...otp];
    digits.forEach((d, i) => {
      newOtp[i] = d;
    });
    setOtp(newOtp);
    if (onChange) onChange(newOtp.join(""));

    const nextIndex = Math.min(digits.length, length - 1);
    if (inputRefs.current[nextIndex]) {
      inputRefs.current[nextIndex].focus();
    }
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  return (
    <div className="flex gap-2 justify-center">
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onFocus={handleFocus}
          onPaste={handlePaste}
          ref={(el) => (inputRefs.current[index] = el)}
          className="shadow-xs flex w-10 sm:w-12 items-center justify-center rounded-lg border border-gray-300 bg-white p-2 text-center text-xl font-medium text-gray-900 outline-none focus:border-[#FF5A29] focus:ring-1 focus:ring-[#FF5A29] sm:text-2xl"
        />
      ))}
    </div>
  );
};

export default OTPInput;
