import React, { useState } from 'react'
import { useAuth, useUser } from '@clerk/clerk-react';

import { IKImage } from 'imagekitio-react';
import Image from './Image';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut,UserButton } from '@clerk/clerk-react';
import { useEffect } from 'react';

const Navbar = () => {
    const { user } = useUser();
    const {getToken}= useAuth()
    useEffect(()=>{
        getToken().then((token)=>{
            console.log(token)
        })
    },[])

    const [open,setOpen]=useState(false);
  return (
    <div className='w-full h-16 md:h-20 flex items-center justify-between'>
        {/* {Logo} */}
        <Link to='/' className='flex items-center gap-4 text-2xl font-bold'>
            <Image  src="logo.png" alt="lama Logo" w={32} h={32}/>
            <span>lamalog</span>
        </Link>
        <div className=' md:hidden'>
            <div className='cursor-pointer font-bold text-4xl' onClick={()=>setOpen(!open)}>
                {
                    open ? "X" :"☰"

                }
            </div>
            <div className={`w-full h-screen flex flex-col justify-center items-center absolute top-16 transition-all ease-in-out bg-[#e6e6ff] gap-8 font-medium text-lg ${open? "-right-0":"-right-[100%]"}`} >
            <Link to="/">Home</Link>
            <Link to='/'>Trending</Link>
            <Link to='/'>Most Popular</Link>
            <Link to='/'>About</Link>
            <Link to='/login'>
                <button className='py-2 px-4 rounded-3xl bg-blue-800 text-white'>Login 👋</button>
            </Link>

            </div>
        </div>
        <div className='hidden md:flex items-center gap-8 xl:gap-12 font-medium'>
            <Link to='/'>Home</Link>
            <Link to='/'>Trending</Link>
            <Link to='/'>Most Popular</Link>
            <Link to='/'>About</Link>

            <SignedOut>
            <Link to='/login'>
                <button className='py-2 px-4 rounded-3xl bg-blue-800 text-white'>Login 👋</button>
            </Link>
        
      </SignedOut>
      <SignedIn>

        {user && (<UserButton afterSignOutUrl="/" />)}
 
      </SignedIn>

        </div>
    </div>
  )
}

export default Navbar