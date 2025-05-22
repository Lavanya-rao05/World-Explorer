import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Planner() {
  const [form, setForm] = useState({ city: '', days: '', interests: '', budget: '' });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('tripForm', JSON.stringify(form));
    navigate('/places');
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Trip Planner</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="w-full p-2 border rounded" placeholder="City" onChange={e => setForm({ ...form, city: e.target.value })} />
        <input className="w-full p-2 border rounded" placeholder="Days" type="number" onChange={e => setForm({ ...form, days: e.target.value })} />
        <input className="w-full p-2 border rounded" placeholder="Interests (comma separated)" onChange={e => setForm({ ...form, interests: e.target.value })} />
        <select className="w-full p-2 border rounded" onChange={e => setForm({ ...form, budget: e.target.value })}>
          <option value="">Select Budget</option>
          <option value="₹">₹ (Low)</option>
          <option value="₹₹">₹₹ (Medium)</option>
          <option value="₹₹₹">₹₹₹ (High)</option>
        </select>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Next</button>
      </form>
    </div>
  );
}
