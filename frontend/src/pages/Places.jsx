// src/pages/Places.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Places() {
  const [places, setPlaces] = useState([]);
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const form = JSON.parse(localStorage.getItem('tripForm'));
    if (!form) return navigate('/planner');
    const fetchPlaces = async () => {
      const res = await axios.get(`http://localhost:5000/api/places/search`, {
        params: {
          textQuery: form.city,
          latitude: 12.9141, // hardcoded for now
          longitude: 74.8560,
        },
      });
      setPlaces(res.data.categorizedPlaces);
    };
    fetchPlaces();
  }, [navigate]);

  const toggleSelect = (place) => {
    setSelected((prev) =>
      prev.find((p) => p.place_id === place.place_id)
        ? prev.filter((p) => p.place_id !== place.place_id)
        : [...prev, place]
    );
  };

  const handleNext = () => {
    localStorage.setItem('selectedPlaces', JSON.stringify(selected));
    navigate('/restaurants');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">Select Places You Want to Visit</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {places.map((place) => (
          <div
            key={place.place_id}
            className={`border p-4 rounded-lg shadow hover:shadow-lg cursor-pointer transition duration-300 ${
              selected.find((p) => p.place_id === place.place_id)
                ? 'border-blue-500 ring-2 ring-blue-300'
                : ''
            }`}
            onClick={() => toggleSelect(place)}
          >
            <img src={place.photo_url} alt={place.name} className="w-full h-48 object-cover rounded mb-2" />
            <h3 className="text-xl font-semibold">{place.name}</h3>
            <p className="text-sm text-gray-600">{place.address}</p>
            <p className="text-sm text-yellow-600">⭐ {place.rating} ({place.user_ratings_total} reviews)</p>
            <p className="text-sm font-bold text-blue-700 mt-1">{place.category}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <button
          onClick={handleNext}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700"
        >
          Next: Restaurants
        </button>
      </div>
    </div>
  );
}