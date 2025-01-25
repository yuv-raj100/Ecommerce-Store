import React, {useState,useEffect} from 'react'
import over from "../Images/over.jpg"
import { useSelector, useDispatch } from 'react-redux'
import RenderRazorpay from './RenderRazorpay'


const CheckoutPage = () => {

    const cartItems = useSelector((store) => store.cart.items);

    let total=0;

    const userInfo = JSON.parse(localStorage.getItem('user'))

    cartItems.map((s)=>{
        total+=(s.pageData.status?s.pageData.exclusive_price:s.pageData.original_price)*s.count;
        return s;
    })

    const server_url = process.env.REACT_APP_SERVER_URL;
    const [displayRazorpay, setDisplayRazorpay] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [pincode, setPincode] = useState('');
    const [error, setError] = useState('');
    const [screen,setScreen] = useState(false);
    const [orderId,setOrderId] = useState("");
    const [orderDetails, setOrderDetails] = useState({
      orderId: null,
      currency: null,
      amount: null,
      customerOrderId: null,
    });
    
    const fetchData = async (data)=>{

        const result = await fetch(server_url+"/checkout", {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const ans = await result.json();
        console.log(ans);
        if(result.ok){
            setOrderDetails({
                orderId: ans.id,
                currency: ans.currency,
                amount: ans.amount,
                customerOrderId: ans.orderId,
            });
        }
        setDisplayRazorpay(true);
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email || !phone) {
            setError('Please provide all required information (name, email, phone,address etc).');
            return;
        }
        setError('');
        //setScreen(!screen);
        //localStorage.removeItem('cart');
        //dispatch(clearItem());

        const obj = {
            useremail:userInfo.email,
            email:email,
            name:name,
            address:address,
            phone:phone,
            pincode:pincode,
            product_info:cartItems,
            total:total,
            keyId:process.env.REACT_APP_KEY_ID,
            keySecret:process.env.REACT_APP_KEY_SECRET,
        };

        await fetchData(obj);
        
      };

    return (
        <div>
            {!screen && <div>
                <img className='mb-10' src={over}/>
                <div className='ml-6 mr-6 mb-2'>
                    <h1 className='mb-3 text-gray-400'>Account Detail</h1>
                    <h1>{userInfo?.email}</h1>
                </div>
                <hr className='m-3'></hr>
                <div className='ml-6 mr-6 mb-5'>
                    <h1 className='mb-3  text-gray-400'>Delivery Address</h1>
                    <div className="max-w-md mx-auto p-4 border rounded shadow-md">
                    <form onSubmit={handleSubmit}>
                    
                        <div className="mb-1">
                            <label htmlFor="email" className="block mb-2">
                                Email:
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border rounded"
                                required
                            />
                        </div>

                        <div className="mb-1">
                        <label htmlFor="name" className="block mb-2">
                            Name:
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                        </div>

                        <div className="mb-1">
                        <label htmlFor="address" className="block mb2">
                            Address:
                        </label>
                        <textarea
                            id="address"
                            name="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full px-3 py-2 border rounded"
                            rows="1"
                            required
                        ></textarea>
                        </div>

                        <div className="mb-2">
                        <label htmlFor="phone" className="block mb-2">
                            Phone:
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                        </div>

                        <div className="mb-2">
                        <label htmlFor="pincode" className="block mb-2">
                            Pincode:
                        </label>
                        <input
                            type="text"
                            id="pincode"
                            name="pincode"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value)}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                        </div>

                    </form>
                    {error && <div className='text-red-500'>{error}</div>}
                    </div>
                </div>
                <hr className='m-3'></hr>
                <div className='ml-6 mr-6 mb-2'>
                    <h1 className='mb-3  text-gray-400'>Payment Method</h1>
                    <h1 className='ml-3'>Cash On Delivery</h1>
                </div>
                <hr className='m-3'></hr>
                <div className='ml-6 mr-6 flex justify-between'>
                    <h1>Total Payable Amount</h1>
                    <h1>Rs. {total}</h1>
                </div>

                <div className='ml-6 mr-6 mt-8 mb-8'>
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer w-full"
                        onClick={handleSubmit}
                        >
                        Place Order
                    </button>
                </div>
            </div>}
            {displayRazorpay && (
                <RenderRazorpay
                    amount={orderDetails.amount}
                    currency={orderDetails.currency}
                    orderId={orderDetails.orderId}
                    keyId={process.env.REACT_APP_KEY_ID}
                    keySecret={process.env.REACT_APP_KEY_SECRET}
                    setScreen={setScreen}
                    customerOrderId={orderDetails.customerOrderId}
                    setDisplayRazorpay={setDisplayRazorpay}
                />)
            }
        </div>
    )
}

export default CheckoutPage