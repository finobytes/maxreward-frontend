import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import {
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ShoppingBag,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
  useCreateOrdersMutation,
  useCalculateShippingMutation,
  useGetActiveMemberShippingMethodsQuery,
} from "../../../redux/features/member/maxRedeemMall/maxRedeemApi";
import { useVerifyMeQuery } from "../../../redux/features/auth/authApi";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";

// Schema for checkout form
const checkoutSchema = z.object({
  customer_full_name: z.string().min(1, "Full Name is required"),
  customer_email: z.string().email("Invalid email address"),
  customer_phone: z.string().min(1, "Phone number is required"),
  customer_address: z.string().min(1, "Address is required"),
  customer_postcode: z.string().min(1, "Postcode is required"),
  customer_city: z.string().min(1, "City is required"),
  customer_state: z.string().min(1, "State is required"),
  customer_country: z.string().min(1, "Country is required"),
});

const CartPage = () => {
  const navigate = useNavigate();

  // API Hooks
  const { data: cartData, isLoading: isLoadingCart } = useGetCartQuery();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [clearCart] = useClearCartMutation();
  const [createOrders, { isLoading: isPurchasing }] = useCreateOrdersMutation();
  const [calculateShipping, { isLoading: isCalculatingShipping }] =
    useCalculateShippingMutation();
  const {
    data: shippingMethodsResponse,
    isLoading: isLoadingShippingMethods,
    isError: isShippingMethodsError,
    refetch: refetchShippingMethods,
  } = useGetActiveMemberShippingMethodsQuery();

  // Parse New API Structure
  const cartByMerchant = cartData?.cart_by_merchant || [];
  const allItems =
    cartByMerchant.flatMap((group) => group.items || []) || [];

  // Use summary from API if available, else fallback
  const cartTotal = cartData?.summary?.total_amount || 0;

  // Auth & Wallet
  const { user, token } = useSelector((state) => state.auth);
  const role = user?.role || "member";
  const { data: profileData } = useVerifyMeQuery(role, { skip: !token });

  const member = profileData?.data || profileData;

  const availablePoints =
    member?.wallet?.available_points || member?.wallet?.total_cp || 0;

  const methods = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customer_full_name: "",
      customer_email: "",
      customer_phone: "",
      customer_address: "",
      customer_postcode: "",
      customer_city: "",
      customer_state: "",
      customer_country: "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = methods;

  const customerPostcode = (watch("customer_postcode") || "").trim();

  const shippingMethodsPayload =
    shippingMethodsResponse?.data?.data ?? shippingMethodsResponse?.data ?? [];
  const shippingMethods = Array.isArray(shippingMethodsPayload)
    ? shippingMethodsPayload
    : [];
  const hasShippingMethodsError =
    isShippingMethodsError || shippingMethodsResponse?.success === false;
  const shippingMethodOptions = shippingMethods
    .filter((method) => method?.id !== null && method?.id !== undefined)
    .map((method) => {
      const minDays = method?.min_days;
      const maxDays = method?.max_days;
      const hasDays =
        minDays !== null &&
        minDays !== undefined &&
        maxDays !== null &&
        maxDays !== undefined;
      const label = hasDays
        ? `${method?.name || "Shipping"} (${minDays}-${maxDays} days)`
        : method?.name || "Shipping";
      return {
        label,
        value: String(method?.id),
      };
    });
  const isShippingMethodsEmpty =
    !isLoadingShippingMethods && shippingMethodOptions.length === 0;
  const showShippingMethodsError =
    hasShippingMethodsError && shippingMethodOptions.length === 0;
  const isShippingMethodsUnavailable = isShippingMethodsEmpty;

  const [merchantShippingMethods, setMerchantShippingMethods] = useState({});
  const [merchantShippingErrors, setMerchantShippingErrors] = useState({});
  const shippingRequestIdRef = useRef(0);
  const lastShippingPayloadRef = useRef(null);
  const [shippingQuote, setShippingQuote] = useState({
    totalPoints: 0,
    byMerchant: {},
    status: "idle",
    error: null,
  });
  const getMerchantId = useCallback(
    (group) =>
      group?.merchant?.merchant_id ??
      group?.merchant_id ??
      group?.merchant?.id ??
      group?.id,
    []
  );

  const handleMerchantShippingChange = (merchantId, value) => {
    if (!merchantId) return;
    setMerchantShippingMethods((prev) => ({
      ...prev,
      [merchantId]: value,
    }));
    setMerchantShippingErrors((prev) => {
      if (!prev[merchantId]) return prev;
      const next = { ...prev };
      delete next[merchantId];
      return next;
    });
  };

  // Pre-fill form from profile
  useEffect(() => {
    if (profileData) {
      const member = profileData.data || profileData;
      reset({
        customer_full_name: member.name || "",
        customer_email: member.email || "",
        customer_phone: member.phone || "",
        customer_address: member.address || "",
        customer_postcode: member.postcode || "",
        customer_city: member.city || "",
        customer_state: member.state || "",
        customer_country: "",
      });
    }
  }, [profileData, reset]);

  useEffect(() => {
    if (!cartByMerchant.length) {
      setMerchantShippingMethods({});
      setMerchantShippingErrors({});
      return;
    }
    setMerchantShippingMethods((prev) => {
      const next = {};
      cartByMerchant.forEach((group) => {
        const merchantId = getMerchantId(group);
        if (merchantId && prev[merchantId]) {
          next[merchantId] = prev[merchantId];
        }
      });
      return next;
    });
    setMerchantShippingErrors((prev) => {
      const next = {};
      cartByMerchant.forEach((group) => {
        const merchantId = getMerchantId(group);
        if (merchantId && prev[merchantId]) {
          next[merchantId] = prev[merchantId];
        }
      });
      return next;
    });
  }, [cartByMerchant, getMerchantId]);

  useEffect(() => {
    if (shippingMethodOptions.length !== 1 || !cartByMerchant.length) return;
    const defaultMethodId = shippingMethodOptions[0].value;
    setMerchantShippingMethods((prev) => {
      let changed = false;
      const next = { ...prev };
      cartByMerchant.forEach((group) => {
        const merchantId = getMerchantId(group);
        if (merchantId && !next[merchantId]) {
          next[merchantId] = defaultMethodId;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
    setMerchantShippingErrors((prev) => {
      if (!Object.keys(prev).length) return prev;
      const next = { ...prev };
      cartByMerchant.forEach((group) => {
        const merchantId = getMerchantId(group);
        if (merchantId && next[merchantId]) {
          delete next[merchantId];
        }
      });
      return next;
    });
  }, [shippingMethodOptions, cartByMerchant, getMerchantId]);

  const normalizeShippingResponse = useCallback((response) => {
    const payload = response?.data ?? response ?? {};
    const merchantsPayload =
      payload?.merchants ??
      payload?.data?.merchants ??
      payload?.shipping ??
      payload?.merchant_shipping ??
      [];
    const byMerchant = {};
    if (Array.isArray(merchantsPayload)) {
      merchantsPayload.forEach((merchant) => {
        const merchantId =
          merchant?.merchant_id ??
          merchant?.merchant?.merchant_id ??
          merchant?.id;
        const points = Number(
          merchant?.shipping_points ??
            merchant?.points ??
            merchant?.shipping_cost ??
            merchant?.shipping
        );
        if (merchantId && Number.isFinite(points)) {
          byMerchant[merchantId] = points;
        }
      });
    }

    const totalFromPayload = Number(
      payload?.total_shipping_points ??
        payload?.shipping_points ??
        payload?.total_shipping ??
        payload?.total ??
        payload?.shipping_cost ??
        payload?.data?.total_shipping_points
    );
    const totalFromMerchants = Object.values(byMerchant).reduce(
      (sum, value) => sum + (Number.isFinite(value) ? value : 0),
      0
    );
    const totalPoints = Number.isFinite(totalFromPayload)
      ? totalFromPayload
      : totalFromMerchants;

    return {
      totalPoints: Number.isFinite(totalPoints) ? totalPoints : 0,
      byMerchant,
    };
  }, []);

  const runShippingCalculation = useCallback(
    async (payload) => {
      const requestId = ++shippingRequestIdRef.current;
      lastShippingPayloadRef.current = payload;
      setShippingQuote({
        totalPoints: 0,
        byMerchant: {},
        status: "calculating",
        error: null,
      });

      try {
        const response = await calculateShipping(payload).unwrap();
        if (response?.success === false) {
          throw new Error(
            response?.message || "Failed to calculate shipping."
          );
        }
        if (requestId !== shippingRequestIdRef.current) return;
        const normalized = normalizeShippingResponse(response);
        setShippingQuote({
          totalPoints: normalized.totalPoints,
          byMerchant: normalized.byMerchant,
          status: "ready",
          error: null,
        });
      } catch (error) {
        if (requestId !== shippingRequestIdRef.current) return;
        setShippingQuote({
          totalPoints: 0,
          byMerchant: {},
          status: "error",
          error:
            error?.data?.message ||
            error?.message ||
            "Failed to calculate shipping. Please try again.",
        });
      }
    },
    [calculateShipping, normalizeShippingResponse]
  );

  const retryCalculateShipping = useCallback(() => {
    if (lastShippingPayloadRef.current) {
      runShippingCalculation(lastShippingPayloadRef.current);
    }
  }, [runShippingCalculation]);

  const shippingCalculationPayload = useMemo(() => {
    if (!customerPostcode || !cartByMerchant.length) return null;
    const isSelectionComplete = cartByMerchant.every((group) => {
      const merchantId = getMerchantId(group);
      return merchantId && merchantShippingMethods[merchantId];
    });
    if (!isSelectionComplete) return null;

    const merchants = cartByMerchant.map((group) => {
      const merchantId = getMerchantId(group);
      return {
        merchant_id: merchantId,
        shipping_method_id: Number(merchantShippingMethods[merchantId]),
        items: (group.items || []).map((item) => ({
          product_id: item.product_id,
          product_variation_id:
            item.variation_id ?? item.product_variation_id ?? null,
          quantity: item.quantity,
        })),
      };
    });

    return {
      customer_postcode: customerPostcode,
      merchants,
    };
  }, [cartByMerchant, customerPostcode, merchantShippingMethods, getMerchantId]);

  useEffect(() => {
    if (!shippingCalculationPayload) {
      setShippingQuote((prev) =>
        prev.status === "idle" && !prev.error
          ? prev
          : { totalPoints: 0, byMerchant: {}, status: "idle", error: null }
      );
      return;
    }

    setShippingQuote((prev) =>
      prev.status === "calculating"
        ? prev
        : { totalPoints: 0, byMerchant: {}, status: "calculating", error: null }
    );

    const timeout = setTimeout(() => {
      runShippingCalculation(shippingCalculationPayload);
    }, 400);

    return () => clearTimeout(timeout);
  }, [shippingCalculationPayload, runShippingCalculation]);

  const isShippingSelectionComplete = cartByMerchant.every((group) => {
    const merchantId = getMerchantId(group);
    return merchantId && merchantShippingMethods[merchantId];
  });
  const needsShippingCalculation = allItems.length > 0;
  const isShippingQuoteReady = shippingQuote.status === "ready";
  const isShippingQuoteError = shippingQuote.status === "error";
  const isShippingCalculating =
    shippingQuote.status === "calculating" || isCalculatingShipping;
  const isShippingCalculationReady =
    isShippingQuoteReady && !isShippingCalculating;
  const isShippingCalculationBlocked =
    needsShippingCalculation &&
    (!customerPostcode || !isShippingSelectionComplete);

  const shippingPoints =
    needsShippingCalculation &&
    isShippingQuoteReady &&
    Number.isFinite(shippingQuote.totalPoints)
      ? shippingQuote.totalPoints
      : 0;

  // Calculations
  const subtotalPoints = Number(cartTotal) || 0;
  const availablePointsValue = Number(availablePoints) || 0;
  // const taxPoints = allItems.length > 0 ? 80 : 0; // Removed as per request
  // const platformFees = allItems.length > 0 ? 200 : 0; // Removed as per request

  const totalPoints = subtotalPoints + shippingPoints;
  const newAvailablePoints = availablePointsValue - totalPoints;
  const insufficientPoints = isShippingQuoteReady
    ? newAvailablePoints < 0
    : false;
  const totalPointsDisplay = isShippingQuoteReady
    ? totalPoints.toLocaleString()
    : "--";
  const newAvailablePointsDisplay = isShippingQuoteReady
    ? newAvailablePoints.toLocaleString()
    : "--";

  const onSubmit = async (formData) => {
    if (allItems.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    if (insufficientPoints) {
      toast.error("Insufficient points to complete this purchase");
      return;
    }
    if (isLoadingShippingMethods) {
      toast.error("Loading shipping methods. Please wait.");
      return;
    }
    if (isShippingMethodsUnavailable) {
      toast.error("Shipping methods are unavailable. Please try again later.");
      return;
    }
    if (!customerPostcode) {
      toast.error("Please enter a postcode to calculate shipping");
      return;
    }

    const missingShippingSelections = {};
    let hasInvalidMerchant = false;
    cartByMerchant.forEach((group) => {
      const merchantId = getMerchantId(group);
      if (!merchantId) {
        hasInvalidMerchant = true;
        return;
      }
      if (!merchantShippingMethods[merchantId]) {
        missingShippingSelections[merchantId] = true;
      }
    });
    if (hasInvalidMerchant) {
      toast.error(
        "Some cart items are missing merchant details. Please refresh and try again."
      );
      return;
    }
    if (Object.keys(missingShippingSelections).length > 0) {
      setMerchantShippingErrors(missingShippingSelections);
      toast.error("Please select a shipping method for each merchant");
      return;
    }

    if (isShippingCalculating) {
      toast.error("Calculating shipping. Please wait.");
      return;
    }
    if (isShippingQuoteError) {
      toast.error(
        shippingQuote.error || "Failed to calculate shipping. Try again."
      );
      return;
    }
    if (needsShippingCalculation && !isShippingCalculationReady) {
      toast.error("Shipping calculation is not ready yet.");
      return;
    }

    try {
      const payload = {
        customer_info: {
          full_name: formData.customer_full_name,
          email: formData.customer_email,
          phone: formData.customer_phone,
          address: formData.customer_address,
          postcode: customerPostcode || formData.customer_postcode,
          city: formData.customer_city,
          state: formData.customer_state,
          country: formData.customer_country,
        },
        merchants: cartByMerchant.map((group) => {
          const merchantId = getMerchantId(group);
          return {
            merchant_id: merchantId,
            shipping_method_id: Number(merchantShippingMethods[merchantId]),
            items: (group.items || []).map((item) => ({
              product_id: item.product_id,
              product_variation_id:
                item.variation_id ?? item.product_variation_id ?? null,
              quantity: item.quantity,
              points: item.price,
              name: item.product_name || "Product",
              sku: item.variation_details?.sku || null,
            })),
          };
        }),
      };

      const orderResponse = await createOrders(payload).unwrap();
      if (orderResponse?.success === false) {
        throw new Error(
          orderResponse?.message || "Failed to place order. Please try again."
        );
      }

      toast.success("Order placed successfully!");
      // Assuming backend clears cart after purchase or we do it here.
      // Safe to call clearCart typically if backend doesn't auto-clear or as a safeguard.
      await clearCart().unwrap();
      navigate("/member/max-redeem-mall");
    } catch (error) {
      console.error("Order creation failed", error);
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Failed to place order"
      );
    }
  };

  const [deleteItem, setDeleteItem] = useState(null);
  const [isClearCartOpen, setIsClearCartOpen] = useState(false);

  const handleClearCart = () => {
    setIsClearCartOpen(true);
  };

  const confirmClearCart = async () => {
    try {
      await clearCart().unwrap();
      toast.success("Cart cleared successfully");
      setIsClearCartOpen(false);
    } catch {
      toast.error("Failed to clear cart");
    }
  };

  const handleRemove = (id) => {
    setDeleteItem(id);
  };

  const confirmRemoveItem = async () => {
    if (deleteItem) {
      try {
        await removeFromCart(deleteItem).unwrap();
        toast.success("Item removed");
        setDeleteItem(null);
      } catch {
        toast.error("Failed to remove item");
      }
    }
  };

  const handleUpdateQty = async (item, newQty) => {
    if (newQty < 1) return;
    try {
      await updateCartItem({ id: item.id, quantity: newQty }).unwrap();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update quantity");
    }
  };

  if (isLoadingCart) {
    return (
      <div className="p-12 text-center text-gray-500">Loading cart...</div>
    );
  }

  return (
    <div className="pb-12 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Max Redeem Mall Cart
        </h1>
        <Link
          to="/member/max-redeem-mall"
          className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
        >
          <ArrowLeft size={16} /> Continue Shopping
        </Link>
      </div>

      {allItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mb-6">
            Looks like you haven't added any items yet.
          </p>
          <Link
            to="/member/max-redeem-mall"
            className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <div>Total {allItems.length} Items</div>

                <div className="">
                  {allItems.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearCart}
                      className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Clear Cart
                    </button>
                  )}
                </div>
              </div>
              {/* Dynamic Merchant Groups */}
              {cartByMerchant.map((group) => {
                const merchantId = getMerchantId(group);
                const selectedMethodId =
                  merchantShippingMethods[merchantId] || "";
                const selectedMethod = shippingMethods.find(
                  (method) => String(method?.id) === String(selectedMethodId)
                );
                const merchantShippingPoints =
                  shippingQuote.byMerchant?.[merchantId];
                const showMerchantError = merchantShippingErrors[merchantId];

                return (
                  <div
                    key={merchantId}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    {/* Merchant Header */}
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                      <Link
                        to={`/member/max-redeem-mall?merchant_id=${merchantId}`}
                        className="flex items-center gap-3 group hover:opacity-80 transition-opacity"
                      >
                        <div className="w-8 h-8 rounded-full bg-white border border-gray-200 overflow-hidden flex-shrink-0">
                          <img
                            src={
                              group.merchant.merchant_logo ||
                              "https://placehold.co/100x100?text=Logo"
                            }
                            alt={group.merchant.merchant_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-bold text-gray-900 group-hover:text-brand-600 transition-colors flex items-center gap-1">
                          {group.merchant.merchant_name}
                          <ChevronRight
                            size={16}
                            className="text-gray-400 group-hover:text-brand-600"
                          />
                        </span>
                      </Link>
                      <div className="text-sm text-gray-500">
                        {group.item_count} items
                      </div>
                    </div>

                    <div className="px-6 py-4 border-b border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                        <div>
                          <Label htmlFor={`shipping_method_${merchantId}`}>
                            Shipping Method
                          </Label>
                          <Select
                            id={`shipping_method_${merchantId}`}
                            placeholder={
                              isLoadingShippingMethods
                                ? "Loading shipping methods..."
                                : "Select shipping method"
                            }
                            options={shippingMethodOptions}
                            value={selectedMethodId}
                            onChange={(event) =>
                              handleMerchantShippingChange(
                                merchantId,
                                event.target.value
                              )
                            }
                            disabled={
                              isLoadingShippingMethods ||
                              shippingMethodOptions.length === 0
                            }
                            error={!!showMerchantError}
                          />
                          {showMerchantError ? (
                            <p className="mt-1.5 text-xs text-error-500">
                              Shipping method is required.
                            </p>
                          ) : null}
                          {showShippingMethodsError ? (
                            <div className="mt-1.5 flex items-center gap-2 text-xs text-error-500">
                              <span>
                                Failed to load shipping methods.
                              </span>
                              <button
                                type="button"
                                onClick={refetchShippingMethods}
                                className="underline underline-offset-2"
                              >
                                Retry
                              </button>
                            </div>
                          ) : null}
                          {isShippingMethodsEmpty && !showShippingMethodsError ? (
                            <p className="mt-1.5 text-xs text-gray-500">
                              No active shipping methods available.
                            </p>
                          ) : null}
                        </div>
                        <div className="text-xs text-gray-500 space-y-1">
                          {selectedMethod?.min_days !== null &&
                          selectedMethod?.min_days !== undefined &&
                          selectedMethod?.max_days !== null &&
                          selectedMethod?.max_days !== undefined ? (
                            <p>
                              Estimated delivery: {selectedMethod.min_days}-
                              {selectedMethod.max_days} days
                            </p>
                          ) : null}
                          {selectedMethod?.description ? (
                            <p>{selectedMethod.description}</p>
                          ) : null}
                          {isShippingQuoteReady &&
                          Number.isFinite(merchantShippingPoints) ? (
                            <p>
                              Shipping points:{" "}
                              {Number(merchantShippingPoints).toLocaleString()}
                            </p>
                          ) : null}
                          {!selectedMethod ? (
                            <p>
                              Select a shipping method to calculate shipping.
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="p-6 space-y-6">
                      {(group.items || []).map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b last:border-0 last:pb-0"
                        >
                          {/* Image */}
                          <div className="w-24 h-24 rounded-xl bg-gray-50 border border-gray-100 flex-shrink-0 overflow-hidden">
                            <img
                              src={
                                item.variation_details?.image?.url ||
                                "https://placehold.co/100x100?text=Product"
                              }
                              alt={item.product_name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Details */}
                          <div className="flex-1 text-center sm:text-left">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                              {item.product_name}
                            </h3>
                            {/* Variation / Attributes */}
                            {item.variation_details?.attributes && (
                              <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                                {item.variation_details.attributes.map(
                                  (attr, i) => (
                                    <span
                                      key={i}
                                      className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 border border-gray-200"
                                    >
                                      <span className="font-medium">
                                        {attr.attribute_name}:
                                      </span>{" "}
                                      {attr.attribute_item_name}
                                    </span>
                                  ),
                                )}
                              </div>
                            )}
                          </div>

                          {/* Quantity */}
                          <div className="flex items-center gap-3">
                            <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateQty(item, item.quantity - 1)
                                }
                                className="p-2 hover:bg-gray-200 rounded-l-lg text-gray-600 transition-colors"
                                disabled={item.quantity <= 1}
                              >
                                <Minus size={14} />
                              </button>
                              <span className="font-bold text-gray-900 w-8 text-center bg-white h-full py-1.5 border-x border-gray-200">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateQty(item, item.quantity + 1)
                                }
                                className="p-2 hover:bg-gray-200 rounded-r-lg text-gray-600 transition-colors"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>

                          {/* Points */}
                          <div className="w-24 text-center sm:text-right">
                            <div className="text-lg font-bold text-gray-900">
                              {(item.price * item.quantity).toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {item.price} pts/each
                            </div>
                          </div>

                          {/* Remove */}
                          <button
                            type="button"
                            onClick={() => handleRemove(item.id)}
                            className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Shipping Form Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Shipping and Billing Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="customer_full_name">Full Name</Label>
                    <Input
                      id="customer_full_name"
                      {...register("customer_full_name")}
                      error={!!errors.customer_full_name}
                      hint={errors.customer_full_name?.message}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer_email">Email</Label>
                    <Input
                      id="customer_email"
                      {...register("customer_email")}
                      error={!!errors.customer_email}
                      hint={errors.customer_email?.message}
                      placeholder="Enter email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer_phone">Phone</Label>
                    <Input
                      id="customer_phone"
                      {...register("customer_phone")}
                      error={!!errors.customer_phone}
                      hint={errors.customer_phone?.message}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="customer_address">Address</Label>
                    <Input
                      id="customer_address"
                      {...register("customer_address")}
                      error={!!errors.customer_address}
                      hint={errors.customer_address?.message}
                      placeholder="Enter full address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer_city">City</Label>
                    <Input
                      id="customer_city"
                      {...register("customer_city")}
                      error={!!errors.customer_city}
                      hint={errors.customer_city?.message}
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer_postcode">Postcode</Label>
                    <Input
                      id="customer_postcode"
                      {...register("customer_postcode")}
                      error={!!errors.customer_postcode}
                      hint={errors.customer_postcode?.message}
                      placeholder="Postcode"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer_state">State</Label>
                    <Input
                      id="customer_state"
                      {...register("customer_state")}
                      error={!!errors.customer_state}
                      hint={errors.customer_state?.message}
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer_country">Country</Label>
                    <Input
                      id="customer_country"
                      {...register("customer_country")}
                      error={!!errors.customer_country}
                      hint={errors.customer_country?.message}
                      placeholder="Country"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[#4F46E5] rounded-3xl p-6 text-white sticky top-24 shadow-xl">
                <h3 className="text-xl font-bold mb-6 border-b border-white/20 pb-4">
                  Order Summary
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-white/80">
                    <span>Subtotal (In Points)</span>
                    <span className="font-semibold">
                      {subtotalPoints.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-white/80">
                    <span>Shipping (In Points)</span>
                    <span className="font-semibold">
                      {isShippingCalculating
                        ? "Calculating..."
                        : isShippingQuoteReady
                        ? shippingPoints.toLocaleString()
                        : "--"}
                    </span>
                  </div>
                  {isShippingCalculationBlocked && (
                    <p className="text-[11px] text-white/70">
                      Select shipping methods and enter a postcode to calculate
                      shipping.
                    </p>
                  )}
                  {isShippingCalculating && (
                    <p className="text-[11px] text-white/70">
                      Calculating shipping based on your selections...
                    </p>
                  )}
                  {isShippingQuoteError && (
                    <div className="text-[11px] text-red-200 flex items-center gap-2">
                      <span>
                        {shippingQuote.error ||
                          "Failed to calculate shipping."}
                      </span>
                      <button
                        type="button"
                        onClick={retryCalculateShipping}
                        className="underline underline-offset-2"
                      >
                        Retry
                      </button>
                    </div>
                  )}
                </div>

                <div className="border-t border-white/20 pt-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Total (In Points)</span>
                    <span className="text-xl font-bold">
                      {totalPointsDisplay}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-white/90 text-sm">
                    <span>Available Points</span>
                    <span>{availablePointsValue.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-white/90">
                      New Available Points
                    </span>
                    <span
                      className={`text-lg font-bold ${
                        insufficientPoints ? "text-red-300" : "text-white"
                      }`}
                    >
                      {newAvailablePointsDisplay}
                    </span>
                  </div>
                  {insufficientPoints && (
                    <p className="text-xs text-red-300 mt-1">
                      Insufficient points balance
                    </p>
                  )}
                  <p className="text-[10px] text-white/60 mt-0.5">
                    After Purchase
                  </p>
                </div>

                <PrimaryButton
                  type="submit"
                  disabled={
                    isPurchasing ||
                    insufficientPoints ||
                    isLoadingCart ||
                    isLoadingShippingMethods ||
                    isShippingMethodsUnavailable ||
                    isShippingCalculating ||
                    isShippingCalculationBlocked ||
                    isShippingQuoteError ||
                    (needsShippingCalculation && !isShippingCalculationReady)
                  }
                  className="w-full bg-[#FA5D29] hover:bg-[#E54818] text-white border-0 font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-between px-6"
                >
                  <span className="text-lg">
                    {totalPointsDisplay}
                  </span>
                  <span className="flex items-center gap-2">
                    Confirm Order <ArrowLeft className="rotate-180" size={20} />
                  </span>
                </PrimaryButton>
              </div>
            </div>
          </form>
        </FormProvider>
      )}

      {/* Clear Cart Modal */}
      <Dialog open={isClearCartOpen} onOpenChange={setIsClearCartOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear Cart</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove all items from your cart? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsClearCartOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmClearCart}>
              Clear Cart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Item Modal */}
      <Dialog
        open={!!deleteItem}
        onOpenChange={(open) => !open && setDeleteItem(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this item from your cart?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteItem(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmRemoveItem}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CartPage;
