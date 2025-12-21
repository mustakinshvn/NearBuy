import React, { useState, useMemo } from 'react';
import { Store, MapPin,  Search, Mail, Phone, Filter, X, ChevronDown, RefreshCw, XCircle } from 'lucide-react';
import { useVendors } from '../hooks/useVendors';

const ShopsPage = () => {
  const { vendors: allVendors, loading, error } = useVendors();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedArea, setSelectedArea] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const cities = useMemo(() => {
    const citySet = new Set(['All']);
    allVendors.forEach(vendor => {
      if (vendor.city) citySet.add(vendor.city);
    });
    return Array.from(citySet);
  }, [allVendors]);
  
  const areasByCity = useMemo(() => {
    const areas = {};
    allVendors.forEach(vendor => {
      if (!vendor.city || !vendor.area) return;
      if (!areas[vendor.city]) {
        areas[vendor.city] = new Set();
      }
      areas[vendor.city].add(vendor.area);
    });
    
    Object.keys(areas).forEach(city => {
      areas[city] = Array.from(areas[city]);
    });
    
    return areas;
  }, [allVendors]);

  const availableAreas = useMemo(() => {
    if (selectedCity === 'All') {
      return ['All', ...Object.values(areasByCity).flat()];
    }
    return ['All', ...(areasByCity[selectedCity] || [])];
  }, [selectedCity, areasByCity]);

  const handleCityChange = (city) => {
    setSelectedCity(city);
    if (city !== selectedCity) {
      setSelectedArea('All');
    }
  };

  const filteredVendors = useMemo(() => {
    let filtered = allVendors.filter(vendor => {
      const matchesSearch = vendor.shop_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           vendor.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           vendor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           vendor.area?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCity = selectedCity === 'All' || vendor.city === selectedCity;
      const matchesArea = selectedArea === 'All' || vendor.area === selectedArea;
      return matchesSearch && matchesCity && matchesArea;
    });

    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.shop_name.localeCompare(b.shop_name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.shop_name.localeCompare(a.shop_name));
        break;
      default:
        break;
    }

    return filtered ;
  }, [searchQuery, selectedCity, selectedArea, sortBy, allVendors]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCity('All');
    setSelectedArea('All');
    setSortBy('newest');
    setShowFilters(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium text-slate-700">Loading vendors...</p>
          <p className="text-sm text-slate-500 mt-2">Discovering amazing shops near you</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-12">
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-2xl mx-auto">
            <div className="bg-red-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-red-800 mb-3">Unable to Load Vendors</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => window.location.reload()} 
                className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg"
              >
                Try Again
              </button>
              <a 
                href="/"
                className="px-8 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:border-blue-600 hover:text-blue-600 transition-all"
              >
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12">
       
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-bold text-slate-800 mb-3">
              Explore <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">Vendors</span>
            </h1>
            <p className="text-lg text-slate-600">Discover {filteredVendors.length} amazing shops and vendors</p>
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <Filter className="w-5 h-5 text-slate-600" />
            <span className="font-medium text-slate-700">Filters</span>
            {showFilters ? <X className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

      
        <div className="mb-6">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vendors by shop name, owner, area, or description..."
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-md focus:shadow-xl focus:ring-2 focus:ring-blue-400 transition-all outline-none text-slate-700 font-medium"
            />
          </div>
        </div>

        {showFilters && (
          <div className="mb-8 bg-white rounded-2xl shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">City</label>
                <div className="flex flex-wrap gap-2">
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => handleCityChange(city)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        selectedCity === city
                          ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Area {selectedCity !== 'All' && <span className="text-xs text-slate-500">({selectedCity})</span>}
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableAreas.map((area) => (
                    <button
                      key={area}
                      onClick={() => setSelectedArea(area)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        selectedArea === area
                          ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none font-medium text-slate-700"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-6 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
              >
                <X size={18} />
                Clear All Filters
              </button>
            </div>
          </div>
        )}

        {!showFilters && (
          <div className="mb-8 flex flex-wrap gap-3">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => handleCityChange(city)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  selectedCity === city
                    ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105'
                    : 'bg-white text-slate-700 hover:bg-slate-100 shadow-md hover:shadow-lg'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        )}

        {allVendors.length === 0 && !loading && !error ? (
          <div className="bg-white rounded-3xl shadow-xl p-16 text-center max-w-2xl mx-auto ">
            <div className="bg-linear-to-r from-green-500 to-blue-500 rounded-full hover:from-green-600 hover:to-blue-600 transition-all w-32 h-32 flex items-center justify-center mx-auto mb-6">
              <Store className="w-16 h-16 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-3">No Vendors Available</h2>
            <p className="text-lg text-slate-600 mb-2">We're currently onboarding new vendors</p>
            <p className="text-slate-500 mb-8">Check back soon to discover amazing local shops!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-linear-to-r from-green-500 to-blue-500 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
                Back to Home
              </a>
              <a href="/products" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:border-blue-600 hover:text-blue-600 transition-all">
                Browse Products
              </a>
            </div>
          </div>
        ) : filteredVendors.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => (
            <div
              key={vendor.vendor_id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden group"
            >
              <div className="h-32 bg-linear-to-r from-blue-500 to-indigo-600 flex items-center justify-center relative overflow-hidden">
                <Store className="w-16 h-16 text-white/80 group-hover:scale-110 transition-transform duration-300" />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">
                  {vendor.shop_name}
                </h3>
                <p className="text-sm text-slate-500 mb-3">Owner: {vendor.name}</p>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">{vendor.description}</p>

                <div className="flex items-start gap-2 mb-3 p-3 bg-slate-50 rounded-lg">
                  <MapPin className="w-4 h-4 text-blue-600 mt-1 shrink-0" />
                  <div className="text-sm text-slate-700">
                    <p className="font-medium">{vendor.area}, {vendor.city}</p>
                    <p className="text-slate-500">{vendor.street}</p>
                    <p className="text-slate-500">{vendor.postal_code}, {vendor.country}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="w-4 h-4 text-green-600" />
                    <span className="font-medium">{vendor.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className="w-4 h-4 text-red-600" />
                    <span className="font-medium">{vendor.email}</span>
                  </div>
                </div>

                <button className="w-full py-3 bg-linear-to-r from-green-500 to-blue-500 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all text-white font-semibold shadow-md hover:shadow-lg active:scale-95 cursor-pointer">
                  Visit Shop
                </button>
              </div>
            </div>
          ))}
        </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-xl mx-auto">
            <div className="bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-700 mb-3">No vendors match your filters</h3>
            <p className="text-slate-500 mb-6">Try adjusting your search or changing the location filters</p>
            <div className="bg-slate-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-slate-600 mb-2">Current filters:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {searchQuery && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    Search: "{searchQuery}"
                  </span>
                )}
                {selectedCity !== 'All' && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    City: {selectedCity}
                  </span>
                )}
                {selectedArea !== 'All' && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    Area: {selectedArea}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={clearFilters}
              className="cursor-pointer px-8 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 "
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopsPage;