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
          "https://qw3js3n6-5000.inc1.devtunnels.ms/api/restaurants",
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
              latitude: 12.9141,
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
    <div className="min-h-screen w-full bg-[#0f172a] text-white p-4 sm:p-6 overflow-x-hidden">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center">
          🌍 Explore the World
        </h1>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row bg-[#1e293b] p-3 rounded-2xl shadow-lg gap-3 items-stretch sm:items-center">
          <select
            className="p-3 bg-[#334155] border border-gray-600 rounded-full text-white focus:outline-none"
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
            className="flex-1 p-3 bg-[#334155] border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-full transition"
          >
            {loading ? "Searching..." : "🔍 Search"}
          </button>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-20">
            <div className="loader"></div>
          </div>
        )}

        {error && <p className="text-red-400 text-center">{error}</p>}

        {/* Result Section */}
        <div className="mt-8 scrollbar-hide space-y-6 pr-2">
          {results.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#1e293b] rounded-3xl shadow-xl flex flex-col sm:flex-row items-center sm:items-start overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
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
                  className="w-full sm:w-72 h-64 object-cover rounded-3xl p-3"
                />
              )}
              <div className="p-6 w-full">
                <h2 className="text-xl sm:text-2xl font-bold mt-3">
                  {item.name || "Unnamed"}
                </h2>
                {item.address && (
                  <p className="text-gray-400 text-lg mt-4">{item.address}</p>
                )}
                {(item.user_ratings_total || item.userRatingsTotal) && (
                  <p className="text-lg text-yellow-600 mt-5">
                    ⭐ {item.rating || "-"} (
                    {item.user_ratings_total || item.userRatingsTotal} reviews)
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Tailwind to hide scrollbar */}
      <style jsx="true">{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Explore;
