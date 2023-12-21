import React ,{useState} from 'react'
import photo from "../Images/tshirt.png"
import heart from "../Images/heart-bg.png"
import { Link } from "react-router-dom"


const ItemCard = (props) => {


    
    const {name,price_max,price_min,imgURL,sale_status}=props;
    // console.log(props.handle);
  

    return (

        <div className='my-2 py-2 transition-transform transform hover:scale-105 hover:shadow-lg px-1' >
            <img className='w-44  rounded-sm' src={imgURL}></img>
            <h4 className='w-44 py-1 font-semibold text-ellipsis'>{name}</h4>

            <div className={sale_status?'flex justify-between items-center':''}>

                <h4 className="text-gray-500">
                    {sale_status && <s className='mr-2'>₹{price_max}</s>}
                    ₹{sale_status===true? price_min : price_max }
                </h4>
                
                {sale_status && 
                    <h1 className='bg-red-500 p-1 mr-2 text-white text-lg'>-{Math.floor(((price_max-price_min)/price_max)*100)}%</h1>}
                
            </div>

            <div className='my-2 text-center'>
                {/* <button className='w-4 m-2'><img src={heart}></img></button> */}
                {/* {flag && <button className='p-2 bg-gray-800 text-white rounded-lg' onClick={() => handleClick({props})}>Add to Cart</button>}
                {!flag && <button className='p-2 bg-gray-800 text-white rounded-lg'><Link to="/cart">Go to cart</Link></button>} */}
            </div>

        </div>
    )
}

export default ItemCard