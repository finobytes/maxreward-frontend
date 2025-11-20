import { useSelector, useDispatch } from "react-redux";
import { setPage, setPerPage } from "./cpUnlockHistoryAdminSlice";
import { useGetAdminCpUnlockHistoryQuery } from "./cpUnlockHistoryAdminApi";

export const useCpUnlockHistoryAdmin = () => {
  const dispatch = useDispatch();
  const { page, perPage } = useSelector((state) => state.cpUnlockHistoryAdmin);

  const queryArgs = {
    page: page ?? 1,
    perPage: perPage ?? 20,
  };

  const query = useGetAdminCpUnlockHistoryQuery(queryArgs);

  const unlockHistories = query.data?.data?.data ?? [];
  const metaSource = query.data?.data ?? {};

  const meta = {
    currentPage: metaSource.current_page ?? queryArgs.page,
    lastPage: metaSource.last_page ?? 1,
    perPage: metaSource.per_page ?? queryArgs.perPage,
    total: metaSource.total ?? unlockHistories.length,
  };

  const changePage = (newPage) => dispatch(setPage(newPage));
  const changePerPage = (value) => dispatch(setPerPage(value));

  return {
    ...query,
    unlockHistories,
    meta,
    page: queryArgs.page,
    perPage: queryArgs.perPage,
    changePage,
    changePerPage,
  };
};
