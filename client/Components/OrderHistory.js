import React from 'react'
import { Link } from 'react-router-dom'

const OrderHistory = (props) => {

    const {pageData,total,orderId} = props;
 
    return (
        <div className='border p-2 pr-3'>

            <div>
                <h1 className='font-semibold text-lg my-3'>OrderID: {orderId}</h1>
            </div>

            {
                pageData.map((s)=>{
                    console.log(s.pageData);
                    const category = s.pageData.category_name.toLowerCase();
                    return (
                    <div className='flex'>

                        <img className='w-40 m-2 rounded-sm' src={s.pageData.images}/>
                        <div>

                            <Link to={"/products/"+category+"/"+s.pageData.handle}><h1 className='font-bold text-xl my-4'>{s.pageData.product_name}
                            </h1></Link>


                            <h1 className='font-semibold text-lg my-3'>Size: {s.size}</h1>
                        
                            <h4 className="my-3 font-semibold text-lg">
                                    ₹{s.pageData.status===true? s.pageData.exclusive_price : s.pageData.original_price }
                            </h4>
                        </div>
                    </div>)
                })
            }  
            <h1 className='font-semibold text-lg my-3 text-right'>Amount Paid: {total}</h1> 
    </div>
    )
}

export default OrderHistory