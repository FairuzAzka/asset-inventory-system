// components/assets/AssetSearchFilter.js
import React, { useState } from 'react';
import { SearchIcon } from '@heroicons/react/solid';

const AssetSearchFilter = ({ globalFilter, setGlobalFilter }) => {
  const [value, setValue] = useState(globalFilter);
  
  const handleChange = (e) => {
    setValue(e.target.value);
    setGlobalFilter(e.target.value || undefined);
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SearchIcon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={value || ''}
        onChange={handleChange}
        placeholder="Search assets by name or number..."
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm 
                  placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
    </div>
  );
};

export default AssetSearchFilter;