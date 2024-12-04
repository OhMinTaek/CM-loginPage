'use client';
import Link from "next/link";
import { useEffect, useState } from "react";
import { User } from "@prisma/client";

export default function ListTweet({
 tweet,
 created_at,
 id,
 user,
}: {
 tweet: string;
 created_at: Date;
 id: number;
 user: User;
}) {
 const [timeAgo, setTimeAgo] = useState("");

 useEffect(() => {
   const formatTime = () => {
     const seconds = Math.floor((new Date().getTime() - new Date(created_at).getTime()) / 1000);
     const intervals = {
       year: 31536000,
       month: 2592000,
       week: 604800,
       day: 86400,
       hour: 3600,
       minute: 60,
       second: 1
     };

     for (const [unit, secondsInUnit] of Object.entries(intervals)) {
       const interval = Math.floor(seconds / secondsInUnit);
       if (interval >= 1) {
         return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
       }
     }
     return "just now";
   };

   setTimeAgo(formatTime());
   const timer = setInterval(() => setTimeAgo(formatTime()), 1000);
   return () => clearInterval(timer);
 }, [created_at]);

 return (
   <Link href={`/tweets/${id}`} className="flex flex-col p-10 rounded-2xl *:text-stone-700 hover:bg-stone-200">
     <div className="flex items-center justify-between">
       <span className="text-lg font-bold">{user.username}</span>
       <span className="text-sm text-stone-400">{timeAgo}</span>
     </div>
     <p className="text-lg">{tweet.slice(20)}...</p>
   </Link>
 );
}