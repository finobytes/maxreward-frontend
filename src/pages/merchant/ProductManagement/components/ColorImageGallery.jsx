import React, { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { UploadCloud, X, ImageIcon } from "lucide-react";
import ComponentCard from "../../../../components/common/ComponentCard";
import Label from "../../../../components/form/Label";

const ColorImageGallery = ({ variations = [] }) => {
  const { watch, setValue } = useFormContext();
  const [activeTab, setActiveTab] = useState(0);

  /* --------------------------------------------------
   Extract unique color attributes
  -------------------------------------------------- */
  const colors = useMemo(() => {
    const map = new Map();

    variations.forEach((v) => {
      v.attributes?.forEach((attr) => {
        const name = attr.attribute_name?.toLowerCase();
        if (name && (name.includes("color") || name.includes("colour"))) {
          if (!map.has(attr.attribute_item_id)) {
            map.set(attr.attribute_item_id, {
              id: attr.attribute_item_id,
              name: attr.attribute_item_name,
              attribute_id: attr.attribute_id,
            });
          }
        }
      });
    });

    return Array.from(map.values());
  }, [variations]);

  const activeColor = colors[activeTab];
  const images = watch(`color_images.${activeColor?.id}`) || [];

  /* --------------------------------------------------
   Remove image
  -------------------------------------------------- */
  const removeImage = (index) => {
    const updated = Array.from(images);
    updated.splice(index, 1);
    setValue(`color_images.${activeColor.id}`, updated);
  };

  if (!colors.length) return null;

  return (
    <ComponentCard title="Color Based Image Gallery">
      {/* ================= Sticky Horizontal Tabs ================= */}
      <div className="sticky top-20 z-20 bg-white pb-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {colors.map((color, index) => {
            const hasImages = watch(`color_images.${color.id}`)?.length > 0;

            return (
              <button
                key={color.id}
                type="button"
                onClick={() => setActiveTab(index)}
                className={`flex items-center gap-3 px-4 py-2 rounded-full border whitespace-nowrap transition ${
                  activeTab === index
                    ? "bg-brand-600 text-white border-brand-600 shadow"
                    : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                }`}
              >
                <span
                  className="h-3 w-3 rounded-full border"
                  style={{ backgroundColor: color.name.toLowerCase() }}
                />
                <span className="text-sm font-medium">{color.name}</span>

                {hasImages && (
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= Content ================= */}
      <div className="mt-6 space-y-5">
        <div className="flex items-center justify-between">
          <Label>
            Images for{" "}
            <span className="font-semibold text-gray-900">
              {activeColor.name}
            </span>
          </Label>
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
            You can upload multiple images
          </p>

          <input
            type="file"
            multiple
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                const newFiles = Array.from(e.target.files);
                const currentImages =
                  watch(`color_images.${activeColor.id}`) || [];
                const validCurrentImages =
                  currentImages instanceof FileList
                    ? Array.from(currentImages)
                    : currentImages;

                setValue(`color_images.${activeColor.id}`, [
                  ...validCurrentImages,
                  ...newFiles,
                ]);
                e.target.value = ""; // Reset input
              }
            }}
          />
        </label>

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
                file instanceof File ? URL.createObjectURL(file) : file;

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

export default ColorImageGallery;
