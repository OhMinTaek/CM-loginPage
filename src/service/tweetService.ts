"use server";

import { Prisma } from "@prisma/client";
import { z } from "zod";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import db from "../utils/db";

const LIMIT_NUMBER = 2;
export const getInitialTweets = async () => {
 const tweets = db.tweet.findMany({
   include: { user: true },
   take: LIMIT_NUMBER,
   orderBy: {
     created_at: "desc",
   },
 });
 return tweets;
};
export type InitialTweets = Prisma.PromiseReturnType<typeof getInitialTweets>;

export async function getTweetsByPage(page: number) {
 const tweets = await db.tweet.findMany({
   include: { user: true },
   skip: LIMIT_NUMBER * (page - 1),
   take: LIMIT_NUMBER,
   orderBy: {
     created_at: "desc",
   },
 });
 return tweets;
}

export async function getTweetTotalCount() {
 return db.tweet.count();
}

export async function getPaginatedTweets(page: number) {
 const tweets = await getTweetsByPage(page);
 const TWEETS_TOTAL_COUNT = await getTweetTotalCount();
 const isLastPage = TWEETS_TOTAL_COUNT <= LIMIT_NUMBER * page;
 return { tweets, isLastPage };
}

const tweetSchema = z.object({
 tweet: z.string({
   required_error: "Tweet is required.",
 }),
});

export async function uploadTweet(_: unknown, formData: FormData) {
 const data = {
   tweet: formData.get("tweet"),
 };

 const result = tweetSchema.safeParse(data);
 if (!result.success) {
   return {
     error: result.error.flatten(),
     isSuccess: false,
   };
 }

 const session = await getServerSession(authOptions);
 
 if (!session || !session.user) {
   return {
     error: { message: "Not authenticated" },
     isSuccess: false,
   };
 }

 try {
   const tweet = await db.tweet.create({
     data: {
       tweet: result.data.tweet,
       userId: session.user.id
     },
   });
   redirect(`/tweets/${tweet.id}`);
 } catch (error) {
   console.error("Error creating tweet:", error);
   return {
     error: { message: "Failed to create tweet" },
     isSuccess: false,
   };
 }
}

export async function getTweetDetail(tweetId: number) {
 const tweet = await db.tweet.findUnique({
   where: {
     id: tweetId,
   },
   include: {
     user: {
       select: {
         username: true,
       },
     },
     _count: {
       select: {
         responses: true,
       },
     },
   },
 });
 return tweet;
}