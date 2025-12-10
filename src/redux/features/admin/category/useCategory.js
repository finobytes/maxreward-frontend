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

  const [formData, setFormData] = useState({ name: "", image: null });
  const [editId, setEditId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        const data = new FormData();
        data.append("name", formData.name);
        if (formData.image instanceof File) {
          data.append("image", formData.image);
        }
        // Note: Some backends require POST with _method="PATCH" for file uploads.
        // If this PATCH fails for files, that would be the next fix.
        // For now, adhering to user's PATCH method.
        await updateCategory({ id: editId, data }).unwrap();
      } else {
        // Create requires FormData for image
        const data = new FormData();
        data.append("name", formData.name);
        if (formData.image) {
          data.append("image", formData.image);
        }
        await createCategory(data).unwrap();
      }
      setFormData({ name: "", image: null });
      setEditId(null);
    } catch (err) {
      console.error("Error submitting category:", err);
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setFormData({ name: item.name }); // match user example where only name is updated
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id).unwrap();
    } catch (err) {
      console.error("Error deleting category:", err);
      throw err;
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
