import { useState } from "react";
import { signIn } from "next-auth/react";
import axios from "axios";
import styles from "./style.module.scss";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });

  const formChangeHandler = (event) => {
    setFormData((prevdata) => ({
      ...prevdata,
      [event.target.name]: event.target.value,
    }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const result = await signIn("credentials", {
      username: formData.username,
      password: formData.password,
      redirect: true,
      callbackUrl: "/",
    });
    try {
      const response = await axios.post(
        "http://193.36.85.124:4000/auth/login",
        {
          username: formData.username,
          password: formData.password,
        }
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={onSubmit} className={styles.login}>
      <h3 className={styles.login__title}>Login</h3>
      <span className={styles.login__description}>
        please enter your username and password
      </span>
      <input
        value={formData.username}
        name="username"
        onChange={formChangeHandler}
        type="text"
        placeholder="username"
      />
      <input
        value={formData.password}
        name="password"
        onChange={formChangeHandler}
        type="password"
        placeholder="password"
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
