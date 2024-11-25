import React from 'react';
import SearchBar from './components/SearchBar';
import Bookmarks from './components/Bookmarks';
import Greeting from './components/Greeting';
import Weather from './components/Weather';
import SpotifyPlayer from './components/SpotifyPlayer';

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center px-6 relative">
      <div className="w-full max-w-6xl fixed top-6 flex justify-end gap-2 z-50">
        <SpotifyPlayer />
        <Weather />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-6xl mx-auto">
        <Greeting />
        <SearchBar />
        <div className="mt-8">
          <Bookmarks />
        </div>
      </div>
    </div>
  );
}

export default App;