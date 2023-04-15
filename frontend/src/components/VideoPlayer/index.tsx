import { useEffect, useRef, useState } from "react";
import { BsPlayCircle, BsPauseCircle } from "react-icons/bs";
import styles from "./style.module.scss";

const VideoPlayer = () => {
  const [videoTimer, setVideoTimer] = useState<string>("00:00");
  const [videoIsPlaying, setVideoIsPlaying] = useState<boolean>(false);
  const videoPlayerRef = useRef<HTMLVideoElement>(null);
  const timeWrapperRef = useRef<HTMLDivElement>(null);
  const timerLengthRef = useRef<HTMLDivElement>(null);

  function setTime() {
    const minutes = Math.floor(videoPlayerRef.current.currentTime / 60);
    const seconds = Math.floor(
      videoPlayerRef.current.currentTime - minutes * 60
    );

    const minuteValue = minutes.toString().padStart(2, "0");
    const secondValue = seconds.toString().padStart(2, "0");

    const mediaTime = `${minuteValue}:${secondValue}`;
    setVideoTimer(mediaTime);

    const barLength =
      timeWrapperRef.current.clientWidth *
      (videoPlayerRef.current.currentTime / videoPlayerRef.current.duration);
    timerLengthRef.current.style.width = `${barLength}px`;
  }

  const toggleVideoPlaying = () => {
    if (!videoIsPlaying) {
      videoPlayerRef.current?.play();
      setVideoIsPlaying((prev) => !prev);
      return;
    }
    videoPlayerRef.current?.pause();
    setVideoIsPlaying((prev) => !prev);
  };
  // useEffect(() => {
  //   if (videoPlayerRef.current) {
  //     setTimeout(() => {
  //       videoPlayerRef.current.play();
  //     }, 1000);
  //   }
  // }, []);

  return (
    <div className={styles.videoPlayer}>
      <video onTimeUpdate={setTime} ref={videoPlayerRef}>
        <source src="/assets/video/cat.mp4" type="video/mp4" />
      </video>
      <div className={styles.videoPlayer__controls}>
        <button
          onClick={toggleVideoPlaying}
          className={styles.videoPlayer__controls__playAndPause}
        >
          {videoIsPlaying ? (
            <BsPauseCircle size={20} />
          ) : (
            <BsPlayCircle size={20} />
          )}
        </button>
        <div
          ref={timeWrapperRef}
          className={styles.videoPlayer__controls__timer}
        >
          <div ref={timerLengthRef}></div>
          <span>{videoTimer}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
