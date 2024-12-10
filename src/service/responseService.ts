"use server";

import { revalidateTag } from "next/cache";
import { Prisma } from "@prisma/client";

import db from "@/utils/db";
import { getSession } from "@/utils/session";
import { responseSchema } from "@/utils/scehma";

export const getInitialResponse = async (tweetId: number) => {
  const responses = await db.response.findMany({
    where: {
      tweetId,
    },
    select: {
      id: true,
      text: true,
      created_at: true,
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
  
  const session = await getSession();
  
  try {
    if (!session.id) {
      throw new Error("Authentication required");
    }
    
    const response = await db.response.create({
      data: {
        userId: session.id,
        tweetId: Number(tweetId),
        text: result.data,
      },
    });
    
    revalidateTag(`tweet-responses-${tweetId}`);
    return { isSuccess: true, data: response };
    
  } catch (error) {
    console.error(error);
    return { error: "Failed to add response", isSuccess: false };
  }
};
