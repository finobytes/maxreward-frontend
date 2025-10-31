import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadCloud, Minus, Plus } from "lucide-react";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Dropzone from "../../../components/form/form-elements/Dropzone";
import { useVoucher } from "./../../../redux/features/member/voucherPurchase/useVoucher";
import VoucherFromSkeleton from "../../../components/skeleton/VoucherFromSkeleton";

const VoucherForm = () => {
  const {
    denominations,
    denomLoading,
    paymentMethod,
    setDenomination,
    setQuantity,
    setPaymentMethod,
    setVoucherType,
    setManualDocs,
    quantity,
    totalAmount,
    creating,
    handleCreateVoucher,
    denominationId,
  } = useVoucher();

  // Handle denomination change
  const handleDenomSelect = (denom) => {
    setDenomination(denom);
    setQuantity(1); // reset quantity when denomination changes
  };

  if (denomLoading) {
    return <VoucherFromSkeleton />;
  }

  return (
    <div>
      <PageBreadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Voucher Purchase", to: "/member/purchase-voucher" },
          { label: "Voucher Purchase Form" },
        ]}
      />

      <ComponentCard title="Voucher Information">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Voucher Information */}
          <div>
            {/* Dynamic Denomination Section */}
            <div>
              <p className="font-semibold mb-6">Denomination</p>
              {denominations.map((item) => {
                const isSelected = item.id === denominationId;
                return (
                  <div key={item.id} className="flex items-center gap-3 mb-6">
                    <input
                      type="radio"
                      id={`denom-${item.id}`}
                      name="denomination"
                      checked={isSelected}
                      onChange={() => handleDenomSelect(item)}
                      className="text-orange-500 focus:ring-orange-500"
                    />
                    <Label
                      htmlFor={`denom-${item.id}`}
                      className="w-20 cursor-pointer"
                    >
                      {item.title}
                    </Label>

                    {/* Show counter only for selected denomination */}
                    {isSelected && (
                      <div className="flex justify-between items-center border rounded-lg px-2 py-1 w-56">
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="p-1 hover:bg-gray-100 rounded border"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-gray-400">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(quantity + 1)}
                          className="p-1 hover:bg-gray-100 rounded border"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Payment Method */}
            <div>
              <p className="text-sm font-medium mb-4">Payment Method</p>
              <div className="flex items-center gap-6">
                {["online", "manual"].map((method) => (
                  <label
                    key={method}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method)}
                      className="text-orange-500 focus:ring-orange-500"
                    />
                    {method.charAt(0).toUpperCase() + method.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            {/* Voucher Type */}
            <div className="mt-6">
              <Label className="text-sm font-medium mb-2 block">
                Voucher Type
              </Label>
              <Select onValueChange={(v) => setVoucherType(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Voucher Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="max">Max</SelectItem>
                  <SelectItem value="refer">Refer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Equivalent Points */}
            <div className="mt-6 max-w-[350px]">
              <Label className="text-sm font-medium mb-2 block">
                Equivalent Points
              </Label>
              <Input
                readOnly
                value={totalAmount}
                placeholder="Points / Price"
                className="bg-gray-100"
              />
            </div>
          </div>
          {/* Bank Information */}
          {paymentMethod === "online" && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">
                Bank Information
              </h3>
              <div className="space-y-5">
                <div>
                  <Label>Bank Name</Label>
                  <Input placeholder="Enter Bank Name" />
                </div>
                <div>
                  <Label>Account Holder Name</Label>
                  <Input placeholder="Enter Account Holder Name" />
                </div>
                <div>
                  <Label>Account Number / IBAN</Label>
                  <Input placeholder="Enter Account Number / IBAN" />
                </div>
                <div>
                  <Label>Swift Code</Label>
                  <Input placeholder="Enter Swift Code" />
                </div>
                <div>
                  <Label>Routing Number</Label>
                  <Input placeholder="Enter Routing Number" />
                </div>
              </div>
            </div>
          )}
          {/* Manual Payment Upload */}
          {paymentMethod === "manual" && (
            <div>
              <Label htmlFor="paymentProof">Payment Proof</Label>
              <div className="mt-4">
                <Dropzone onFileSelect={(file) => setManualDocs(file)} />
              </div>
            </div>
          )}
        </div>
      </ComponentCard>

      {/* Buttons */}
      <div className="mt-8">
        <ComponentCard title="Referral Information">
          <div className="mt-8 flex gap-4">
            <PrimaryButton
              type="button"
              onClick={handleCreateVoucher}
              disabled={creating}
            >
              {creating ? "Processing..." : "Submit"}
            </PrimaryButton>
            <PrimaryButton
              variant="secondary"
              type="button"
              to="/member/referred-member"
            >
              Back
            </PrimaryButton>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
};

export default VoucherForm;
