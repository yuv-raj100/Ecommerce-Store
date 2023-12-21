import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addItem } from './reducers/UserSlice';
import { Link } from 'react-router-dom';

import OrderHistory from './OrderHistory';

const UserProfile = (props) => {

    const [user,setUser] = useState("");
    const [orderInfo,setOrderInfo] = useState([]);
    const navigate = useNavigate();

    useEffect(()=>{
        fetchData();
    },[])


    const url="http://localhost:3000/api/profile"
    const url2="http://localhost:3000/api/profile/orderhistory"

    const handlClick = ()=>{
        localStorage.removeItem("token");
        localStorage.removeItem('user');
        localStorage.removeItem('cart');
        navigate('/');
    }

    const fetchData = async (data)=>{


        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({token:localStorage.getItem("token")})
        });
        const ans = await res.json();
        setUser(ans.username);
        localStorage.setItem('user',JSON.stringify({username:ans.username,email:ans.email}))

        const result = await fetch(url2, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({email:ans.email})
        });
       
        const json = await result.json();
        setOrderInfo(json);
       
    }
    const [showDiv,setShowDiv] = useState(false);

    return (
        <div className='m-4 mb-80'>
            <h1 className='font-bold text-3xl text-gray-700 mb-10'>Hi, {user}</h1>
            <Link to="/"><h1 className='font-semibold text-xl text-gray-700 mb-2'>Dashboard</h1></Link>
            <button className='font-semibold text-xl text-gray-700 mb-2' onClick={()=>setShowDiv(!showDiv)}>Order History</button>

            {
              showDiv &&  orderInfo.map((s)=>(<OrderHistory pageData={s.     products}
                                    total={s.total}
                                    orderId={s.orderId}
                />))
            }
            <br/>
            <button className='font-semibold text-xl text-gray-700 mb-2' onClick={handlClick}>Log Out</button>
        </div>
    )
}

export default UserProfile