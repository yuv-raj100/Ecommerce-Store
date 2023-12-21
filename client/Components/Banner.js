import React from 'react'
import { Link } from 'react-router-dom'

const Banner = ({img,bannerText,url}) => {

    return (
        <div>
            <div className="relative">
                <Link to={`/products/${url}`}><img src={img} alt="Hoodies" className="w-full h-auto" /></Link>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-2xl font-bold w-80 text-center">
                    {bannerText}
                </div>
            </div>
        </div>
    )
}

export default Banner