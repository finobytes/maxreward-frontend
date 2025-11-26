import { useGetMemberCommunityPointQuery } from "./communityPointMemberApi";

export const useCommunityPointMember = (memberId) => {
  const query = useGetMemberCommunityPointQuery(
    { memberId },
    {
      skip: !memberId,
    }
  );

  // console.log("query::::", query?.data?.data);

  const communityPoints = query.data?.data ?? [];
  const metaSource = query.data?.data ?? {};

  const meta = {
    currentPage: metaSource.current_page ?? 1,
    lastPage: metaSource.last_page ?? 1,
    perPage: metaSource.per_page ?? 20,
    total: metaSource.total ?? communityPoints.length,
  };

  return {
    ...query,
    communityPoints,
    meta,
  };
};
