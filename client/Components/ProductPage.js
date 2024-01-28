
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addItem } from './reducers/CartSlice'
import ImageSlider from './ImageSlider';
import { Minus,Plus } from 'lucide-react';
import { server_url } from './utils/constants';
import ScrollToTop from './ScrollToTop';


const ProductPage = () => {
    const dispatch = useDispatch();

    ScrollToTop();

    const handleAdd = (item)=>{
        if(size==0){
            setError("*Please select a size");
        }
        else
            dispatch(addItem(item));
        //setTemp((prev)=>(prev+1));
    }

    const [size,setSize] = useState(0);
    const obj = useParams();
    const [arr,setArr] = useState([]);
    const [pageData,setPageData] = useState({})
    const [count,setCount] = useState(1);
    const [flag,setFlag] = useState(false)
    const [images,setImages] = useState([]);
    const [error,setError] = useState(null);
    const [temp,setTemp] = useState(0);

    useEffect(()=>{
        fetchData();
    },[]);

    const URL = server_url+"products/"+obj.category+"/"+obj.name;
   

    const fetchData = async ()=>{
        const res = await fetch(URL);
        const data = await res.json();
        setArr(data.quantity);
        setImages(data.images);
        setPageData(data)
    }

    const handleSize = (s)=>{
        setSize(s);
        setError(null);
    }
    
    const incCount = ()=>{
        setCount(count+1);
    }

    const decCount = ()=>{
        setCount(count-1);
    }

    const handlClick = ()=>{
        setFlag(!flag);
    }
    
    return (
        <div className='text-center '>


            {images.length>0 && <ImageSlider images={pageData?.images} />}
            <h1 className='font-bold text-4xl font-mono my-6'>{pageData.product_name}</h1>
            <div>

                <h4 className="text-black text-2xl mb-4">
                    {pageData.status && <s className='mr-2'>₹{pageData.original_price}</s>}
                    ₹{pageData.status===true? pageData.exclusive_price : pageData.original_price }
                </h4>

                {pageData.status && 
                    <span className='bg-red-500 p-1 text-white text-xl'>-{Math.floor(((pageData.original_price-pageData.exclusive_price)/pageData.original_price)*100)}%</span>}

            </div>

            <hr className='m-4'></hr>

            <h1 className='font-semibold text-xl mb-2'>Size</h1>
            { arr.length>0 && 
                arr.map((s,index)=>(<button  className={`m-2 py-2 font-medium border w-10 text-center border-gray-600 ${
                    size === s.size ? 'bg-gray-500' : 'bg-white'
                  }`} onClick={()=> handleSize(s.size)} key={index}>{s.size}</button>))
            }

            {
                error && <h1 className='text-red-700 text-lg'>{error}</h1>
            }

            <h1 className='font-semibold text-xl my-2'>Quantity</h1>
            <div className='m-4 flex justify-center'>
                <button className='w-8 text-2xl border font-bold flex items-center justify-center border-r-0' onClick={count>1 && decCount}><Minus /></button>

                <span className='w-8 p-1 border font-semibold text-xl border-l-0 border-r-0'>{count}</span>

                <button className='w-8 text-2xl border font-bold flex items-center justify-center border-l-0 ' onClick={incCount}> <Plus /></button>
            </div>

            <hr className='m-4'></hr>

            <ul className='text-left list-disc m-4 font-medium'>
                <li className='mx-4 my-5 '>
                    Get this for Rs. 1,049 Use Code: SLEIGH
                    Flat 25% off on minimum order value of Rs. 2599/- Limited Period Offer!
                </li>
                <li className='mx-4 my-5'>
                    Get this for Rs. 1,189 Use Code: GET15
                    On minimum order value of Rs. 1999/-
                </li>
                <li className='mx-4 my-5'>
                    Get this for Rs. 1,259 Use Code: GET10
                    On minimum order value of Rs. 1499/-
                </li>
            </ul>

            <div className='border p-4 m-4 text-xl'>
                <button className='font-bold ' onClick={handlClick}>Description</button>
                
                {flag && <div className='text-left my-4' dangerouslySetInnerHTML={{ __html: pageData.description }} />}
            </div>
            <div className='m-4 p-4 border bg-black'>
                <button className='text-white text-lg font-bold w-full' onClick={()=>handleAdd({pageData,count,size})}>Add To Cart</button>
            </div> 
            
            

        </div>
    )
}

export default ProductPage