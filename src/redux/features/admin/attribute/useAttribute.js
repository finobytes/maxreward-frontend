import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useCreateAttributeMutation,
  useGetAttributesQuery,
  useUpdateAttributeMutation,
  useDeleteAttributeMutation,
} from "./attributeApi";
import { setPage, setSearch, resetFilters } from "./attributeSlice";

export const useAttribute = () => {
  const dispatch = useDispatch();
  const { page, per_page, search } = useSelector((state) => state.attribute);

  const { data, isLoading, isFetching, isError } = useGetAttributesQuery({
    page,
    per_page,
    search,
  });

  const [createAttribute] = useCreateAttributeMutation();
  const [updateAttribute] = useUpdateAttributeMutation();
  const [deleteAttribute] = useDeleteAttributeMutation();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
  });
  const [editId, setEditId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        slug: formData.slug,
      };

      if (editId) {
        await updateAttribute({ id: editId, data: payload }).unwrap();
      } else {
        await createAttribute(payload).unwrap();
      }
      setFormData({
        name: "",
        slug: "",
      });
      setEditId(null);
    } catch (err) {
      console.error("Error submitting attribute:", err);
      throw err;
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setFormData({
      name: item.name,
      slug: item.slug || "",
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteAttribute(id).unwrap();
    } catch (err) {
      console.error("Error deleting attribute:", err);
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
