import React from 'react'
import Image from './Image'
import { format } from 'timeago.js'
import { useAuth, useUser } from '@clerk/clerk-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'react-toastify'

const Comment = ({ comment,postId }) => {
  const { user } = useUser()
  const { getToken } = useAuth()

  const role = user?.publicMetadata?.role
  console.log(role)

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async () => {
      const token = await getToken()
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/comments/${comment._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      return res.data
    },
    onSuccess: () => {
      toast.success('✅ Comment deleted successfully!')
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
    },
    onError: (err) => {
      toast.error('❌ Error in deleting Comment')
      console.error('❌ Comment creation error:', err.response?.data || err.message)
    },
  })

  return (
    <div className='p-4 bg-slate-50 rounded-xl mb-8'>
      <div className='flex items-center gap-4'>
        {comment.user.img && (
          <Image
            src={comment.user.img}
            className='w-10 h-10 rounded-full object-cover'
            w='40'
          />
        )}
        <span className='font-medium'>{comment.user.username}</span>
        <span className='text-sm text-gray-500'>{format(comment.createdAt)}</span>
        {user && (comment.user?.clerkId === user.id || role === 'admin') && (
          <span
            className='text-xs text-red-300 hover:text-red-500 cursor-pointer'
            onClick={() => mutation.mutate()}
          >
            Delete
            {mutation.isPending && <span>(in Progress)</span>}
          </span>
        )}
      </div>
      <div className='mt-10'>
        <p>{comment.desc}</p>
      </div>
    </div>
  )
}

export default Comment
