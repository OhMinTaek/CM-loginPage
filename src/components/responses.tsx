"use client";

import { useOptimistic } from "react";
import { useFormState } from "react-dom";
import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/solid";

import { addTweetResponse, InitialResponses } from "@/service/responseService";
import Input from "./input";
import { responseSchema } from "@/utils/scehma";

// 에러 타입 정의
type FormError = {
  fieldErrors: {
    text?: string[];
  };
  formErrors: string[];
};

export default function Responses({
  initialResponses,
  tweetId,
  username,
}: {
  initialResponses: InitialResponses;
  tweetId: number;
  username: string;
}) {
  const [responses, optimisticResponse] = useOptimistic(
    initialResponses,
    (previousResponses, responseOptimisticValue: string) => {
      return [
        ...previousResponses,
        {
          id: new Date().getTime(),
          text: responseOptimisticValue,
          created_at: new Date(),
          tweetId,
          user: { username, id: Infinity },
        },
      ];
    }
  );

  const handleUploadResponse = async (prevState: FormError | null, formData: FormData) => {
    const result = responseSchema.safeParse(formData.get("text"));
      
    if (result.success) {
      optimisticResponse(result.data);
      const response = await addTweetResponse(formData);
        
      if (!response?.isSuccess) {
        return {
          fieldErrors: { text: [response?.error as string] },
          formErrors: [],
        } as FormError;
      }
      return null;
    }
      
    return {
      fieldErrors: { 
        text: result.error.errors.map(err => err.message)
      },
      formErrors: [],
  } as FormError;
  };

  const [state, action] = useFormState(handleUploadResponse, null);

  return (
    <div className="w-full flex flex-col gap-3">
      <form action={action} className="flex w-full gap-2 ">
        <Input
          labelIcon={<ChatBubbleBottomCenterTextIcon />}
          name="text"
          type="text"
          required
          placeholder="Write a response."
          errors={state?.fieldErrors?.text}
        />
        <input className="hidden" type="hidden" name="tweetId" value={tweetId} />
        <button className="ml-auto min-w-14 bg-stone-300 rounded-xl p-3">추가</button>
      </form>
      {responses.map((response) => (
        <div key={response.id} className="*:text-md flex items-center my-3">
          <span className="font-semibold w-3/12">{response.user.username}</span>
          <span> {response.text}</span>
        </div>
      ))}
    </div>
  );
}