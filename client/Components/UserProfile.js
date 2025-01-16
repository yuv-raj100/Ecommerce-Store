import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearItem } from './reducers/CartSlice';
import { Link } from 'react-router-dom';



import OrderHistory from './OrderHistory';

const UserProfile = () => {

    const dispatch = useDispatch();


    const [user,setUser] = useState("");
    const [orderInfo,setOrderInfo] = useState([]);
    const navigate = useNavigate();

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

    const fetchData = async ()=>{


        const res = await fetch(server_url+"/profile", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({token:localStorage.getItem("token")})
        });
        const ans = await res.json();
        setUser(ans.username);
        localStorage.setItem('user',JSON.stringify({username:ans.username,email:ans.email}))

        const result = await fetch(server_url+"/profile/orderhistory", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({email:ans.email})
        });
       
        const json = await result.json();
        console.log(json)
        setOrderInfo(json.orders);

        const Result = await fetch(server_url+"/home", {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({email:ans.email})
        });
        const Ans = await Result.json();
        console.log(Ans);
        if(Ans.cartOrders.length>0){
            const cartItemsJSON = JSON.stringify(Ans.cartOrders)
            localStorage.setItem('cart',cartItemsJSON)
        }
       
    }

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