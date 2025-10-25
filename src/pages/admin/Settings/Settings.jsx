import React, { useEffect } from "react";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useGetCurrentSettingsQuery,
  useCreateOrUpdateMutation,
} from "../../../redux/features/admin/settings/settingsApi";

// Simple inline alert component
const Alert = ({ type = "info", children }) => {
  const bg =
    type === "error"
      ? "bg-red-100 text-red-800"
      : type === "success"
      ? "bg-green-100 text-green-800"
      : "bg-blue-100 text-blue-800";
  return <div className={`${bg} px-3 py-2 rounded-md`}>{children}</div>;
};

// zod schema for validation
const schema = z.object({
  rm_points: z
    .number({ invalid_type_error: "Required" })
    .int()
    .min(0, "Must be >= 0"),
  pp_points: z.number().int().min(0),
  rp_points: z.number().int().min(0),
  cp_points: z.number().int().min(0),
  cr_points: z.number().int().min(0),
});

const SettingsPage = () => {
  const { data, isFetching, isError, error, refetch } =
    useGetCurrentSettingsQuery();
  const [
    createOrUpdate,
    { isLoading: isSubmitting, isSuccess, error: submitError },
  ] = useCreateOrUpdateMutation();

  // react-hook-form; numbers default to 0
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      rm_points: 0,
      pp_points: 0,
      rp_points: 0,
      cp_points: 0,
      cr_points: 0,
    },
  });

  // populate form when data arrives
  useEffect(() => {
    if (data?.setting_attribute) {
      reset({
        rm_points: Number(data.setting_attribute.rm_points ?? 0),
        pp_points: Number(data.setting_attribute.pp_points ?? 0),
        rp_points: Number(data.setting_attribute.rp_points ?? 0),
        cp_points: Number(data.setting_attribute.cp_points ?? 0),
        cr_points: Number(data.setting_attribute.cr_points ?? 0),
      });
    }
  }, [data, reset]);

  const onSubmit = async (values) => {
    // values are numbers already
    const payload = {
      setting_attribute: {
        rm_points: Number(values.rm_points),
        pp_points: Number(values.pp_points),
        rp_points: Number(values.rp_points),
        cp_points: Number(values.cp_points),
        cr_points: Number(values.cr_points),
      },
    };

    try {
      await createOrUpdate(payload).unwrap();
      // success handled by isSuccess (or we can show toast)
      // refetch to sync with server
      refetch();
    } catch (e) {
      // errors surfaced via submitError
      console.error("Update failed", e);
    }
  };

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Settings" }]}
      />

      <ComponentCard title="Setting attributes">
        <div className="space-y-4">
          {isFetching && <Alert>Loading current settings…</Alert>}
          {isError && (
            <Alert type="error">
              Failed to load settings. {error?.error || ""}
            </Alert>
          )}
          {isSuccess && (
            <Alert type="success">Settings saved successfully.</Alert>
          )}
          {submitError && (
            <Alert type="error">
              Save failed.{" "}
              {(submitError?.data && submitError.data.message) ||
                submitError?.error ||
                ""}
            </Alert>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* rm_points */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                RM Points
              </label>
              <input
                type="number"
                step="1"
                {...register("rm_points", { valueAsNumber: true })}
                className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              {errors.rm_points && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.rm_points.message}
                </p>
              )}
            </div>

            {/* pp_points */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PP Points
              </label>
              <input
                type="number"
                step="1"
                {...register("pp_points", { valueAsNumber: true })}
                className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              {errors.pp_points && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.pp_points.message}
                </p>
              )}
            </div>

            {/* rp_points */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                RP Points
              </label>
              <input
                type="number"
                step="1"
                {...register("rp_points", { valueAsNumber: true })}
                className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              {errors.rp_points && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.rp_points.message}
                </p>
              )}
            </div>

            {/* cp_points */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CP Points
              </label>
              <input
                type="number"
                step="1"
                {...register("cp_points", { valueAsNumber: true })}
                className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              {errors.cp_points && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.cp_points.message}
                </p>
              )}
            </div>

            {/* cr_points */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CR Points
              </label>
              <input
                type="number"
                step="1"
                {...register("cr_points", { valueAsNumber: true })}
                className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              {errors.cr_points && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.cr_points.message}
                </p>
              )}
            </div>

            {/* actions */}
            <div className="md:col-span-2 flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 bg-brand-600 text-white rounded-md shadow-sm hover:bg-brand-700 disabled:opacity-60"
              >
                {isSubmitting ? "Saving..." : "Save Settings"}
              </button>

              <button
                type="button"
                onClick={() => {
                  reset();
                  refetch();
                }}
                className="px-4 py-2 border rounded-md"
              >
                Reset
              </button>

              <div className="ml-auto text-sm text-gray-500">
                Last update:{" "}
                <span className="font-medium">
                  {data?.updated_at
                    ? new Date(data.updated_at).toLocaleString()
                    : "—"}
                </span>
              </div>
            </div>
          </form>
        </div>
      </ComponentCard>
    </div>
  );
};

export default SettingsPage;
