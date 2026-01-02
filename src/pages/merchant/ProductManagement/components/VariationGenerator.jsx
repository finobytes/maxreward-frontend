import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import MultiSelect from "react-select";
import PrimaryButton from "../../../../components/ui/PrimaryButton";
import Label from "../../../../components/form/Label";
import Select from "@/components/form/Select";
import { useGenerateVariationsMutation } from "../../../../redux/features/merchant/product/productApi";
import { generateEAN13 } from "../../../../utils/eanGenerator";

const VariationGenerator = ({
  attributes = [],
  attributeItems = [],
  productId,
  replaceVariations,
  initialSelectedAttributes = [],
}) => {
  const { getValues } = useFormContext();
  const [initialAttributes, setInitialAttributes] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [initializedProductId, setInitializedProductId] = useState(null);

  const [generateVariations, { isLoading: isGenerating }] =
    useGenerateVariationsMutation();

  useEffect(() => {
    // Initialize or re-initialize when initialSelectedAttributes populate
    // and we haven't initialized for this specific productId yet.
    if (
      initialSelectedAttributes.length > 0 &&
      initializedProductId !== productId
    ) {
      setSelectedAttributes(initialSelectedAttributes);
      setInitialAttributes(initialSelectedAttributes);
      setInitializedProductId(productId);
    }
  }, [initialSelectedAttributes, productId, initializedProductId]);

  const isProtectedAttribute = (attr) => {
    // Check if the attribute was present initially (by matching ID)
    return initialAttributes.some(
      (ia) => String(ia.attribute_id) === String(attr.attribute_id)
    );
  };

  const getProtectedItemIds = (attrId) => {
    const found = initialAttributes.find(
      (ia) => String(ia.attribute_id) === String(attrId)
    );
    return found ? found.attribute_item_ids : [];
  };

  const getItemsForAttribute = (attrId) => {
    return attributeItems.filter((item) => item.attribute_id == attrId);
  };

  const handleAddAttributeSelection = () => {
    setSelectedAttributes([
      ...selectedAttributes,
      { attribute_id: "", attribute_item_ids: [] },
    ]);
  };

  const handleRemoveAttributeSelection = (index) => {
    const newAttrs = [...selectedAttributes];
    newAttrs.splice(index, 1);
    setSelectedAttributes(newAttrs);
  };

  const updateAttributeSelection = (index, field, value) => {
    const newAttrs = [...selectedAttributes];
    newAttrs[index][field] = value;
    setSelectedAttributes(newAttrs);
  };

  const handleGenerateVariations = async () => {
    const skuShortCode = getValues("sku_short_code");
    if (!skuShortCode) {
      toast.error("Please enter SKU Short Code first");
      return;
    }
    if (selectedAttributes.length === 0) {
      toast.error("Please select attributes first");
      return;
    }

    const formatAttrs = selectedAttributes.map((a) => ({
      attribute_id: a.attribute_id,
      attribute_item_ids: a.attribute_item_ids,
    }));

    try {
      const result = await generateVariations({
        sku_short_code: skuShortCode,
        attributes: formatAttrs,
        product_id: productId,
      }).unwrap();

      if (result.success) {
        // Read root values for auto-fill
        const rootValues = getValues();

        const newVariations = result.data.variations.map((v) => ({
          sku: v.sku,
          attributes: v.attributes,
          formatted_attributes: v.formatted_attributes,

          // Auto-fill from root values
          regular_price: rootValues.regular_price || "",
          regular_point: rootValues.regular_point || "",
          sale_price: rootValues.sale_price || "",
          sale_point: rootValues.sale_point || "",
          cost_price: rootValues.cost_price || "",
          unit_weight: rootValues.unit_weight || "",
          actual_quantity: "", // Quantity is usually unique per variation, keeping blank or 0

          low_stock_threshold: "",
          ean_no: generateEAN13(),
          images: [],
        }));

        replaceVariations(newVariations);
        toast.success(`Generated ${newVariations.length} variations`);

        if (result.data.has_conflicts) {
          toast.warning("Some generated SKUs already exist!");
        }
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to generate variations");
    }
  };

  return (
    <div className="bg-gray-50 border rounded-xl overflow-hidden">
      <div className="p-4 border-b bg-gray-100/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="font-semibold text-gray-800">Variation Generator</h4>
          <p className="text-xs text-gray-500 mt-1">
            Select attributes to automatically generate combinations.
          </p>
        </div>
        <div className="flex gap-2">
          <PrimaryButton
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddAttributeSelection}
          >
            + Add Attribute
          </PrimaryButton>
          <PrimaryButton
            type="button"
            size="sm"
            onClick={handleGenerateVariations}
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate Combinations"}
          </PrimaryButton>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {selectedAttributes.length === 0 ? (
          <div className="text-center py-6 text-gray-400 text-sm">
            Click "Add Attribute" to start generating variations.
          </div>
        ) : (
          selectedAttributes.map((attr, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row gap-4 items-start md:items-end p-3 bg-white border rounded-lg shadow-sm"
            >
              <div className="w-full md:w-1/4">
                <Label className="mb-1 text-xs uppercase tracking-wide text-gray-500">
                  Attribute Type
                </Label>
                <Select
                  value={attr.attribute_id}
                  disabled={isProtectedAttribute(attr)}
                  onChange={(e) =>
                    updateAttributeSelection(
                      index,
                      "attribute_id",
                      e.target.value
                    )
                  }
                  options={attributes
                    .filter(
                      (a) =>
                        !selectedAttributes.some(
                          (sa) =>
                            String(sa.attribute_id) === String(a.id) &&
                            String(sa.attribute_id) !==
                              String(attr.attribute_id)
                        )
                    )
                    .map((a) => ({
                      value: a.id,
                      label: a.name,
                    }))}
                  placeholder="Select Attribute"
                />
              </div>
              <div className="w-full md:flex-1">
                <Label className="mb-1 text-xs uppercase tracking-wide text-gray-500">
                  Attribute Values
                </Label>
                <MultiSelect
                  isMulti
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  styles={{
                    menuPortal: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                    multiValueRemove: (base, state) => {
                      return state.data.isFixed
                        ? { ...base, display: "none" }
                        : base;
                    },
                  }}
                  options={getItemsForAttribute(attr.attribute_id).map((i) => ({
                    value: i.id,
                    label: i.name,
                  }))}
                  value={getItemsForAttribute(attr.attribute_id)
                    .filter((i) => attr.attribute_item_ids.includes(i.id))
                    .map((i) => {
                      const protectedIds = getProtectedItemIds(
                        attr.attribute_id
                      );
                      const isFixed = protectedIds.some(
                        (pid) => String(pid) === String(i.id)
                      );
                      return { value: i.id, label: i.name, isFixed };
                    })}
                  onChange={(selected) => {
                    const newSelectedIds = selected
                      ? selected.map((s) => s.value)
                      : [];
                    const protectedIds = getProtectedItemIds(attr.attribute_id);

                    const mergedIds = [
                      ...new Set([...newSelectedIds, ...protectedIds]),
                    ];

                    updateAttributeSelection(
                      index,
                      "attribute_item_ids",
                      mergedIds
                    );
                  }}
                  placeholder="Select Values"
                  isDisabled={!attr.attribute_id}
                  className="text-sm"
                />
              </div>
              <button
                type="button"
                disabled={isProtectedAttribute(attr)}
                onClick={() => handleRemoveAttributeSelection(index)}
                className={`p-2 rounded transition-colors ${
                  isProtectedAttribute(attr)
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-red-500 hover:text-red-700 hover:bg-red-50"
                }`}
                title={
                  isProtectedAttribute(attr)
                    ? "Existing attributes cannot be removed"
                    : "Remove Attribute"
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VariationGenerator;
