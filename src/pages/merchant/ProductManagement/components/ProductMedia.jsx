import React from "react";
import { useFormContext } from "react-hook-form";
import { UploadCloud, X, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import ComponentCard from "../../../../components/common/ComponentCard";
import Label from "../../../../components/form/Label";

const ProductMedia = () => {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const images = watch("images") || [];

  const removeImage = (index) => {
    const updated = Array.from(images);
    const removed = updated[index];
    updated.splice(index, 1);
    setValue("images", updated, { shouldValidate: true });

    // Track deleted images (if existing image from DB)
    if (!(removed instanceof File)) {
      const currentDeleted = watch("delete_images") || [];
      setValue("delete_images", [...currentDeleted, removed]);
    }
  };

  return (
    <ComponentCard title="Product Media">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <Label>General Images</Label>
          <span className="text-xs text-gray-500">
            {images.length} selected
          </span>
        </div>

        {/* ================= Upload Zone ================= */}
        <label className="relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-10 cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
          <UploadCloud className="h-9 w-9 text-brand-600 mb-2" />
          <p className="text-sm font-medium text-gray-700">
            Click or drag images to upload
          </p>

          <p className="text-xs text-gray-500 mt-1">
            Max 5 images (JPEG/PNG/WebP, max 5MB)
          </p>

          <input
            type="file"
            multiple
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                const newFiles = Array.from(e.target.files);
                const currentImages = images || [];
                const validCurrentImages = Array.isArray(currentImages)
                  ? currentImages
                  : [];

                if (validCurrentImages.length + newFiles.length > 5) {
                  toast.error("You can only upload up to 5 images.");
                  return;
                }

                const validFiles = newFiles.filter((file) => {
                  if (file.size > 5 * 1024 * 1024) {
                    toast.error(`Image ${file.name} is too large (max 5MB).`);
                    return false;
                  }
                  if (
                    ![
                      "image/jpeg",
                      "image/png",
                      "image/webp",
                      "image/jpg",
                    ].includes(file.type)
                  ) {
                    toast.error(
                      `Image ${file.name} format not supported (JPEG/PNG/WebP only).`,
                    );
                    return false;
                  }
                  return true;
                });

                if (validFiles.length > 0) {
                  setValue("images", [...validCurrentImages, ...validFiles], {
                    shouldValidate: true,
                  });
                }
                e.target.value = ""; // Reset input
              }
            }}
          />
        </label>

        {errors.images && (
          <p className="text-red-500 text-sm mt-1">{errors.images.message}</p>
        )}

        {/* ================= Empty State ================= */}
        {!images.length && (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <ImageIcon className="h-10 w-10 mb-2" />
            <p className="text-sm">No images uploaded yet</p>
          </div>
        )}

        {/* ================= Preview Grid ================= */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {Array.from(images).map((file, index) => {
              const src =
                file instanceof File
                  ? URL.createObjectURL(file)
                  : file.url || file;

              return (
                <div
                  key={index}
                  className="relative group rounded-xl overflow-hidden border bg-white shadow-sm"
                >
                  <img
                    src={src}
                    alt="preview"
                    className="h-32 w-full object-cover"
                    onLoad={() =>
                      file instanceof File && URL.revokeObjectURL(src)
                    }
                  />

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ComponentCard>
  );
};

export default ProductMedia;
