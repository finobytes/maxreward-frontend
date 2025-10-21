import { useSelector } from "react-redux";
import { useGetMembersQuery } from "./memberManagementApi";

export const useMembers = () => {
  const { search, memberType, status, page, perPage, sortBy, sortOrder } =
    useSelector((state) => state.memberManagement || {});

  const params = {
    page,
    per_page: perPage,
    search: search || undefined,
    member_type: memberType || undefined,
    status: status !== "all" ? status : undefined,
    sort_by: sortBy,
    sort_order: sortOrder,
  };

  // RTK Query: data is { members, meta } from transformResponse
  const { data, isLoading, isFetching, isError, refetch } = useGetMembersQuery(
    params,
    {
      refetchOnMountOrArgChange: true, // auto refetch on param change
      keepPreviousData: true, // keep old data while loading new
    }
  );

  return {
    members: data?.members || [],
    meta: data?.meta || {
      current_page: 1,
      last_page: 1,
      total: 0,
      per_page: perPage,
    },
    isLoading,
    isFetching,
    isError,
    refetch,
  };
};
