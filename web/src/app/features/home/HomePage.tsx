"use client"
import { getHistoricalCandles } from '@/services/candles.api'
import React, { useEffect } from 'react'

const Home = () => {
  useEffect(() => {
    const fetchHistoricalCandles = async () => {
      try{
        const res = await getHistoricalCandles()
        console.log(res.data)
      }
   catch(error){
        console.error('Error fetching historical candles:', error)
      }
    }
    fetchHistoricalCandles()
  },[])

  return (
    <div className='flex flex-col items-center justify-center text-center h-[60vh]'>
      <h1 className='text-4xl font-bold'>Welcome to Stock Sense</h1>
    </div>
  )
}

export default Home