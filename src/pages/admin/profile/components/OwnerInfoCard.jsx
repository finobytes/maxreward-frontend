import React from "react";

const OwnerInfoCard = ({ userInfo }) => {
  const people = [
    {
      key: "Name:",
      value: userInfo?.name || "John Doe",
    },
    {
      key: "Email:",
      value: userInfo?.email || "youremail@example.com",
    },
    {
      key: "Phone:",
      value: userInfo?.phone || "+1 (555) 123-4567",
    },
    {
      key: "Designation:",
      value: userInfo?.designation || "C.E.O",
    },
    {
      key: "Address:",
      value: userInfo?.address || "Washington D.C",
    },
    {
      key: "Contributor level :",
      value: "Level-3",
    },
    {
      key: "Create at:",
      value: `${new Date(userInfo?.created_at).toLocaleDateString()}` || "N/A",
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
                {people.map((person) => (
                  <li className="flex" key={person.email}>
                    <p className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-0">
                      {person.key}
                    </p>
                    <p className="py-4 text-sm whitespace-nowrap text-gray-900">
                      {person.value}
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

export default OwnerInfoCard;
