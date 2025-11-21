import { useSelector, useDispatch } from "react-redux";
import { setPage, setPerPage } from "./cpUnlockHistoryMemberSlice";
import { useGetMemberCpUnlockHistoryQuery } from "./cpUnlockHistoryMemberApi";

export const useCpUnlockHistoryMember = (memberId) => {
  const dispatch = useDispatch();
  const { page, perPage } = useSelector((state) => state.cpUnlockHistoryMember);

  const queryArgs = {
    memberId,
    page: page ?? 1,
    perPage: perPage ?? 20,
  };

  const query = useGetMemberCpUnlockHistoryQuery(queryArgs, {
    skip: !memberId,
  });

  console.log("query:::", query.data?.data);

  const unlockHistories = query.data?.data?? [];
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
