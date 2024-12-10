"use server";

import db from "@/utils/db";
import { keywordSchema } from "@/utils/scehma";

export async function searchTweet(_: unknown, formData: FormData) {
  const keyword = formData.get("keyword");
  const result = keywordSchema.safeParse(keyword);
  if (!result.success) return { data: null, error: result.error.flatten(), keyword };
  return { data: await getTWeetByKeyword(result.data), error: null, keyword };
}
export async function getTWeetByKeyword(keyword: string) {
  const tweets = await db.tweet.findMany({
    where: {
      tweet: {
        contains: keyword,
      },
    },
    include: {
      _count: {
        select: {
          responses: true,
          likes: true,
        },
      },
      user: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });
  return tweets;
}