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
import { fpxLogo, paymentProofPlaceholder } from "../../../assets/assets";
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
      { message: "Payment proof is required for manual method" },
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
                      (d) => d.id === item.id,
                    );
                    const selectedItem = selectedDenominations.find(
                      (d) => d.id === item.id,
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
                                  Math.max(
                                    1,
                                    (selectedItem?.quantity || 1) - 1,
                                  ),
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
                                  (selectedItem?.quantity || 1) + 1,
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
                {/* {totalAmountWithRm && totalAmountWithRm !== totalAmount ? (
                  <p className="text-xs text-gray-500 mt-1">
                    After RM points: {totalAmountWithRm}
                  </p>
                ) : null} */}
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
              <div className="bg-white border hover:border-blue-200 transition-colors duration-300 rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] relative overflow-hidden group">
                {/* Background decorative element */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-50 to-transparent rounded-full -mr-20 -mt-20 transition-transform group-hover:scale-110 duration-700 ease-out" />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-7">
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
                      <img
                        src={fpxLogo}
                        alt="FPX Logo"
                        className="h-7 w-auto object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">
                        FPX Online Banking
                      </h3>
                      <p className="text-sm text-gray-500 font-medium mt-0.5">
                        Fast, secure & reliable
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-7">
                    {[
                      "Real-time processing",
                      "Supports all major Malaysian banks",
                      "Bank-level 256-bit encryption",
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 border border-blue-100/50 flex items-center justify-center">
                          <svg
                            className="w-3.5 h-3.5 text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-600 font-medium">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50/70 rounded-xl p-4 border border-blue-100/50 flex items-start gap-3 mt-auto">
                    <svg
                      className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <p className="text-xs text-blue-800 leading-relaxed font-medium">
                      You will be securely redirected to the FPX payment gateway
                      upon submission. Do not close your browser.
                    </p>
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
