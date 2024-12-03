'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Tweet {
  id: number;
  tweet: string;
  user: {
    username: string;
  };
  _count: {
    likes: number;
  };
}

export default function TweetList({
  tweets,
  currentPage,
  totalPages
}: {
  tweets: Tweet[];
  currentPage: number;
  totalPages: number;
}) {
  const router = useRouter();

  return (
    <div>
      <h1>Tweets</h1>
      <div className="space-y-4">
        {tweets.map((tweet) => (
          <Link 
            key={tweet.id}
            href={`/tweets/${tweet.id}`}  // 템플릿 리터럴을 문자열로 감싸야 함
            className="block p-4 border rounded hover:bg-gray-50"
          >
            <p>{tweet.tweet}</p>
            <div className="mt-2 text-sm text-gray-500">
              <span>{tweet.user.username}</span>
              <span className="mx-2">•</span>
              <span>{tweet._count.likes} likes</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-4 flex justify-center gap-4">
        {currentPage > 1 && (
          <button
            onClick={() => router.push(`/?page=${currentPage - 1}`)}  // 템플릿 리터럴을 문자열로 감싸야 함
            className="px-4 py-2 border rounded"
          >
            Previous
          </button>
        )}
        {currentPage < totalPages && (
          <button
            onClick={() => router.push(`/?page=${currentPage + 1}`)}  // 템플릿 리터럴을 문자열로 감싸야 함
            className="px-4 py-2 border rounded"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}