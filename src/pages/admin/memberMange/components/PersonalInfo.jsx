import React from "react";

const PersonalInfo = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 sm:px-2 sm:pt-6 lg:px-6 shadow-md">
      {/* Info List */}
      <ul className="space-y-3 text-sm text-gray-700">
        <li className="flex">
          <span className="w-32 font-medium">Name :</span>
          <span className="text-gray-600">Leo Phillips</span>
        </li>

        <li className="flex">
          <span className="w-32 font-medium">Email :</span>
          <span className="text-primary">youremail@example.com</span>
        </li>

        <li className="flex">
          <span className="w-32 font-medium">Phone :</span>
          <span className="text-gray-600">+1 (555) 123-4567</span>
        </li>

        <li className="flex">
          <span className="w-32 font-medium">Designation :</span>
          <span className="text-gray-600">C.E.O</span>
        </li>

        <li className="flex">
          <span className="w-32 font-medium">Address :</span>
          <span className="text-gray-600">Washington D.C</span>
        </li>

        <li className="flex">
          <span className="w-32 font-medium">Contributor level :</span>
          <span className="text-indigo-600">Level-3</span>
        </li>
      </ul>
    </div>
  );
};

export default PersonalInfo;
