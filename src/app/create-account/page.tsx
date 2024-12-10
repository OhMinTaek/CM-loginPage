"use client";

import { useFormState } from "react-dom";
import { FireIcon, EnvelopeIcon, UserIcon, KeyIcon } from "@heroicons/react/24/solid";
import { handleForm } from "./actions";
import Input from "@/components/input";
import Button from "@/components/button";
import SuccessMessage from "@/components/success-message";
import Link from "next/link";

// FormState 타입 정의
type FormState = {
 isSuccess: boolean;
 error: {
   fieldErrors: {
     email?: string[];
     username?: string[];
     password?: string[];
   };
 } | null;
} | null;

// 초기 상태 정의
const initialState: FormState = {
 isSuccess: false,
 error: null
};

export default function Home() {
 const [state, action] = useFormState<FormState, FormData>(handleForm, initialState);

 return (
   <main className="flex flex-col gap-10 items-center justify-center">
     <h1 className="text-center text-6xl">
       <FireIcon className="w-20 h-20 text-red-400" />
     </h1>
     <form action={action} className="w-full flex flex-col gap-5">
       <Input
         name="email"
         type="email"
         placeholder="Email"
         required={true}
         errors={state?.error?.fieldErrors.email}
         labelIcon={<EnvelopeIcon />}
       />
       <Input
         name="username"
         placeholder="Username"
         required={true}
         errors={state?.error?.fieldErrors.username}
         labelIcon={<UserIcon />}
       />
       <Input
         name="password"
         type="password"
         placeholder="Password"
         required={true}
         errors={state?.error?.fieldErrors.password}
         labelIcon={<KeyIcon />}
       />
       <Button text="Create Account" />
       {state?.isSuccess && <SuccessMessage />}
     </form>
     <div className="flex gap-2">
       <span>이미 계정이 있나요?</span>
       <Link 
         href="/log-in" 
         className="text-stone-600 hover:underline hover:text-stone-400"
       >
         Log in
       </Link>
     </div>
   </main>
 );
}