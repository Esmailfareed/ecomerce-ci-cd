import React ,{ useEffect, useState } from 'react'
import styles from './CategorySlider.module.css'
import Slider from "react-slick";
import axios from "axios";
import { API_URL } from "../../config";
export default function CategorySlider() {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 1
  };

const [categories, setCategories] = useState([])
async  function getCategories () 
  {
   let {data} = await axios.get(`${API_URL}/api/v1/categories`);
   setCategories(data.data)
  }
  useEffect(() => {
    getCategories ();
    }, []);


  return <>
    <div className="mb-5 mt-3">
    <Slider {...settings}>
      {categories.map((category)=><div key={category._id}>
        <img height={200} className='w-100' src={category.image} alt="" />
        <h3 className='h6'>{category.name}</h3>
 </div>)}
 
    </Slider>
</div>
    
    </>
  
}
