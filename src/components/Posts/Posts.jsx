import styles from "./Posts.module.css";
import { useEffect, useState } from "react"
import { Link } from "react-router";

export default function Posts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:8080/posts", { signal });
        if (!response.ok) {
          throw new Error("Fetch error");
        }
        const postsData = await response.json();
        console.log(postsData);
        setPosts(postsData);
      } catch (err) {
        if (err.name === "AbortError") {
          console.log("Request aborted");
        } else {
          console.log(err);
        }
      }
    };
    fetchPosts();
    return () => controller.abort();
  }, []);

  const postItems = posts.map((post) => {
    return (
      <Link to={`/posts/${post.id}`} key={post.id} className={styles.linkNoUnderscore}>
        <div className={`post ${styles.post}`}>
          <div className="title">{post.title}</div>
          <div className="message">{post.message}</div>
          <div className="createdAt">{post.createdAt}</div>
          <div className="comments">Comments: {post._count.comments}</div>
          <div className="author">Author: {post.author.username}</div>
        </div>
      </Link>
    );
  });
  return <div className={styles.posts}>{posts.length > 0 ? postItems : <p>No posts yet...</p>}</div>;
}
