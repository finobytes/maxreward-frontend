import { useDropzone } from "react-dropzone";
import { useState, useEffect } from "react";

const Dropzone = ({ onFilesChange, multiple = false, maxFiles = 1 }) => {
  const [files, setFiles] = useState([]);

  const onDrop = (acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    let updatedFiles;
    if (multiple) {
      updatedFiles = [...files, ...newFiles].slice(0, maxFiles);
    } else {
      updatedFiles = newFiles;
    }

    setFiles(updatedFiles);
    onFilesChange && onFilesChange(updatedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    maxFiles,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/webp": [],
      "image/svg+xml": [],
    },
  });

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <>
      <div className="transition border border-gray-300 border-dashed cursor-pointer rounded-xl hover:border-brand-500">
        <div
          {...getRootProps()}
          className={`dropzone rounded-xl border-dashed border-gray-300 p-7 lg:p-10
        ${
          isDragActive
            ? "border-brand-500 bg-gray-100"
            : "border-gray-300 bg-gray-50"
        }`}
        >
          <input {...getInputProps()} />
          <div className="dz-message flex flex-col items-center">
            {/* Icon */}
            <div className="mb-[22px] flex justify-center">
              <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-gray-200 text-gray-700">
                <svg
                  className="fill-current"
                  width="29"
                  height="28"
                  viewBox="0 0 29 28"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14.5 3.917a.7.7 0 0 0-.549.239L8.574 9.532a.667.667 0 0 0 .948.948L13.75 6.478V18.667a.75.75 0 0 0 1.5 0V6.482l4.114 4.11a.667.667 0 1 0 .948-.948l-5.342-5.338a.7.7 0 0 0-.47-.29ZM5.916 18.667a.75.75 0 0 0-1.5 0v3.167c0 1.243 1.007 2.25 2.25 2.25h15.668c1.243 0 2.25-1.007 2.25-2.25v-3.167a.75.75 0 0 0-1.5 0v3.167c0 .414-.336.75-.75.75H6.666a.75.75 0 0 1-.75-.75v-3.167Z"
                  />
                </svg>
              </div>
            </div>
            {/* Text */}
            <h4 className="mb-3 font-semibold text-gray-800 text-theme-xl">
              {isDragActive ? "Drop Files Here" : "Drag & Drop Files Here"}
            </h4>
            <span className="mb-5 block w-full max-w-[290px] text-center text-sm text-gray-700">
              Drag and drop your PNG, JPG, WebP, SVG images here or browse
            </span>
            <span className="font-medium underline text-theme-sm text-brand-500">
              Browse File
            </span>
          </div>
        </div>
      </div>

      {/* Preview */}
      {files.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-3">
          {files.map((file) => (
            <div key={file.name} className="relative">
              <img
                src={file.preview}
                alt={file.name}
                className="h-32 w-full object-cover rounded-lg border"
              />
              <p className="mt-1 text-xs text-gray-600 truncate">{file.name}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Dropzone;
