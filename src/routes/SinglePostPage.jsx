import React from 'react'
import Image from '../components/Image'
import { Link, useParams } from 'react-router-dom'
import PostMenuActions from '../components/PostMenuActions'
import Search from '../components/Search'
import Comments from '../components/Comments'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { format } from 'timeago.js'
const fetchPost=async(slug)=>{
    const res=await axios.get(`${import.meta.env.VITE_API_URL}/posts/${slug}`)
    console.log(res)
    console.log(res.data)
    return res.data;
  }
const SinglePostPage = () => {
const {slug}=useParams();

const {isPending,error,data}=useQuery({
  queryKey:["post",slug],
  queryFn:()=>fetchPost(slug),
  select: (res) => res.post,
  onError: (error) => {
  console.error("❌ Post error:", error?.response?.data || error.message);
}

})

if(isPending) return "Loading..."
if(error) return "Something went wrong!"+error.message
if(!data) return "Post not found!"

  return (
    <div className='flex flex-col gap-8'>
      <div className="flex gap-8">
      <div className="lg:w-3/5 flex flex-col gap-8">
      <h1 className='text-xl md:text-2xl xl:text-4xl 2xl:text-5xl font-semibold'>{data.title}</h1>
<div className="flex items-center gap-2 text-gray-400 text-sm ">
      <span >Written by</span>
        <Link className=' text-blue-800'>{data.user?.username}</Link>
        <span>on</span>
        <Link className=' text-blue-800'>{data.category}</Link>
        <span>{format(data.createdAt)}</span>
        </div>
        <p className='text-gray-500 font-medium'>
          {data.desc}
        </p>
      </div>
        {data.img && <div className="hidden lg:block w-2/5 ">
        <Image src={data.img} w="600" className="rounded-2xl"/>

        
        </div>}
      </div>

      <div className="flex flex-fol md:flex-row gap-8">
        <div className="lg:text-lg flex flex-col gap-6 text-justify">
          <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Blanditiis consequuntur rem consequatur magni porro deserunt, officia voluptates magnam debitis eligendi tenetur alias aliquid asperiores sed impedit rerum voluptatibus molestiae, quos quasi aperiam suscipit laudantium! Maiores odio, exercitationem, aliquam eveniet consectetur nobis optio ipsa numquam iure id, suscipit odit sit recusandae.
          </p>
          
          
          </div>
          {/* menu */}
        <div className="px-4 h-max sticky top-8">
          <h1  className='text-sm font-medium mb-4'>Author</h1>
          <div className="flex flex-col gap-4">

         
            <div className='flex items-center gap-8'>
            { data.user?.img && <Image src={data.user?.img} className="w-12 h-12 rounded-ful obect-cover" h="40"/>}
            <Link>{data.user?.username}</Link>
          </div>
            <p className='text-sm text-gray-500'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Excepturi, rem!</p>

            <div className='flex gap-2'>
              <Link>
              <Image src="facebook.svg"/>
              </Link>
              <Link>
              <Image src="instagram.svg"/>
              </Link>
            </div>
          </div>
          <PostMenuActions post={data}/>
          <h1  className='mt-8 text-sm font-medium mb-4'>Categories</h1>
          <div className="grid  gap-2 text-sm grid-cols-2">

            <Link className='underline'>All</Link>
            <Link className='underline' to="/">Web Design </Link>
            <Link className='underline' to="/">Development</Link>
            <Link className='underline' to="/">Databases </Link>
            <Link className='underline' to="/">Search Engines</Link>
            <Link className='underline' to="/">Marketing</Link>
            

          </div>
          <h1 className='mt-8 text-sm font-medium mb-4'>Search</h1>
          <Search/>
        </div>
      </div>
      <Comments postId={data._id}/>
      
    </div>
  )
}

export default SinglePostPage