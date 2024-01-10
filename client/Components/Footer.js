import React, { useState } from 'react'
import { Instagram,Facebook,Copyright } from 'lucide-react';


const Footer = () => {

    const [showDiv,setShowDiv] = useState(false)
    const [showAbout,setShowAbout] = useState(false);

    return (
        <div className='relative bottom-0 left-0 right-0 bg-gray-800 text-white p-4 mt-8'>
            <button onClick={()=>{
                if(showAbout===true){
                    setShowAbout(false);
                }
                setShowDiv(!showDiv);
            }} className='mb-4'>SUPPORT</button>
            {showDiv && (
                <div>
                    <ul>
                        <li>Contact us</li>
                        <li>Track your order</li>
                        <li>Exchange and Returns</li>
                        <li>FAQs</li>
                        <li>Terms of service</li>
                    </ul>
                </div>
            )}
            <hr className='mt-2 mb-2'></hr>
            <button className='mt-4 mb-4' onClick={()=>{
                if(showDiv===true){
                    setShowDiv(false);
                }
                setShowAbout(!showAbout);
            }}>ABOUT US</button>
            {showAbout && (
                <div className='text-white'>
                    We at NEXGEN strive to provide the best quality clothing and service at amazing prices with free and express shipping and a delightful after sales service. Feel free to reach out to us at +91 9720306743 or nexgen@gmail.com
                </div>
            )}
            <hr className='mt-2 mb-2'></hr>
            <h1 className='mt-8 mb-4'>Follow Us</h1>
            <div className='flex'>
                <Instagram/>
                <h1 className='mr-2'></h1>
                <Facebook />
            </div>
            <div className='flex mt-10'>
                <Copyright/>
                <span className='ml-1'>2023</span>
                <span className='ml-1'>nexGen</span>
            </div>
        </div>
    )
}

export default Footer