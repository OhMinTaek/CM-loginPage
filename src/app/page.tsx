import TweetList from "@/components/tweet-list";
import { getInitialTweets } from "../service/tweetService";

export default async function MainPage() {
  const tweets = await getInitialTweets();
  return (
    <div className="p-5 flex flex-col gap-5">
      <TweetList initialTweets={tweets} />
    </div>
  );
}