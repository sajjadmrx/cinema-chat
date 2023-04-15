import styles from "./style.module.scss";

const signUp = () => {
  return (
    <div className={styles.signUp}>
      <h3 className={styles.signUp__title}>Sign Up</h3>
      <input type="text" placeholder="username" />
      <input type="email" placeholder="email" />
      <input type="password" placeholder="password" />
      <button>Sign Up</button>
    </div>
  );
};

export default signUp;
