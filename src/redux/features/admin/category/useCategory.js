import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useCreateCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "./categoryApi";
import { setPage, setSearch, resetFilters } from "./categorySlice";

export const useCategory = () => {
  const dispatch = useDispatch();
  const { page, per_page, search } = useSelector((state) => state.category);

  const { data, isLoading, isFetching, isError } = useGetCategoriesQuery({
    page,
    per_page,
    search,
  });

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [formData, setFormData] = useState({ name: "" });
  const [editId, setEditId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateCategory({ id: editId, data: formData }).unwrap();
      } else {
        await createCategory(formData).unwrap();
      }
      setFormData({ name: "" });
      setEditId(null);
    } catch (err) {
      console.error("Error submitting category:", err);
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setFormData({ name: item.name });
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure to delete this category?")) {
      try {
        await deleteCategory(id).unwrap();
      } catch (err) {
        console.error("Error deleting category:", err);
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
