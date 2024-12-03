import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

interface PageProps {
 params: {
   id: string;
 };
}

export default async function TweetDetailPage({ params }: PageProps) {
 const tweet = await prisma.tweet.findUnique({
   where: { id: +params.id },
   include: {
     user: true,
     _count: {
       select: { likes: true }
     }
   }
 });

 if (!tweet) {
   notFound();
 }

 return (
   <div className="p-4">
     <div className="border rounded p-4">
       <p className="text-lg">{tweet.tweet}</p>
       <div className="mt-2 text-sm text-gray-500">
         <span>{tweet.user.username}</span>
         <span className="mx-2">•</span>
         <span>{tweet._count.likes} likes</span>
       </div>
     </div>
   </div>
 );
}