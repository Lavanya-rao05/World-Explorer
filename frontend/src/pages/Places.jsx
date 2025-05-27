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
      try {
        const city = form.city || 'Mangalore';

        // TODO: Optional — Replace hardcoded coordinates with real ones using a geocode API if needed
        const response = await axios.get('https://qw3js3n6-5000.inc1.devtunnels.ms/api/places', {
          params: {
            textQuery: `best places in ${city}`,
            latitude: 12.9141,  // You can fetch dynamically
            longitude: 74.8560,
            radius: 50000,
            openNow: false,
          },
        });

        setPlaces(response.data.categorizedPlaces || []);
      } catch (err) {
        console.error('Error fetching places:', err);
        setPlaces([]);
      }
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
    <div className="p-6 max-w-full mx-auto bg-gray-900 ">
      <h2 className="text-3xl text-center align-center items-center text-white font-bold mb-4">Select Places You Want to Visit</h2>
      {places.length === 0 ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {places.map((place) => (
            <div
              key={place.place_id}
              className={`border bg-white rounded-2xl shadow hover:shadow-lg cursor-pointer transition duration-300 ${
                selected.find((p) => p.place_id === place.place_id)
                  ? 'border-blue-500 ring-2 ring-blue-500'
                  : ''
              }`}
              onClick={() => toggleSelect(place)}
            >
              {place.photo_url && (
                <img
                  src={place.photo_url}
                  alt={place.name}
                  className="h-52 w-full rounded-t-2xl object-cover group-hover:brightness-90 transition duration-300"
                />
              )}
              <div className='p-4'>
              <h3 className="text-xl text-black font-semibold">{place.name}</h3>
              <p className="text-sm text-gray-600">{place.address}</p>
              <p className="text-sm text-yellow-600">
                ⭐ {place.rating || '-'} ({place.user_ratings_total || 0} reviews)
              </p>
              {/* <p className="text-sm font-bold text-blue-700 mt-1">{place.category}</p> */}
            </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-6 mr-5">
{selected.length > 0 && (
  <div className="mt-6 flex justify-end pr-5">
    <button
      onClick={handleNext}
      className="bg-gradient-to-r from-blue-600 text-lg via-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-purple-700"
    >
      Next: Restaurants
    </button>
  </div>
)}
      </div>
    </div>
  );
}
