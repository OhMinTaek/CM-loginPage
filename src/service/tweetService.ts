"use server";

import { Prisma } from "@prisma/client";
import { z } from "zod";
import db from "../utils/db";
import { getSession } from "@/utils/session";

// 트윗 응답 타입 정의
interface TweetResponse {
  tweet?: {
    id: number;
    tweet: string;
    userId: number;
    created_at: Date;
  };
  error?: {
    fieldErrors: Record<string, string[]>;
    formErrors: string[];
  };
  isSuccess: boolean;
}

const LIMIT_NUMBER = 2;

export const getInitialTweets = async () => {
  const tweets = await db.tweet.findMany({
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

export async function uploadTweet(_: unknown, formData: FormData): Promise<TweetResponse> {
  const session = await getSession();
  if (!session.id) {
    return {
      error: { fieldErrors: {}, formErrors: ["Please log in to tweet"] },
      isSuccess: false
    };
  }

  const existingUser = await db.user.findUnique({
    where: {
      id: session.id
    }
  });

  if (!existingUser) {
    return {
      error: { fieldErrors: {}, formErrors: ["User not found"] },
      isSuccess: false
    };
  }

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

  try {
    const tweet = await db.tweet.create({
      data: {
        tweet: result.data.tweet,
        userId: session.id
      },
      select: {
        id: true,
        tweet: true,
        userId: true,
        created_at: true,
      },
    });

    return {
      tweet,
      isSuccess: true,
    };
  } catch {
    return {
      error: { fieldErrors: {}, formErrors: ["Failed to create tweet"] },
      isSuccess: false
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