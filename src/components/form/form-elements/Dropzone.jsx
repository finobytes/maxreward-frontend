import { useDropzone } from "react-dropzone";
import { useState, useEffect } from "react";
import { upload } from "../../../assets/assets";

const Dropzone = ({
  onFilesChange,
  multiple = false,
  maxFiles = 1,
  initialFiles = [],
}) => {
  const [files, setFiles] = useState([]);

  // existing files handle (from server)
  useEffect(() => {
    if (initialFiles.length > 0) {
      const formatted = initialFiles.map((url) => ({
        name: url.split("/").pop(),
        preview: url,
        existing: true,
      }));
      setFiles(formatted);
    }
  }, [initialFiles]);

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
      updatedFiles = [newFiles[0]]; // single file mode
    }

    setFiles(updatedFiles);

    // callback — auto handle single/multiple
    if (onFilesChange) {
      onFilesChange(multiple ? updatedFiles : updatedFiles[0]);
    }
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

  // revoke blob URLs when unmounted
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
            <div className="mb-[22px] flex justify-center items-center bg-brand-500 rounded-full p-1">
              <div className="rounded-full bg-white w-12 h-12 p-2">
                <img className="" src={upload} alt="upload icon" />
              </div>
              <p className="text-white px-5">Drop here to attach or upload</p>
            </div>
            <span className="font-medium underline text-theme-sm text-brand-500">
              Browse File
            </span>
            <span className="text-gray-400 text-xs mt-2">Max size: 10MB</span>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      {files.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-3">
          {files.map((file, idx) => (
            <div key={idx} className="relative">
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
