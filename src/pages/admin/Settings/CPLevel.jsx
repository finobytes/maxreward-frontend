import React, { useState } from "react";
import { PencilLine, Loader, RefreshCw } from "lucide-react";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import {
  useGetCPLevelQuery,
  useUpdateCPLevelMutation,
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CPLevel = () => {
  const { data, isLoading, isFetching, refetch, error, isError } =
    useGetCPLevelQuery();
  const [updateCPLevel, { isLoading: isUpdating }] = useUpdateCPLevelMutation();

  const cpLevels = data || [];
  console.log(cpLevels);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [formData, setFormData] = useState({
    level_from: "",
    level_to: "",
    cp_percentage_per_level: "",
    total_percentage_for_range: "",
  });

  const handleEdit = (row) => {
    setSelectedRow(row);
    setFormData({
      level_from: row.level_from,
      level_to: row.level_to,
      cp_percentage_per_level: row.cp_percentage_per_level,
      total_percentage_for_range: row.total_percentage_for_range,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateCPLevel({
        id: selectedRow.id,
        data: formData,
      }).unwrap();

      toast.success("CP level updated successfully.");
      setIsModalOpen(false);
      setSelectedRow(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update.");
    }
  };

  return (
    <div className="space-y-4">
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "CP Level" }]}
      />

      <div className="relative rounded-xl border bg-white p-4">
        {isFetching && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/40">
            <Loader className="h-6 w-6 animate-spin text-gray-500" />
          </div>
        )}

        <div className="flex justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800">
            CP Level Configuration
          </h2>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 border px-3 py-2 rounded-md text-sm"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {isError && (
          <div className="text-red-600 bg-red-50 border border-red-200 p-2 rounded">
            {error?.data?.message || "Failed to load CP levels."}
          </div>
        )}

        {isLoading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : cpLevels.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No data found.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>S/N</TableHead>
                <TableHead>Level From</TableHead>
                <TableHead>Level To</TableHead>
                <TableHead>CP % / Level</TableHead>
                <TableHead>Total % Range</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cpLevels.map((row, i) => (
                <TableRow key={row.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{row.level_from}</TableCell>
                  <TableCell>{row.level_to}</TableCell>
                  <TableCell>{row.cp_percentage_per_level}%</TableCell>
                  <TableCell>{row.total_percentage_for_range}%</TableCell>
                  <TableCell className="text-right">
                    <button
                      onClick={() => handleEdit(row)}
                      className="flex items-center gap-1 border px-3 py-1 rounded-md text-sm"
                    >
                      <PencilLine className="h-4 w-4" /> Edit
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit CP Level</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label>Level From</label>
                <input
                  type="number"
                  value={formData.level_from}
                  onChange={(e) =>
                    setFormData({ ...formData, level_from: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label>Level To</label>
                <input
                  type="number"
                  value={formData.level_to}
                  onChange={(e) =>
                    setFormData({ ...formData, level_to: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label>CP % Per Level</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.cp_percentage_per_level}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cp_percentage_per_level: e.target.value,
                    })
                  }
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label>Total % Range</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.total_percentage_for_range}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      total_percentage_for_range: e.target.value,
                    })
                  }
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>

            <DialogFooter>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="border px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="bg-orange-600 text-white px-4 py-2 rounded-md"
              >
                {isUpdating ? "Saving..." : "Save"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CPLevel;
