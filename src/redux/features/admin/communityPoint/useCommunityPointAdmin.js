import { useSelector, useDispatch } from "react-redux";
import { setPage, setPerPage } from "./communityPointAdminSlice";
import { useGetAdminCommunityPointQuery } from "./communityPointAdminApi";

export const useCommunityPointAdmin = () => {
  const dispatch = useDispatch();
  const { page, perPage } = useSelector((state) => state.communityPointAdmin);

  const queryArgs = {
    page: page ?? 1,
    perPage: perPage ?? 20,
  };

  const query = useGetAdminCommunityPointQuery(queryArgs);

  const communityPoints = query.data?.data?.data ?? [];
  const metaSource = query.data?.data ?? {};

  const meta = {
    currentPage: metaSource.current_page ?? queryArgs.page,
    lastPage: metaSource.last_page ?? 1,
    perPage: metaSource.per_page ?? queryArgs.perPage,
    total: metaSource.total ?? communityPoints.length,
  };

  const changePage = (newPage) => dispatch(setPage(newPage));
  const changePerPage = (value) => dispatch(setPerPage(value));

  return {
    ...query,
    communityPoints,
    meta,
    page: queryArgs.page,
    perPage: queryArgs.perPage,
    changePage,
    changePerPage,
  };
};
