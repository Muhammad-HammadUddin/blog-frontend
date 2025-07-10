import React from 'react';
import Comment from './Comment';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useAuth, useUser } from '@clerk/clerk-react';

const fetchComments = async (postId) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/comments/${postId}`);
  return res.data.comments || res.data; // Adjust if your backend wraps it
};

const Comments = ({ postId }) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const { isPending, error, data } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => fetchComments(postId),
    onError: (error) => {
      console.error('❌ Comments error:', error?.response?.data || error.message);
    }
  });

  const mutation = useMutation({
    mutationFn: async (newComment) => {
      const token = await getToken();
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/comments/${postId}`,
        newComment,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success('✅ Comment created successfully!');
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
    onError: (err) => {
      toast.error('❌ Failed to create comment!');
      console.error('❌ Comment creation error:', err.response?.data || err.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      desc: formData.get('desc'),
      postId,
    };
    mutation.mutate(data);
    e.target.reset();
  };

  if (isPending) return 'Loading...';
  if (error) return 'Something went wrong! ' + error.message;

  return (
    <div className="flex flex-col gap-8 lg:w-3/5 mb-12">
      <h1 className="text-xl text-gray-500 underline">Comments</h1>

      <form onSubmit={handleSubmit} className="flex items-center justify-between gap-8 w-full rounded-xl">
        <textarea
          placeholder="Write a comment..."
          className="w-full p-4 rounded-xl outline-none bg-gray-100"
          name="desc"
          required
        ></textarea>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="bg-blue-800 px-4 py-3 text-white font-medium rounded-xl disabled:opacity-50"
        >
          Send
        </button>
      </form>

      {/* Show optimistic comment while sending */}
      {mutation.isPending && mutation.variables && (
        <Comment
          comment={{
            desc: `${mutation.variables.desc} (Sending...)`,
            createdAt: new Date(),
            user: {
              img: user?.imageUrl,
              username: user?.username,
            },
          }}
        />
      )}

      {/* Show real comments */}
      {data?.map((comment) => (
        <Comment key={comment._id} comment={comment}  postId={postId}/>
      ))}
    </div>
  );
};

export default Comments;
