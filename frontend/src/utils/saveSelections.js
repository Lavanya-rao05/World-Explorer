import axios from 'axios';

export const saveSelections = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?._id;

  if (!userId) {
    console.error('User ID not found.');
    return;
  }

  const places = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
  const restaurants = JSON.parse(localStorage.getItem('selectedRestaurants')) || [];
  const hotels = JSON.parse(localStorage.getItem('selectedHotels')) || [];

  const normalizedPlaces = places.map(place => ({
    name: place.name,
    address: place.address,
    latitude: place.latitude || place.lat,
    longitude: place.longitude || place.lng,
    category: 'place',
  }));

  const normalizedRestaurants = restaurants.map(restaurant => ({
    name: restaurant.name,
    address: restaurant.address,
    latitude: restaurant.latitude || restaurant.lat,
    longitude: restaurant.longitude || restaurant.lng,
    category: 'restaurant',
  }));

  const normalizedHotels = hotels.map(hotel => ({
    name: hotel.name,
    address: hotel.address,
    latitude: hotel.location?.lat || hotel.latitude || hotel.lat,
    longitude: hotel.location?.lng || hotel.longitude || hotel.lng,
    category: 'hotel',
  }));

  const payload = {
    userId,
    places: [...normalizedPlaces, ...normalizedRestaurants, ...normalizedHotels],
  };

  try {
    console.log('Payload being sent:', payload);
    await axios.post('http://localhost:5000/api/selections', payload);
    console.log('Selections saved successfully');
  } catch (error) {
    console.error('Failed to save selections:', error.response?.data || error);
  }
};
