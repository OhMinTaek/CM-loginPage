"use client";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useFormState } from "react-dom";

import { searchTweet } from "./action";
import Button from "@/components/button";
import Input from "@/components/input";
import ListTweet from "@/components/list-tweet";

export default function MainPage() {
  const [state, action] = useFormState(searchTweet, null);
  return (
    <div className="flex flex-col gap-5 px-5">
      <form action={action} className="fixed top-0 flex gap-3 w-full max-w-screen-sm py-5 bg-stone-100">
        <Input
          labelIcon={<MagnifyingGlassIcon className="size-6" />}
          name="keyword"
          type="text"
          placeholder="검색할 내용을 입력해주세요."
          required
          errors={state?.error?.formErrors}
        />
        <div className="w-20">
          <Button text="검색" />
        </div>
      </form>
      <div className="flex flex-col gap-5 py-14">
        {state?.data?.length === 0 && (
          <p className="text-center mt-10 text-stone-500 text-xl">검색 결과가 존재하지 않습니다.</p>
        )}
        {state?.data?.map((tweet) => (
          <ListTweet key={tweet.id} {...tweet} />
        ))}
      </div>
    </div>
  );
}