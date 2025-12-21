import React, { useState } from 'react';
import { Heart, Share2 } from 'lucide-react';

const SecondaryActions = ({ onShare }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6 flex-col sm:flex-row">
      <button
        onClick={() => setIsFavorite(!isFavorite)}
        className={`flex-1 py-2 sm:py-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 text-sm sm:text-base ${
          isFavorite
            ? 'border-red-500 bg-red-50 text-red-600'
            : 'border-slate-300 hover:border-red-500 hover:bg-red-50 hover:text-red-600'
        }`}
      >
        <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isFavorite ? 'fill-current' : ''}`} />
        <span className="font-medium hidden sm:inline">{isFavorite ? 'Saved' : 'Save'}</span>
        <span className="font-medium sm:hidden">{isFavorite ? 'Save' : 'Like'}</span>
      </button>
      <button
        onClick={() => onShare && onShare()}
        className="flex-1 py-2 sm:py-3 rounded-lg border-2 border-slate-300 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
      >
        <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="font-medium hidden sm:inline">Share</span>
        <span className="font-medium sm:hidden">Share</span>
      </button>
    </div>
  );
};

export default SecondaryActions;
