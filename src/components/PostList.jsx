import React from 'react';
import PostListItem from './PostListItem';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSearchParams } from 'react-router-dom';

const fetchPosts = async (pageParam, searchParams) => {
  const searchParamsObj = Object.fromEntries([...searchParams]); // ✅ fix spelling
  console.log(searchParamsObj);

  const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
    params: {
      page: pageParam,
      limit: 10,
      ...searchParamsObj, // ✅ optional: include search filters in query
    },
  });
  console.log(response.data)
  return response.data; // { posts: [...], hasMore: true/false }
};

const PostList = () => {
  const [searchParams] = useSearchParams();

  const {
    data,
    status,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts', Object.fromEntries([...searchParams])], // include search in key
    queryFn: async ({ pageParam = 1 }) =>
      await fetchPosts(pageParam, searchParams),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return lastPage?.hasMore ? pages.length + 1 : undefined;
    },
  });

  if (status === 'loading') {
    return <div className='text-center text-2xl'>Loading...</div>;
  }

  if (status === 'error') {
    return <div className='text-center text-2xl'>Error: {error.message}</div>;
  }

  const allPosts = data?.pages?.flatMap((page) => page?.posts) || [];

  return (
    <InfiniteScroll
      dataLength={allPosts.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={<h4 className="text-center">Loading more posts...</h4>}
      endMessage={
        <p className='text-center mt-4'>
          <b>All posts loaded! You’ve seen it all ✨</b>
        </p>
      }
    >
      {allPosts.map((post) => (
        <PostListItem key={post?._id} post={post} />
      ))}
    </InfiniteScroll>
  );
};

export default PostList;
