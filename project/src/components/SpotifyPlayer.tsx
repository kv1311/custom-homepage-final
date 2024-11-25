import React, { useState, useRef, useEffect } from 'react';
import { Music } from 'lucide-react';

interface SpotifyPlayerProps {
  defaultPlaylistUrl?: string;
}

export default function SpotifyPlayer({ defaultPlaylistUrl = "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M" }: SpotifyPlayerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [playlistUrl, setPlaylistUrl] = useState(defaultPlaylistUrl);
  const [isContextMenu, setIsContextMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const menuRef = useRef<HTMLDivElement>(null);

  const getEmbedUrl = (url: string) => {
    const playlistId = url.split('/').pop()?.split('?')[0];
    return `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`;
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      setMenuPosition({
        x: Math.min(e.clientX, window.innerWidth - 300),
        y: rect.bottom + window.scrollY + 8
      });
    }
    setIsContextMenu(true);
  };

  const handleLongPress = () => {
    window.open(playlistUrl, '_blank');
  };

  const handleTouchStart = () => {
    timeoutRef.current = setTimeout(handleLongPress, 500);
  };

  const handleTouchEnd = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsContextMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef}>
      <button
        ref={buttonRef}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-lg hover:bg-white/10 transition-all"
        onClick={() => setIsVisible(!isVisible)}
        onContextMenu={handleContextMenu}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Music className="w-5 h-5" />
      </button>

      <div className={`absolute top-full right-0 mt-2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <iframe
          src={getEmbedUrl(playlistUrl)}
          width="300"
          height="380"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="rounded-2xl"
        />
      </div>

      {isContextMenu && (
        <div
          ref={menuRef}
          className="fixed bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg shadow-lg py-2 z-50"
          style={{ top: menuPosition.y, left: menuPosition.x }}
        >
          <div className="px-4 py-2">
            <input
              type="text"
              value={playlistUrl}
              onChange={(e) => setPlaylistUrl(e.target.value)}
              className="w-64 bg-black/20 border border-white/10 rounded px-3 py-1 text-sm text-white"
              placeholder="Spotify playlist URL"
            />
          </div>
        </div>
      )}
    </div>
  );
}