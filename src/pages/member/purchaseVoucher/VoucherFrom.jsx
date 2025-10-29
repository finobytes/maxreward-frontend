import React, { useState } from "react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { memberSchema } from "../../../schemas/memberSchema";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Dropzone from "../../../components/form/form-elements/Dropzone";

const VoucherForm = () => {
  const [denomination, setDenomination] = useState("RM10");
  const [paymentMethod, setPaymentMethod] = useState("Manual");
  const [counts, setCounts] = useState({ RM10: 1, RM100: 1, RM1000: 1 });
  const [file, setFile] = useState(null);

  const handleCountChange = (key, type) => {
    setCounts((prev) => ({
      ...prev,
      [key]: type === "inc" ? prev[key] + 1 : prev[key] > 1 ? prev[key] - 1 : 1,
    }));
  };

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Form Data:", data);
  };

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
          <div className=" grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Voucher Information */}
            <div>
              <div>
                <p className="font-semibold mb-7">Denomination</p>
                {[
                  { label: "RM 10", key: "RM10" },
                  { label: "RM 100", key: "RM100" },
                  { label: "RM 1,000", key: "RM1000" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center gap-3 mb-6">
                    <input
                      type="radio"
                      id={item.key}
                      name="denomination"
                      checked={denomination === item.key}
                      onChange={() => setDenomination(item.key)}
                      className="text-orange-500 focus:ring-orange-500"
                    />
                    <Label htmlFor={item.key} className="w-20 cursor-pointer">
                      {item.label}
                    </Label>
                    <div className="flex justify-between items-center border rounded-lg px-2 py-1 w-56">
                      <button
                        onClick={() => handleCountChange(item.key, "dec")}
                        className="p-1 hover:bg-gray-100 rounded border"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-gray-400">
                        {counts[item.key]}
                      </span>
                      <button
                        onClick={() => handleCountChange(item.key, "inc")}
                        className="p-1 hover:bg-gray-100 rounded border"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-medium mb-4">Payment Method</p>
                <div className="flex items-center gap-6">
                  {["Online", "Manual"].map((method) => (
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
                      {method}
                    </label>
                  ))}
                </div>
              </div>
              <div className="mt-6">
                <Label className="text-sm font-medium mb-2 block">
                  Voucher Type
                </Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Voucher Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="max">Max</SelectItem>
                    <SelectItem value="refer">Refer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-6 max-w-[350px]">
                <Label className="text-sm font-medium mb-2 block">
                  Equivalent Points
                </Label>
                <Input
                  disabled
                  placeholder="Points / Price"
                  className="bg-gray-100"
                />
              </div>
            </div>

            {/* Bank Information */}
            {paymentMethod === "Online" && (
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

            {/* Payment Proof */}
            {paymentMethod === "Manual" && (
              <div>
                <Label htmlFor="email">Payment Proof</Label>
                <div className="mt-4">
                  <Dropzone />
                </div>
              </div>
            )}
          </div>
        </ComponentCard>

        {/* Referral */}
        <div className="mt-8">
          <ComponentCard title="Referral Information">
            <div className="mt-8 flex gap-4">
              <PrimaryButton type="submit">Submit</PrimaryButton>
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
