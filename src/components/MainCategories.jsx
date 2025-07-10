import React from 'react'
import { Link } from 'react-router-dom'
import Search from './Search.jsx'

const MainCategories = () => {
  return (
    <>
      <div className='hidden md:flex bg-white rounded-3xl xl:rounded-full p-4 shadow-lg items-center justify-center gap-8'>
        <div className="flex-1 flex items-center justify-between flex-wrap">
          <Link to="/posts" className='text-white rounded-full px-4 py-2 bg-blue-800'>All Posts</Link>
          <Link to="/posts?cat=web-design" className=' rounded-full px-4 py-2 hover:bg-blue-50'>Web Design</Link>
          <Link to="/posts?cat=development" className=' rounded-full px-4 py-2 hover:bg-blue-50'>Development</Link>
          <Link to="/posts?cat=databases" className=' rounded-full px-4 py-2 hover:bg-blue-50'>Databases</Link>
          <Link to="/posts?cat=seo" className=' rounded-full px-4 py-2 hover:bg-blue-50'>Search Engines</Link>
          <Link to="/posts?cat=marketing" className=' rounded-full px-4 py-2 hover:bg-blue-50'>Marketing</Link>
        </div>
        <span className="text-xl font-medium">|</span>
        <Search />
      </div>
    </>
  );
};

export default MainCategories;
