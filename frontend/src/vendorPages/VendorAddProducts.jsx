import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  FileField,
} from "../component/form/FormField";
import { vendorAddProductSchema } from "../lib/validation/schemas";
import { productPayloadToFormData } from "../lib/formData";
import { TrashIcon } from "lucide-react";
import Button from "../component/sharingComponents/Button";
import { ShowLoading } from "../component/sharingComponents/ShowLoading";

const VendorAddProducts = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const isEditMode = Boolean(productId);
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
  const [productLoading, setProductLoading] = useState(false);
  const [productLoadError, setProductLoadError] = useState("");
  const [loadedProduct, setLoadedProduct] = useState(null);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState([]);
  const [variantImageFiles, setVariantImageFiles] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [existingMainImageUrl, setExistingMainImageUrl] = useState("");
  const [existingAdditionalImageUrls, setExistingAdditionalImageUrls] = useState(
    [],
  );
  const [existingVariantImageUrls, setExistingVariantImageUrls] = useState(
    [],
  );

  const [mainImagePreviewUrl, setMainImagePreviewUrl] = useState("");
  const [additionalImagePreviewUrls, setAdditionalImagePreviewUrls] = useState(
    [],
  );
  const [variantImagePreviewUrls, setVariantImagePreviewUrls] = useState([]);

  const normalizeImageUrls = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value === "string") {
      return value
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean);
    }
    return [];
  };

  const mapProductToFormValues = (product) => ({
    title: product?.title || "",
    description: product?.description || "",
    brand: product?.brand || "",
    model_number: product?.model_number || "",
    category_id:
      product?.category_id === null || product?.category_id === undefined
        ? ""
        : String(product.category_id),
    subcategory_id:
      product?.subcategory_id === null || product?.subcategory_id === undefined
        ? ""
        : String(product.subcategory_id),
    price:
      product?.price === null || product?.price === undefined
        ? ""
        : String(product.price),
    discount_price:
      product?.discount_price === null || product?.discount_price === undefined
        ? ""
        : String(product.discount_price),
    currency: product?.currency || "BDT",
    stock_quantity:
      product?.stock_quantity === null || product?.stock_quantity === undefined
        ? "0"
        : String(product.stock_quantity),
    is_available:
      product?.is_available === null || product?.is_available === undefined
        ? true
        : Boolean(product.is_available),
    main_image_url: product?.main_image_url || "",
    image_urls: normalizeImageUrls(product?.image_urls).join(", "),
    weight:
      product?.weight === null || product?.weight === undefined
        ? ""
        : String(product.weight),
    dimensions: product?.dimensions || "",
    color: product?.color || "",
    material: product?.material || "",
    keywords: Array.isArray(product?.keywords)
      ? product.keywords.join(", ")
      : product?.keywords || "",
    variants: Array.isArray(product?.variants)
      ? product.variants.map((variant) => ({
          sku: variant?.sku || "",
          variant_name: variant?.variant_name || "",
          color: variant?.color || "",
          size: variant?.size || "",
          material: variant?.material || "",
          price:
            variant?.price === null || variant?.price === undefined
              ? ""
              : String(variant.price),
          discount_price:
            variant?.discount_price === null ||
            variant?.discount_price === undefined
              ? ""
              : String(variant.discount_price),
          stock_quantity:
            variant?.stock_quantity === null ||
            variant?.stock_quantity === undefined
              ? "0"
              : String(variant.stock_quantity),
          is_available:
            variant?.is_available === null || variant?.is_available === undefined
              ? true
              : Boolean(variant.is_available),
          image_url: variant?.image_url || "",
          weight:
            variant?.weight === null || variant?.weight === undefined
              ? ""
              : String(variant.weight),
          dimensions: variant?.dimensions || "",
        }))
      : [],
  });

  useEffect(() => {
    if (!mainImageFile) {
      setMainImagePreviewUrl(isEditMode ? existingMainImageUrl : "");
      return;
    }

    const url = URL.createObjectURL(mainImageFile);
    setMainImagePreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [existingMainImageUrl, isEditMode, mainImageFile]);

  useEffect(() => {
    if (!(additionalImageFiles || []).length) {
      setAdditionalImagePreviewUrls(
        isEditMode ? existingAdditionalImageUrls : [],
      );
      return;
    }

    const urls = (additionalImageFiles || []).map((f) =>
      URL.createObjectURL(f),
    );
    setAdditionalImagePreviewUrls(urls);
    return () => {
      for (const url of urls) URL.revokeObjectURL(url);
    };
  }, [additionalImageFiles, existingAdditionalImageUrls, isEditMode]);

  useEffect(() => {
    if (!(variantImageFiles || []).length) {
      setVariantImagePreviewUrls(isEditMode ? existingVariantImageUrls : []);
      return;
    }

    const urls = (variantImageFiles || []).map((f, index) =>
      f ? URL.createObjectURL(f) : existingVariantImageUrls?.[index] || "",
    );
    setVariantImagePreviewUrls(urls);
    return () => {
      for (const url of urls) {
        if (url) URL.revokeObjectURL(url);
      }
    };
  }, [existingVariantImageUrls, variantImageFiles]);

  useEffect(() => {
    let active = true;

    const loadProduct = async () => {
      if (!isEditMode) {
        setLoadedProduct(null);
        setProductLoading(false);
        setProductLoadError("");
        setExistingMainImageUrl("");
        setExistingAdditionalImageUrls([]);
        setExistingVariantImageUrls([]);
        reset(defaultValues);
        replace([]);
        return;
      }

      setProductLoading(true);
      setProductLoadError("");

      try {
        const response = await productAPI.getById(productId);
        const product = response.product || response;

        if (!active) return;

        setLoadedProduct(product);
        reset(mapProductToFormValues(product));
        replace(mapProductToFormValues(product).variants || []);
        setExistingMainImageUrl(product?.main_image_url || "");
        setExistingAdditionalImageUrls(normalizeImageUrls(product?.image_urls));
        setExistingVariantImageUrls(
          Array.isArray(product?.variants)
            ? product.variants.map((variant) => variant?.image_url || "")
            : [],
        );
      } catch (err) {
        if (active) {
          setProductLoadError(err.message || "Failed to load product");
        }
      } finally {
        if (active) setProductLoading(false);
      }
    };

    loadProduct();

    return () => {
      active = false;
    };
  }, [defaultValues, isEditMode, productId, replace, reset]);

  const handleReset = () => {
    const initialValues = isEditMode && loadedProduct
      ? mapProductToFormValues(loadedProduct)
      : defaultValues;

    reset(initialValues);
    replace(initialValues.variants || []);

    success(isEditMode ? "Changes reset to the current product values" : "Cancelled: Product form reset");

    setFormError("");
    setMainImageFile(null);
    setAdditionalImageFiles([]);
    setVariantImageFiles([]);
    setMainImagePreviewUrl(isEditMode ? existingMainImageUrl : "");
    setAdditionalImagePreviewUrls(
      isEditMode ? existingAdditionalImageUrls : [],
    );
    setVariantImagePreviewUrls(
      isEditMode ? existingVariantImageUrls : [],
    );
    setFileInputKey((k) => k + 1);
    if (!isEditMode) {
      setExistingMainImageUrl("");
      setExistingAdditionalImageUrls([]);
      setExistingVariantImageUrls([]);
    }
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

    setVariantImageFiles((prev) => [...(prev || []), null]);
  };

  const handleRemoveVariant = (index) => {
    remove(index);
    setVariantImageFiles((prev) => {
      const list = Array.isArray(prev) ? [...prev] : [];
      list.splice(index, 1);
      return list;
    });
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
        main_image_url: null,
        image_urls: null,
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

      if (isEditMode && !mainImageFile && existingMainImageUrl) {
        payload.main_image_url = existingMainImageUrl;
      }

      if (isEditMode && !additionalImageFiles.length && existingAdditionalImageUrls.length) {
        payload.image_urls = existingAdditionalImageUrls;
      }

      const sourceVariants = values.variants ?? getValues("variants") ?? [];

      const normalizedVariants = sourceVariants
        .map((v, index) => {
          const variant = {
            sku: toTrimmedOrNull(v.sku),
            variant_name: toTrimmedOrNull(v.variant_name),
            color: toTrimmedOrNull(v.color),
            size: toTrimmedOrNull(v.size),
            material: toTrimmedOrNull(v.material),
            price: toFloatOrNull(v.price),
            discount_price: toFloatOrNull(v.discount_price),
            stock_quantity: toIntOrZero(v.stock_quantity),
            is_available: v.is_available ?? true,
            image_url: null,
            weight: toFloatOrNull(v.weight),
            dimensions: toTrimmedOrNull(v.dimensions),
          };

          if (isEditMode && !variantImageFiles?.[index]) {
            variant.image_url = existingVariantImageUrls?.[index] || "";
          }

          const hasAny =
            variant.sku ||
            variant.variant_name ||
            variant.color ||
            variant.size ||
            variant.material ||
            variant.price !== null ||
            variant.discount_price !== null ||
            !!variantImageFiles?.[index];

          if (!hasAny) return null;

          return { variant, index };
        })
        .filter(Boolean);

      let variantUploadFiles = [];
      if (normalizedVariants.length > 0) {
        payload.variants = normalizedVariants.map(({ variant, index }) => {
          const file = variantImageFiles?.[index] || null;
          if (!file) return variant;
          const fileIndex = variantUploadFiles.length;
          variantUploadFiles.push(file);
          return { ...variant, __imageFileIndex: fileIndex };
        });
      }

      try {
        setSubmitting(true);
        const hasFiles =
          !!mainImageFile ||
          (additionalImageFiles?.length ?? 0) > 0 ||
          (variantImageFiles?.filter(Boolean)?.length ?? 0) > 0;

        if (hasFiles) {
          const formData = productPayloadToFormData(payload);
          if (mainImageFile) {
            formData.append("mainImage", mainImageFile);
          }
          for (const file of additionalImageFiles) {
            formData.append("images", file);
          }

          for (const file of variantUploadFiles) {
            formData.append("variantImages", file);
          }

          if (isEditMode) {
            await productAPI.update(productId, formData);
          } else {
            await productAPI.create(formData);
          }
        } else {
          if (isEditMode) {
            await productAPI.update(productId, payload);
          } else {
            await productAPI.create(payload);
          }
        }

        success(isEditMode ? "Product updated successfully" : "Product created successfully");
        setMainImageFile(null);
        setAdditionalImageFiles([]);
        setVariantImageFiles([]);
        setFileInputKey((k) => k + 1);
        navigate("/vendor/products");
      } catch (err) {
        console.error(isEditMode ? "Error updating product" : "Error creating product", err);
        showError(err.message || (isEditMode ? "Failed to update product" : "Failed to create product"));
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

  if (productLoading) {
    return (
      <div className="bg-slate-50 py-8 w-full">
        <ShowLoading
          message={isEditMode ? "Loading product details..." : "Loading form..."}
          subMessage="Please wait while we prepare the vendor product form"
        />
      </div>
    );
  }

  if (productLoadError) {
    return <ShowError message={productLoadError} />;
  }

  return (
    <div className="bg-slate-50 py-8 w-full  ">
      <div className="mx-auto w-full  px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl  border border-slate-200 bg-white shadow-sm">
          <div className="border-b  border-slate-200 px-4 py-5 sm:px-6 text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              {isEditMode ? "Edit Product" : "Add New Product"}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              {isEditMode
                ? "Update product details, media, and variants for your shop."
                : "Fill in the details below to add a new product to your shop."}
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
                      min="1"
                    />
                  </div>
                </FormSection>

                <FormSection title="Inventory & Images">
                  <CheckboxField
                    name="is_available"
                    label="Available for sale"
                  />

                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <FileField
                        key={`main-${fileInputKey}`}
                        label="Main Image"
                        name="main_image_file"
                        accept="image/*"
                        hint="Upload the main product photo. Max 5MB."
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setMainImageFile(file);

                          // Allow selecting the same file again later
                          e.target.value = "";
                        }}
                        disabled={submitting || isSubmitting}
                      />
                      {mainImagePreviewUrl ? (
                        <div className="relative mt-2 rounded-lg border border-slate-200 bg-white p-2">
                          <button
                            type="button"
                            onClick={() => setMainImageFile(null)}
                            className="absolute right-2 top-2 rounded-md bg-slate-900/70 px-2 py-1 text-xs font-medium text-white hover:bg-slate-900/80"
                            aria-label="Remove main image"
                          >
                            Remove
                          </button>
                          <img
                            src={mainImagePreviewUrl}
                            alt="Main preview"
                            className="h-32 w-full rounded-md object-contain"
                          />
                        </div>
                      ) : null}
                    </div>

                    <div>
                      <FileField
                        key={`additional-${fileInputKey}`}
                        label="Additional Images"
                        name="additional_image_files"
                        accept="image/*"
                        multiple
                        hint="Optional. Upload extra photos (up to 10), max 5MB each. You can select multiple times."
                        onChange={(e) => {
                          const picked = Array.from(e.target.files || []);
                          setAdditionalImageFiles((prev) => {
                            const existing = Array.isArray(prev) ? prev : [];
                            const merged = [...existing, ...picked];

                            const unique = [];
                            const seen = new Set();
                            for (const file of merged) {
                              const key = `${file.name}|${file.size}|${file.lastModified}`;
                              if (seen.has(key)) continue;
                              seen.add(key);
                              unique.push(file);
                              if (unique.length >= 10) break;
                            }

                            return unique;
                          });

                          // Allow selecting the same file again later
                          e.target.value = "";
                        }}
                        disabled={submitting || isSubmitting}
                      />

                      {additionalImagePreviewUrls.length > 0 ? (
                        <div className="mt-2">
                          <div className="grid grid-cols-3 gap-2">
                            {additionalImagePreviewUrls.map((src, i) => (
                              <div
                                key={src}
                                className="relative rounded-lg border border-slate-200 bg-white p-1"
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    setAdditionalImageFiles((prev) => {
                                      const list = Array.isArray(prev)
                                        ? [...prev]
                                        : [];
                                      list.splice(i, 1);
                                      return list;
                                    });
                                  }}
                                  className="absolute cursor-pointer right-0 top-1 rounded-md  px-2 py-1 font-medium text-red-500 hover:text-red-700"
                                  aria-label={`Remove additional image ${i + 1}`}
                                >
                                  <TrashIcon size={18} />
                                </button>
                                <img
                                  src={src}
                                  alt={`Additional preview ${i + 1}`}
                                  className="h-20  w-full  rounded-md object-contain"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
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
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          <div>
                            <FileField
                              key={`variant-file-${fileInputKey}-${index}`}
                              label="Variant Image"
                              name={`variant_image_file_${index}`}
                              accept="image/*"
                              hint="Optional. Upload a photo for this variant. Max 5MB."
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                setVariantImageFiles((prev) => {
                                  const list = Array.isArray(prev)
                                    ? [...prev]
                                    : [];
                                  list[index] = file;
                                  return list;
                                });

                                // Allow selecting the same file again later
                                e.target.value = "";
                              }}
                              disabled={submitting || isSubmitting}
                            />

                            {variantImagePreviewUrls?.[index] ? (
                              <div className="relative mt-2 rounded-lg border border-slate-200 bg-white p-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setVariantImageFiles((prev) => {
                                      const list = Array.isArray(prev)
                                        ? [...prev]
                                        : [];
                                      list[index] = null;
                                      return list;
                                    });
                                  }}
                                  className="absolute right-2 top-2 rounded-md bg-slate-900/70 px-2 py-1 text-xs font-medium text-white hover:bg-slate-900/80"
                                  aria-label={`Remove variant ${index + 1} image`}
                                >
                                  Remove
                                </button>
                                <img
                                  src={variantImagePreviewUrls[index]}
                                  alt={`Variant ${index + 1} preview`}
                                  className="h-24 w-full rounded-md object-contain"
                                />
                              </div>
                            ) : null}
                          </div>
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
                  <Button
                    type="button"
                    onClick={handleReset}
                    label="Cancel"
                    variant="secondary"
                    className="w-auto px-4 py-2"
                    disabled={submitting || isSubmitting}
                  />
                  <Button
                    type="submit"
                    label="Save Product"
                    loading={submitting || isSubmitting}
                    loadingLabel="Saving..."
                    className="w-auto px-4 py-2"
                    disabled={submitting || isSubmitting}
                  />
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
