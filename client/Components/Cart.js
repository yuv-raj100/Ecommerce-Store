import React ,{useEffect}from 'react'
import { useSelector } from 'react-redux'
import CartItem from './CartItem';
import { Link } from 'react-router-dom';
import { server_url } from './utils/constants';
import ScrollToTop from './ScrollToTop';




const Cart = () => {

  ScrollToTop();

  const cartItems = useSelector((store) => store.cart.items);
  console.log(cartItems);
  
  const cartItemsJSON = JSON.stringify(cartItems)
  localStorage.setItem('cart', cartItemsJSON);

  const userInfo = JSON.parse(localStorage.getItem('user'))

  const isLogin = localStorage.getItem("token")

  //const url = "http://localhost:3000/api/cart"

  const fetchData = async (data)=>{
    const result = await fetch(server_url+"cart", {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
    const ans = await result.json();
    console.log(ans);
}

  useEffect(()=>{
    if(cartItems.length>0 && localStorage.getItem('user'))
      fetchData({email:userInfo.email,
                  cartDetails:cartItems});
  },cartItems);
  
  if(cartItems.length==0){
    return(
      <div className='text-center font-bold m-8 text-2xl'>
          Your Cart is Empty
      </div>
    )
  }

  

  let total=0;

  cartItems.map((s)=>{
    total+=(s.pageData.status?s.pageData.exclusive_price:s.pageData.original_price)*s.count;
    return s;
  })

  return (
    <div className='p-2 cart-container flex flex-col h-screen min-h-screen'>
        <div className='flex-grow overflow-y-auto pb-44'>
          {
            cartItems.map((s)=>(<CartItem data={s}/>))
          }
        </div>
        <div className='flex-grow'></div>
        <div className='footer-container fixed bottom-0 left-0 w-full p-4 border bg-white text-black'>
          <div className='flex justify-between mx-2 mt-6 font-serif text-xl'>
              <h1>SUBTOTAL</h1>
              <h1>Rs. {total}</h1>
          </div>
          <h1 className='mx-4 p-4 text-xs'>Shipping taxes, and discount codes calculated at checkout.</h1>
          <div className='m-4 p-4 border bg-black'>
                {
                    isLogin && <Link to="/checkout"><button className='text-white text-lg font-bold w-full'>PROCEED TO CHECOUT</button></Link>
                } 
                {
                  !isLogin && <Link to="/login"><button className='text-white text-lg font-bold w-full'>PROCEED TO CHECOUT</button></Link>
                } 
          </div> 
        </div>
    </div>
  )
}

export default Cart