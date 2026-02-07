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

// Schema matching backend fields
const schema = z.object({
  rm_points: z.number().int().min(0, "RM Points required"),
  pp_points: z.number().int().min(0, "PP Points required"),
  rp_points: z.number().int().min(0, "RP Points required"),
  cp_points: z.number().int().min(0, "CP Points required"),
  cr_points: z.number().int().min(0, "CR Points required"),
  max_level: z.number().int().min(0, "Max level required"),
  deductable_points: z.number().int().min(0, "Deductible points required"),
});

const SettingsPage = () => {
  const { data, isFetching, isError, error, refetch } =
    useGetCurrentSettingsQuery();

  const [createOrUpdate, { isLoading: isSubmitting, error: submitError }] =
    useCreateOrUpdateMutation();

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
      max_level: 0,
      deductable_points: 0,
    },
  });

  // Populate form when data arrives
  useEffect(() => {
    if (data?.setting_attribute?.maxreward) {
      const s = data.setting_attribute.maxreward;
      reset({
        rm_points: Number(s.rm_points ?? 0),
        pp_points: Number(s.pp_points ?? 0),
        rp_points: Number(s.rp_points ?? 0),
        cp_points: Number(s.cp_points ?? 0),
        cr_points: Number(s.cr_points ?? 0),
        max_level: Number(s.max_level ?? 0),
        deductable_points: Number(s.deductable_points ?? 0),
      });
    }
  }, [data, reset]);

  // Submit handler
  const onSubmit = async (values) => {
    const payload = {
      settings: {
        maxreward: values,
      },
    };

    try {
      await createOrUpdate(payload).unwrap();
      toast.success("Settings updated successfully!");
      refetch();
    } catch {
      toast.error(
        submitError?.data?.message ||
          "Failed to update settings. Please try again.",
      );
    }
  };

  // Error toast
  useEffect(() => {
    if (isError) {
      toast.error(
        error?.data?.message || "Failed to load settings. Try refreshing.",
      );
    }
  }, [isError, error]);

  return (
    <div className="space-y-6">
      <ComponentCard title="MaxReward Point Settings">
        <div className="space-y-6">
          {isFetching ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 7 }).map((_, i) => (
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
                { name: "max_level", label: "Max Level" },
                { name: "deductable_points", label: "Deductible Points" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <input
                    type="number"
                    step="1"
                    {...register(field.name, { valueAsNumber: true })}
                    readOnly={field.name === "max_level"}
                    className={`w-full rounded-md border px-3 py-2 focus:outline-none ${
                      field.name === "max_level"
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                        : "focus:ring-2 focus:ring-indigo-300"
                    }`}
                  />

                  {errors[field.name] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors[field.name].message}
                    </p>
                  )}
                </div>
              ))}

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
