import React, { KeyboardEvent } from 'react';
import { Search } from 'lucide-react';

export default function SearchBar() {
  const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const query = encodeURIComponent(e.currentTarget.value);
      window.location.href = `https://www.bing.com/search?q=${query}`;
    }
  };

  return (
    <div className="relative w-full max-w-2xl">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Search the web..."
        className="w-full search-bar py-4 px-12 rounded-[24px] text-white text-lg"
        onKeyDown={handleSearch}
      />
    </div>
  );
}