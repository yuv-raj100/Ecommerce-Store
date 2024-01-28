import React,{useState} from 'react'
import { Link } from "react-router-dom"
import { useSelector } from 'react-redux'
import nexGen from "../Images/nexGen.png"
import {AlignLeft,ShoppingCart,User,PhoneCall,MailOpen,X} from "lucide-react"
import CartItem from './CartItem'


const Header = () => {

  const [showDiv,setShowDiv] = useState(false);
  const cartItems = useSelector((store) => store.cart.items);


  return (
      <div>
        <div className='bg-[#F8FFD2] p-1 flex justify-between items-center'>

            {/* <div className='ml-2'>
              <button><AlignLeft/></button>
            </div> */}

              <div className='ml-2'>
                <button onClick={() => setShowDiv(!showDiv)} >
                  {showDiv===false?<AlignLeft/>:<X/>}
                </button>
              </div>

            

            <div>
                <Link to="/"><img className='w-32 ml-6' src={nexGen}/></Link>
            </div>

            <div>
                <ul className='flex items-center'>
                    <li className='m-2 text-gray-600 font-bold'><Link to="/cart"><ShoppingCart /></Link></li>
                    <li className='m-2 text-gray-600 font-bold'><Link to="/login"><User /></Link></li>
                </ul>
            </div>
            
        </div>
        <div className='absolute bg-white top-3 right-12'>
            <span className='font-semibold'>{cartItems.length}</span>
        </div>
        {showDiv && (
              <div className='absolute z-10 bg-white p-4 h-full w-full'>
                  <ul>
                    <Link to="/login"><li className='text-xl mb-2' onClick={()=>setShowDiv(!showDiv)}>My account</li></Link>
                    <li className='text-xl mb-2'>Oversized t-shirt</li>
                    <li className='text-xl mb-2'>Hoddies and Sweatshirts</li>
                    <li className='text-xl mb-2'>Bottoms</li>
                    <li className='text-xl mb-2'>Exchange & Returns</li>
                    <li className='text-xl mb-2'>Track your order</li>
                  </ul>

                  <h1 className='mt-8 text-2xl font-semibold'>Need Help?</h1>
                  <ul>
                    <li className='flex items-center mt-4'><PhoneCall/> <p className='ml-4 text-xl mb-2'>Call us at 12345556</p></li>
                    <li className='flex items-center mt-4'><MailOpen/> <p className='ml-4 text-xl mb-2'>nexgen@gmail.com</p></li>
                  </ul>
              </div>
        )}
      </div>
  )
}

export default Header

