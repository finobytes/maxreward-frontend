import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Minus, Plus } from "lucide-react";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Dropzone from "../../../components/form/form-elements/Dropzone";
import VoucherFromSkeleton from "../../../components/skeleton/VoucherFromSkeleton";
import { paymentProofPlaceholder } from "../../../assets/assets";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import * as z from "zod";
import { useVoucherForm } from "../../../redux/features/member/voucherPurchase/useVoucherForm";
import { toast } from "sonner";

// Zod Schema for validation
const voucherSchema = z.object({
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
        if (ctx?.parent?.paymentMethod === "manual") {
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
    settingsLoading,
    verifying,
    paymentMethod,
    voucherType,
    selectedDenominations,
    setDenomination,
    updateQuantity,
    setPaymentMethod,
    setVoucherType,
    setManualDocs,
    totalAmount,
    totalAmountWithRm,
    totalQuantity,
    creating,
    handleCreateVoucher,
  } = useVoucherForm();

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
      paymentMethod: paymentMethod || "manual",
      voucherType: "",
      manualDocs: null,
    },
  });

  // Watch for real-time updates
  const selectedPaymentMethod = watch("paymentMethod") || paymentMethod;
  const selectedVoucherType = watch("voucherType") || voucherType;

  useEffect(() => {
    register("manualDocs");
    register("voucherType");
  }, [register]);

  useEffect(() => {
    setValue("paymentMethod", paymentMethod);
  }, [paymentMethod, setValue]);

  useEffect(() => {
    setValue("voucherType", voucherType);
  }, [voucherType, setValue]);

  const handleDenomToggle = (item) => {
    setDenomination(item);
  };

  const handleQtyChange = (id, newQty) => {
    updateQuantity({ id, quantity: Math.max(1, newQty) });
  };

  // Handle payment method
  const handlePaymentMethod = (method) => {
    setPaymentMethod(method);
    setValue("paymentMethod", method, { shouldValidate: true });
    if (method === "online") {
      setManualDocs(null);
      setValue("manualDocs", null, { shouldValidate: true });
    }
  };

  // Handle voucher type
  const handleVoucherType = (type) => {
    setVoucherType(type);
    setValue("voucherType", type, { shouldValidate: true });
  };

  // Handle file upload
  const handleFileSelect = (file) => {
    const selectedFile = Array.isArray(file) ? file[0] : file;
    setManualDocs(selectedFile || null);
    setValue("manualDocs", selectedFile || null, { shouldValidate: true });
  };

  // On Submit
  const onSubmit = async () => {
    if (!selectedDenominations.length) {
      toast.error("Select at least one denomination to proceed.");
      return;
    }
    await handleCreateVoucher();
  };

  if (denomLoading || settingsLoading || verifying) {
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

      <form onSubmit={handleSubmit(onSubmit)}>
        <ComponentCard title="Voucher Information">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Side - Voucher Info */}
            <div>
              {/* Denomination */}
              <div>
                <p className="font-semibold mb-2">Denomination</p>
                {!denominations.length ? (
                  <p className="text-sm text-gray-500">
                    No denominations available. Please try again later.
                  </p>
                ) : (
                  denominations.map((item) => {
                    const isSelected = selectedDenominations.some(
                      (d) => d.id === item.id
                    );
                    const selectedItem = selectedDenominations.find(
                      (d) => d.id === item.id
                    );
                    const checkboxId = `denom-${item.id}`;
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 mb-4"
                      >
                        <Checkbox
                          id={checkboxId}
                          checked={isSelected}
                          onCheckedChange={() => handleDenomToggle(item)}
                          className="bg-brand-25"
                        />
                        <Label
                          htmlFor={checkboxId}
                          className="cursor-pointer w-24"
                        >
                          {item.title}
                        </Label>

                        {/* Quantity Counter */}
                        {isSelected && (
                          <div className="flex justify-between items-center border rounded-lg px-2 py-1 w-56">
                            <button
                              type="button"
                              onClick={() =>
                                handleQtyChange(
                                  item.id,
                                  Math.max(1, (selectedItem?.quantity || 1) - 1)
                                )
                              }
                              className="p-1 hover:bg-gray-100 rounded border"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-gray-400">
                              {selectedItem?.quantity ?? 1}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleQtyChange(
                                  item.id,
                                  (selectedItem?.quantity || 1) + 1
                                )
                              }
                              className="p-1 hover:bg-gray-100 rounded border"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
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

                <Select
                  value={selectedVoucherType || ""}
                  onValueChange={handleVoucherType}
                >
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

              {/* Totals */}
              {/* <div className="mt-6 grid gap-4 max-w-[350px]"> */}
              {/* <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Total Quantity
                  </Label>
                  <Input
                    readOnly
                    value={String(totalQuantity || 0)}
                    placeholder="Quantity"
                    className="bg-gray-100"
                  />
                </div> */}
              <div className="mt-6 max-w-[350px]">
                <Label className="text-sm font-medium mb-2 block">
                  Total voucher amount
                </Label>
                <Input
                  readOnly
                  value={String(totalAmount || 0)}
                  placeholder="Points / Price"
                  className="bg-gray-100"
                />
                {totalAmountWithRm && totalAmountWithRm !== totalAmount ? (
                  <p className="text-xs text-gray-500 mt-1">
                    After RM points: {totalAmountWithRm}
                  </p>
                ) : null}
              </div>
              {/* </div> */}

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
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <span className="font-semibold">Note:</span> Please make the
                    payment to the bank account listed below according to your{" "}
                    <span className="font-semibold">
                      Equivalent Points (RM {totalAmount})
                    </span>
                    .
                    <br />
                    Bank Name: <span className="font-semibold">Maybank</span>
                    <br />
                    Account Holder Name:{" "}
                    <span className="font-semibold">John Doe</span>
                    <br />
                    Account Number:{" "}
                    <span className="font-semibold">1234 5678 9012</span>
                    <br />
                    After sending the payment, please upload the “Payment Proof”
                    file (receipt/screenshot) below.
                  </p>
                </div>

                <Label htmlFor="paymentProof">Payment Proof</Label>
                <div className="mt-4">
                  <Dropzone
                    multiple={false}
                    maxFileSizeMB={5}
                    required={selectedPaymentMethod === "manual"}
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
      </form>
    </div>
  );
};

export default VoucherForm;
