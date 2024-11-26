import React, { useState, useEffect } from 'react';
import { Plus, X, Globe } from 'lucide-react';
import { browserStorage } from '../utils/browserStorage';

interface Bookmark {
  id: string;
  url: string;
}

const defaultBookmarks: Bookmark[] = [
  { id: '1', url: 'https://github.com' },
  { id: '2', url: 'https://twitter.com' }
];

const getFaviconUrl = (url: string): string => {
  const hostname = new URL(url).hostname;
  return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
};

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(defaultBookmarks);
  const [isAdding, setIsAdding] = useState(false);
  const [newBookmark, setNewBookmark] = useState({ url: '' });

  useEffect(() => {
    const loadBookmarks = async () => {
      const stored = await browserStorage.get('bookmarks');
      if (stored) {
        try {
          setBookmarks(JSON.parse(decodeURIComponent(stored)));
        } catch (e) {
          console.error('Error parsing bookmarks:', e);
        }
      }
    };
    loadBookmarks();
  }, []);

  useEffect(() => {
    browserStorage.set('bookmarks', encodeURIComponent(JSON.stringify(bookmarks)));
  }, [bookmarks]);

  const addBookmark = () => {
    if (newBookmark.url) {
      const url = newBookmark.url.startsWith('http') ? newBookmark.url : `https://${newBookmark.url}`;
      const newBookmarks = [...bookmarks, {
        id: Date.now().toString(),
        url
      }];
      
      setBookmarks(newBookmarks);
      setNewBookmark({ url: '' });
      setIsAdding(false);
    }
  };

  const removeBookmark = (id: string) => {
    const updatedBookmarks = bookmarks.filter(b => b.id !== id);
    setBookmarks(updatedBookmarks);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addBookmark();
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="grid grid-cols-10 gap-3 justify-items-center">
        {bookmarks.map(bookmark => (
          <div key={bookmark.id} className="bookmark-item group relative">
            <a
              href={bookmark.url}
              className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-white/5 transition-all"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img 
                src={getFaviconUrl(bookmark.url)}
                alt=""
                className="w-7 h-7"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '';
                  e.currentTarget.className = 'hidden';
                  e.currentTarget.parentElement?.appendChild(
                    Object.assign(document.createElement('div'), {
                      className: 'w-7 h-7 flex items-center justify-center',
                      children: [
                        Object.assign(document.createElement('div'), {
                          className: 'text-gray-300',
                          children: [document.createElement('Globe')]
                        })
                      ]
                    })
                  );
                }}
              />
            </a>
            <button
              onClick={() => removeBookmark(bookmark.id)}
              className="absolute -top-1 -right-1 p-1 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3 text-gray-400" />
            </button>
          </div>
        ))}
        
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-white/5 transition-all"
        >
          <Plus className="w-6 h-6 text-gray-400" />
        </button>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-zinc-900 p-6 rounded-2xl w-full max-w-md">
            <h3 className="text-xl font-medium mb-4">Add Bookmark</h3>
            <input
              type="text"
              placeholder="URL"
              className="w-full mb-4 bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white"
              value={newBookmark.url}
              onChange={e => setNewBookmark({ ...newBookmark, url: e.target.value })}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-lg text-gray-400 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={addBookmark}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}