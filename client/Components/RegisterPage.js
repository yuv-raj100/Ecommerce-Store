import React, { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';



const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  

  const server_url = process.env.REACT_APP_SERVER_URL;

  const fetchData = async (data) => {
    try {
      const res = await fetch(server_url + "/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Parse the response
      const ans = await res.json();

      // Check for HTTP errors
      if (!res.ok) {
        throw new Error(ans.message || `HTTP error: ${res.status}`);
      }

      // Store token and user in localStorage
      localStorage.setItem("token", ans.token);
      localStorage.setItem("user", JSON.stringify(ans.user)); // Save user as a string
      console.log("User registered successfully:", ans.user);
    } catch (error) {
      console.error("Registration failed:", error.message);
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError('Please enter all required information.');
      return;
    }

      const data = {
        username:name,
        email:email,
        password:password
      }
      await fetchData(data);


    setName('');
    setEmail('');
    setPassword('');
    setError('');
    navigate('/login');
  };

  return (
    <div className="flex justify-center items-center h-screen"
         style={{
           backgroundImage: `url('https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/banner-images/opening-sc23.jpg')`,
           backgroundSize: 'cover',
           backgroundPosition: 'center',
         }}
    >

      <div className="p-4 bg-opacity-50 text-center bg-gray-200 rounded shadow-md mb-48">
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-4">
          <input
            type="text"
            id="name"
            className="w-full p-2 border border-white rounded bg-transparent text-white placeholder-white"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <input
            type="email"
            id="email"
            className="w-full p-2 border border-white rounded bg-transparent text-white placeholder-white"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <input
            type="password"
            id="password"
            className="w-full p-2 border border-white rounded bg-transparent text-white placeholder-white"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="bg-red-900 text-white p-2 rounded hover:bg-blue-600 w-60 text-lg"
          onClick={handleRegister}
        >
          Register
        </button>

        <p className="mt-4 text-center text-white font-bold">
          Already registered?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login Now!
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
