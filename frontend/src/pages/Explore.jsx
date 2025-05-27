import React, { useState } from "react";
import axios from "axios";

const Explore = () => {
  const [category, setCategory] = useState("restaurants");
  const [location, setLocation] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!location) return setError("Please enter a location");

    setError("");
    setLoading(true);
    setResults([]);

    try {
      let res;

      if (category === "hotels") {
        res = await axios.get(
          "https://qw3js3n6-5000.inc1.devtunnels.ms/api/hotels",
          {
            params: { city: location },
          }
        );
        setResults(res.data.hotels || []);
      } else if (category === "restaurants") {
        res = await axios.get(
          `https://qw3js3n6-5000.inc1.devtunnels.ms/api/restaurants`,
          {
            params: { city: location },
          }
        );
        setResults(res.data.restaurants || []);
      } else {
        res = await axios.get(
          "https://qw3js3n6-5000.inc1.devtunnels.ms/api/places",
          {
            params: {
              textQuery: `best places in ${location}`,
              latitude: 12.9141, // You can fetch dynamically
              longitude: 74.856,
              radius: 50000,
              openNow: false,
            },
          }
        );

        setResults(res.data.places || res.data.categorizedPlaces || []);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch results. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">🌍 Explore the World</h1>

        <div className="bg-[#1e293b] p-6 rounded-xl shadow-lg space-y-4">
          <select
            className="w-full p-3 bg-[#334155] border border-gray-600 rounded-md text-white focus:outline-none"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="restaurants">🍽️ Restaurants</option>
            <option value="hotels">🏨 Hotels</option>
            <option value="places">🗺️ Tourist Places</option>
          </select>

          <input
            type="text"
            placeholder="Enter a location (e.g. Mangalore)"
            className="w-full p-3 bg-[#334155] border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition"
          >
            {loading ? "Searching..." : "🔍 Search"}
          </button>

          {error && <p className="text-red-400 text-center">{error}</p>}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {results.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#1e293b] p-4 rounded-lg shadow-md hover:scale-[1.02] transition-transform"
            >
              <h2 className="text-lg font-semibold">
                {item.name || "Unnamed"}
              </h2>
              {item.address && (
                <p className="text-sm text-gray-400">{item.address}</p>
              )}

              {(item.photo_url ||
                item.photoUrl ||
                (Array.isArray(item.images) && item.images[0])) && (
                <img
                  src={
                    item.photo_url ||
                    item.photoUrl ||
                    (Array.isArray(item.images) ? item.images[0] : "")
                  }
                  alt={item.name}
                  className="w-full h-40 object-cover mt-3 rounded-md"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Explore;
