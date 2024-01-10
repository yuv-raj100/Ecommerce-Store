import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import UserProfile from './UserProfile';
import { server_url } from './utils/constants';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  //const url="http://localhost:3000/api/login"

  if(localStorage.getItem("token")){
    return (
        <UserProfile token={localStorage.getItem("token")}/>
    )
  }

  // useEffect(()=>{
  //   handleLogin();
  // },[])

  const fetchData = async (data)=>{

    try {

      const res = await fetch(server_url+"login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const ans = await res.json();
      if(res.ok){
        localStorage.setItem('token',ans.token);
      }
      
    } catch (err) {
        console.log(err);
        setError(err.message);
    }
      
  }

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
    setError('');
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