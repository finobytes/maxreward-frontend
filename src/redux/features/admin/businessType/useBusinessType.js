import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useCreateBusinessTypeMutation,
  useGetBusinessTypesQuery,
  useUpdateBusinessTypeMutation,
  useDeleteBusinessTypeMutation,
} from "./businessTypeApi";
import { setPage, setSearch, resetFilters } from "./businessTypeSlice";

export const useBusinessType = () => {
  const dispatch = useDispatch();
  const { page, per_page, search } = useSelector((state) => state.businessType);

  const { data, isLoading, isFetching, isError } = useGetBusinessTypesQuery({
    page,
    per_page,
    search,
  });

  const [createBusinessType] = useCreateBusinessTypeMutation();
  const [updateBusinessType] = useUpdateBusinessTypeMutation();
  const [deleteBusinessType] = useDeleteBusinessTypeMutation();

  const [formData, setFormData] = useState({ name: "" });
  const [editId, setEditId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateBusinessType({ id: editId, data: formData }).unwrap();
      } else {
        await createBusinessType(formData).unwrap();
      }
      setFormData({ name: "" });
      setEditId(null);
    } catch (err) {
      console.error("Error submitting business type:", err);
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setFormData({ name: item.name });
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure to delete this business type?")) {
      try {
        await deleteBusinessType(id).unwrap();
      } catch (err) {
        console.error("Error deleting business type:", err);
      }
    }
  };

  return {
    data: data?.data || [],
    pagination: data?.meta,
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
