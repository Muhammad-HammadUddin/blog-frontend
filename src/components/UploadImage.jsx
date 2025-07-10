import React, { useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IKContext, IKUpload } from 'imagekitio-react';
import axios from 'axios';

const UploadImage = ({ setProgress, setData, children,type }) => {
  const ref = useRef(null);

  const authenticatorFn = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts/upload-auth`);
      return response.data; // Must return { signature, expire, token }
    } catch (error) {
      console.error("❌ Auth error:", error.message);
      throw new Error("ImageKit authentication failed");
    }
  };

  const onUploadProgress = (progress) => {
    const percent = Math.round((progress.loaded / progress.total) * 100);
    setProgress(percent);
    console.log("📤 Upload progress:", percent + "%");
  };

  return (
    <IKContext
      publicKey={import.meta.env.VITE_IK_PUBLIC_KEY}
      urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
      authenticator={authenticatorFn}
    >
      <IKUpload
        useUniqueFileName
        onUploadProgress={onUploadProgress}
        className='hidden'
        ref={ref}
        accept={`${type}/* || image/* `}
        onSuccess={(res) => {
          console.log("✅ Image uploaded:", res.url);
          setData(res);
          toast.success("Image uploaded!");
        }}
        onError={(err) => {
          console.error("❌ Upload error:", err);
          toast.error("Image upload failed!");
        }}
      />
      <div
        className='text-center text-gray-500 text-sm mt-2 cursor-pointer'
        onClick={() => ref.current.click()}
      >
        {children || "Click to upload image"}
      </div>
    </IKContext>
  );
};

export default UploadImage;
