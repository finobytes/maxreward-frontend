import React from "react";

const StaffDocuments = ({ staff }) => {
  const nidFront = staff?.national_id_card?.front?.url;
  const nidBack = staff?.national_id_card?.back?.url;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 sm:px-2 sm:pt-6 lg:px-6 shadow-md">
      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-700">Staff Documents</h3>
      <div className="mt-2 w-full border-t border-gray-300 mb-4"></div>

      {/* Documents Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-4">
        {/* NID Front */}
        {nidFront && (
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 mb-2">
              Identity Card Front
            </p>
            <img
              src={nidFront}
              alt="NID Front"
              className="w-40 h-28 object-cover mx-auto rounded-xl border border-gray-200 shadow-sm"
            />
          </div>
        )}

        {/* NID Back */}
        {nidBack && (
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 mb-2">
              Identity Card Back
            </p>
            <img
              src={nidBack}
              alt="NID Back"
              className="w-40 h-28 object-cover mx-auto rounded-xl border border-gray-200 shadow-sm"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDocuments;
