"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  className?: string;
  width?: string | number;
  height?: string | number;
  loop?: boolean;
  clearSwearing: () => void;
}

export default function Swearing({
  className = "",
  width = "100%",
  height = "auto",
  loop = false,
  clearSwearing
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // useEffect(() => {
  //   const video = videoRef.current;
  //   if (!video) return;

  //   const handleEnded = () => {
  //     if (current !== src) {
  //       setCurrent(src);
  //       video.load();
  //     }
  //     console.log(current);
  //     const offset = video.duration * 0.7;
  //     const startPosition = video.duration - offset;
  //     video.currentTime = startPosition;
  //     video.play();
  //   };

  //   video.addEventListener("ended", handleEnded);
  //   video.play();
  //   return () => video.removeEventListener("ended", handleEnded);
  // }, []);

  // const clickHandler = () => {
  //   if (videoRef.current) {
  //     const video = videoRef.current;
  //     setCurrent("/video/swearing.webm");
  //     video.load();
  //     video.play();
  //     setTimeout(() => {
  //       setCurrent(src);
  //       video.load();
  //       video.play();
  //     }, 500);
  //   }
  // };

  return (
    <div className={className}>
      <video
        onContextMenu={(e) => e.preventDefault()}
        ref={videoRef}
        autoPlay
        muted
        playsInline
        disablePictureInPicture
        disableRemotePlayback
        style={{
          width,
          height,
          display: "block",
          maxWidth: "100%",
          userSelect: "none",
          cursor: "default",
          pointerEvents: "none",
        }}
        loop={loop}
        controls={false}
        onEnded={clearSwearing}
      >
        <source src={"/video/swearing.webm"} type="video/webm" />
      </video>
    </div>
  );
}
