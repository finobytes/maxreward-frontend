import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useCreateAttributeItemMutation,
  useGetAttributeItemsQuery,
  useUpdateAttributeItemMutation,
  useDeleteAttributeItemMutation,
} from "./attributeItemApi";
import { setPage, setSearch, resetFilters } from "./attributeItemSlice";

export const useAttributeItem = () => {
  const dispatch = useDispatch();
  const { page, per_page, search, is_active, attribute_id } = useSelector(
    (state) => state.attributeItem
  );

  const { data, isLoading, isFetching, isError } = useGetAttributeItemsQuery({
    page,
    per_page,
    search,
    is_active,
    attribute_id,
  });

  const [createAttributeItem] = useCreateAttributeItemMutation();
  const [updateAttributeItem] = useUpdateAttributeItemMutation();
  const [deleteAttributeItem] = useDeleteAttributeItemMutation();

  const [formData, setFormData] = useState({
    attribute_id: "",
    name: "",
    slug: "",
    is_active: true,
  });
  const [editId, setEditId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        attribute_id: formData.attribute_id,
        name: formData.name,
        slug: formData.slug,
        is_active: formData.is_active ? 1 : 0,
      };

      if (editId) {
        await updateAttributeItem({ id: editId, data: payload }).unwrap();
      } else {
        await createAttributeItem(payload).unwrap();
      }
      setFormData({
        attribute_id: "",
        name: "",
        slug: "",
        is_active: true,
      });
      setEditId(null);
    } catch (err) {
      console.error("Error submitting attribute item:", err);
      throw err;
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setFormData({
      attribute_id: item.attribute_id,
      name: item.name,
      slug: item.slug || "",
      is_active: item.is_active === 1 || item.is_active === true,
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteAttributeItem(id).unwrap();
    } catch (err) {
      console.error("Error deleting attribute item:", err);
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
