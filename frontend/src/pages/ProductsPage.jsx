import React, { useState, useMemo } from "react";
import {
  ShoppingBag,
  Filter,
  Search,
  X,
  ChevronDown,
  Star,
} from "lucide-react";
import ProductCard from "../component/ProductCard";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { ShowLoading } from "../component/sharingComponents/ShowLoading";
import { ShowError } from "../component/sharingComponents/ShowError";

const ProductsPage = () => {
  const { products: allProducts, loading, error } = useProducts();
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 2000000]);
  const [sortBy, setSortBy] = useState("featured");
  const [minRating, setMinRating] = useState(0);

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    addToCart(product, 1);
  };

  const categories = useMemo(() => {
    const categorySet = new Set(["All"]);
    allProducts.forEach((product) => {
      if (product.category_name) categorySet.add(product.category_name);
    });
    return Array.from(categorySet);
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    let filtered = allProducts.filter((product) => {
      const matchesSearch =
        product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (product.brand &&
          product.brand.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory =
        selectedCategory === "All" ||
        product.category_name === selectedCategory;
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesRating = (product.average_rating || 0) >= minRating;

      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    });

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort(
          (a, b) => (b.average_rating || 0) - (a.average_rating || 0),
        );
        break;
      case "popular":
        filtered.sort(
          (a, b) => (b.total_reviews || 0) - (a.total_reviews || 0),
        );
        break;
      default:
        break;
    }

    return filtered;
  }, [
    allProducts,
    searchQuery,
    selectedCategory,
    priceRange,
    sortBy,
    minRating,
  ]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setPriceRange([0, 20000]);
    setSortBy("featured");
    setMinRating(0);
  };

  if (loading) {
    return (
      <ShowLoading
        message="Loading products..."
        subMessage="Please wait while we fetch the products"
      />
    );
  }

  if (error) {
    return <ShowError message={error} />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">Products</h1>
            <p className="text-slate-600">
              Browse our collection of {filteredProducts.length} amazing
              products
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <Filter className="w-5 h-5 text-slate-600" />
            <span className="font-medium text-slate-700">Filters</span>
            {showFilters ? (
              <X className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

        <div className="mb-6">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by name or description..."
              className="w-full pl-12 pr-12 py-4 bg-white rounded-2xl shadow-md focus:shadow-xl focus:ring-2 focus:ring-blue-400 transition-all outline-none text-slate-700 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="mb-6 p-6 bg-white rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear All
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Category
                </label>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                        selectedCategory === category
                          ? "bg-blue-600 text-white font-medium"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Price Range: ৳{priceRange[0]} - ৳{priceRange[1]}
                </label>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-600">
                      Min: ৳{priceRange[0]}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="20000"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([Number(e.target.value), priceRange[1]])
                      }
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600">
                      Max: ৳{priceRange[1]}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="20000"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], Number(e.target.value)])
                      }
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Minimum Rating
                </label>
                <div className="space-y-2">
                  {[0, 3, 4, 4.5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(rating)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                        minRating === rating
                          ? "bg-blue-600 text-white font-medium"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      <Star className="w-4 h-4 fill-current" />
                      {rating === 0 ? "All Ratings" : `${rating}+ Stars`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Sort By
                </label>
                <div className="space-y-2">
                  {[
                    { value: "featured", label: "Featured" },
                    { value: "price-low", label: "Price: Low to High" },
                    { value: "price-high", label: "Price: High to Low" },
                    { value: "rating", label: "Highest Rated" },
                    { value: "popular", label: "Most Popular" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                        sortBy === option.value
                          ? "bg-blue-600 text-white font-medium"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {allProducts.length === 0 && !loading && !error ? (
          <div className="bg-white rounded-3xl shadow-xl p-16 text-center max-w-2xl mx-auto">
            <div className="bg-linear-to-br from-blue-100 to-indigo-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-16 h-16 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-3">
              No Products Available
            </h2>
            <p className="text-lg text-slate-600 mb-2">
              We're currently updating our inventory
            </p>
            <p className="text-slate-500 mb-8">
              Check back soon for exciting new products!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Back to Home
              </a>
              <a
                href="/shops"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:border-blue-600 hover:text-blue-600 transition-all"
              >
                Browse Shops
              </a>
            </div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.product_id}
                product={product}
                mode="grid"
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-xl mx-auto">
            <div className="bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-700 mb-3">
              No products match your filters
            </h3>
            <p className="text-slate-500 mb-6">
              Try adjusting your search terms or removing some filters
            </p>
            <div className="bg-slate-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-slate-600 mb-2">Current filters:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {searchQuery && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    Search: "{searchQuery}"
                  </span>
                )}
                {selectedCategory !== "All" && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    Category: {selectedCategory}
                  </span>
                )}
                {(priceRange[0] !== 0 || priceRange[1] !== 20000) && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    Price: ৳{priceRange[0]} - ৳{priceRange[1]}
                  </span>
                )}
                {minRating > 0 && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                    Rating: {minRating}+ stars
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={clearFilters}
              className="px-8 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
