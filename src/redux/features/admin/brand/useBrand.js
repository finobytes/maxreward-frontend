import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useCreateBrandMutation,
  useGetBrandsQuery,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} from "./brandApi";
import { setPage, setSearch, resetFilters } from "./brandSlice";

export const useBrand = () => {
  const dispatch = useDispatch();
  const { page, per_page, search, is_active, is_featured } = useSelector(
    (state) => state.brand
  );

  const { data, isLoading, isFetching, isError } = useGetBrandsQuery({
    page,
    per_page,
    search,
    is_active,
    is_featured,
  });

  const [createBrand] = useCreateBrandMutation();
  const [updateBrand] = useUpdateBrandMutation();
  const [deleteBrand] = useDeleteBrandMutation();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: null,
    // sort_order: 0,
    is_active: true,
    is_featured: false,
  });
  const [editId, setEditId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", formData.name);
      if (formData.slug) data.append("slug", formData.slug);
      if (formData.description)
        data.append("description", formData.description);
      // if (formData.sort_order !== null)
      //   data.append("sort_order", formData.sort_order);
      data.append("is_active", formData.is_active ? "1" : "0");
      data.append("is_featured", formData.is_featured ? "1" : "0");

      if (formData.image instanceof File) {
        data.append("image", formData.image);
      }

      if (editId) {
        data.append("_method", "POST"); // Backend handles updates via POST if needed for fields inside, usually PUT but here consistency with category
        await updateBrand({ id: editId, data }).unwrap();
      } else {
        await createBrand(data).unwrap();
      }
      setFormData({
        name: "",
        slug: "",
        description: "",
        image: null,
        // sort_order: 0,
        is_active: true,
        is_featured: false,
      });
      setEditId(null);
    } catch (err) {
      console.error("Error submitting brand:", err);
      throw err;
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setFormData({
      name: item.name,
      slug: item.slug || "",
      description: item.description || "",
      image: null,
      // sort_order: item.sort_order || 0,
      is_active: item.is_active === 1 || item.is_active === true,
      is_featured: item.is_featured === 1 || item.is_featured === true,
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteBrand(id).unwrap();
    } catch (err) {
      console.error("Error deleting brand:", err);
      throw err;
    }
  };

  return {
    data: data?.data || [],
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
