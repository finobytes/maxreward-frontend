import { useSelector, useDispatch } from "react-redux";
import { setPage, setPerPage } from "./cpTransactionMemberSlice";
import { useGetCpTransactionQuery } from "./cpTransactionMemberApi";

export const useCpTransactionMember = (memberId) => {
  const dispatch = useDispatch();
  const { page, perPage } = useSelector((state) => state.cpTransactionMember);

  const queryArgs = {
    memberId,
    page: page ?? 1,
    perPage: perPage ?? 20,
  };

  const query = useGetCpTransactionQuery(queryArgs, {
    skip: !memberId,
  });

  const transactions = query.data?.data?.data ?? [];
  const metaSource = query.data?.data ?? {};

  const meta = {
    currentPage: metaSource.current_page ?? queryArgs.page,
    lastPage: metaSource.last_page ?? 1,
    perPage: metaSource.per_page ?? queryArgs.perPage,
    total: metaSource.total ?? transactions.length,
  };

  const changePage = (newPage) => dispatch(setPage(newPage));
  const changePerPage = (value) => dispatch(setPerPage(value));

  return {
    ...query,
    transactions,
    meta,
    page: queryArgs.page,
    perPage: queryArgs.perPage,
    changePage,
    changePerPage,
  };
};
