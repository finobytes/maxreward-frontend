import React, { useRef, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import { QrCode } from "lucide-react";
import { qr } from "../../../assets/assets";
import ComponentCard from "../../../components/common/ComponentCard";
import MerchantCard from "./components/MerchantCard";
import {
  useGetMerchantSearchQuery,
  useLazyGetMerchantSearchQuery,
  useLocateMerchantsQuery,
} from "../../../redux/features/member/shopWithMerchant/shopWihtMerchantApi";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useGetAllBusinessTypesQuery } from "@/redux/features/admin/businessType/businessTypeApi";
import SearchableSelect from "../../../components/form/SearchableSelect";
import QrScanner from "react-qr-scanner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";

const ShopWithMerchant = () => {
  const [searchText, setSearchText] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const navigate = useNavigate();
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 300); // debounce 300ms

    return () => clearTimeout(handler);
  }, [searchText]);

  const { data: suggestions, isFetching: isSearching } =
    useGetMerchantSearchQuery(debouncedSearch, {
      skip: !debouncedSearch || debouncedSearch.length < 1,
    });
  const [getMerchantSearch, { isFetching: isLoading }] =
    useLazyGetMerchantSearchQuery();
  const {
    data: businessTypes,
    isLoading: isBusinessTypeLoading,
    isError: isBusinessTypeError,
  } = useGetAllBusinessTypesQuery();

  // QR Code State
  const [isQrOpen, setIsQrOpen] = useState(false);
  const prevSearchRef = useRef(null);

  // Separate forms for Simple and Advanced search
  const {
    register: registerSimple,
    handleSubmit: handleSubmitSimple,
    formState: { errors: simpleErrors },
    setValue: setSimpleValue,
  } = useForm();

  const {
    register: registerAdvanced,
    handleSubmit: handleSubmitAdvanced,
    formState: { errors: advancedErrors },
    setValue: setAdvancedValue,
    watch: watchAdvanced,
  } = useForm();

  const [filters, setFilters] = React.useState(null);
  const { data: advancedResult, isFetching: isFilterLoading } =
    useLocateMerchantsQuery(filters, { skip: !filters });

  const [isScannerProcessing, setIsScannerProcessing] = useState(false);

  // Validation Schemas
  const searchSchema = z
    .string()
    .min(1, "Please enter a valid merchant unique number.");
  const qrSchema = z.object({
    text: z.string().min(1, "Invalid QR code detected."),
  });

  const handleSearch = async (code) => {
    // Validate input before API call
    const validation = searchSchema.safeParse(code);
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return false;
    }

    try {
      const res = await getMerchantSearch(code).unwrap();

      if (res?.id) {
        toast.success(`Merchant "${res.business_name}" found successfully!`);
        navigate("/member/redeem-with-merchant", { state: { merchant: res } });
        return true;
      } else {
        toast.error("Merchant not found. Please check the code and try again.");
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error?.data?.message || "Failed to retrieve merchant information."
      );
      return false;
    }
  };

  const handleScan = async (data) => {
    if (isScannerProcessing) return;

    if (data?.text && data.text !== prevSearchRef.current) {
      const validation = qrSchema.safeParse(data);
      if (!validation.success) return;

      setIsScannerProcessing(true);
      prevSearchRef.current = data.text;

      const success = await handleSearch(data.text);

      if (success) {
        setIsQrOpen(false);
        setIsScannerProcessing(false);
        prevSearchRef.current = null;
      } else {
        setTimeout(() => {
          setIsScannerProcessing(false);
          prevSearchRef.current = null;
        }, 2000);
      }
    }
  };

  const handleQrError = (err) => {
    console.error("QR Error", err);
    if (err?.name === "NotAllowedError") {
      toast.error("Camera access denied. Please allow camera permissions.");
    } else {
      toast.error("Issue accessing camera.");
    }
  };

  // Reset scanner state when modal opens/closes
  React.useEffect(() => {
    if (!isQrOpen) {
      setIsScannerProcessing(false);
      prevSearchRef.current = null;
    }
  }, [isQrOpen]);

  // Simple Search
  const onSubmitSimple = async (data) => {
    const code = data.merchantNameOrUniqueNumber?.trim();
    await handleSearch(code);
  };

  // Advanced Search
  const onSubmitAdvanced = (data) => {
    const payload = {
      state: data.state || "",
      town: data.town || "",
      company_address: data.area || "",
      business_type_id: data.business_type_id || "",
    };
    setFilters(payload);
  };

  // Ensure suggestions is an array
  const suggestionsList = Array.isArray(suggestions)
    ? suggestions
    : suggestions
    ? [suggestions]
    : [];

  const { onChange: onSimpleChange, ...simpleRest } = registerSimple(
    "merchantNameOrUniqueNumber"
  );

  return (
    <div>
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Shop At Merchants" }]}
      />

      {/* Search Card */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white pb-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-800">Merchant</h3>
          <PrimaryButton
            variant="accent"
            size="md"
            to="/member/redeem-transactions"
          >
            Transaction
          </PrimaryButton>
        </div>

        {/* Form Section */}
        <div className="mt-4 w-full grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {/* Left Section */}
          <div className="flex w-full flex-col gap-6 px-4">
            <Tabs defaultValue="simple" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="simple">Name / Unique Number</TabsTrigger>
                <TabsTrigger value="advanced">Locate Merchant</TabsTrigger>
              </TabsList>

              {/* SIMPLE SEARCH */}
              <TabsContent value="simple">
                <form
                  onSubmit={handleSubmitSimple(onSubmitSimple)}
                  className="space-y-4"
                >
                  <div className="relative max-w-[350px]">
                    <Label>Merchant Name / Unique Number</Label>

                    <Input
                      placeholder="Enter merchant name or unique number"
                      value={searchText}
                      onChange={(e) => {
                        onSimpleChange(e);
                        setSearchText(e.target.value);
                      }}
                      {...simpleRest}
                    />

                    {/* Suggestion Dropdown */}
                    {searchText && suggestionsList?.length > 0 && (
                      <ul className="absolute z-50 bg-white border shadow-md rounded-md mt-1 w-full max-h-60 overflow-y-auto">
                        {suggestionsList.map((m) => (
                          <li
                            key={m.id}
                            className="p-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                          >
                            <div
                              onClick={() => {
                                const val = m.unique_number || m.business_name;
                                setSearchText(val);
                                setSimpleValue(
                                  "merchantNameOrUniqueNumber",
                                  val
                                );
                              }}
                              className="flex-1"
                            >
                              <p className="font-medium">{m.business_name}</p>
                              <p className="text-xs text-gray-500">
                                {m.unique_number}
                              </p>
                            </div>

                            {/* Redeem Button */}
                            <button
                              onClick={() =>
                                navigate("/member/redeem-with-merchant", {
                                  state: { merchant: m },
                                })
                              }
                              className="ml-3 px-3 py-1 text-sm rounded-md bg-brand-200 text-white hover:bg-brand-300 transition"
                            >
                              Redeem
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <Button
                    className="bg-brand-200 hover:bg-brand-200"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Searching..." : "Redeem"}
                  </Button>
                </form>
              </TabsContent>

              {/* ADVANCED SEARCH */}
              <TabsContent value="advanced">
                <form
                  onSubmit={handleSubmitAdvanced(onSubmitAdvanced)}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div>
                    <Label>State</Label>
                    <Input
                      placeholder="Enter state"
                      {...registerAdvanced("state")}
                    />
                  </div>

                  <div>
                    <Label>Town</Label>
                    <Input
                      placeholder="Enter town"
                      {...registerAdvanced("town")}
                    />
                  </div>

                  <div>
                    <Label>Area</Label>
                    <Input
                      placeholder="Enter area"
                      {...registerAdvanced("area")}
                    />
                  </div>

                  <div>
                    <Label>Product / Service</Label>
                    {isBusinessTypeLoading ? (
                      <div className="animate-pulse space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ) : isBusinessTypeError ? (
                      <p className="text-red-500 text-sm">
                        Failed to load product/service type
                      </p>
                    ) : (
                      <SearchableSelect
                        value={watchAdvanced("business_type_id")}
                        onChange={(val) =>
                          setAdvancedValue("business_type_id", val)
                        }
                        options={businessTypes?.data?.business_types || []}
                        placeholder="Select Product/Service Type"
                      />
                    )}
                    {advancedErrors.business_type_id && (
                      <p className="text-red-500 text-xs mt-1">
                        {advancedErrors.business_type_id.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-full mt-2">
                    <Button
                      className="bg-brand-200 hover:bg-brand-200"
                      type="submit"
                    >
                      Search Merchant
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </div>

          {/* Divider */}
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-0.5 bg-brand-200/40"></div>

          {/* Right Section */}
          <div className="flex flex-col justify-center items-center">
            <img
              src={qr}
              alt="QR Code"
              className="mb-6 w-28 h-28 object-contain"
            />
            <PrimaryButton
              variant="primary"
              size="md"
              onClick={() => setIsQrOpen(true)}
            >
              <QrCode /> Search with QR Code
            </PrimaryButton>
          </div>
        </div>
      </div>

      {filters && (
        <ComponentCard title="Search Results" className="mt-6">
          {isFilterLoading ? (
            <p className="text-gray-600">Searching merchants...</p>
          ) : advancedResult?.merchants?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {advancedResult.merchants.map((m) => (
                <MerchantCard key={m.id} merchant={m} />
              ))}
            </div>
          ) : (
            <p className="text-red-500 mt-2">No merchants found.</p>
          )}
        </ComponentCard>
      )}

      <Dialog open={isQrOpen} onOpenChange={setIsQrOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Scan Merchant QR Code</DialogTitle>
          </DialogHeader>
          <div className="w-full h-[300px] bg-black rounded-lg overflow-hidden relative flex items-center justify-center">
            {isQrOpen && (
              <QrScanner
                delay={500}
                onError={handleQrError}
                onScan={handleScan}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                constraints={{
                  audio: false,
                  video: { facingMode: "environment" },
                }}
              />
            )}

            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
              <div className="relative w-64 h-64 border-2 border-brand-500/80 rounded-lg overflow-hidden shadow-[0_0_0_100vw_rgba(0,0,0,0.5)]">
                <div className="absolute inset-x-0 w-full h-1 bg-brand-500/80 shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-pulse"></div>

                {isScannerProcessing && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm z-10">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 border-4 border-white/30 border-t-brand-500 rounded-full animate-spin"></div>
                      <p className="text-white text-sm mt-3 font-medium">
                        Verifying...
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <p className="mt-6 text-white text-sm font-medium drop-shadow-md">
                Align QR code within the frame
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShopWithMerchant;
