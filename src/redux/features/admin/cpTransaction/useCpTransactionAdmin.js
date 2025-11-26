import { useSelector, useDispatch } from "react-redux";
import { setPage, setPerPage } from "./cpTransactionAdminSlice";
import { useGetAdminCpTransactionQuery } from "./cpTransactionAdminApi";

export const useCpTransactionAdmin = () => {
  const dispatch = useDispatch();
  const { page, perPage } = useSelector((state) => state.cpTransactionAdmin);

  const queryArgs = {
    page: page ?? 1,
    perPage: perPage ?? 20,
  };

  const query = useGetAdminCpTransactionQuery(queryArgs);

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
