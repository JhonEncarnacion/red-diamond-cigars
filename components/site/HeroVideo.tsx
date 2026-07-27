"use client";

import { useEffect, useRef } from "react";

type HeroVideoProps = {
  src: string;
  poster?: string;
  className?: string;
};

export function HeroVideo({ src, poster, className }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.muted = true;
    video.playsInline = true;

    void video.play().catch(() => {
      // Decorative video. Ignore autoplay failure.
    });
  }, []);

  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      autoPlay
      preload="metadata"
      poster={poster}
      controls={false}
      disablePictureInPicture
      className={className}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
