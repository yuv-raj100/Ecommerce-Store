import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import UserProfile from './UserProfile';
import axios from 'axios';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const server_url = process.env.REACT_APP_SERVER_URL;

  // if(localStorage.getItem("token")){
  //   return (
  //       <UserProfile token={localStorage.getItem("token")}/>
  //   )
  // }

 

    const fetchData = async (data) => {
      try {
        const res = await axios.post(`${server_url}/login`, data, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        // If successful, store the token
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate('/');
      } catch (err) {
        // Handle errors (both HTTP errors and network errors)
          if (err) {
            setError(err.response.data.message);
          }
      }
    };

    const handleLogin = async () => {
   
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    const data = {
      email:email,
      password:password,
    }
    await fetchData(data);

    setEmail('');
    setPassword('');
  };

  

  return (
    <div className="flex justify-center items-center h-screen"
          style={{
            backgroundImage: `url('https://prod-img.thesouledstore.com/public/theSoul/storage/mobile-cms-media-prod/banner-images/opening-sc23.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
    >

      <div className="p-4 bg-opacity-50 bg-gray-200 rounded shadow-md mb-48">
        {/* <h2 className="text-2xl text-center text-white font-bold mb-4 ">LOGIN</h2> */}

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-4">
          {/* <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email:
          </label> */}
          <input
            type="email"
            id="email"
            className="w-full p-2 border border-white rounded bg-transparent text-white  placeholder-white"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-6">
          {/* <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password:
          </label> */}
          <input
            type="password"
            id="password"
            className="w-full p-2 border border-white rounded bg-transparent text-white  placeholder-white"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="bg-red-900 text-white p-2 rounded hover:bg-blue-600 w-56 text-lg"
          onClick={handleLogin}
        >
          Login
        </button>
        <p className="mt-4 text-center text-white font-bold">
          Not registered?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register Now!
          </Link>
        </p>
      </div>
    </div>
  );
};



export default LoginPage