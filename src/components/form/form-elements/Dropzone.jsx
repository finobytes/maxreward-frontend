import { useDropzone } from "react-dropzone";
import { useState, useEffect } from "react";
import { upload } from "../../../assets/assets";
import { X } from "lucide-react";

const Dropzone = ({
  onFilesChange,
  multiple = false,
  maxFiles = 1,
  initialFiles = [],
}) => {
  const [files, setFiles] = useState([]);
  const [hasNewFile, setHasNewFile] = useState(false);

  // ✅ Load existing image from server only once (when editing)
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

  // ✅ Handle new file drop
  const onDrop = (acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );

    // শুধুমাত্র single file এর ক্ষেত্রে পুরনো preview clear করে দেই
    const updatedFiles = multiple
      ? [...files, ...newFiles].slice(0, maxFiles)
      : [newFiles[0]];

    setFiles(updatedFiles);
    setHasNewFile(true); // mark that user uploaded a new file

    // inform parent
    if (onFilesChange) {
      onFilesChange(multiple ? updatedFiles : updatedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    maxFiles,
    accept: { "image/*": [] },
  });

  // ✅ Clean up URLs
  useEffect(() => {
    return () =>
      files.forEach((f) => !f.existing && URL.revokeObjectURL(f.preview));
  }, [files]);

  // ✅ Remove selected file
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
        className={`transition border-2 border-dashed rounded-xl cursor-pointer p-7 lg:p-10
          ${
            isDragActive
              ? "border-brand-500 bg-gray-100"
              : "border-gray-300 bg-gray-50 hover:border-brand-400"
          }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <div className="mb-3 flex justify-center items-center bg-brand-500 rounded-full p-1">
            <div className="rounded-full bg-white w-12 h-12 p-2">
              <img src={upload} alt="upload icon" />
            </div>
            <p className="text-white px-5">Drop or click to upload</p>
          </div>
          <span className="font-medium underline text-theme-sm text-brand-500">
            Browse File
          </span>
          <span className="text-gray-400 text-xs mt-2">Max size: 10MB</span>
        </div>
      </div>

      {/* ✅ Preview Section */}
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
              <p className="mt-1 text-xs text-gray-600 truncate text-center px-1">
                {file.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Dropzone;
