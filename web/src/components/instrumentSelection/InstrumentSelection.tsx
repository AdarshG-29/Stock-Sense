import { Input } from '@/components/ui/input';
import { useSearchItem } from '@/hooks/useSearchItem';
import { setInstrumentData } from '@/stores/instrumentChart/action';
import { SearchItemType } from '@/types/SearchItemType';
import React from 'react'


const InstrumentSelection = () => {
  const {searchInput, searchResults, onInputChange, clearFields} = useSearchItem();


  const onInstrumentSelect = (item: SearchItemType) => {
    const {instrument_key, instrument_type, trading_symbol, exchange, name} = item;
    setInstrumentData({
        instrument_key,
        instrument_type: instrument_type ?? '',
        trading_symbol,
        exchange : exchange ?? '',
        name: name,
        });
    clearFields();
  }

  const handleBlur = () => {
  setTimeout(() => {
    clearFields();
  }, 200);
  };

  return (
    <div className="flex flex-col w-[360px]">
      <label className="block mb-1 text-sm font-medium text-gray-700">Search Instruments</label>
      <div className='relative'>
      <Input
      type="text"
      placeholder="Search for stocks..."
      className="bg-white w-full max-w-md"
      value={searchInput}
      onBlur={handleBlur}
      onChange={(e) => onInputChange(e.target.value)}
      />
      {searchResults?.length > 0 && (
      <div className="absolute z-10 mt-1 w-full max-w-md bg-white border border-gray-300 rounded shadow-lg">
        {searchResults.map((item) => (
        <div
          key={item?.instrument_key}
          className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex justify-between"
          onClick={() => onInstrumentSelect(item)}
        >
          <span className="truncate">{item?.name}</span>
          {item.exchange && (
          <span className="px-2 py-1 text-xs font-medium text-white bg-blue-500 rounded-full">
            {item.exchange}
          </span>
          )}
        </div>
        ))}
      </div>
      )}
      </div>
    </div>
  )
}

export default InstrumentSelection