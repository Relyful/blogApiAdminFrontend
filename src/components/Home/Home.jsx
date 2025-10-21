import styles from "./Home.module.css";
import { Link } from "react-router";

export default function Home() {
  return (
    <div className={styles.banner}>
      <Link to="posts" className={styles.linkContent}>
        <div className={styles.bannerContent}>
          <h1 className={styles.h1}>Welcome to <br/>Rely's Blog Admin</h1>
          <div className={styles.button}>Enter</div>
        </div>
      </Link>
    </div>
  )
}