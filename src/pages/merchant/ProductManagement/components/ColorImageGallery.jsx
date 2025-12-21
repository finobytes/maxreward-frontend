import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import Label from "../../../../components/form/Label";
import ComponentCard from "../../../../components/common/ComponentCard";

const ColorImageGallery = ({ variations = [] }) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [colorAttributes, setColorAttributes] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  // Extract unique color attributes from variations
  useEffect(() => {
    if (!variations || variations.length === 0) {
      setColorAttributes([]);
      return;
    }

    const colors = new Map();

    variations.forEach((v) => {
      if (v.attributes) {
        v.attributes.forEach((attr) => {
          // Check if attribute name contains "color" or "colour" (case insensitive)
          const name = attr.attribute_name?.toLowerCase();
          if (name && (name.includes("color") || name.includes("colour"))) {
            if (!colors.has(attr.attribute_item_id)) {
              colors.set(attr.attribute_item_id, {
                id: attr.attribute_item_id,
                name: attr.attribute_item_name,
                attribute_id: attr.attribute_id, // Keep track of parent attribute ID if needed
              });
            }
          }
        });
      }
    });

    const colorList = Array.from(colors.values());
    setColorAttributes(colorList);
    // Reset active tab if it's out of bounds
    if (activeTab >= colorList.length) {
      setActiveTab(0);
    }
  }, [variations]);

  // Watch the current images for the active tab to show previews
  const currentImages = watch(`color_images.${colorAttributes[activeTab]?.id}`);

  if (colorAttributes.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
      <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span className="bg-brand-600 text-white p-1 rounded">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m14.31 8 5.74 9.94" />
            <path d="M9.69 8h11.48" />
            <path d="m7.38 12 5.74-9.94" />
            <path d="M9.69 16 3.95 6.06" />
            <path d="M14.31 16H2.83" />
            <path d="m16.62 12-5.74 9.94" />
          </svg>
        </span>
        Color Variation Images
      </h4>
      <p className="text-sm text-gray-500 mb-6">
        Upload images for each color. These images will be automatically applied
        to all variations of that color.
      </p>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Tabs */}
        <div className="w-full md:w-48 flex-shrink-0 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          {colorAttributes.map((color, index) => (
            <button
              key={color.id}
              type="button"
              onClick={() => setActiveTab(index)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium text-left transition-all whitespace-nowrap ${
                activeTab === index
                  ? "bg-brand-600 text-white ring-1 ring-brand-200 shadow-sm"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span>{color.name}</span>
                {watch(`color_images.${color.id}`)?.length > 0 && (
                  <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-gray-50/50 rounded-xl border border-dashed border-gray-200 p-6">
          {colorAttributes[activeTab] && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <Label className="text-gray-700">
                  Images for {colorAttributes[activeTab].name}
                </Label>
                <span className="text-xs text-gray-500">
                  {currentImages?.length || 0} files selected
                </span>
              </div>

              <input
                type="file"
                multiple
                className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2.5 file:px-4
                            file:rounded-full file:border-0
                            file:text-xs file:font-semibold
                            file:bg-brand-600 file:text-white
                            hover:file:bg-brand-700
                            cursor-pointer file:cursor-pointer
                        "
                {...register(`color_images.${colorAttributes[activeTab].id}`)}
              />

              {/* Simple Preview */}
              {currentImages && currentImages.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 mt-4">
                  {Array.from(currentImages).map((file, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-white relative group"
                    >
                      {file instanceof File ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt="preview"
                          className="w-full h-full object-cover"
                          onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                        />
                      ) : (
                        // Handle potential string URLs if editing existing product (though current logic is mostly for new uploads)
                        <img
                          src={file}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ColorImageGallery;
