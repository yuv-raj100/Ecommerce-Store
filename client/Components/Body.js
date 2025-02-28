import React,{useState,useEffect} from 'react'
import CategoryWear from './CategoryWear'
import Banner from './Banner'
import { MoonLoader } from 'react-spinners';
import ScrollToTop from './ScrollToTop';


const Body = () => {

    ScrollToTop();
    const [carouselData,setCarouselData] = useState([]);
    const [banner,setBanner] = useState([]);
    const [loading,setLoading] = useState(true)


    useEffect(()=>{
        fetchData();
    },[])

    const server_url=process.env.REACT_APP_SERVER_URL
    const userInfo = JSON.parse(localStorage.getItem('user'))


    const fetchData = async ()=>{
        try {
            const res = await fetch(server_url + "/home");
            const data = await res.json();
            const homePageArray = data.homePage;
            setBanner(homePageArray[0].categories);
            setCarouselData(homePageArray[0].sliders);
            setLoading(!loading);
        } catch (error) {
            console.log(error);
        }
    }


    if(banner.length===0){
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

            {
                banner.map((s,index)=>{
                    return <Banner img={s.bannerURL}
                                   bannerText={s.bannerHeading}
                                   url={s.category_url}
                                   key={index} />
                })
            }

            {
                carouselData.map((s,index)=>{
                    return <CategoryWear heading={s.category}
                                         data={s.products}
                                         category_url={s.category_url}
                                         key={index}/>
                })
            }
            
        </div>
    )
}

export default Body