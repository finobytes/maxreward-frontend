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
import { toast } from "sonner";

// Skeleton Loader
const SkeletonField = () => (
  <div className="animate-pulse space-y-2">
    <div className="h-4 w-24 bg-gray-300 rounded"></div>
    <div className="h-9 w-full bg-gray-200 rounded"></div>
  </div>
);

// zod schema for validation
const schema = z.object({
  rm_points: z.number({ invalid_type_error: "Required" }).int().min(0),
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

  // react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
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
    const payload = { setting_attribute: values };

    try {
      await createOrUpdate(payload).unwrap();
      toast.success("Settings updated successfully!");
      refetch();
    } catch (e) {
      toast.error(
        submitError?.data?.message ||
          "Failed to update settings. Please try again."
      );
    }
  };

  // Toasts for errors (load phase)
  useEffect(() => {
    if (isError) {
      toast.error(
        error?.data?.message || "Failed to load settings. Try refreshing."
      );
    }
  }, [isError, error]);

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Settings" }]}
      />

      <ComponentCard title="Setting Attributes">
        <div className="space-y-6">
          {/* Skeleton Loader */}
          {isFetching ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonField key={i} />
              ))}
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {[
                { name: "rm_points", label: "RM Points" },
                { name: "pp_points", label: "PP Points" },
                { name: "rp_points", label: "RP Points" },
                { name: "cp_points", label: "CP Points" },
                { name: "cr_points", label: "CR Points" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <input
                    type="number"
                    step="1"
                    {...register(field.name, { valueAsNumber: true })}
                    className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                  {errors[field.name] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors[field.name].message}
                    </p>
                  )}
                </div>
              ))}

              {/* Actions */}
              <div className="md:col-span-2 flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 bg-brand-600 text-white rounded-md shadow-sm hover:bg-orange-600 disabled:opacity-60"
                >
                  {isSubmitting ? "Saving..." : "Save Settings"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    reset();
                    refetch();
                    toast.info("Reset to last saved values");
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
          )}
        </div>
      </ComponentCard>
    </div>
  );
};

export default SettingsPage;
