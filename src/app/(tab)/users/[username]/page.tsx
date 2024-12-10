import Link from "next/link";

import { getUserInfoByName, getUserInfoBySession } from "@/service/userService";
import ListTweet from "@/components/list-tweet";

export default async function UserProfile({ params }: { params: { username: string } }) {
  const user = await getUserInfoByName(params.username);
  const loggedInUser = await getUserInfoBySession();

  return (
    <main className="flex flex-col gap-5 pt-10 pb-40 h-screen px-3">
      <div>
        <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
          <div className="flex gap-4 items-end">
            <h3 className="text-xl font-semibold">{user.username}</h3>
            <small className="text-stone-400">{user.email}</small>
          </div>
          {params.username === loggedInUser.username && (
            <Link
              className="ml-auto w-fit p-3 bg-stone-300 hover:bg-stone-200 active:bg-stone-100 transition-colors rounded-2xl "
              href={`/users/${loggedInUser.username}/edit`}>
              내 정보 수정
            </Link>
          )}
        </div>
      </div>
      <p className="p-3 border border-stone-300 rounded-xl">{user.bio}</p>
      <div className="p-5 flex flex-col gap-5">
        {user.tweets?.map((tweet) => (
          <ListTweet key={tweet.id} {...tweet} />
        ))}
      </div>
    </main>
  );
}