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
        // For update, we use the user's requested PATCH method.
        // If image is present, we might need FormData, but user showed simple JSON example for update.
        // However, standard consistency implies we might update image too.
        // I'll send plain JSON if no image, or if image is string (url).
        // If image is File, I'll send FormData.
        // BUT user specifically said update body: name: "Fashion N".
        // I will stick to sending what matches the backend expectation.
        // If the backend expects JSON for PATCH, I'll send JSON.

        await updateCategory({ id: editId, data: formData }).unwrap();
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
