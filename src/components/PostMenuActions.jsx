import React, { useMemo } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const PostMenuActions = ({ post }) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate=useNavigate();



  const { data: savedPosts, isPending, error } = useQuery({
    queryKey: ["savedPosts"],
    queryFn: async () => {
      const token = await getToken();
     const res= await axios.get(`${import.meta.env.VITE_API_URL}/users/saved`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return res.data
    
    },
    enabled: !!user,
    onError: (error) => {
      console.error("❌ Fetch saved posts error:", error?.response?.data || error.message);
    }
  });
 const isAdmin = user?.publicMetadata?.role==="admin" || false;
 const isSaved = useMemo(() => {
  const isPostSaved= Array.isArray(savedPosts) && savedPosts.some((p) => p === post._id);
  console.log("Saved Posts:", savedPosts);
  return isPostSaved;
}, [savedPosts, post._id]);

  const deleteMutation = useMutation({
    mutationFn:async ()=>{
      console.log("here")
      const token=await getToken()
      return axios.delete(`${import.meta.env.VITE_API_URL}/posts/${post._id}`,{
        headers:{
          Authorization:`Bearer ${token}`
        }

    });
    

    },
    onSuccess:()=>{
      toast.success("post deleted successfully")
      navigate("/")
    },
    onError:(error)=>{
      toast.error(error.respnse.data)
    }
  })
const queryClient=useQueryClient()
  const SaveMutation = useMutation({
    mutationFn:async ()=>{
      console.log("here")
      const token=await getToken()
      return axios.patch(`${import.meta.env.VITE_API_URL}/users/save`,{
        postId:post._id
      },
        {
        headers:{
          Authorization:`Bearer ${token}`
        }

    });
    

    },
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:["savedPosts"]})
      toast.success("post saved successfully")
      
    },
    onError:(error)=>{
      toast.error(error.respnse.data)
    }
  })

   const handleSave = async () => {
    if(!user){
      navigate("/login")
    }
    SaveMutation.mutate();
   }




 const featureMutation = useMutation({
    mutationFn:async ()=>{
      console.log("here")
      const token=await getToken()
      return axios.patch(`${import.meta.env.VITE_API_URL}/posts/feature`,{
        postId:post._id
      },
        {
        headers:{
          Authorization:`Bearer ${token}`
        }

    });
    

    },
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:["post",post.slug]})

     
      
    },
    onError:(error)=>{
      toast.error(error.response.data)
    }
  })
 const handleFeature=()=>{
  featureMutation.mutate();

 }

  //   try {
  //     const token = await getToken();
  //     const res = await axios.put(
  //       `${import.meta.env.VITE_API_URL}/posts/save/${post._id}`,
  //       {},
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         }
  //       }
  //     );
  //     toast.success("Post saved!");
  //   } catch (err) {
  //     toast.error("Failed to save post!");
  //     console.error(err);
  //   }
  // };

   const handleDelete = async () => {
    console.log("I was clicked")
    deleteMutation.mutate();
   }
  //   try {
  //     const token = await getToken();
  //     await axios.delete(`${import.meta.env.VITE_API_URL}/posts/${post._id}`, {
  //       headers: {import { QueryClient } from '@tanstack/react-query';

  //         Authorization: `Bearer ${token}`
  //       }
  //     });
  //     toast.success("Post deleted!");
  //     window.location.reload(); // or use navigate to redirect
  //   } catch (err) {
  //     toast.error("Failed to delete post!");
  //     console.error(err);
  //   }
  // };

  return (
    <div>
      <h1 className='mb-4 text-sm font-medium mt-8'>Actions</h1>
     {isPending ? "Loading" : error ? "Saved post fetching failed" : <div className='flex items-center gap-2 py-2 text-sm cursor-pointer'></div>}
      {/* Save Button */}
      {user && !isPending && (
        <div
          className='flex items-center gap-2 py-2 text-sm cursor-pointer'
           onClick={handleSave}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px">
            <path d="M12 4C10.3 4 9 5.3 9 7v34l15-9 15 9V7c0-1.7-1.3-3-3-3H12z" fill={isSaved ? "black" : "white"} />
          </svg>
          <span>{isSaved ? "Post Saved" : "Save this Post"}</span>

        </div>
      )}
      {isAdmin && <div className='flex items-center gap-2 py-2 text-sm cursor-pointer' onClick={handleFeature}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
  <path d="M12 .587l3.668 7.568L24 9.423l-6 5.849L19.335 24 12 20.201 4.665 24 6 15.272 0 9.423l8.332-1.268z"
  fill={featureMutation.isPending?post.isFeatured ? "none":"black " :post.isFeatured?"black":"none"}
  />
</svg>
<span>Feature</span>
 {featureMutation.isPending && <span className='text'>(in progress)</span>}

      </div> }

      {/* Delete Button */}
      {user && (post.user?.clerkId === user.id || isAdmin) && (
        <div
          className='flex items-center gap-2 py-2 text-sm cursor-pointer'
          onClick={handleDelete}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20px" height="20px" fill="red">
            <path
              d="M3 6h18v2H3V6zm2 4h14l-1.5 12h-11L5 10zm3 2v8h2v-8H8zm4 0v8h2v-8h-2zM9 4V2h6v2h5v2H4V4h5z"
              stroke="black"
              strokeWidth="1"
            />
          </svg>
          <span>Delete this Post</span>
          {deleteMutation.isPending && <span className='text'>(in progress)</span>}
        </div>
      )}
    </div>
  );
};

export default PostMenuActions;
