import styles from "./Posts.module.css";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";

function PublishToggle({ postId, initialPublished }) {
  const [published, setPublished] = useState(initialPublished);
  const publishController = useRef(null);

  async function handlePublishCheckbox(e, postId) {
    const publishValue = e.target.checked;
    if (publishController.current) publishController.current.abort();

    const jwt = localStorage.getItem("authToken");
    const controller = new AbortController();
    publishController.current = controller;
    const signal = controller.signal;
    const backendAddress = import.meta.env.VITE_backend_address || 'http://localhost:8080';

    try {
      const response = await fetch(
        `${backendAddress}/posts/${postId}/publish`,
        {
          signal,
          method: "PUT",
          body: JSON.stringify({ published: publishValue }),
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) throw new Error("Error connecting to server");
      setPublished(publishValue);
    } catch (err) {
      console.error(err);
    }
  }

  const checkboxId = `publish-toggle-${postId}`;

  return (
    <div className={styles.publishRow}>
      <p>Publish: </p>
      <div className={styles["checkbox-wrapper-6"]}>
        <input
          className={`${styles.tgl} ${styles["tgl-light"]}`}
          id={checkboxId}
          type="checkbox"
          onChange={(e) => handlePublishCheckbox(e, postId)}
          checked={published}
        />
        <label className={styles["tgl-btn"]} htmlFor={checkboxId} />
      </div>
    </div>
  );
}


export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);
  
  useEffect(() => {
    setError(null);
    const backendAddress = import.meta.env.VITE_backend_address || 'http://localhost:8080';
    console.log(backendAddress)
    const controller = new AbortController();
    const signal = controller.signal;
    const jwt = localStorage.getItem("authToken");
    
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${backendAddress}/posts/all`, {
          signal,
          headers: {
            Authorization: `Bearer ${jwt}`,
          }
        });
        if (response.status === 401 || response.status === 403) {
          throw new Error("Unauthorized");
        }
        if (!response.ok) {
          throw new Error("Fetch error");
        }
        const postsData = await response.json();
        console.log(postsData);
        setPosts(postsData);
        setLoading(false);
      } catch (err) {
        if (err.name === "AbortError") {
          console.log("Request aborted");
        } else {
          setError(err.message);
          console.log(err);
        }
      }
    };
    fetchPosts();
    return () => controller.abort();
  }, []);

  async function handleDelete(postId) {
    const backendAddress = import.meta.env.VITE_backend_address || 'http://localhost:8080';
    const confirmDelete = window.confirm(
      "Are you sure you want do delete this post ?",
    );
    if (!confirmDelete) return;

    const jwt = localStorage.getItem("authToken");
    if (controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const response = await fetch(`${backendAddress}/posts/${postId}`, {
        signal: controller.signal,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Error communicating with server");
      }
      console.log(response);
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (err) {
      console.error(err);
    }
  }

  const postItems = posts.map((post) => {
    return (
      <div className={`post ${styles.post}`} key={post.id}>
        <h2 className={`title, ${styles.title}`}>{post.title}</h2>
        <div
          className={`message ${styles.message}`}
          dangerouslySetInnerHTML={{ __html: post.message }}
        />
        <div className="createdAt">
          Created:{" "}
          {new Date(post.createdAt).toLocaleDateString(undefined, {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "numeric"
          })}
        </div>
        <div className="comments">Comments: {post._count.comments}</div>
        <div className="author">Author: {post.author.username}</div>
        <div className={styles.adminRow}>
          <Link
            to={`/posts/${post.id}`}
            key={post.id}
            className={`${styles.button}`}
          >
            Open
          </Link>
          <Link
            className={`${styles.adminLink}, ${styles.button}`}
            to={`/posts/edit/${post.id}`}
          >
            Edit
          </Link>
          <button
            className={`${styles.button}`}
            type="button"
            onClick={() => handleDelete(post.id)}
          >
            DELETE
          </button>
        </div>
        <div className={`${styles.adminRow}`}>
          <PublishToggle postId={post.id} initialPublished={post.published} />
        </div>
      </div>
    );
  });

  if (error) {
    return <p className={styles.loading}>{error}</p>
  }

  if (loading) {
    return <p className={styles.loading}>Loading...</p>;
  }

  return (
    <div className={styles.posts}>
      {posts.length > 0 ? postItems : <p>No posts yet...</p>}
    </div>
  );
}
