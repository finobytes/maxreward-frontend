import React from "react";
import MemberList from "./components/MemberList";

const MemberManage = () => {
  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-600 pb-4">
        Member Manage
      </h1>
      <div>
        <MemberList />
      </div>
    </div>
  );
};

export default MemberManage;
