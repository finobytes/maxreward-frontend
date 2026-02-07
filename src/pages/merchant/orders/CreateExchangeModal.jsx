import React, { useState } from "react";
import { Loader } from "lucide-react";
import {
  useGetMerchantOrdersQuery,
  useCreateExchangeMutation,
  useGetAvailableVariationsQuery,
} from "../../../redux/features/merchant/orders/merchantOrderApi";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

const EXCHANGE_TYPES = [
  { label: "Size Change", value: "size_change" },
  { label: "Color Change", value: "color_change" },
  { label: "Defect / Damaged", value: "defect" },
  { label: "Other", value: "other" },
];

const CreateExchangeModal = ({ open, onOpenChange, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [searchOrder, setSearchOrder] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [exchangeType, setExchangeType] = useState(EXCHANGE_TYPES[0].value);
  const [reason, setReason] = useState("");
  const [selectedVariationId, setSelectedVariationId] = useState("");

  const {
    data: orderSearchData,
    isLoading: isSearching,
    isError,
  } = useGetMerchantOrdersQuery(
    { search: searchOrder, per_page: 5, status: "completed" },
    { skip: !searchOrder || searchOrder.length < 3 },
  );

  const [createExchange, { isLoading: isCreating }] =
    useCreateExchangeMutation();

  const { data: variationsData, isLoading: isLoadingVariations } =
    useGetAvailableVariationsQuery(selectedItem?.id, {
      skip:
        !selectedItem ||
        !["size_change", "color_change"].includes(exchangeType),
    });

  const availableVariations = variationsData?.data || [];

  const handleSearch = (e) => {
    e.preventDefault();
    // Triggered by input change automatically due to hook dependency
  };

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    setStep(2);
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setStep(3);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedOrder(null);
    setSelectedItem(null);
    setExchangeType(EXCHANGE_TYPES[0].value);
    setReason("");
    setSelectedVariationId("");
    setSearchOrder("");
  };

  const handleClose = () => {
    onOpenChange(false);
    handleReset();
  };

  const handleSubmit = async () => {
    if (!selectedOrder || !selectedItem) return;

    if (
      ["size_change", "color_change"].includes(exchangeType) &&
      !selectedVariationId
    ) {
      toast.error("Please select a new variation.");
      return;
    }

    try {
      await createExchange({
        order_id: selectedOrder.id,
        order_item_id: selectedItem.id,
        exchange_type: exchangeType,
        reason,
        new_variation_id: selectedVariationId || null,
      }).unwrap();
      toast.success("Exchange request created successfully");
      if (onSuccess) onSuccess();
      handleClose();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create exchange");
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Search Order (Completed)
        </label>
        <div className="flex gap-2">
          <Input
            placeholder="Enter Order Number (e.g. ORD-123)"
            value={searchOrder}
            onChange={(e) => setSearchOrder(e.target.value)}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Only completed orders can be exchanged.
        </p>
      </div>

      <div className="border rounded-md max-h-60 overflow-y-auto">
        {isSearching ? (
          <div className="p-4 text-center text-gray-500">Searching...</div>
        ) : searchOrder.length < 3 ? (
          <div className="p-4 text-center text-gray-500">
            Enter at least 3 characters to search.
          </div>
        ) : !orderSearchData?.data?.data?.length ? (
          <div className="p-4 text-center text-gray-500">No orders found.</div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="p-2">Order #</th>
                <th className="p-2">Customer</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {orderSearchData.data.data.map((order) => (
                <tr key={order.id} className="border-t hover:bg-gray-50">
                  <td className="p-2 font-mono">{order.order_number}</td>
                  <td className="p-2">
                    {order.member?.name || order.customer_info?.full_name}
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => handleSelectOrder(order)}
                      className="text-brand-600 hover:underline font-medium"
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="bg-gray-50 p-3 rounded-md mb-2">
        <p className="text-sm font-medium">
          Order: {selectedOrder.order_number}
        </p>
        <button
          onClick={() => setStep(1)}
          className="text-xs text-brand-600 hover:underline"
        >
          Change Order
        </button>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">
          Select Item to Exchange
        </label>
        <div className="border rounded-md max-h-60 overflow-y-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="p-2">Product</th>
                <th className="p-2">Qty</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {(selectedOrder.items || []).map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="p-2">
                    <div className="font-medium">{item.product_name}</div>
                    {(item.variation_snapshot || item.product_variation) && (
                      <div className="text-xs text-gray-500">
                        {item.variation_snapshot?.attribute_values
                          ? Object.values(
                              item.variation_snapshot.attribute_values,
                            ).join(", ")
                          : ""}
                      </div>
                    )}
                  </td>
                  <td className="p-2">{item.quantity}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleSelectItem(item)}
                      className="text-brand-600 hover:underline font-medium"
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="bg-gray-50 p-3 rounded-md mb-2 text-sm">
        <p>
          <span className="font-medium">Order:</span>{" "}
          {selectedOrder.order_number}
        </p>
        <p>
          <span className="font-medium">Item:</span> {selectedItem.product_name}
        </p>
        <button
          onClick={() => setStep(2)}
          className="text-xs text-brand-600 hover:underline mt-1"
        >
          Change Item
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Exchange Type</label>
        <select
          className="w-full border rounded-md p-2 text-sm bg-white"
          value={exchangeType}
          onChange={(e) => setExchangeType(e.target.value)}
        >
          {EXCHANGE_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {["size_change", "color_change"].includes(exchangeType) && (
        <div>
          <label className="block text-sm font-medium mb-1">
            New Variation
          </label>
          {isLoadingVariations ? (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader className="w-4 h-4 animate-spin" /> Loading variations...
            </div>
          ) : (
            <select
              className="w-full border rounded-md p-2 text-sm bg-white"
              value={selectedVariationId}
              onChange={(e) => setSelectedVariationId(e.target.value)}
            >
              <option value="">Select new variation...</option>
              {availableVariations.map((v) => (
                <option key={v.id} value={v.id}>
                  {Object.entries(v.attribute_values || {})
                    .map(([key, val]) => `${key}: ${val}`)
                    .join(", ")}{" "}
                  (Stock: {v.stock})
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Reason</label>
        <textarea
          className="w-full border rounded-md p-2 text-sm"
          rows={3}
          placeholder="Reason for exchange..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Exchange Request</DialogTitle>
          <DialogDescription>
            Step {step} of 3:{" "}
            {step === 1
              ? "Select Order"
              : step === 2
                ? "Select Item"
                : "Exchange Details"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>

        <DialogFooter>
          {step === 1 ? (
            <PrimaryButton variant="secondary" onClick={handleClose}>
              Cancel
            </PrimaryButton>
          ) : (
            <PrimaryButton
              variant="secondary"
              onClick={() => setStep(step - 1)}
            >
              Back
            </PrimaryButton>
          )}

          {step === 3 && (
            <PrimaryButton
              variant="primary"
              onClick={handleSubmit}
              disabled={isCreating}
            >
              {isCreating ? "Creating..." : "Create Exchange"}
            </PrimaryButton>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateExchangeModal;
