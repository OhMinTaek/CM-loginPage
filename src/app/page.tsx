import TweetList from "@/components/tweet-list";
import { getInitialTweets } from "../service/tweetService";
import AddTweet from "../components/add-tweet";

export default async function MainPage() {
  const tweets = await getInitialTweets();
  return (
    <div className="p-5 flex flex-col gap-5">
      <AddTweet />
      <div className="border border-stone-400"></div>
      <TweetList initialTweets={tweets} />
    </div>
  );
}
