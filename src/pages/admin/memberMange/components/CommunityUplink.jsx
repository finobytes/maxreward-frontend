import React from "react";
import { useGetUpLineMemberQuery } from "../../../../redux/features/admin/memberManagement/memberManagementApi";

const CommunityUplink = ({ member }) => {
  const { data } = useGetUpLineMemberQuery(member?.id, { skip: !member?.id });
  console.log("Upline data:", data);
  return <div>CommunityUplink</div>;
};

export default CommunityUplink;
