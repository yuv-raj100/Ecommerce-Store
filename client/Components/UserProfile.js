import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearItem } from './reducers/CartSlice';
import { Link } from 'react-router-dom';


import OrderHistory from './OrderHistory';
import LoginPage from './LoginPage';

const UserProfile = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userDetails = localStorage.getItem("user");
    const [user,setUser] = useState(userDetails?.username);
    const [orderInfo,setOrderInfo] = useState([]);
  
    useEffect(()=>{
        fetchData();
    },[])

    

    const server_url = process.env.REACT_APP_SERVER_URL;

    const handlClick = ()=>{
        localStorage.removeItem("token");
        localStorage.removeItem('user');
        localStorage.removeItem('cart');
        dispatch(clearItem());
        navigate('/');
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // First request to fetch user profile
        const profilePromise = fetch(server_url + "/profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        }).then((res) => res.json());

        // Wait for the profile data to resolve
        const profileData = await profilePromise;

        // Store user data in localStorage
        setUser(profileData.username);
        localStorage.setItem(
          "user",
          JSON.stringify({
            username: profileData.username,
            email: profileData.email,
          })
        );

        // Concurrently fetch order history and home data
        const [orderHistory, homeData] = await Promise.all([
          fetch(server_url + "/profile/orderhistory", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: profileData.email }),
          }).then((res) => res.json()),

          fetch(server_url + "/home", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: profileData.email }),
          }).then((res) => res.json()),
        ]);

        // Process order history data
        setOrderInfo(orderHistory.orders.product_info);

        // Process home data and store cart items in localStorage
        if (homeData.cartOrders.length > 0) {
          const cartItemsJSON = JSON.stringify(homeData.cartOrders);
          localStorage.setItem("cart", cartItemsJSON);
        }

        console.log(orderHistory);
        console.log(homeData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const [showDiv,setShowDiv] = useState(false);

    return (
        <div className='m-4 mb-80'>
            <h1 className='font-bold text-3xl text-gray-700 mb-10'>Hi, {user}</h1>
            <Link to="/"><h1 className='font-semibold text-xl text-gray-700 mb-2'>Dashboard</h1></Link>
            <button className='font-semibold text-xl text-gray-700 mb-2' onClick={()=>setShowDiv(!showDiv)}>Order History</button>

            {showDiv && (
                <>
                    {orderInfo.length > 0 ? (
                        orderInfo.map((s) => (
                            <OrderHistory
                                key={s.orderId}
                                pageData={s.products}
                                total={s.total}
                                orderId={s.orderId}
                            />
                        ))
                    ) : (
                        <p className="text-gray-500 mt-4">No orders placed yet.</p>
                    )}
                </>
            )}
            <br/>
            <button className='font-semibold text-xl text-gray-700 mb-2' onClick={handlClick}>Log Out</button>
        </div>
    )
}

export default UserProfile