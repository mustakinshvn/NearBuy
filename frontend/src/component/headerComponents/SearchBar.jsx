import React, { useState } from "react";
import { Search, X } from "lucide-react";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      // logic to perform search will be added here
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full ">
      <div
        className={`relative lg:min-w-110 flex items-center transition-all duration-300 ${
          isFocused ? "ring-2 ring-blue-400 shadow-lg" : "ring-1 ring-slate-200"
        } rounded-full bg-slate-50 hover:bg-slate-100`}
      >
        <Search className="absolute left-4 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search products..."
          className="w-full pl-12 pr-12 py-2.5 bg-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none font-medium"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
