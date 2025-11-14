import { useDropzone } from "react-dropzone";
import { useState, useEffect } from "react";
import { upload } from "../../../assets/assets";
import { X } from "lucide-react";
import { toast } from "sonner";

const Dropzone = ({
  onFilesChange,
  multiple = false,
  maxFiles = 1,
  initialFiles = [],
  maxFileSizeMB = 5,
  placeholderImage = null,
  required = false,
  requiredCount = null,
  validationMessage = "This field is required",
  countValidationMessage = null,
}) => {
  const [files, setFiles] = useState([]);
  const [hasNewFile, setHasNewFile] = useState(false);

  // Load existing image (for edit)
  useEffect(() => {
    if (initialFiles.length > 0 && !hasNewFile) {
      const formatted = initialFiles.map((url) => ({
        name: url.split("/").pop(),
        preview: url,
        existing: true,
      }));
      setFiles(formatted);
    }
  }, [initialFiles, hasNewFile]);

  // Handle file drop
  const onDrop = (acceptedFiles) => {
    const validFiles = acceptedFiles.filter((file) => {
      if (file.size > maxFileSizeMB * 1024 * 1024) {
        toast.error(`"${file.name}" exceeds ${maxFileSizeMB}MB limit`);
        return false;
      }
      return true;
    });

    const newFiles = validFiles.map((file) =>
      Object.assign(file, { preview: URL.createObjectURL(file) })
    );

    const updatedFiles = multiple
      ? [...files, ...newFiles].slice(0, maxFiles)
      : [newFiles[0]];

    if (
      (requiredCount || maxFiles) &&
      updatedFiles.length < (requiredCount || maxFiles)
    ) {
      toast.error(
        countValidationMessage ||
          `You must upload ${requiredCount || maxFiles} file${
            (requiredCount || maxFiles) > 1 ? "s" : ""
          }`
      );
    }

    setFiles(updatedFiles);
    setHasNewFile(true);

    onFilesChange && onFilesChange(multiple ? updatedFiles : updatedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    maxFiles,
    accept: { "image/*": [] },
  });

  // Cleanup previews
  useEffect(() => {
    return () =>
      files.forEach((f) => !f.existing && URL.revokeObjectURL(f.preview));
  }, [files]);

  // Remove file
  const handleRemove = (index) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    if (updated.length === 0) setHasNewFile(false);
    onFilesChange && onFilesChange(multiple ? updated : null);
  };

  return (
    <>
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`transition border-2 border-dashed rounded-xl cursor-pointer p-6 flex flex-col items-center justify-center
    ${
      isDragActive
        ? "border-brand-500 bg-gray-100"
        : "border-gray-300 bg-gray-50 hover:border-brand-400"
    }`}
      >
        <input {...getInputProps()} />

        {files.length === 0 ? (
          <>
            {placeholderImage && (
              <img
                src={placeholderImage}
                alt="placeholder"
                className="h-28 w-28 object-cover rounded-lg border mb-3"
              />
            )}
            <p className="text-gray-500 text-sm mb-1">
              Drop or click to upload
            </p>
            <span className="font-medium underline text-sm text-brand-500">
              Browse File
            </span>
            <span className="text-gray-400 text-xs mt-2">
              {`Max ${maxFiles} file${
                maxFiles > 1 ? "s" : ""
              }, up to ${maxFileSizeMB}MB each`}
            </span>
          </>
        ) : (
          <>
            {/* ✅ Only show Add More when multiple is true & not reached limit */}
            {multiple && files.length < maxFiles ? (
              <div className="flex flex-col items-center">
                <img
                  src={upload}
                  alt="upload icon"
                  className="h-10 w-10 opacity-80"
                />
                <p className="font-medium underline text-sm text-brand-500 mt-1">
                  Add More
                </p>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Files Uploaded</p>
            )}
          </>
        )}
      </div>

      {/* Preview Section */}
      {files.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-3">
          {files.map((file, idx) => (
            <div
              key={idx}
              className="relative group border rounded-lg overflow-hidden"
            >
              <img
                src={file.preview}
                alt={file.name}
                className="h-32 w-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
              <p className="text-xs text-gray-600 text-center truncate px-1 mt-1">
                {file.name}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Validation message */}
      {/* {required && files.length < (requiredCount || maxFiles) && (
        <p className="text-red-500 text-xs mt-1">
          {countValidationMessage ||
            `Please upload all ${requiredCount || maxFiles} required files.`}
        </p>
      )} */}
      {/* Validation message */}
      {validationMessage && (
        <p className="text-red-500 text-xs mt-1">{validationMessage}</p>
      )}
    </>
  );
};

export default Dropzone;
