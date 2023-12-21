import { CopySlash } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const ScrollableComponent = ({ items }) => {

    return (
        <div className="flex overflow-x-auto py-2">
            {items.map((item, index) => (
                <div key={index} className="flex-shrink-0 w-64 p-4 border">
                <img src={item.image}/>
                <Link to={"/products/"+item.category_name+"/"+item.handle}><h3 className="text-lg font-bold py-2">{item.product_name}</h3></Link>

                <div className={item.status?'flex justify-between items-center':''}>
                    <h4 className="text-gray-500">
                        {item.status && <s className='mr-2'>₹{item.original_price}</s>}
                        ₹{item.status===true? item.exclusive_price : item.original_price }
                    </h4>

                    {item.status && 
                        <h1 className='bg-red-500 p-1 mr-2 text-white text-lg'>-{Math.floor(((item.original_price-item.exclusive_price)/item.original_price)*100)}%</h1>}
                </div>
                    
                <p>{item.description}</p>
                </div>
            ))}
        </div>
    );
};

export default ScrollableComponent