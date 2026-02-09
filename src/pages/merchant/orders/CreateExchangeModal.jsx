import React, { useState } from "react";
import { Loader, AlertCircle } from "lucide-react";
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
import PrimaryButton from "../../../components/ui/PrimaryButton";
import Input from "../../../components/form/input/InputField";

const CreateExchangeModal = ({ open, onOpenChange, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [searchOrder, setSearchOrder] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [reason, setReason] = useState("");
  const [selectedVariationId, setSelectedVariationId] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Step 1: Search Order
  const { data: orderSearchData, isLoading: isSearching } =
    useGetMerchantOrdersQuery(
      { search: searchOrder, per_page: 5, status: "completed" },
      { skip: !searchOrder || searchOrder.length < 3 },
    );

  // Step 2 & 3: Create Exchange
  const [createExchange, { isLoading: isCreating }] =
    useCreateExchangeMutation();

  // Step 3: Available Variations
  const { data: variationsData, isLoading: isLoadingVariations } =
    useGetAvailableVariationsQuery(selectedItem?.id, {
      skip: !selectedItem,
    });

  const availableVariations = variationsData?.data?.available_variations || [];
  const currentVariation = variationsData?.data?.current_variation;

  const handleReset = () => {
    setStep(1);
    setSelectedOrder(null);
    setSelectedItem(null);
    setReason("");
    setSelectedVariationId("");
    setQuantity(1);
    setSearchOrder("");
  };

  const handleClose = () => {
    onOpenChange(false);
    handleReset();
  };

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    setStep(2);
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setStep(3);
  };

  const handleSubmit = async () => {
    if (!selectedOrder || !selectedItem || !selectedVariationId) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createExchange({
        order_id: selectedOrder.id,
        order_item_id: selectedItem.id,
        exchange_product_variation_id: selectedVariationId,
        quantity: quantity,
        reason: reason,
      }).unwrap();

      toast.success("Exchange request created successfully");
      if (onSuccess) onSuccess();
      handleClose();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create exchange request");
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Search Completed Order
        </label>
        <Input
          placeholder="Enter Order Number (e.g. ORD-123)"
          value={searchOrder}
          onChange={(e) => setSearchOrder(e.target.value)}
          autoFocus={step === 1}
        />
        <p className="text-xs text-gray-500 mt-1">
          Enter at least 3 characters. Only completed orders can be exchanged.
        </p>
      </div>

      <div className="border rounded-md max-h-60 overflow-y-auto bg-white">
        {isSearching ? (
          <div className="p-4 text-center text-gray-500">
            <Loader className="w-5 h-5 animate-spin mx-auto mb-2" />
            Searching...
          </div>
        ) : searchOrder.length < 3 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            Type to search orders...
          </div>
        ) : !orderSearchData?.data?.data?.length ? (
          <div className="p-4 text-center text-gray-500">No orders found.</div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 sticky top-0">
              <tr>
                <th className="p-3 font-medium">Order #</th>
                <th className="p-3 font-medium">Customer</th>
                <th className="p-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orderSearchData.data.data.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3 font-mono text-xs">
                    {order.order_number}
                  </td>
                  <td className="p-3">
                    <div className="font-medium">
                      {order.member?.name || order.customer_info?.full_name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.member?.phone || order.customer_info?.phone}
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleSelectOrder(order)}
                      className="text-white font-medium text-xs border border-brand-200 bg-brand-50 px-3 py-1.5 rounded-md transition-colors"
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
      <div className="bg-blue-50 p-3 rounded-md mb-2 flex justify-between items-center border border-blue-100">
        <div>
          <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">
            Selected Order
          </p>
          <p className="text-sm font-semibold text-blue-900">
            {selectedOrder.order_number}
          </p>
        </div>
        <button
          onClick={() => setStep(1)}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium underline"
        >
          Change
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Select Item to Exchange
        </label>
        <div className="border rounded-md max-h-60 overflow-y-auto bg-white">
          {!selectedOrder.items?.length ? (
            <div className="p-4 text-center text-gray-500">
              No items in this order.
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700 sticky top-0">
                <tr>
                  <th className="p-3 font-medium">Product Details</th>
                  <th className="p-3 font-medium text-center">Qty</th>
                  <th className="p-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {selectedOrder.items.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3">
                      <div className="font-medium text-gray-900">
                        {item.product_name}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {item.variation_snapshot?.attribute_values
                          ? Object.values(
                              item.variation_snapshot.attribute_values,
                            ).join(" • ")
                          : item.sku || "No variant"}
                      </div>
                    </td>
                    <td className="p-3 text-center text-gray-600">
                      {item.quantity}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleSelectItem(item)}
                        className="text-white font-medium text-xs border border-brand-200 bg-brand-50 px-3 py-1.5 rounded-md transition-colors"
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
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-5">
      <div className="bg-gray-50 p-3 rounded-md text-sm border border-gray-100">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              Order
            </span>
            <p className="font-medium text-gray-900">
              {selectedOrder.order_number}
            </p>
          </div>
          <div className="text-right">
            <button
              onClick={() => setStep(2)}
              className="text-xs text-white hover:underline font-medium"
            >
              Change Item
            </button>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-200">
          <span className="text-xs text-gray-500 uppercase tracking-wide">
            Current Item
          </span>
          <p className="font-medium text-gray-900">
            {selectedItem.product_name}
          </p>
          <p className="text-xs text-gray-600">
            {currentVariation?.variation_name ||
              (selectedItem.variation_snapshot?.attribute_values
                ? Object.values(
                    selectedItem.variation_snapshot.attribute_values,
                  ).join(" • ")
                : "")}
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5 text-gray-700">
          Select New Variation <span className="text-red-500">*</span>
        </label>

        {isLoadingVariations ? (
          <div className="w-full border rounded-md p-3 flex items-center justify-center gap-2 text-sm text-gray-500 bg-gray-50">
            <Loader className="w-4 h-4 animate-spin" /> Fetching available
            options...
          </div>
        ) : availableVariations.length === 0 ? (
          <div className="w-full border border-red-200 bg-red-50 rounded-md p-3 flex items-start gap-2 text-sm text-red-600">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">No other variations available.</p>
              <p className="text-xs mt-0.5 opacity-90">
                Either out of stock or no other options exist.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <select
              className="w-full border border-gray-300 rounded-md p-2.5 text-sm bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-shadow"
              value={selectedVariationId}
              onChange={(e) => setSelectedVariationId(e.target.value)}
            >
              <option value="">-- Choose New Size/Color --</option>
              {availableVariations.map((v) => (
                <option
                  key={v.id}
                  value={v.id}
                  disabled={v.actual_quantity < 1}
                >
                  {v.variation_name || v.sku}
                  {v.actual_quantity < 1
                    ? " (Out of Stock)"
                    : ` (${v.actual_quantity} available)`}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5 text-gray-700">
          Quantity to Exchange <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min="1"
            max={selectedItem.quantity}
            className="w-24 border border-gray-300 rounded-md p-2 text-sm text-center focus:ring-2 focus:ring-brand-500 outline-none"
            value={quantity}
            onChange={(e) =>
              setQuantity(
                Math.min(parseInt(e.target.value) || 1, selectedItem.quantity),
              )
            }
          />
          <span className="text-xs text-gray-500">
            (Max: {selectedItem.quantity})
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5 text-gray-700">
          Reason for Exchange{" "}
          <span className="text-gray-400 text-xs font-normal">(Optional)</span>
        </label>
        <textarea
          className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-shadow"
          rows={3}
          placeholder="E.g. Customer requested a different size..."
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
          <DialogTitle className="text-xl">Create Exchange Request</DialogTitle>
          <DialogDescription className="text-sm">
            Step {step} of 3:{" "}
            <span className="font-medium text-white">
              {step === 1
                ? "Find Order"
                : step === 2
                  ? "Select Item"
                  : "Exchange Details"}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
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

          {step === 3 ? (
            <div className="ml-2">
              <PrimaryButton
                variant="primary"
                onClick={handleSubmit}
                disabled={isCreating || !selectedVariationId}
              >
                {isCreating ? (
                  <span className="flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" /> Creating...
                  </span>
                ) : (
                  "Create Request"
                )}
              </PrimaryButton>
            </div>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateExchangeModal;
