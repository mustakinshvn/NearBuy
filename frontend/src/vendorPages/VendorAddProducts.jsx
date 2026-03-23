import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVendorAuthContext } from "../hooks/useVendorAuthContext";
import { useToast } from "../hooks/useToast";
import { productAPI } from "../services/api";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormAlert,
  FormSection,
  CheckboxField,
  TextAreaField,
  TextField,
} from "../component/form/FormField";
import { vendorAddProductSchema } from "../lib/validation/schemas";

const VendorAddProducts = () => {
  const navigate = useNavigate();
  const { vendor } = useVendorAuthContext();
  const { success, error: showError } = useToast();

  const defaultValues = useMemo(
    () => ({
      title: "",
      description: "",
      brand: "",
      model_number: "",
      category_id: "",
      subcategory_id: "",
      price: "",
      discount_price: "",
      currency: "BDT",
      stock_quantity: "0",
      is_available: true,
      main_image_url: "",
      image_urls: "",
      weight: "",
      dimensions: "",
      color: "",
      material: "",
      keywords: "",
      variants: [],
    }),
    [],
  );

  const methods = useForm({
    defaultValues,
    resolver: zodResolver(vendorAddProductSchema),
    mode: "onSubmit",
  });

  const {
    control,
    reset,
    formState: { isSubmitting },
    getValues,
  } = methods;

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "variants",
  });

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const handleReset = () => {
    reset(defaultValues);
    replace([]);
    success("Cancelled: Product form reset");

    setFormError("");
  };

  const handleAddVariant = () => {
    append({
      sku: "",
      variant_name: "",
      color: "",
      size: "",
      material: "",
      price: "",
      discount_price: "",
      stock_quantity: "0",
      is_available: true,
      image_url: "",
      weight: "",
      dimensions: "",
    });
  };

  const handleRemoveVariant = (index) => {
    remove(index);
  };

  const getFirstErrorMessage = (errors) => {
    if (!errors || typeof errors !== "object") return "";
    for (const value of Object.values(errors)) {
      if (!value) continue;
      if (typeof value.message === "string" && value.message)
        return value.message;
      if (value?.root && typeof value.root.message === "string") {
        return value.root.message;
      }
      const nested = getFirstErrorMessage(value);
      if (nested) return nested;
    }
    return "";
  };

  const onSubmit = methods.handleSubmit(
    async (values) => {
      setFormError("");

      if (!vendor || !vendor.vendor_id) {
        setFormError("Vendor information is missing. Please log in again.");
        return;
      }

      const toTrimmedOrNull = (v) => {
        const s = (v ?? "").toString().trim();
        return s ? s : null;
      };

      const toIntOrNull = (v) => {
        if (v === undefined || v === null || v === "") return null;
        const n = parseInt(v, 10);
        return Number.isNaN(n) ? null : n;
      };

      const toFloatOrNull = (v) => {
        if (v === undefined || v === null || v === "") return null;
        const n = parseFloat(v);
        return Number.isNaN(n) ? null : n;
      };

      const toIntOrZero = (v) => {
        const n = toIntOrNull(v);
        return n === null ? 0 : n;
      };

      const payload = {
        title: (values.title ?? "").toString().trim(),
        description: toTrimmedOrNull(values.description),
        brand: toTrimmedOrNull(values.brand),
        model_number: toTrimmedOrNull(values.model_number),
        category_id: toIntOrNull(values.category_id),
        subcategory_id: toIntOrNull(values.subcategory_id),
        price: toFloatOrNull(values.price),
        discount_price: toFloatOrNull(values.discount_price),
        currency: "BDT",
        stock_quantity: toIntOrZero(values.stock_quantity),
        is_available: !!values.is_available,
        main_image_url: toTrimmedOrNull(values.main_image_url),
        image_urls: values.image_urls
          ? values.image_urls
              .split(",")
              .map((url) => url.trim())
              .filter(Boolean)
          : null,
        weight: toFloatOrNull(values.weight),
        dimensions: toTrimmedOrNull(values.dimensions),
        color: toTrimmedOrNull(values.color),
        material: toTrimmedOrNull(values.material),
        seller_id: vendor.vendor_id,
        keywords: values.keywords
          ? values.keywords
              .split(",")
              .map((k) => k.trim())
              .filter(Boolean)
          : null,
      };

      const sourceVariants = values.variants ?? getValues("variants") ?? [];

      const normalizedVariants = sourceVariants
        .map((v) => ({
          sku: toTrimmedOrNull(v.sku),
          variant_name: toTrimmedOrNull(v.variant_name),
          color: toTrimmedOrNull(v.color),
          size: toTrimmedOrNull(v.size),
          material: toTrimmedOrNull(v.material),
          price: toFloatOrNull(v.price),
          discount_price: toFloatOrNull(v.discount_price),
          stock_quantity: toIntOrZero(v.stock_quantity),
          is_available: v.is_available ?? true,
          image_url: toTrimmedOrNull(v.image_url),
          weight: toFloatOrNull(v.weight),
          dimensions: toTrimmedOrNull(v.dimensions),
        }))
        .filter(
          (v) =>
            v.sku ||
            v.variant_name ||
            v.color ||
            v.size ||
            v.material ||
            v.price !== null ||
            v.discount_price !== null,
        );

      if (normalizedVariants.length > 0) {
        payload.variants = normalizedVariants;
      }

      try {
        setSubmitting(true);
        await productAPI.create(payload);
        success("Product created successfully");
        navigate("/vendor-dashboard");
      } catch (err) {
        console.error("Error creating product", err);
        showError(err.message || "Failed to create product");
      } finally {
        setSubmitting(false);
      }
    },
    (errors) => {
      const msg =
        getFirstErrorMessage(errors) || "Please fix the highlighted fields.";
      setFormError(msg);
    },
  );

  return (
    <div className="bg-slate-50 py-8 w-full  ">
      <div className="mx-auto w-full  px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl  border border-slate-200 bg-white shadow-sm">
          <div className="border-b  border-slate-200 px-4 py-5 sm:px-6 text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Add New Product
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Fill in the details below to add a new product to your shop.
            </p>
          </div>

          <div className="px-4 py-6 sm:px-6">
            {formError ? (
              <FormAlert className="mb-5">{formError}</FormAlert>
            ) : null}

            <FormProvider {...methods}>
              <form onSubmit={onSubmit} className="space-y-6">
                <FormSection title="Basic Information">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <TextField
                      label="Title"
                      required
                      name="title"
                      placeholder="e.g. iPhone 15 Pro Max"
                    />

                    <TextField
                      label="Brand"
                      name="brand"
                      placeholder="e.g. Apple"
                    />

                    <TextField
                      label="Model Number"
                      name="model_number"
                      placeholder="e.g. A3108"
                    />

                    <TextField
                      label="Main Image URL"
                      type="url"
                      name="main_image_url"
                      placeholder="https://..."
                    />

                    <TextAreaField
                      className="sm:col-span-2"
                      label="Description"
                      name="description"
                      placeholder="Write a detailed description of the product..."
                      rows={4}
                    />
                  </div>
                </FormSection>

                <FormSection
                  title="Category & Classification"
                  description="Use IDs based on your category table (if available)."
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <TextField
                      label="Category ID"
                      type="number"
                      name="category_id"
                      placeholder="e.g. 1"
                    />
                    <TextField
                      label="Subcategory ID"
                      type="number"
                      name="subcategory_id"
                      placeholder="e.g. 10"
                    />
                    <TextField
                      label="Keywords"
                      name="keywords"
                      placeholder="phone, smartphone, flagship"
                      hint="Comma separated"
                    />
                  </div>
                </FormSection>

                <FormSection title="Pricing">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <TextField
                      label="Price"
                      required
                      type="number"
                      step="0.01"
                      name="price"
                      placeholder="e.g. 99999.99"
                    />
                    <TextField
                      label="Discount Price"
                      type="number"
                      step="0.01"
                      name="discount_price"
                      placeholder="e.g. 89999.99"
                    />
                    <TextField
                      label="Currency"
                      name="currency"
                      disabled={true}
                    />
                    <TextField
                      label="Stock Quantity"
                      type="number"
                      name="stock_quantity"
                      min="0"
                    />
                  </div>
                </FormSection>

                <FormSection title="Inventory & Images">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <CheckboxField
                      name="is_available"
                      label="Available for sale"
                      className="sm:pt-7"
                    />
                    <TextField
                      label="Additional Image URLs"
                      name="image_urls"
                      placeholder="https://..., https://..."
                      hint="Comma separated"
                    />
                  </div>
                </FormSection>

                <FormSection title="Product Details">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <TextField
                      label="Weight (kg)"
                      type="number"
                      step="0.01"
                      name="weight"
                      placeholder="e.g. 0.50"
                    />
                    <TextField
                      label="Dimensions"
                      name="dimensions"
                      placeholder="e.g. 10 x 5 x 1 cm"
                    />
                    <TextField
                      label="Color"
                      name="color"
                      placeholder="e.g. Black"
                    />
                    <TextField
                      label="Material"
                      name="material"
                      placeholder="e.g. Aluminum"
                    />
                  </div>
                </FormSection>

                <FormSection
                  title="Variants (Optional)"
                  description='Use variants for different colors, sizes, or configurations (e.g. "Red / M", "Black / L"). If no variants are added, the base product settings will be used.'
                >
                  {fields.length === 0 ? (
                    <button
                      type="button"
                      onClick={handleAddVariant}
                      className="inline-flex items-center justify-center rounded-md border border-dashed border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                      disabled={submitting || isSubmitting}
                    >
                      + Add first variant
                    </button>
                  ) : null}

                  <div className="mt-4 space-y-4">
                    {fields.map((variantField, index) => (
                      <div
                        key={variantField.id}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <h3 className="text-sm font-semibold text-slate-900">
                            Variant {index + 1}
                          </h3>
                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(index)}
                            className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-60"
                            disabled={submitting || isSubmitting}
                          >
                            Remove
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          <TextField
                            size="sm"
                            label="Variant Name"
                            id={`variant-${index}-variant_name`}
                            name={`variants.${index}.variant_name`}
                            placeholder="e.g. Red / M"
                          />
                          <TextField
                            size="sm"
                            label="SKU"
                            id={`variant-${index}-sku`}
                            name={`variants.${index}.sku`}
                            placeholder="e.g. TS-RED-M"
                          />
                          <TextField
                            size="sm"
                            label="Image URL"
                            id={`variant-${index}-image_url`}
                            name={`variants.${index}.image_url`}
                            type="url"
                            placeholder="https://..."
                          />
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                          <TextField
                            size="sm"
                            label="Color"
                            id={`variant-${index}-color`}
                            name={`variants.${index}.color`}
                            placeholder="e.g. Red"
                          />
                          <TextField
                            size="sm"
                            label="Size"
                            id={`variant-${index}-size`}
                            name={`variants.${index}.size`}
                            placeholder="e.g. M"
                          />
                          <TextField
                            size="sm"
                            label="Material"
                            id={`variant-${index}-material`}
                            name={`variants.${index}.material`}
                            placeholder="e.g. Cotton"
                          />

                          <div className="sm:pt-6">
                            <CheckboxField
                              id={`variant-available-${index}`}
                              name={`variants.${index}.is_available`}
                              label="Available"
                            />
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                          <TextField
                            size="sm"
                            label="Variant Price"
                            id={`variant-${index}-price`}
                            name={`variants.${index}.price`}
                            type="number"
                            step="0.01"
                            placeholder="Override base price"
                          />
                          <TextField
                            size="sm"
                            label="Variant Discount"
                            id={`variant-${index}-discount_price`}
                            name={`variants.${index}.discount_price`}
                            type="number"
                            step="0.01"
                            placeholder="Override discount"
                          />
                          <TextField
                            size="sm"
                            label="Variant Stock"
                            id={`variant-${index}-stock_quantity`}
                            name={`variants.${index}.stock_quantity`}
                            type="number"
                            min="0"
                            placeholder="e.g. 10"
                          />
                          <TextField
                            size="sm"
                            label="Variant Weight (kg)"
                            id={`variant-${index}-weight`}
                            name={`variants.${index}.weight`}
                            type="number"
                            step="0.01"
                            placeholder="Override weight"
                          />
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                          <TextField
                            size="sm"
                            label="Variant Dimensions"
                            id={`variant-${index}-dimensions`}
                            name={`variants.${index}.dimensions`}
                            placeholder="Override dimensions"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {fields.length > 0 ? (
                    <button
                      type="button"
                      onClick={handleAddVariant}
                      className="mt-4 inline-flex items-center justify-center rounded-md border border-dashed border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                      disabled={submitting || isSubmitting}
                    >
                      + Add another variant
                    </button>
                  ) : null}
                </FormSection>

                <div className="flex flex-col-reverse items-center gap-3 sm:flex-row sm:justify-center">
                  <button
                    type="button"
                    onClick={handleReset}
                    className=" cursor-pointer inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                    disabled={submitting || isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="cursor-pointer inline-flex items-center justify-center rounded-md bg-linear-to-r from-green-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={submitting || isSubmitting}
                  >
                    {submitting ? "Saving..." : "Save Product"}
                  </button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorAddProducts;
