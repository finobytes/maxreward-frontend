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
import { paymentProofPlaceholder } from "../../../assets/assets";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

// Zod Schema for validation
const voucherSchema = z.object({
  denominationId: z.string().min(1, "Please select a denomination"),
  paymentMethod: z.enum(["online", "manual"], {
    required_error: "Please select a payment method",
  }),
  voucherType: z.enum(["max", "refer"], {
    required_error: "Please select a voucher type",
  }),
  manualDocs: z
    .any()
    .optional()
    .refine(
      (file, ctx) => {
        const method = ctx?.parent?.paymentMethod;
        if (method === "manual") {
          return !!file;
        }
        return true;
      },
      { message: "Payment proof is required for manual method" }
    ),
});

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

  // React Hook Form Setup
  const {
    handleSubmit,
    setValue,
    register,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(voucherSchema),
    defaultValues: {
      denominationId: denominationId || "",
      paymentMethod: paymentMethod || "",
      voucherType: "",
      manualDocs: null,
    },
  });

  // Watch for real-time updates
  const selectedPaymentMethod = watch("paymentMethod");

  // Handle denomination selection
  const handleDenomSelect = (denom) => {
    setDenomination(denom);
    setValue("denominationId", String(denom.id));
    setQuantity(1);
  };

  // Handle payment method
  const handlePaymentMethod = (method) => {
    setPaymentMethod(method);
    setValue("paymentMethod", method);
  };

  // Handle voucher type
  const handleVoucherType = (type) => {
    setVoucherType(type);
    setValue("voucherType", type);
  };

  // Handle file upload
  const handleFileSelect = (file) => {
    setManualDocs(file);
    setValue("manualDocs", file, { shouldValidate: true });
  };

  // On Submit
  const onSubmit = (data) => {
    if (data.paymentMethod === "manual" && !data.manualDocs) {
      toast.error("Payment proof is required for manual payment.");
      return;
    }
    handleCreateVoucher();
  };

  if (denomLoading) return <VoucherFromSkeleton />;

  return (
    <div>
      <PageBreadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Voucher Purchase", to: "/member/purchase-voucher" },
          { label: "Voucher Purchase Form" },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <ComponentCard title="Voucher Information">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Side - Voucher Info */}
            <div>
              {/* Denomination */}
              <div>
                <p className="font-semibold mb-2">Denomination</p>
                {denominations.slice(0, 3).map((item) => {
                  const isSelected = item.id === denominationId;
                  return (
                    <div key={item.id} className="flex items-center gap-3 mb-4">
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

                      {/* Quantity Counter */}
                      {isSelected && (
                        <div className="flex justify-between items-center border rounded-lg px-2 py-1 w-56">
                          <button
                            type="button"
                            onClick={() =>
                              setQuantity(Math.max(1, quantity - 1))
                            }
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
                {errors.denominationId && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.denominationId.message}
                  </p>
                )}
              </div>

              {/* Payment Method */}
              <div className="mt-6">
                <p className="text-sm font-medium mb-2">Payment Method</p>
                <div className="flex items-center gap-6">
                  {["online", "manual"].map((method) => (
                    <label
                      key={method}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        {...register("paymentMethod")}
                        name="paymentMethod"
                        value={method}
                        checked={selectedPaymentMethod === method}
                        onChange={() => handlePaymentMethod(method)}
                        className="text-orange-500 focus:ring-orange-500"
                      />

                      {method.charAt(0).toUpperCase() + method.slice(1)}
                    </label>
                  ))}
                </div>
                {errors.paymentMethod && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.paymentMethod.message}
                  </p>
                )}
              </div>

              {/* Voucher Type */}
              <div className="mt-6">
                <Label className="text-sm font-medium mb-2 block">
                  Voucher Type
                </Label>
                <Select onValueChange={handleVoucherType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Voucher Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="max">Max</SelectItem>
                    <SelectItem value="refer">Refer</SelectItem>
                  </SelectContent>
                </Select>
                {errors.voucherType && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.voucherType.message}
                  </p>
                )}
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

            {/* Right Side - Payment Info */}
            {selectedPaymentMethod === "online" && (
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

            {selectedPaymentMethod === "manual" && (
              <div>
                <Label htmlFor="paymentProof">Payment Proof</Label>
                <div className="mt-4">
                  <Dropzone
                    multiple={false}
                    maxFileSizeMB={5}
                    required
                    validationMessage="Payment proof is required"
                    placeholderImage={paymentProofPlaceholder}
                    onFilesChange={handleFileSelect}
                  />

                  {errors.manualDocs && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.manualDocs.message}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </ComponentCard>

        {/* Buttons */}
        <div className="mt-8">
          <ComponentCard title="Referral Information">
            <div className="mt-8 flex gap-4">
              <PrimaryButton type="submit" disabled={creating}>
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
      </form>
    </div>
  );
};

export default VoucherForm;
