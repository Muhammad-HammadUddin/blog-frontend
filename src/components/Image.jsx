import React from 'react';
import { IKImage } from 'imagekitio-react';

const Image = ({ src, className, w, h, alt }) => {
  const isExternal = src.startsWith('http'); // Clerk or any other external source

  if (isExternal) {
    return (
      <img
        src={src}
        className={className}
        width={w}
        height={h}
        alt={alt || 'image'}
        loading="lazy"
      />
    );
  }

  return (
    <IKImage
      urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
      path={src}
      className={className}
      loading="lazy"
      lqip={{ active: true, quality: 20 }}
      width={w}
      height={h}
      alt={alt}
      transformation={[
        {
          width: w,
          height: h,
        },
      ]}
    />
  );
};

export default Image;
