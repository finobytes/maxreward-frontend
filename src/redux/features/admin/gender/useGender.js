import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useCreateGenderMutation,
  useGetGendersQuery,
  useUpdateGenderMutation,
  useDeleteGenderMutation,
} from "./genderApi";
import { setPage, setSearch, resetFilters } from "./genderSlice";

export const useGender = () => {
  const dispatch = useDispatch();
  const { page, per_page, search, is_active } = useSelector(
    (state) => state.gender
  );

  const { data, isLoading, isFetching, isError } = useGetGendersQuery({
    page,
    per_page,
    search,
    is_active,
  });

  const [createGender] = useCreateGenderMutation();
  const [updateGender] = useUpdateGenderMutation();
  const [deleteGender] = useDeleteGenderMutation();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    is_active: true,
  });
  const [editId, setEditId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        slug: formData.slug,
        is_active: formData.is_active ? 1 : 0,
      };

      if (editId) {
        await updateGender({ id: editId, data: payload }).unwrap();
      } else {
        await createGender(payload).unwrap();
      }
      setFormData({
        name: "",
        slug: "",
        is_active: true,
      });
      setEditId(null);
    } catch (err) {
      console.error("Error submitting gender:", err);
      throw err;
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setFormData({
      name: item.name,
      slug: item.slug || "",
      is_active: item.is_active === 1 || item.is_active === true,
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteGender(id).unwrap();
    } catch (err) {
      console.error("Error deleting gender:", err);
      throw err;
    }
  };

  return {
    data: data?.data || [], // Return pagination object to match Brand/Model pattern and Component expectation
    pagination: {
      current_page: data?.data?.current_page,
      last_page: data?.data?.last_page,
      total: data?.data?.total,
    },
    isLoading,
    isFetching,
    isError,
    formData,
    editId,
    actions: {
      setFormData,
      handleSubmit,
      handleEdit,
      handleDelete,
      setSearch: (val) => dispatch(setSearch(val)),
      setPage: (val) => dispatch(setPage(val)),
      resetFilters: () => dispatch(resetFilters()),
    },
  };
};
