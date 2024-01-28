import React, { useEffect, useState, CSSProperties } from 'react'
import ItemCard from './ItemCard';
import { useParams } from 'react-router-dom'
import {server_url} from './utils/constants';
import { Link } from 'react-router-dom';
import { Search ,X} from 'lucide-react';
import { MoonLoader } from 'react-spinners';
import ScrollToTop from './ScrollToTop';



const Products = () => {

    ScrollToTop();
    const obj = useParams();

    const [productList,setProductList] = useState([]);
    const [filterList,setFilterList] = useState([]);
    const [searchText,setSearchText] = useState("");
    const [display,setDisplay] = useState(false);
    const [sort,setSort] = useState(false);
    const [loading,setLoading] = useState(true)

    useEffect(()=>{
        fetchData();
    },[])

    const fetchData = async ()=>{
        const res = await fetch(server_url+"products/"+obj.category);
        const data = await res.json();
        setProductList(data);
        setFilterList(data);
        setLoading(!loading);
    }


    const handleSearch = ()=>{
        const filterRest = productList.filter((res)=>{
            return res.product_name.toLowerCase().includes(searchText.toLowerCase())
        })
        setFilterList(filterRest);
        setDisplay(!display);
    }

    const handleDisplay = ()=>{
        setFilterList(productList);
        setSearchText("");
        setDisplay(!display);
    }

    const handleSort = (e)=>{
        if(e==="htol"){
           
            const newList = [...filterList].sort((a, b) => b.original_price - a.original_price);
            setFilterList(newList)
        }
        else if(e==="ltoh"){
            const newList = [...filterList].sort((a, b) => a.original_price - b.original_price);
            setFilterList(newList)
        }
        else{
            setFilterList(productList);
        }
        setSort(!sort)
    }

    if(productList.length===0){
        return (
            <div className='flex justify-center mt-48 h-screen'>
                <MoonLoader
                color="#FE4B69"
                margin={2}
                loading={loading}
                />
            </div>
        )
    }

    return (

        <div>
            <div className='flex items-center justify-center'>
                <input type="text" className='w-60 border p-2'
                    placeholder='Search'
                    onChange={(e)=>{
                        setSearchText(e.target.value)
                    }}
                    value={searchText}
                />
                <button className='border p-2' onClick={handleSearch}><Search /></button>
                {display && <button className='border p-2' onClick={handleDisplay}><X /></button>}

            </div>
            <hr className='m-4'/>
            
            <div className='mt-4 ml-4 relative mr-4 mb-0 grid-rows-1'>
                <button className='p-2 border w-1/2' onClick={()=>setSort(!sort)}>Sort By</button>
                <button className='p-2 border w-1/2'>Refine By</button>
               
            </div>
            {
                sort && <div className='mt-1 absolute grid ml-4 mr-4 mb-4 z-10 bg-white'>
                    <button className='border border-b-0 p-2 w-52' onClick={()=>handleSort("htol")}>Price (High to Low)</button>

                    <button className='border border-t-0 border-b-0 p-2' onClick={()=>handleSort("ltoh")}>Price (Low to High)</button>

                    <button className='border border-t-0 p-2' onClick={()=>handleSort("rel")}>Relevance</button>

                </div>
            }

            {/* {
                sort && <div className='mt-1 absolute grid ml-4 mr-4 mb-4 z-10 bg-white'>
                    <button className='border border-b-0 p-2 w-52' onClick={()=>handleSort("htol")}>Colors</button>

                    <button className='border border-t-0 border-b-0 p-2' onClick={()=>handleSort("ltoh")}>Price (Low to High)</button>

                    <button className='border border-t-0 p-2' onClick={()=>handleSort("rel")}>Relevance</button>

                </div>
            } */}

            

            <div className='flex flex-wrap m-1 justify-around'>
                {
                    filterList.map((s,index)=>(<Link key={s.title}
                                                to={"/products/"+obj.category+"/"+s.handle}><ItemCard
                                                name={s.product_name}
                                                handle={s.handle}
                                                price_max={s.original_price}
                                                price_min={s.exclusive_price}
                                                imgURL={s.images[0]}
                                                key={index}
                                                sale_status={s.status}
                                        />
                                        </Link>
                                    ))
                }
            </div>
        </div>
    )
}

export default Products