import { notFound } from "next/navigation";
import db from "@/utils/db";

async function getTweet(id: string) {
  const tweet = await db.tweet.findUnique({
    where: { id: parseInt(id) },
    include: {
      user: { select: { username: true } }
    }
  });
  return tweet;
}

export default async function TweetDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (isNaN(parseInt(id))) return notFound();
  
  const tweet = await getTweet(id);
  if (!tweet) return notFound();

  return (
    <div className="pb-36">
      <h3 className="p-5 flex items-center gap-3 border-b border-neutral-500">
        {tweet.user.username}
      </h3>
      <p className="p-5">{tweet.tweet}</p>
    </div>
  );
}