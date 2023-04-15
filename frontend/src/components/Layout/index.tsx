import MainPage from "@/components/MainPage";
import styles from "./style.module.scss";

export default function Layout({ children }) {
  return (
    <>
      <div className={styles.layout}>
        <div className={styles.layout__right}></div>
        <div className={styles.layout__left}>{children}</div>
      </div>
    </>
  );
}
