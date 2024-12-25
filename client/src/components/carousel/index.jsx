import React from 'react';
import { Carousel } from 'antd';

import img1 from '../../assets/images/n1.png';
import img2 from '../../assets/images/n2.png';
import img3 from '../../assets/images/n3.png';



export default  () => (
  <Carousel autoplay className='ml-[40vw] py-20 w-[60vw] px-[10vw] z-10 opacity-80'>
    <div className=' text-center pb-2 '>
         <img className=' relative shadow-md w-full h-full  rounded-2xl' src={img1} alt='img1'></img>
    </div>
    <div className=' text-center pb-2 '>
         <img className=' relative shadow-md w-full h-full  rounded-2xl' src={img2} alt='img1'></img>
    </div>
    <div className=' text-center pb-2 '>
         <img className=' relative shadow-md w-full h-full rounded-2xl' src={img3} alt='img1'></img>
    </div>
  </Carousel>
  
);
