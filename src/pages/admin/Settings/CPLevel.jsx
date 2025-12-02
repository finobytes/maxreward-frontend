import React, { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import {
  useGetCPLevelQuery,
  useBulkUpdateCPLevelMutation,
} from "../../../redux/features/admin/settings/settingsApi";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import Input from "../../../components/form/input/InputField";

const CPLevel = () => {
  const { data, isLoading, isFetching, refetch } = useGetCPLevelQuery();
  const [bulkUpdateCPLevel, { isLoading: isUpdating }] =
    useBulkUpdateCPLevelMutation();

  const [rows, setRows] = useState([]);

  // Load data into rows
  useEffect(() => {
    if (data) {
      setRows(data.map((item) => ({ ...item, isEditing: false })));
    }
  }, [data]);

  // Toggle row editing
  const handleRowClick = (id) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, isEditing: true } : { ...r, isEditing: false }
      )
    );
  };

  // Handle table field change
  const handleChange = (id, field, value) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  // Submit updates
  const handleSubmit = async () => {
    const payload = {
      configs: rows.map(
        ({
          id,
          level_from,
          level_to,
          cp_percentage_per_level,
          total_percentage_for_range,
        }) => ({
          id,
          level_from: Number(level_from),
          level_to: Number(level_to),
          cp_percentage_per_level: Number(cp_percentage_per_level),
          total_percentage_for_range: Number(total_percentage_for_range),
        })
      ),
    };
    try {
      await bulkUpdateCPLevel(payload).unwrap();
      toast.success("CP Level updated successfully!");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update.");
    }
  };
  const handleCancel = () => {
    setRows((prev) =>
      prev.map((r) => ({
        ...r,
        isEditing: false,
      }))
    );
  };

  return (
    <div className="space-y-4">
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "CP Level" }]}
      />

      <div className="relative rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            CP Level Configuration
          </h2>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 border px-3 py-2 rounded-md text-sm hover:bg-gray-50 transition"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20 text-gray-700">S/N</TableHead>
                  <TableHead className="text-gray-700">Level From</TableHead>
                  <TableHead className="text-gray-700">Level To</TableHead>
                  <TableHead className="text-gray-700">
                    CP % Per Level
                  </TableHead>
                  <TableHead className="text-gray-700">
                    Total % For Range
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    onClick={() => handleRowClick(row.id)}
                    className={`cursor-pointer transition ${
                      row.isEditing ? "bg-gray-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <TableCell>{index + 1}</TableCell>

                    {/* LEVEL FROM */}
                    <TableCell>
                      {row.isEditing ? (
                        <div className="w-24">
                          <Input
                            type="number"
                            value={row.level_from}
                            onChange={(e) =>
                              handleChange(row.id, "level_from", e.target.value)
                            }
                          />
                        </div>
                      ) : (
                        <span className="text-gray-700">{row.level_from}</span>
                      )}
                    </TableCell>

                    {/* LEVEL TO */}
                    <TableCell>
                      {row.isEditing ? (
                        <div className="w-24">
                          <Input
                            type="number"
                            value={row.level_to}
                            onChange={(e) =>
                              handleChange(row.id, "level_to", e.target.value)
                            }
                          />
                        </div>
                      ) : (
                        <span className="text-gray-700">{row.level_to}</span>
                      )}
                    </TableCell>

                    {/* CP % PER LEVEL */}
                    <TableCell>
                      {row.isEditing ? (
                        <div className="w-24">
                          <Input
                            type="number"
                            value={row.cp_percentage_per_level}
                            onChange={(e) =>
                              handleChange(
                                row.id,
                                "cp_percentage_per_level",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      ) : (
                        <span className="text-gray-700">
                          {row.cp_percentage_per_level}%
                        </span>
                      )}
                    </TableCell>

                    {/* TOTAL % RANGE */}
                    <TableCell>
                      {row.isEditing ? (
                        <div className="w-28">
                          <Input
                            type="number"
                            value={row.total_percentage_for_range}
                            onChange={(e) =>
                              handleChange(
                                row.id,
                                "total_percentage_for_range",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      ) : (
                        <span className="text-gray-700">
                          {row.total_percentage_for_range}%
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex justify-end mt-6 gap-4">
          <PrimaryButton onClick={handleCancel} variant="secondary" size="sm">
            Cancel
          </PrimaryButton>
          <PrimaryButton onClick={handleSubmit} disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Update"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default CPLevel;
