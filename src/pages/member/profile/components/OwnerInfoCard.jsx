import React from "react";
import PrimaryButton from "../../../../components/ui/PrimaryButton";
import ComponentCard from "../../../../components/common/ComponentCard";

const OwnerInfoCard = ({ userInfo }) => {
  const people = [
    {
      key: "Name:",
      value: userInfo?.name || "N/A",
    },
    {
      key: "Email:",
      value: userInfo?.email || "N/A",
    },
    {
      key: "Phone:",
      value: userInfo?.phone || "N/A",
    },
    {
      key: "Address:",
      value: userInfo?.address || "N/A",
    },
    {
      key: "Create at:",
      value: `${new Date(userInfo?.created_at).toLocaleDateString()}` || "N/A",
    },
  ];
  return (
    <div className="">
      {/* Info List */}
      <ComponentCard title="Owner Information">
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
        <div className="py-4">
          <PrimaryButton
            type="button"
            variant="primary"
            size="md"
            to="/member/merchant-application"
          >
            Apply For Merchant
          </PrimaryButton>
        </div>
      </ComponentCard>
    </div>
  );
};

export default OwnerInfoCard;
