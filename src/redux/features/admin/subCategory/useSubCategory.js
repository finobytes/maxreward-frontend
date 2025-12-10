import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useCreateSubCategoryMutation,
  useGetSubCategoriesQuery,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
} from "./subCategoryApi";
import { setPage, setSearch, resetFilters } from "./subCategorySlice";

export const useSubCategory = () => {
  const dispatch = useDispatch();
  const { page, per_page, search } = useSelector((state) => state.subCategory);

  const { data, isLoading, isFetching, isError } = useGetSubCategoriesQuery({
    page,
    per_page,
    search,
  });

  const [createSubCategory] = useCreateSubCategoryMutation();
  const [updateSubCategory] = useUpdateSubCategoryMutation();
  const [deleteSubCategory] = useDeleteSubCategoryMutation();

  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    description: "",
    sort_order: "",
    is_active: true,
  });
  const [editId, setEditId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateSubCategory({ id: editId, data: formData }).unwrap();
      } else {
        await createSubCategory(formData).unwrap();
      }
      setFormData({
        name: "",
        category_id: "",
        description: "",
        sort_order: "",
        is_active: true,
      });
      setEditId(null);
    } catch (err) {
      console.error("Error submitting sub-category:", err);
      throw err;
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setFormData({
      name: item.name,
      category_id: item.category_id || item.category?.id || "",
      description: item.description || "",
      sort_order: item.sort_order || "",
      is_active: item.is_active ?? true,
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteSubCategory(id).unwrap();
    } catch (err) {
      console.error("Error deleting sub-category:", err);
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
