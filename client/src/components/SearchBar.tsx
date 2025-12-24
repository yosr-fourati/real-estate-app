
import React, { useState } from "react";


export default function SearchBar() {
  const [filters, setFilters] = useState({
    city: "",
    type: "",
    minPrice: "",
    maxPrice: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search filters:", filters);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-6 flex flex-wrap gap-4 justify-center"
    >
      <input
        name="city"
        type="text"
        placeholder="City"
        value={filters.city}
        onChange={handleChange}
        className="border rounded-md p-2 w-40"
      />

      <select
        name="type"
        value={filters.type}
        onChange={handleChange}
        className="border rounded-md p-2 w-40"
      >
        <option value="">Property Type</option>
        <option value="apartment">Apartment</option>
        <option value="house">House</option>
        <option value="villa">Villa</option>
      </select>

      <input
        name="minPrice"
        type="number"
        placeholder="Min Price"
        value={filters.minPrice}
        onChange={handleChange}
        className="border rounded-md p-2 w-36"
      />

      <input
        name="maxPrice"
        type="number"
        placeholder="Max Price"
        value={filters.maxPrice}
        onChange={handleChange}
        className="border rounded-md p-2 w-36"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Search
      </button>
    </form>
  );
}
