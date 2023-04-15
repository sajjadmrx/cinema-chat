import Chatbox from "@/components/Chatbox";
import VideoPlayer from "@/components/VideoPlayer";
import styles from "./style.module.scss";

const MainPage = () => {
  return (
    <div className={styles.mainPage}>
      <Chatbox />
      <VideoPlayer />
    </div>
  );
};

export default MainPage;
