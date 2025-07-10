import React from 'react'
import Search from './Search'
import { Link, useSearchParams } from 'react-router-dom'

const SideMenu = () => {
  const [searchParams,setSearchParams]=useSearchParams()
 const handleFilterChange = (e) => {
  const selectedSort = e.target.value;
  const currentParams = Object.fromEntries(searchParams.entries());

  // ✅ Only update if value is different
  if (searchParams.get("sort") !== selectedSort) {
    setSearchParams({
      ...currentParams,
      sort: selectedSort,
    });
  }
};
 const handleCategoryChange = (category) => {
  console.log("idhar")
 
  const currentParams = Object.fromEntries(searchParams.entries())
  
  if (searchParams.get("cat") !== category) {
    setSearchParams({
      ...currentParams,
      cat: category,
    });
  }
};
  return (
    <div className='px-4 h-max sticky top-8'>
        <h1 className='mb-4 text-sm font-medium'>Search</h1>
        <Search/>
        <h1 className='mb-4  mt-8 text-sm font-medium'>Filter</h1>
        <div className="flex flex-col gap-2 text-sm" >
            <label htmlFor="" className='flex  items-center gap-2 cursor-pointer'>
                <input type="radio" value="newest" className='appearance-none w-4 h-4 border-[1.5px] border-blue rounded-sm checked:bg-blue-800 bg-white' onChange={handleFilterChange}
                />
              Newest
            </label> 

             <label htmlFor="" className='flex  items-center gap-2 cursor-pointer'>
                <input type="radio" value="popular" className='appearance-none w-4 h-4 border-[1.5px] border-blue rounded-sm checked:bg-blue-800 bg-white' onChange={handleFilterChange}
                />
              Most Popular
            </label>
             <label htmlFor="" className='flex  items-center gap-2 cursor-pointer'>
                <input type="radio" value="trending" className='appearance-none w-4 h-4 border-[1.5px] border-blue rounded-sm checked:bg-blue-800 bg-white' onChange={handleFilterChange}
                />
              Trending
            </label>
             <label htmlFor="" className='flex  items-center gap-2 cursor-pointer'>
                <input type="radio" value="oldest" className='appearance-none w-4 h-4 border-[1.5px] border-blue rounded-sm checked:bg-blue-800 bg-white' onChange={handleFilterChange}
                />
              Oldest
            </label>
        </div>
        <h1 className='mb-4  mt-8 text-sm font-medium'>Categories</h1>

        <div className="flex flex-col gap-2 text-sm">

            <span className='underline cursor-pointer' onClick={()=>handleCategoryChange("general")} >All</span>
            <span className='underline cursor-pointer' onClick={()=>handleCategoryChange("web-design")} >Web Design </span>
            <span className='underline cursor-pointer' onClick={()=>handleCategoryChange("developement")}>Development</span>
            <span className='underline cursor-pointer' onClick={()=>handleCategoryChange("databases")} >Databases </span>
            <span className='underline cursor-pointer' onClick={()=>handleCategoryChange("seo")} >Search Engines</span>
            <span className='underline cursor-pointer' onClick={()=>handleCategoryChange("marketing")} >Marketing</span>

        </div>
    </div>
  )
}

export default SideMenu