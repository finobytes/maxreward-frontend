import React from "react";

const PersonalInfo = ({ member }) => {
  if (!member) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-6 shadow-md">
        <p className="text-gray-500 text-center">No member data available.</p>
      </div>
    );
  }
  const totalReferrals = member.total_referrals || 0;

  // Limit stars between 0–5
  const starCount = Math.min(totalReferrals, 5);

  // Text label (1 Star / 2 Stars / etc.)
  const starLabel = starCount === 1 ? "1 Star" : `${starCount} Stars`;
  // Dynamically map member info
  const infoList = [
    { key: "Name:", value: member.name || "N/A" },
    { key: "Email:", value: member.email || "N/A" },
    { key: "Phone:", value: member.phone || "N/A" },
    { key: "Member Type:", value: member.member_type || "N/A" },
    { key: "Referral Code:", value: member.referral_code || "N/A" },
    { key: "Status:", value: member.status || "N/A" },
    { key: "Member Level:", value: starLabel || "N/A" },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 sm:px-2 sm:pt-6 lg:px-6 shadow-md">
      <h3 className="text-lg font-semibold text-gray-700">Personal Info</h3>
      <div className="mt-2 w-full border-t border-gray-300"></div>

      <div className="flow-root mt-2">
        <ul className="divide-y divide-gray-200">
          {infoList.map((item, index) => (
            <li key={index} className="flex justify-between py-3">
              <p className="text-sm font-medium text-gray-600">{item.key}</p>
              <p className="text-sm text-gray-900">{item.value}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PersonalInfo;
