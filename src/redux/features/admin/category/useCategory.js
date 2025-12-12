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

  const [formData, setFormData] = useState({
    name: "",
    // slug: "",
    description: "",
    image: null,
    sort_order: 0,
    is_active: true,
  });
  const [editId, setEditId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", formData.name);
      // if (formData.slug) data.append("slug", formData.slug);
      if (formData.description)
        data.append("description", formData.description);
      if (formData.sort_order !== null)
        data.append("sort_order", formData.sort_order);
      data.append("is_active", formData.is_active ? "1" : "0");

      if (formData.image instanceof File) {
        data.append("image", formData.image);
      }

      if (editId) {
        data.append("_method", "POST");
        await updateCategory({ id: editId, data }).unwrap();
      } else {
        await createCategory(data).unwrap();
      }
      setFormData({
        name: "",
        // slug: "",
        description: "",
        image: null,
        sort_order: 0,
        is_active: true,
      });
      setEditId(null);
    } catch (err) {
      console.error("Error submitting category:", err);
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setFormData({
      name: item.name,
      // slug: item.slug || "",
      description: item.description || "",
      image: null, // Image is not editable directly here, only replaced
      sort_order: item.sort_order || 0,
      is_active: item.is_active === 1 || item.is_active === true,
    });
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
