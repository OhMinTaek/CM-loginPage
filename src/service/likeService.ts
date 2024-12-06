"use server";

import { revalidateTag } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import db from "@/utils/db";

export const getLikeStatus = async (tweetId: number, userId: number) => {
 const like = await db.like.findUnique({
   where: {
     userId_tweetId: {
       userId,
       tweetId,
     },
   },
 });
 const likeCount = await db.like.count({
   where: {
     tweetId,
   },
 });
 return {
   isLiked: Boolean(like),
   likeCount,
 };
};

export const likeTweet = async (tweetId: number) => {
 const session = await getServerSession(authOptions);
 
 if (!session || !session.user) {
   return { error: "Not authenticated" };
 }

 try {
   await db.like.create({
     data: {
       userId: session.user.id,
       tweetId,
     },
   });
   revalidateTag(`like-status-${tweetId}`);
   return { success: true };
 } catch (error) {
   console.error(error);
   return { error: "Failed to like tweet" };
 }
};

export const dislikeTweet = async (tweetId: number) => {
 const session = await getServerSession(authOptions);
 
 if (!session || !session.user) {
   return { error: "Not authenticated" };
 }

 try {
   await db.like.delete({
     where: {
       userId_tweetId: { 
         userId: session.user.id, 
         tweetId 
       },
     },
   });
   revalidateTag(`like-status-${tweetId}`);
   return { success: true };
 } catch (error) {
   console.error(error);
   return { error: "Failed to unlike tweet" };
 }
};