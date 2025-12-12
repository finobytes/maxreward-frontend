import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useCreateModelMutation,
  useGetModelsQuery,
  useUpdateModelMutation,
  useDeleteModelMutation,
} from "./modelApi";
import { setPage, setSearch, resetFilters } from "./modelSlice";

export const useModel = () => {
  const dispatch = useDispatch();
  const { page, per_page, search, is_active } = useSelector(
    (state) => state.model
  );

  const { data, isLoading, isFetching, isError } = useGetModelsQuery({
    page,
    per_page,
    search,
    is_active,
  });

  const [createModel] = useCreateModelMutation();
  const [updateModel] = useUpdateModelMutation();
  const [deleteModel] = useDeleteModelMutation();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    is_active: true,
  });
  const [editId, setEditId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Model doesn't have image, so simple JSON object is usually fine,
      // but to stay consistent with other forms using FormData (and if backend expects POST for updates):
      const payload = {
        name: formData.name,
        slug: formData.slug,
        is_active: formData.is_active ? 1 : 0,
      };

      if (editId) {
        // Many Laravel APIs expect POST for updates if they handle _method
        // But for pure JSON APIs, PUT is standard. Using normal object with PUT for model.
        // Wait, User's backend code uses Route::post('/{id}', [ModelController::class, 'update'])
        // So we strictly use POST.

        // However, if we're not sending files, we can just send JSON?
        // The backend uses $request->all(), so JSON or FormData works.
        // Let's use simple logic.

        await updateModel({ id: editId, data: payload }).unwrap();
      } else {
        await createModel(payload).unwrap();
      }
      setFormData({
        name: "",
        slug: "",
        is_active: true,
      });
      setEditId(null);
    } catch (err) {
      console.error("Error submitting model:", err);
      throw err;
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setFormData({
      name: item.name,
      slug: item.slug || "",
      is_active: item.is_active === 1 || item.is_active === true,
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteModel(id).unwrap();
    } catch (err) {
      console.error("Error deleting model:", err);
      throw err;
    }
  };

  return {
    data: data?.data || [], // Paginated result usually in data.data or directly in data depending on API
    // Adjusted based on Brand:
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
