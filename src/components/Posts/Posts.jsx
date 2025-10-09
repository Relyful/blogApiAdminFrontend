import styles from "./Posts.module.css";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const controllerRef = useRef(null);
  const navigate = useNavigate();

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

  async function handleDelete(postId) {
    const confirmDelete = window.confirm('Are you sure you want do delete this post ?');
    if(!confirmDelete) return;

    const jwt = localStorage.getItem("authToken");
    if(controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    try{
      const response = await fetch(`http://localhost:8080/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      }
    })
    if (!response.ok) {
      throw new Error('Error communicating with server');
    }
    console.log(response);
    navigate(0);
    } catch(err) {
      console.error(err);
    }
  }

  const postItems = posts.map((post) => {
    return (
      <div className={`post ${styles.post}`} key={post.id}>
        <div className="title">{post.title}</div>
        <div className={`message ${styles.message}`} dangerouslySetInnerHTML={{__html: post.message}}/>
        <div className="createdAt">{post.createdAt}</div>
        <div className="comments">Comments: {post._count.comments}</div>
        <div className="author">Author: {post.author.username}</div>
        <div className={styles.adminRow}>
          <Link
            to={`/posts/${post.id}`}
            key={post.id}
            className={styles.linkNoUnderscore}
          >
            Open
          </Link>
          <Link
            className={`${styles.linkNoUnderscore}, ${styles.adminLink}`}
            to={`/posts/edit/${post.id}`}
          >
            Edit
          </Link>
          <button type="button" onClick={() => handleDelete(post.id)}>DELETE</button>          
        </div>
      </div>
    );
  });
  return (
    <div className={styles.posts}>
      {posts.length > 0 ? postItems : <p>No posts yet...</p>}
    </div>
  );
}
