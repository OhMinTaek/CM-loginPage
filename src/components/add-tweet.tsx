"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import Button from "./button";
import { uploadTweet } from "@/service/tweetService";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button 
      text={pending ? "Adding..." : "Add tweet"} 
      disabled={pending}
    />
  );
}

export default function AddTweet() {
  const router = useRouter();
  const [state, action] = useFormState(async (prevState: unknown, formData: FormData) => {
    const result = await uploadTweet(prevState, formData);
    if (result?.tweet?.id) {
      router.push(`/tweets/${result.tweet.id}`);
      router.refresh();
    }
    return result;
  }, null);

  return (
    <form action={action} className="p-5 flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <textarea 
          name="tweet" 
          required 
          placeholder="Write a tweet" 
          className="w-full p-5 rounded-md resize-none border border-gray-200"
        />
        {state?.error && (
          <span className="text-red-400">
            {state.error.fieldErrors?.tweet?.[0] || state.error.formErrors?.[0]}
          </span>
        )}
      </div>
      <SubmitButton />
    </form>
  );
}
