import React, { useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import SearchInput from "../../../components/form/form-elements/SearchInput";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import { Eye, PencilLine, Plus, Trash2Icon } from "lucide-react";
import DropdownSelect from "../../../components/ui/dropdown/DropdownSelect";

const ActiveMerchant = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  return (
    <div>
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Active Merchant" }]}
      />
      <div>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-4">
          <div className="max-w-full overflow-x-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h3 className="text-lg font-semibold text-gray-800">
                All Merchant List
              </h3>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
                {/* Search */}
                <SearchInput
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search here..."
                />

                {/* Add Member Button */}
                <PrimaryButton variant="primary" size="md" to="">
                  <Plus size={18} />
                  Add New Merchant
                </PrimaryButton>
                <div className="flex justify-between items-center gap-4 md:px-2">
                  {/* Sort Dropdown */}
                  <DropdownSelect
                    value={statusFilter}
                    onChange={setStatusFilter}
                    options={[
                      { label: "Short By", value: "All" },
                      { label: "Active", value: "Active" },
                      { label: "Blocked", value: "Blocked" },
                      { label: "Suspended", value: "Suspended" },
                    ]}
                  />
                  <PrimaryButton variant="secondary" size="md">
                    Clear
                  </PrimaryButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveMerchant;
