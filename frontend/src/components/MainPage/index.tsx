import { useRef } from "react";
import Chatbox from "../../components/Chatbox";
import VideoPlayer from "../../components/VideoPlayer";
import styles from "./style.module.scss";

const MainPage = () => {
  const playerRef = useRef(null);

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: "http://193.36.85.124:4000/stream/hls/cat/cat_480_hls.m3u8",
        type: "application/x-mpegURL",
      },
    ],
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };

  return (
    <div className={styles.mainPage}>
      <Chatbox />
      <VideoPlayer options={videoJsOptions} onReady={handlePlayerReady} />
    </div>
  );
};

export default MainPage;
