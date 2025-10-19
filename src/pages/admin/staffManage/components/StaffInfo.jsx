import React from "react";

const StaffInfo = ({ staff }) => {
  const staffInfo = [
    {
      key: "Name:",
      value: staff?.name,
    },
    {
      key: "Email:",
      value: staff?.email,
    },
    {
      key: "Phone:",
      value: staff?.phone,
    },
    {
      key: "Designation:",
      value: staff?.designation,
    },
    {
      key: "Address:",
      value: staff?.address,
    },
    {
      key: "Contributor level :",
      value: staff?.contributorLevel,
    },
  ];
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 sm:px-2 sm:pt-6 lg:px-6 shadow-md">
      {/* Info List */}
      <h3 className="text-lg font-semibold text-gray-700">Personal Info</h3>
      <div className="mt-2 w-full border-t border-gray-300"></div>
      <div className="flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="relative min-w-full divide-y divide-gray-200">
              <ul className="divide-y divide-gray-200">
                {staffInfo.map((info) => (
                  <li className="flex" key={info.key}>
                    <p className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-0">
                      {info.key}
                    </p>
                    <p className="py-4 text-sm whitespace-nowrap text-gray-900">
                      {info.value}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffInfo;
