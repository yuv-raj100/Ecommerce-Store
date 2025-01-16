import React, { useEffect, useState } from 'react'
import ItemCard from './ItemCard';
import { useParams } from 'react-router-dom'
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
    const [pageNumber,setPageNumber]=useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [btnText, setBtnText] = useState("Sort By");
     

    const server_url = process.env.REACT_APP_SERVER_URL;

    const fetchData = async (sortStyle="default") => {

      if(!hasMore)
        return ; 

      setLoading(true);
      try {
        const params = new URLSearchParams({ page: pageNumber, limit: 6, sort:sortStyle });
        const url = `${server_url}/products/${
          obj.category
        }?${params.toString()}`;
        const res = await fetch(url);
        const data = await res.json();
        console.log(data);
        setProductList((prevData) => [...prevData, ...data.result]);
        // setFilterList((prevData) => [...prevData, ...data.result]);
        data.result.length>0 ? setHasMore(true) : setHasMore(false);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    useEffect(()=>{
        if(hasMore)
            fetchData();
    },[pageNumber])

       const handleScroll = () => {
         const { scrollTop, clientHeight, scrollHeight } =
           document.documentElement;
        //console.log(scrollTop+" "+scrollHeight+" "+clientHeight);
         if (scrollTop + clientHeight >= scrollHeight-100) {
           setPageNumber((prevPage) => prevPage + 1);
         }
       };

       useEffect(() => {
         window.addEventListener("scroll", handleScroll);
         return () => window.removeEventListener("scroll", handleScroll);
       }, []);


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
            setBtnText("Price (High to Low)");
            fetchData("htol")
        }
        else if(e==="ltoh"){
            setBtnText("Price (Low to High)");
            fetchData("ltoh")
        }
        else{ 
            setBtnText("Sort By"); 
            fetchData();
        }
        setPageNumber(1);
        setProductList([]);
        setSort(!sort)
    }

    // if(productList.length===0){
    //     return (
    //         <div className='flex justify-center mt-48 h-screen'>
    //             <MoonLoader
    //             color="#FE4B69"
    //             margin={2}
    //             loading={loading}
    //             />
    //         </div>
    //     )
    // }

    return (
      <div className={`min-h-full ${loading && "pb-96"} relative`}>
        <div className="flex items-center justify-center">
          <input
            type="text"
            className="w-60 border p-2"
            placeholder="Search"
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
            value={searchText}
          />
          <button className="border p-2" onClick={handleSearch}>
            <Search />
          </button>
          {display && (
            <button className="border p-2" onClick={handleDisplay}>
              <X />
            </button>
          )}
        </div>
        <hr className="m-4" />

        <div className="mt-4 ml-4 relative mr-4 mb-0 grid-rows-1">
          <button className="p-2 border w-1/2" onClick={() => setSort(!sort)}>
            {btnText}
          </button>
          <button className="p-2 border w-1/2">Refine By</button>
        </div>
        {sort && (
          <div className="mt-1 absolute grid ml-4 mr-4 mb-4 z-10 bg-white">
            <button
              className="border border-b-0 p-2 w-52"
              onClick={() => handleSort("htol")}
            >
              Price (High to Low)
            </button>

            <button
              className="border border-t-0 border-b-0 p-2"
              onClick={() => handleSort("ltoh")}
            >
              Price (Low to High)
            </button>

            <button
              className="border border-t-0 p-2"
              onClick={() => handleSort("rel")}
            >
              Relevance
            </button>
          </div>
        )}

        <div className="flex flex-wrap m-1 justify-around">
          {productList.map((s, index) => (
            <Link
              key={s.title}
              to={"/products/" + obj.category + "/" + s.handle}
            >
              <ItemCard
                name={s.product_name}
                handle={s.handle}
                price_max={s.original_price}
                price_min={s.exclusive_price}
                imgURL={s.images[0]}
                key={index}
                sale_status={s.status}
              />
            </Link>
          ))}
        </div>
        <div
          className={`flex mt-0 ${loading ? "h-16" : "h-full"} justify-center mt-12`}
        >
          <MoonLoader color="#FE4B69" margin={2} loading={loading} />
        </div>
      </div>
    );
}

export default Products