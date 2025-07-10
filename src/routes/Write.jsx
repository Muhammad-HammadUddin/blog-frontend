import React, { useState } from 'react';
import { useAuth, useUser } from "@clerk/clerk-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IKContext, IKUpload } from 'imagekitio-react';
import UploadImage from '../components/UploadImage';
import { useEffect } from 'react';



const Write = () => {
  const { isLoaded } = useUser();
  const [value, setValue] = useState('');
  const { getToken } = useAuth();
  const [cover,setCover] = useState(null);
  const [progress,setProgress]=useState(0);
  const navigate = useNavigate();
  const [img,setImg]=useState("")
  const [video,setVideo]=useState("")
  useEffect(() => {
    console.log(img);
    img && setValue(prev=>prev+`<p><img src="${img}" alt="Image" /></p>`);
  }, [img]);

    useEffect(() => {
    
    video && setValue(prev=>prev+`<p><iframe src="${img}" alt="Image" class="ql-video"/></p>`);
  }, [video]);

      useEffect(() => {
    
   console.log(cover)
  }, [img]);

  const mutation = useMutation({
    mutationFn: async (newPost) => {
      const token = await getToken();

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/posts`, newPost, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });
      console.log(response.data)
      return response.data;
    },
    onSuccess: (res) => {
      toast.success("Post created successfully!");
      navigate(`/${res.publish.slug}`);
    },
    onError: (err) => {
      toast.error("Failed to create post!");
      console.error("❌ Post creation error:", err.response?.data || err.message);
    }
  });

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log(cover)
    const data = {
      img:cover.filePath || "",
      title: formData.get("title"),
      category: formData.get("category"),
      desc: formData.get("desc"),
      content: value,
    };
    mutation.mutate(data);
  };

  return (
    <div className='h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex flex-col gap-6 px-4'>
      <ToastContainer />
      <h1 className='text-xl font-light'>Create a New Post</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-6 flex-1 mb-6'>
        
        {/* Image Upload */}
       <UploadImage setProgress={setProgress} setData={setCover} type="image">
<button className='w-max p-2 shadow-md rounded-xl bg-white hover:bg-gray-100 transition-all duration-300 ease-in-out'>Add a cover Image</button>
</UploadImage>
        {/* Title */}
        <input
          type="text"
          name="title"
          placeholder='My Awesome Story'
          className='text-4xl font-semibold bg-transparent outline-0'
          required
        />

        {/* Category */}
        <div className="flex items-center gap-4">
          <label className='text-sm'>Choose a Category:</label>
          <select name="category" className='bg-white outline-0 rounded-xl p-1 shadow-md'>
            <option value="general">General</option>
            <option value="web-design">Web Design</option>
            <option value="databases">Databases</option>
            <option value="seo">SEO</option>
            <option value="development">Development</option>
            <option value="marketing">Marketing</option>
          </select>
        </div>

        {/* Description */}
        <textarea
          name="desc"
          placeholder='A short description...'
          className='bg-white outline-0 rounded-xl p-4'
          required
        />
            <div className="flex flex-1">
              <div className="flex flex-col gap-2 mr-2">
              <UploadImage setProgress={setProgress} setData={setImg} type="image">
<button  type="button" className='w-max p-2 shadow-md rounded-xl bg-white hover:bg-gray-100 transition-all duration-300 ease-in-out'>📷</button>
</UploadImage>
 <UploadImage setProgress={setProgress} setData={setVideo} type="video">
<button type="button"  className='w-max p-2 shadow-md rounded-xl bg-white hover:bg-gray-100 transition-all duration-300 ease-in-out'>🎬</button>
</UploadImage>
              </div>
            </div>
        {/* Editor */}
        <ReactQuill
          theme='snow'
          value={value}
          onChange={setValue}
          className='flex-1 bg-white outline-0 rounded-xl border-0 max-h-max'
        />

        {/* Submit */}
        <button
          type="submit"
          className='bg-blue-800 text-white font-medium rounded-xl mt-4 w-36 p-1 disabled:bg-blue-400 disabled:cursor-not-allowed'
          disabled={mutation.isPending || 0>progress && progress<100}
        >
          {mutation.isPending ? "Creating Post..." : "Create Post"}
        </button>
        {"Progress:"+progress}


        {/* Status */}
        {mutation.isSuccess && <div className='text-green-500'>Post created successfully!</div>}
        {mutation.isError && <div className='text-red-500'>Error: {mutation.error.message}</div>}
      </form>
    </div>
  );
};

export default Write;
