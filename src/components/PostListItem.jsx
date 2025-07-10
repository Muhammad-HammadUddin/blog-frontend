import React from 'react'
import Image from './Image'
import {format} from "timeago.js"
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'


const PostListItem = ({post}) => {
  console.log(post);
  


  return (
   <div className="flex flex-col xl:flex-row gap-8">
       {post?.img&&
    <div className='md:hidden xl:block xl:w-1/3'>
        <Image src={post?.img} className="rounded-2xl object-cover" w="732"/>
    </div>}
    <div className='flex flex-col gap-4 xl:w-2/3'>
       <Link to={`/${post?.slug}`} className='text-4xl font-semibold'>
       {post?.title}
</Link>
       <div className='flex items-center gap-2 text-gray-700 text-sm'>
        <span >Written by</span>
        <Link className=' text-blue-800' to={`/posts?author=${post?.user?.username}`}>{post?.user?.username}</Link>
        <span>on</span>
        <Link className=' text-blue-800'>{post?.category} </Link>
        <span>{format(post?.createdAt)}</span>
       </div>
       <p>{post?.desc}</p>
       <Link to={`/${post?.slug}`} className="underline text-blue-800 text-sm">Read More </Link>
    </div>
   </div>
  )
}

export default PostListItem