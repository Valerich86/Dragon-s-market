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
        console.log("Автовоспроизведение заблокировано при загрузке:", e),
      );
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full pointer-events-none select-none overflow-hidden`}
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
          userSelect: "none",
          // opacity: isVisible ? 1 : 0,
          // transition: "opacity 0.5s ease"
        }}
        loop={true} 
        controls={false}
      >
        <source src={`/video/sparkles.webm`} type="video/webm" />
        Ваш браузер не поддерживает видео.
      </video>
    </div>
  );
}
