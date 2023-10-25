import React, { useEffect, useState } from 'react'
import {Link} from "react-router-dom";
import {Swiper,SwiperSlide} from "swiper/react";
import "swiper/css/bundle";
import SwiperCore from "swiper";
import {Navigation} from "swiper/modules";
import ListingItem from "../components/ListingItem"

export default function Home() {

  const [offerListings,setOfferListings] = useState([]);
  const [rentListings,setRentListings] = useState([]);
  const [saleListings,setSaleListings] = useState([]);

  SwiperCore.use([Navigation]);

  useEffect(()=>{

    const fetchSaleListings = async()=>{
      try {
        const res = await fetch("/api/listing/get?type=sale&limit=3");
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    }

    const fetchRentListings = async()=>{
      try {
        const res = await fetch("api/listing/get?type=rent&limit=3");
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    }

    const fetchOfferListings = async()=>{
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=3");
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    }

    fetchOfferListings();
  },[])
  return (
    <div>

      <div className='flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto'>
        <h1
        className='text-slate-700 font-bold text-3xl lg:text-6xl'
        >Find your next <span className='text-slate-500'>perfect</span>
        <br />
        place with ease
        </h1>

        <div className='txet-gray-400 text-xs sm:text-sm'>
          Canopy is the best place to find your next
          perfect place to live.
          <br />
          Choose from a wide range of properties worldwide.
        </div>
        <Link className='text-sx sm:text-sm text-blue-800 font-bold hover:underline'
        to={"/search"}>
          Get Started...
        </Link>
      </div>

      <div>
      <Swiper navigation>
      {offerListings && offerListings.length>0 && 
      offerListings.map((listing) => (
        <SwiperSlide key={listing._id}>
          <div key={listing._id}
          className='h-[500px]'
          style={{background : `url(${listing.imageUrls[0]}) center no-repeat`,backgroundSize:"cover"}}>

          </div>
        </SwiperSlide>
      ))
      }
      </Swiper>
      </div>

      <div 
      className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListings && offerListings.length>0 && (
          <div className='my-3'>
            <div>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent Offers</h2>
              <Link className='text-sm text-blue-800 hover:underline'
              to={"/search?offer=true"}>
                Show More...
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing)=>(
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {rentListings && rentListings.length>0 && (
          <div className='my-3'>
            <div>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent Places for Rent</h2>
              <Link className='text-sm text-blue-800 hover:underline'
              to={"/search?type=rent"}>
                Show More...
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing)=>(
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {saleListings && saleListings.length>0 && (
          <div className='my-3'>
            <div>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent Places for Sale</h2>
              <Link className='text-sm text-blue-800 hover:underline'
              to={"/search?type=sale"}>
                Show More...
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {saleListings.map((listing)=>(
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
