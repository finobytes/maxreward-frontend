import React from "react";
import ComponentCard from "../../../../components/common/ComponentCard";

const AuthorizedPersonInformation = ({ userInfo }) => {
  const authorizedPersonInformation = [
    {
      key: "Name:",
      value: userInfo?.authorized_person_name || "N/A",
    },
    {
      key: "Phone:",
      value: userInfo?.authorized_person_phone || "N/A",
    },
    {
      key: "Email:",
      value: userInfo?.authorized_person_email || "N/A",
    },
  ];
  return (
    <div>
      {" "}
      <ComponentCard title="Authorized Person Information">
        {" "}
        <div className="flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="relative min-w-full divide-y divide-gray-200">
                <ul className="divide-y divide-gray-200">
                  {authorizedPersonInformation.map((info) => (
                    <li className="flex" key={info.email}>
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
      </ComponentCard>
    </div>
  );
};

export default AuthorizedPersonInformation;
