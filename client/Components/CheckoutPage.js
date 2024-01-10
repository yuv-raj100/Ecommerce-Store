import React,{useState} from 'react'
import over from "../Images/over.jpg"
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { clearItem } from './reducers/CartSlice'
import { server_url } from './utils/constants';


const CheckoutPage = () => {

    const dispatch = useDispatch();
    const cartItems = useSelector((store) => store.cart.items);
    console.log(cartItems);

    let total=0;

    const userInfo = JSON.parse(localStorage.getItem('user'))

    cartItems.map((s)=>{
        total+=(s.pageData.status?s.pageData.exclusive_price:s.pageData.original_price)*s.count;
        return s;
    })

    //const url = "http://localhost:3000/api/checkout"

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [pincode, setPincode] = useState('');
    const [error, setError] = useState('');
    const [screen,setScreen] = useState(false);
    const [orderId,setOrderId] = useState("");

    const fetchData = async (data)=>{

        const result = await fetch(server_url+"checkout", {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const ans = await result.json();
        console.log(ans);
        setOrderId(ans.orderId);
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email || !phone) {
            setError('Please provide all required information (name, email, phone,address etc).');
            return;
        }
        setError('');
        setScreen(!screen);
        localStorage.removeItem('cart');
        dispatch(clearItem());

        const obj = {
            useremail:userInfo.email,
            email:email,
            name:name,
            address:address,
            phone:phone,
            pincode:pincode,
            product_info:cartItems,
            total:total
        };

        await fetchData(obj);
        
      };

    return (
        <div>
            {!screen && <div>
                <img className='mb-10' src={over}/>
                <div className='ml-6 mr-6 mb-2'>
                    <h1 className='mb-3 text-gray-400'>Account Detail</h1>
                    <h1>{userInfo.email}</h1>
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
            {screen && 
                <div className='text-center'>
                
                <h1 className='font-bold text-2xl m-4'>Order Successfull!!</h1>
                <h1 className='font-bold text-2xl m-4'>Your OrderId: {orderId}</h1>
                
                <Link to="/"><h1>You will be redirected to HomePage...</h1></Link>
                {
                    setTimeout(() => {
                        navigate('/');
                    }, 3000)
                }
                
                </div>}
        </div>
    )
}

export default CheckoutPage