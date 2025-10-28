// src/redux/features/admin/denomination/useDenomination.js
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useCreateDenominationMutation,
  useGetDenominationsQuery,
  useUpdateDenominationMutation,
  useDeleteDenominationMutation,
} from "./denominationApi";
import { setPage, setSearch, resetFilters } from "./denominationSlice";

export const useDenomination = () => {
  const dispatch = useDispatch();
  const { page, per_page, search } = useSelector((state) => state.denomination);

  const { data, isLoading, isFetching, isError } = useGetDenominationsQuery({
    page,
    per_page,
    search,
  });

  const [createDenomination] = useCreateDenominationMutation();
  const [updateDenomination] = useUpdateDenominationMutation();
  const [deleteDenomination] = useDeleteDenominationMutation();

  const [formData, setFormData] = useState({ title: "", value: "" });
  const [editId, setEditId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateDenomination({ id: editId, data: formData }).unwrap();
      } else {
        await createDenomination(formData).unwrap();
      }
      setFormData({ title: "", value: "" });
      setEditId(null);
    } catch (err) {
      console.error("Error submitting denomination:", err);
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setFormData({ title: item.title, value: item.value });
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure to delete this denomination?")) {
      try {
        await deleteDenomination(id).unwrap();
      } catch (err) {
        console.error("Error deleting denomination:", err);
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
