import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { saveSelections } from '../utils/saveSelections'; // adjust path if needed

export default function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const tripForm = JSON.parse(localStorage.getItem("tripForm"));
    if (!tripForm || !tripForm.city) {
      return navigate("/planner");
    }

    const fetchHotels = async () => {
      try {
        const res = await axios.get(
          "https://qw3js3n6-5000.inc1.devtunnels.ms/api/hotels",
          {
            params: { city: tripForm.city },
          }
        );
        setHotels(res.data.hotels || []);
      } catch (err) {
        console.error("Error fetching hotels:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [navigate]);

  const toggleSelect = (hotel) => {
    setSelected((prev) =>
      prev.find((h) => h.id === hotel.id)
        ? prev.filter((h) => h.id !== hotel.id)
        : [...prev, hotel]
    );
  };

  const handleNext = () => {
    localStorage.setItem("selectedHotels", JSON.stringify(selected));
    navigate('/CustomMap');  // or next route after hotels
    
  };

  if (loading) return <div className="p-6 text-center">Loading hotels...</div>;

  return (
    <div className="p-6 max-w-full mx-auto bg-gray-900">
      <h2 className="text-4xl font-bold text-center mb-10 text-white">
        🏩 Find Your Ideal Stay
      </h2>
      <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className={`border rounded-xl bg-white shadow hover:shadow-lg cursor-pointer transition duration-300 ${
              selected.find((h) => h.id === hotel.id)
                ? "border-purple-500 ring-2 ring-blue-500"
                : ""
            }`}
            onClick={() => toggleSelect(hotel)}
          >
            {hotel.images && hotel.images.length > 0 && (
              <img
                src={hotel.images[0]}
                alt={hotel.name}
                className="w-full h-48 object-cover rounded-t-xl mb-2"
              />
            )}
            <div className="p-4">
              <h3 className="text-xl font-semibold">{hotel.name}</h3>
              <p className="text-sm text-gray-600">
                {hotel.address || "No address listed"}
              </p>
              <p className="text-sm text-yellow-600">
                ⭐ {hotel.rating || "N/A"}
              </p>
            </div>
            {hotel.isOpen && (
              <p
                className={`text-sm font-medium ${
                  hotel.isOpen.includes("Closed")
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {hotel.isOpen}
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 mr-5">
        <div className="mt-6 flex justify-end pr-5">
          <button
            onClick={async () => {
              await saveSelections();
              navigate("/CustomMap");
            }}
            className="bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl text-lg shadow-md hover:shadow-lg transition-all duration-300 hover:from-green-600 hover:to-teal-700"
          >
            Final Plan
          </button>
        </div>
      </div>
    </div>
  );
}
