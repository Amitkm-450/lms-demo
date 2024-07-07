import { RedirectToSignIn, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import {  UserButton } from "@clerk/nextjs";

export default function Home() {
  
  return (
    <>
      <UserButton />
    </>
      
  );
}
