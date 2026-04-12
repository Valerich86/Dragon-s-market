"use client";

import { useEffect, useRef, useState } from "react";

export default function SparklesAnimation() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video
      .play()
      .catch((e) =>
        console.error("Автовоспроизведение заблокировано при загрузке:", e),
      );
  }, []);

  return (
    <div
      className={`absolute w-full top-40 left-0  h-full pointer-events-none select-none z-10`}
    >
      <video
        onContextMenu={(e) => e.preventDefault()}
        ref={videoRef}
        // autoPlay
        muted
        playsInline
        disablePictureInPicture
        disableRemotePlayback
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          userSelect: "none"
        }}
        loop={true} 
        controls={false}
      >
        <source src={`/video/sparkles.webm`} type="video/webm" />
      </video>
    </div>
  );
}
