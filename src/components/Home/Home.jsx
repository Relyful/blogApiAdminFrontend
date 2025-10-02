import styles from "./Home.module.css";
import { Link } from "react-router";

export default function Home() {
  return (
    <div className={styles.banner}>
      <h1>Welcome to <br/>Rely's Blog Admin page</h1>
      <Link to="posts" className={styles.button}>Enter</Link>
    </div>
  )
}