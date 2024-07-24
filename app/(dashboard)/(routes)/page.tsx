"use client"
import {  useAuth, UserButton } from "@clerk/nextjs";
import  {redirect}  from "next/navigation";

export default function Home() {
  const { isLoaded, userId } = useAuth();
  
  if (isLoaded && !userId) {
    return redirect("/sign-in");
  }

  return (
    <>
      <UserButton />
      <p>Welcome, User!</p>
    </>
  );
}
