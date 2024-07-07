
"use client"

import Image from "next/image";

const Logo = () => {
    return ( 
        <Image 
          height={80}
          width={80}
          alt="logo"
          src="/logo.svg" 
        />
     );
}
 
export default Logo;