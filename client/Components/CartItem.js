import React,{useState} from 'react'
import { useDispatch } from 'react-redux'
import { removeItem,updateItem } from './reducers/CartSlice';
import { Trash2,Minus,Plus } from 'lucide-react';
import { Link } from 'react-router-dom'


const CartItem = (props) => {
  
  const dispatch = useDispatch();

  const handleClick = (item)=>{
      dispatch(removeItem(item));
  }

  const [count,setCount] = useState(props.data.count);

  const decCount = (item)=>{
    if(count>1){
      setCount((prevCount) => {
        const newCount = prevCount - 1;
        dispatch(updateItem({ ...item, count: newCount }));
        return newCount;
      });
    }
  }

  const {pageData,size} = props.data;
  const category = pageData.category_name.toLowerCase()
 

  const incCount = (item)=>{
    setCount((prevCount) => {
      const newCount = prevCount + 1;
      dispatch(updateItem({ ...item, count: newCount }));
      return newCount;
    });
  }

  return (
    <div>
      <div className='flex'>
          <img className='w-40 m-2 rounded-sm' src={props.data.pageData.images}/>
          <div>

            <Link to={"/products/"+category+"/"+pageData.handle}><h1 className='font-bold text-xl my-4'>{props.data.pageData.product_name}
            </h1></Link>


            <h1 className='font-semibold text-lg my-3'>Size: {props.data.size}</h1>

              <div className='flex justify-start'>
                <button className='w-8 text-2xl border font-bold flex items-center justify-center border-r-0' onClick={()=>decCount({pageData,count,size})}><Minus /></button>

                <span className='w-8 p-1 border font-semibold text-xl border-l-0 border-r-0 flex justify-center'>{count}</span>

                <button className='w-8 text-2xl border font-bold flex items-center justify-center border-l-0 ' onClick={()=>incCount({pageData,count,size})}> <Plus /></button>
              </div>

           
            <h4 className="my-3 font-semibold text-lg">
                    {props.data.pageData.status && <s className='mr-2'>₹{props.data.pageData.original_price}</s>}
                    ₹{props.data.pageData.status===true? props.data.pageData.exclusive_price : props.data.pageData.original_price }
            </h4>
            <button className='p-2' onClick={()=>handleClick(props.data)}><Trash2/></button>
            </div>
      </div>
      <hr className='m-2'></hr>
    </div>
  )
}

export default CartItem