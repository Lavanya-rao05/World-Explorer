import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { saveSelections } from "../utils/saveSelections"; // adjust path if needed
  
export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const tripForm = JSON.parse(localStorage.getItem("tripForm"));
    const selectedPlaces = JSON.parse(localStorage.getItem("selectedPlaces"));

    if (!tripForm || !tripForm.city) return navigate("/planner");
    if (!selectedPlaces || selectedPlaces.length === 0)
      return navigate("/places");

    const fetchRestaurants = async () => {
      try {
        const res = await axios.get(
          `https://qw3js3n6-5000.inc1.devtunnels.ms/api/restaurants`,
          {
            params: { city: tripForm.city },
          }
        );
        setRestaurants(res.data.restaurants || []);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [navigate]);

  const toggleSelect = (restaurant) => {
    setSelected((prev) =>
      prev.find((r) => r.name === restaurant.name)
        ? prev.filter((r) => r.name !== restaurant.name)
        : [...prev, restaurant]
    );
  };

  const handleNext = () => {
    localStorage.setItem("selectedRestaurants", JSON.stringify(selected));
    navigate("/hotels");
  };

  if (loading)
    return (
              <div className="flex justify-center items-center h-32">
  <div className="loader"></div>
</div>
    );
  

  return (
    <div className="p-6 max-w-full mx-auto bg-gray-900 ">
      <h2 className="text-4xl font-bold text-center mb-10 text-white">
        🍽️ Choose Your Food Stops
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {restaurants.map((restaurant, index) => {
          const isSelected = selected.find((r) => r.name === restaurant.name);
          return (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`bg-white border rounded-2xl shadow-xl overflow-hidden transition-all duration-300 cursor-pointer group ${
                isSelected ? "ring-4 ring-blue-500" : ""
              }`}
              onClick={() => toggleSelect(restaurant)}
            >
              {restaurant.photoUrl ? (
                <img
                  src={restaurant.photoUrl}
                  alt={restaurant.name}
                  className="h-52 w-full object-cover group-hover:brightness-90 transition duration-300"
                />
              ) : (
                <div className="h-52 bg-gray-100 flex items-center justify-center text-gray-500">
                  No image
                </div>
              )}
              <div className="p-4">
                <h3 className="text-2xl font-semibold text-gray-800">
                  {restaurant.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {restaurant.address || "No address listed"}
                </p>

                <div className="flex items-center justify-between mt-3 text-sm">
                  <span className="text-yellow-600 font-medium">
                    ⭐ {restaurant.rating || "N/A"} (
                    {restaurant.userRatingsTotal || "0"} reviews)
                  </span>
                  {restaurant.isOpen && (
                    <span
                      className={`font-semibold ${
                        restaurant.isOpen.includes("Closed")
                          ? "text-red-500"
                          : "text-green-600"
                      }`}
                    >
                      {restaurant.isOpen}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end pr-5 gap-4">
        <button
          onClick={handleNext}
          className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl text-lg shadow-md hover:shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-purple-700"
        >
          Next: Hotels
        </button>
        <button
          onClick={async () => {
            localStorage.setItem("selectedRestaurants", JSON.stringify(selected));
            await saveSelections();
            navigate("/CustomMap");
          }}
          className="bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl text-lg shadow-md hover:shadow-lg transition-all duration-300 hover:from-green-600 hover:to-teal-700"
        >
          Final Plan
        </button>
      </div>
    </div>
  );
}
