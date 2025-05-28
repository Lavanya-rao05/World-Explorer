import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // import Link here
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "https://qw3js3n6-5000.inc1.devtunnels.ms/api/auth/login",
        { email, password }
      );
      login(data);
      navigate("/planner");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-400/40 to-blue-400/40 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-2xl px-8 pt-6 pb-8 w-full max-w-md border border-gray-200"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-semibold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@gmail.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            required
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-semibold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
        >
          Login
        </button>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-purple-600 hover:underline font-medium"
          >
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
