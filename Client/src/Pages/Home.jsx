import React from 'react';
import Hero from '../Components/Hero';
import FeaturedSection from '../Components/FeaturedSection';
import Banner from '../Components/Banner';
import Testimonial from '../Components/Testimonial';
import Newsletter from '../Components/Newsletter';

const Home = () =>{
    return (
  <div>
    <Hero />
    <FeaturedSection />
    <Banner />
    <Testimonial />
    <Newsletter />
  </div>
    )
};

export default Home;