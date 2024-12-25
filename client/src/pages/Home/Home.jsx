import React from "react";
import Carousel from "../../components/carousel";
import img1 from '../../assets/images/smart-watch.png';
import img2 from '../../assets/images/n2.png';
import img3 from '../../assets/images/n3.png';
import title from '../../assets/images/title.png';

const Home = () => {
  return (<div className=" absolute text-center font-bold flex justify-center items-center w-full h-full text-white">
    {/* <span className="text-3xl leading-[70px] tracking-widest text-white">
     新しいビジネスチャンス！<br/>加入者全員が収益を得る無在庫システムで、<br/>あなたも成功の一員に！
    </span> */}
    <img width={1000} src={title} alt="title" />
  </div>

  );
};

export default Home;
