import PageBreadcrumb from "@/components/common/PageBreadcrumb";

const MerchantTransactionDetails = () => {
  return (
    <div>
      <PageBreadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Merchant Transaction ", to: "/admin/merchant-transaction" },
          { label: "Merchant Transaction Details" },
        ]}
      />
    </div>
  );
};

export default MerchantTransactionDetails;
