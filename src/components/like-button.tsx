'use client';

import { useState } from "react";
import { Heart } from "lucide-react";

export default function LikeButton({ 
  tweetId, 
  isLiked, 
  likeCount 
}: { 
  tweetId: number;
  isLiked: boolean;
  likeCount: number;
}) {
  const [isLikedState, setIsLikedState] = useState(isLiked);
  const [likeCountState, setLikeCountState] = useState(likeCount);

  const handleLike = async () => {
    try {
      const res = await fetch('/api/tweets/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tweetId,
        }),
      });

      if (!res.ok) throw new Error('Failed to like/unlike');

      setIsLikedState(!isLikedState);
      setLikeCountState(prev => isLikedState ? prev - 1 : prev + 1);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <button 
      onClick={handleLike}
      className="flex items-center gap-1"
    >
      <Heart 
        className={`w-6 h-6 ${isLikedState ? 'fill-red-500 text-red-500' : 'text-neutral-500'}`}
      />
      <span className="text-sm">
        {likeCountState}
      </span>
    </button>
  );
}