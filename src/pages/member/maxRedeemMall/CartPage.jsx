import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
  usePurchaseProductMutation,
} from "../../../redux/features/member/maxRedeemMall/maxRedeemApi";
import { useVerifyMeQuery } from "../../../redux/features/auth/authApi";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import PrimaryButton from "../../../components/ui/PrimaryButton";

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
  const [purchaseProduct, { isLoading: isPurchasing }] =
    usePurchaseProductMutation();

  const items = cartData?.cart_items || [];
  const cartTotal = cartData?.total_amount || 0;

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
    formState: { errors },
  } = methods;

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
        customer_country: member.country_code || "60",
      });
    }
  }, [profileData, reset]);

  // Calculations
  // API returns total_amount. Assuming it includes item prices.
  // We add shipping/tax/platform on top? Or backend handles it?
  // Current requirement implies frontend addition based on previous code.
  // Using cartTotal from API as "Subtotal".

  const subtotalPoints = cartTotal;
  const shippingPoints = items.length > 0 ? 120 : 0;
  const taxPoints = items.length > 0 ? 80 : 0;
  const platformFees = items.length > 0 ? 200 : 0;

  const totalPoints =
    subtotalPoints + shippingPoints + taxPoints + platformFees;
  const newAvailablePoints = availablePoints - totalPoints;

  const insufficientPoints = newAvailablePoints < 0;

  const onSubmit = async (formData) => {
    if (items.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    if (insufficientPoints) {
      toast.error("Insufficient points to complete this purchase");
      return;
    }

    try {
      const payload = {
        member_id: profileData?.id || profileData?.data?.id,
        ...formData,
        // If API expects items for purchase validation, we send them.
        // Or if 'purchaseProduct' triggers checkout from backend cart, we might just need address.
        // Sticking to previous payload structure but using API items structure if needed.
        items: items.map((item) => ({
          product_id: item.product_id,
          product_variation_id: item.variation_id,
          quantity: item.quantity,
          points: item.price, // API returns 'price', mapping to points
        })),
        total_points: totalPoints,
      };

      await purchaseProduct(payload).unwrap();

      toast.success("Order placed successfully!");
      await clearCart().unwrap(); // API clear
      navigate("/member/max-redeem-mall");
    } catch (error) {
      console.error("Purchase failed", error);
      toast.error(error?.data?.message || "Failed to place order");
    }
  };

  const handleRemove = async (id) => {
    if (confirm("Remove this item from cart?")) {
      try {
        await removeFromCart(id).unwrap();
        toast.success("Item removed");
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

      {items.length === 0 ? (
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
              {/* Cart Items List */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 space-y-6">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b last:border-0 last:pb-0"
                    >
                      {/* Image */}
                      <div className="w-24 h-24 rounded-xl bg-gray-50 border border-gray-100 flex-shrink-0 overflow-hidden">
                        <img
                          src={
                            item.product_image?.url ||
                            "https://placehold.co/100x100?text=Product"
                          }
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 text-center sm:text-left">
                        {item.brand && (
                          <div className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full w-fit mb-1 mx-auto sm:mx-0">
                            92% Off
                          </div>
                        )}
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
                                  className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600"
                                >
                                  {attr.attribute_name}: {attr.item_name}
                                </span>
                              )
                            )}
                          </div>
                        )}
                      </div>

                      {/* Quantity */}
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-xl text-gray-900">
                          {item.quantity}
                        </span>
                        <div className="flex flex-col gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateQty(item, item.quantity + 1)
                            }
                            className="p-1 hover:bg-gray-100 rounded text-gray-600"
                          >
                            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[6px] border-b-gray-600" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateQty(item, item.quantity - 1)
                            }
                            className="p-1 hover:bg-gray-100 rounded text-gray-600"
                          >
                            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-gray-600" />
                          </button>
                        </div>
                      </div>

                      {/* Points */}
                      <div className="w-24 text-center sm:text-right">
                        <div className="text-xl font-bold text-gray-900">
                          {(item.price * item.quantity).toLocaleString()}
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

              {/* Shipping Form Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Shipping Information
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
              <div className="bg-[#4F46E5] rounded-3xl p-6 text-white sticky top-12 shadow-xl">
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
                    <span className="font-semibold">{shippingPoints}</span>
                  </div>
                  <div className="flex justify-between items-center text-white/80">
                    <span>Tax (In Points)</span>
                    <span className="font-semibold">{taxPoints}</span>
                  </div>
                  <div className="flex justify-between items-center text-white/80">
                    <span>Platform Fees (In Points)</span>
                    <span className="font-semibold">{platformFees}</span>
                  </div>
                </div>

                <div className="border-t border-white/20 pt-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Total (In Points)</span>
                    <span className="text-xl font-bold">
                      {totalPoints.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-white/90 text-sm">
                    <span>Available Points</span>
                    <span>{Number(availablePoints).toLocaleString()}</span>
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
                      {newAvailablePoints.toLocaleString()}
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
                  disabled={isPurchasing || insufficientPoints || isLoadingCart}
                  className="w-full bg-[#FA5D29] hover:bg-[#E54818] text-white border-0 font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-between px-6"
                >
                  <span className="text-lg">
                    {totalPoints.toLocaleString()}
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
    </div>
  );
};

export default CartPage;
