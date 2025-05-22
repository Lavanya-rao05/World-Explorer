import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const selectedPlaces = JSON.parse(localStorage.getItem('selectedPlaces'));
    if (!selectedPlaces || selectedPlaces.length === 0) {
      return navigate('/places');
    }

    const firstPlace = selectedPlaces[0];
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/restaurants/nearby`, {
          params: {
            lat: firstPlace.latitude || 12.9141, // You can extract actual lat/lng if available
            lng: firstPlace.longitude || 74.8560,
          },
        });
        setRestaurants(res.data.restaurants || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching restaurants:', err);
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
    localStorage.setItem('selectedRestaurants', JSON.stringify(selected));
    navigate('/summary');
  };

  if (loading) return <div className="p-6 text-center">Loading restaurants...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">Select Restaurants or Cafes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {restaurants.map((restaurant, index) => (
          <div
            key={index}
            className={`border p-4 rounded-lg shadow hover:shadow-lg cursor-pointer transition duration-300 ${
              selected.find((r) => r.name === restaurant.name)
                ? 'border-green-500 ring-2 ring-green-300'
                : ''
            }`}
            onClick={() => toggleSelect(restaurant)}
          >
            <h3 className="text-xl font-semibold">{restaurant.name}</h3>
            <p className="text-sm text-gray-600">{restaurant.address || 'No address listed'}</p>
            <p className="text-sm text-yellow-600">⭐ {restaurant.rating || 'N/A'}</p>
            <p className="text-sm">{restaurant.cuisine?.join(', ') || 'Cuisine not listed'}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <button
          onClick={handleNext}
          className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700"
        >
          Finalize Plan
        </button>
      </div>
    </div>
  );
}
