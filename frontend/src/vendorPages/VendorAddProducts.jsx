import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVendorAuthContext } from "../hooks/useVendorAuthContext";
import { useToast } from "../hooks/useToast";
import { productAPI } from "../services/api";

const VendorAddProducts = () => {
  const navigate = useNavigate();
  const { vendor } = useVendorAuthContext();
  const { success, error: showError } = useToast();

  const [formData, setFormData] = useState({
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
  });

  const [variants, setVariants] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const handleReset = () => {
    setFormData({
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
    });
    setVariants([]);
    success("Cancelled: Product form reseted");

    setFormError("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleVariantChange = (index, field, value, type = "text") => {
    setVariants((prev) =>
      prev.map((variant, i) => {
        if (i !== index) return variant;

        let parsedValue = value;
        if (type === "number") {
          parsedValue = value === "" ? "" : value;
        } else if (type === "checkbox") {
          parsedValue = !!value;
        }

        return {
          ...variant,
          [field]: parsedValue,
        };
      }),
    );
  };

  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
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
      },
    ]);
  };

  const handleRemoveVariant = (index) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.title.trim()) {
      setFormError("Title is required");
      return;
    }

    if (formData.price === "" || isNaN(parseFloat(formData.price))) {
      setFormError("Valid price is required");
      return;
    }

    if (!vendor || !vendor.vendor_id) {
      setFormError("Vendor information is missing. Please log in again.");
      return;
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      brand: formData.brand.trim() || null,
      model_number: formData.model_number.trim() || null,
      category_id: formData.category_id
        ? parseInt(formData.category_id, 10)
        : null,
      subcategory_id: formData.subcategory_id
        ? parseInt(formData.subcategory_id, 10)
        : null,
      price: parseFloat(formData.price),
      discount_price:
        formData.discount_price !== "" &&
        !isNaN(parseFloat(formData.discount_price))
          ? parseFloat(formData.discount_price)
          : null,
      currency: formData.currency || "BDT",
      stock_quantity:
        formData.stock_quantity !== "" &&
        !isNaN(parseInt(formData.stock_quantity, 10))
          ? parseInt(formData.stock_quantity, 10)
          : 0,
      is_available: !!formData.is_available,
      main_image_url: formData.main_image_url.trim() || null,
      image_urls: formData.image_urls
        ? formData.image_urls
            .split(",")
            .map((url) => url.trim())
            .filter(Boolean)
        : null,
      weight:
        formData.weight !== "" && !isNaN(parseFloat(formData.weight))
          ? parseFloat(formData.weight)
          : null,
      dimensions: formData.dimensions.trim() || null,
      color: formData.color.trim() || null,
      material: formData.material.trim() || null,
      seller_id: vendor.vendor_id,
      keywords: formData.keywords
        ? formData.keywords
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean)
        : null,
    };

    const normalizedVariants = variants
      .map((v) => ({
        sku: v.sku?.trim() || null,
        variant_name: v.variant_name?.trim() || null,
        color: v.color?.trim() || null,
        size: v.size?.trim() || null,
        material: v.material?.trim() || null,
        price:
          v.price !== "" && !isNaN(parseFloat(v.price))
            ? parseFloat(v.price)
            : null,
        discount_price:
          v.discount_price !== "" && !isNaN(parseFloat(v.discount_price))
            ? parseFloat(v.discount_price)
            : null,
        stock_quantity:
          v.stock_quantity !== "" && !isNaN(parseInt(v.stock_quantity, 10))
            ? parseInt(v.stock_quantity, 10)
            : 0,
        is_available: v.is_available ?? true,
        image_url: v.image_url?.trim() || null,
        weight:
          v.weight !== "" && !isNaN(parseFloat(v.weight))
            ? parseFloat(v.weight)
            : null,
        dimensions: v.dimensions?.trim() || null,
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
  };

  return (
    <div className="bg-gray-50 py-8  ">
      <div className="w-full mx-auto bg-white shadow-md rounded-lg p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="w-full items-center flex flex-col">
            <h1 className="text-2xl font-bold text-gray-900">
              Add New Product
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Fill in the details below to add a new product to your shop.
            </p>
          </div>
        </div>

        {formError && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-sm min-h-10 px-4"
                  placeholder="e.g. iPhone 15 Pro Max"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-sm min-h-10 px-4"
                  placeholder="e.g. Apple"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model Number
                </label>
                <input
                  type="text"
                  name="model_number"
                  value={formData.model_number}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-sm min-h-10 px-4"
                  placeholder="e.g. A3108"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Main Image URL
                </label>
                <input
                  type="url"
                  name="main_image_url"
                  value={formData.main_image_url}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-sm min-h-10 px-4"
                  placeholder="https://..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-sm px-4 py-2"
                  placeholder="Write a detailed description of the product..."
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Category & Classification
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category ID
                </label>
                <input
                  type="number"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-sm min-h-10 px-4"
                  placeholder="e.g. 1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subcategory ID
                </label>
                <input
                  type="number"
                  name="subcategory_id"
                  value={formData.subcategory_id}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-sm min-h-10 px-4"
                  placeholder="e.g. 10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Keywords (comma separated)
                </label>
                <input
                  type="text"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-sm min-h-10 px-4"
                  placeholder="phone, smartphone, flagship"
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Pricing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-sm min-h-10 px-4"
                  placeholder="e.g. 99999.99"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="discount_price"
                  value={formData.discount_price}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-sm min-h-10 px-4"
                  placeholder="e.g. 89999.99"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <input
                  type="text"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-sm min-h-10 px-4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  name="stock_quantity"
                  value={formData.stock_quantity}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-sm min-h-10 px-4"
                  min="0"
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Inventory & Images
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center mt-2">
                <input
                  id="is_available"
                  type="checkbox"
                  name="is_available"
                  checked={formData.is_available}
                  onChange={handleChange}
                  className="h-4 w-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500"
                />
                <label
                  htmlFor="is_available"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Available for sale
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Image URLs (comma separated)
                </label>
                <input
                  type="text"
                  name="image_urls"
                  value={formData.image_urls}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-sm min-h-10 px-4"
                  placeholder="https://..., https://..."
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Product Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-sm min-h-10 px-4"
                  placeholder="e.g. 0.50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dimensions
                </label>
                <input
                  type="text"
                  name="dimensions"
                  value={formData.dimensions}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-sm min-h-10 px-4"
                  placeholder="e.g. 10 x 5 x 1 cm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-sm min-h-10 px-4"
                  placeholder="e.g. Black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Material
                </label>
                <input
                  type="text"
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-sm min-h-10 px-4"
                  placeholder="e.g. Aluminum"
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Variants (Optional)
            </h2>
            <p className="text-xs text-gray-500 mb-3">
              Use variants for different colors, sizes, or configurations (e.g.
              "Red / M", "Black / L"). If no variants are added, the base
              product settings will be used.
            </p>

            {variants.length === 0 && (
              <button
                type="button"
                onClick={handleAddVariant}
                className="mb-2 inline-flex items-center px-3 py-2 border border-dashed border-gray-400 rounded-md text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                disabled={submitting}
              >
                + Add first variant
              </button>
            )}

            {variants.map((variant, index) => (
              <div
                key={index}
                className="mb-4 rounded-md border border-gray-200 p-4 bg-gray-50"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-800">
                    Variant {index + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(index)}
                    className="text-xs text-red-600 hover:text-red-700 cursor-pointer"
                    disabled={submitting}
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Variant Name
                    </label>
                    <input
                      type="text"
                      value={variant.variant_name}
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "variant_name",
                          e.target.value,
                        )
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-xs min-h-9 px-3"
                      placeholder="e.g. Red / M"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      SKU
                    </label>
                    <input
                      type="text"
                      value={variant.sku}
                      onChange={(e) =>
                        handleVariantChange(index, "sku", e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-xs min-h-9 px-3"
                      placeholder="e.g. TS-RED-M"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={variant.image_url}
                      onChange={(e) =>
                        handleVariantChange(index, "image_url", e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-xs min-h-9 px-3"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Color
                    </label>
                    <input
                      type="text"
                      value={variant.color}
                      onChange={(e) =>
                        handleVariantChange(index, "color", e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-xs min-h-9 px-3"
                      placeholder="e.g. Red"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Size
                    </label>
                    <input
                      type="text"
                      value={variant.size}
                      onChange={(e) =>
                        handleVariantChange(index, "size", e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-xs min-h-9 px-3"
                      placeholder="e.g. M"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Material
                    </label>
                    <input
                      type="text"
                      value={variant.material}
                      onChange={(e) =>
                        handleVariantChange(index, "material", e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-xs min-h-9 px-3"
                      placeholder="e.g. Cotton"
                    />
                  </div>
                  <div className="flex items-center mt-6">
                    <input
                      id={`variant-available-${index}`}
                      type="checkbox"
                      checked={variant.is_available}
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "is_available",
                          e.target.checked,
                          "checkbox",
                        )
                      }
                      className="h-4 w-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500"
                    />
                    <label
                      htmlFor={`variant-available-${index}`}
                      className="ml-2 block text-xs text-gray-700"
                    >
                      Available
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Variant Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={variant.price}
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "price",
                          e.target.value,
                          "number",
                        )
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-xs min-h-9 px-3"
                      placeholder="Override base price"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Variant Discount Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={variant.discount_price}
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "discount_price",
                          e.target.value,
                          "number",
                        )
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-xs min-h-9 px-3"
                      placeholder="Override discount"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Variant Stock
                    </label>
                    <input
                      type="number"
                      value={variant.stock_quantity}
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "stock_quantity",
                          e.target.value,
                          "number",
                        )
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-xs min-h-9 px-3"
                      min="0"
                      placeholder="e.g. 10"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Variant Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={variant.weight}
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "weight",
                          e.target.value,
                          "number",
                        )
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-xs min-h-9 px-3"
                      placeholder="Override weight"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Variant Dimensions
                    </label>
                    <input
                      type="text"
                      value={variant.dimensions}
                      onChange={(e) =>
                        handleVariantChange(index, "dimensions", e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-xs min-h-9 px-3"
                      placeholder="Override dimensions"
                    />
                  </div>
                </div>
              </div>
            ))}

            {variants.length > 0 && (
              <button
                type="button"
                onClick={handleAddVariant}
                className="mt-2 inline-flex items-center px-3 py-2 border border-dashed border-gray-400 rounded-md text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                disabled={submitting}
              >
                + Add another variant
              </button>
            )}
          </section>

          <div className="pt-4 flex justify-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex cursor-pointer items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorAddProducts;
