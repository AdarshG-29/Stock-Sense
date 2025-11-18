"use client";

import { Input } from "@/components/ui/input";
import { useSearchItem } from "@/hooks/useSearchItem";
import {  getHistoricalCandles } from "@/services/candles.api";
import { SearchItemType } from "@/types/SearchItemType";

const Home = () => {
  const {searchInput, searchResults, onInputChange} = useSearchItem();

  const onStockClick = async (item: SearchItemType) => {
    try{
      const res = await getHistoricalCandles(item?.instrument_key);
      console.log("Today's Candles:", res?.data);
    } catch (error) {
      console.error("Error fetching today's candles:", error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center text-center h-[60vh]">
      <h1 className="text-4xl font-bold">Welcome to Stock Sense</h1>
      <Input
        type="text"
        placeholder="Search for stocks..."
        className="mt-4 w-1/2"
        value={searchInput}
        onChange={(e) => onInputChange(e.target.value)}
      />
      {searchResults?.map((item) => (
        <div key={item?.instrument_key} className="mt-2" onClick={() => onStockClick(item)}>
          {item?.name}
        </div>
      ))}
    </div>
  );
};

export default Home;
