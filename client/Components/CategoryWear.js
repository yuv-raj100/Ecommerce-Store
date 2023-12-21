import React from 'react'
import ScrollableComp from './ScrollableComp';
import { Link } from 'react-router-dom';

const CategoryWear = ({heading,data,category_url}) => {

    return (
        <div className='my-8 mx-4'>
            <div className='flex justify-between'>
                <h1 className='font-bold text-lg'>{heading}</h1>
                <Link to={"/products/"+category_url}><button>View all</button></Link>
            </div>
            <ScrollableComp items={data}/>
        </div>
    )
}

export default CategoryWear