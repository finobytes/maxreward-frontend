import { useDispatch, useSelector } from "react-redux";
import {
  useGetReferredMembersQuery,
  useReferNewMemberMutation,
} from "./referNewMemberApi";
import {
  setLoading,
  setSuccess,
  setError,
  resetReferNewMember,
} from "./referNewMemberSlice";

export const useReferNewMember = () => {
  const dispatch = useDispatch();
  const [referNewMember] = useReferNewMemberMutation();
  const { loading, success, error } = useSelector(
    (state) => state.referNewMember
  );

  const handleRefer = async (data) => {
    try {
      dispatch(setLoading());
      const res = await referNewMember(data).unwrap();
      dispatch(setSuccess(res.data.new_member));
      return res;
    } catch (err) {
      dispatch(setError(err?.data?.message || "Failed to refer member"));
      throw err;
    }
  };

  const resetState = () => dispatch(resetReferNewMember());

  useGetReferredMembersQuery;

  return { handleRefer, loading, success, error, resetState };
};
