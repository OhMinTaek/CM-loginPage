"use client";

import { useActionState } from "react";
import Button from "./button";
import { uploadTweet } from "@/service/tweetService";

export default function AddTweet() {
 const [state, action] = useActionState(uploadTweet, null);

 const getErrorMessage = () => {
   if (!state || state.isSuccess) return null;
   
   // Zod 에러인 경우
   if ('fieldErrors' in state.error) {
     return state.error.fieldErrors.tweet;
   }
   // 일반 에러 메시지인 경우
   if ('message' in state.error) {
     return state.error.message;
   }
   return null;
 };

 return (
   <form action={action} className="p-5 flex flex-col gap-5">
     <div className="flex flex-col gap-2">
       <textarea 
         name="tweet" 
         required 
         placeholder="Write a tweet" 
         className="w-full p-5 rounded-md resize-none" 
       />
       {!state?.isSuccess && getErrorMessage() && (
         <span className="text-red-400">{getErrorMessage()}</span>
       )}
     </div>
     <Button text="Add tweet" />
   </form>
 );
}