"use server";

import { revalidateTag } from "next/cache";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import db from "@/utils/db";
import { responseSchema } from "@/utils/schema";

export const getInitialResponse = async (tweetId: number) => {
 const responses = await db.response.findMany({
   where: {
     tweetId,
   },
   select: {
     id: true,
     text: true,
     created_at: true,
     tweetId: true,
     user: {
       select: {
         id: true,
         username: true,
       },
     },
   },
 });
 return responses;
};

export type InitialResponses = Prisma.PromiseReturnType<typeof getInitialResponse>;

export const addTweetResponse = async (formData: FormData) => {
 const text = formData.get("text");
 const tweetId = formData.get("tweetId");
 const result = responseSchema.safeParse(text);
 
 if (!result.success) {
   return { error: result.error.flatten(), isSuccess: false };
 }

 const session = await getServerSession(authOptions);
 
 if (!session || !session.user) {
   return {
     error: { message: "Not authenticated" },
     isSuccess: false
   };
 }

 try {
   await db.response.create({
     data: {
       userId: session.user.id,
       tweetId: Number(tweetId),
       text: result.data,
     },
   });
   revalidateTag(`tweet-responses-${tweetId}`);
   return { isSuccess: true };
 } catch (error) {
   console.error(error);
   return {
     error: { message: "Failed to create response" },
     isSuccess: false
   };
 }
};