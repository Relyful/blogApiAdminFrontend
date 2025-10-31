// import styles from "./Post.module.css";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import styles from './Post.module.css';

function Comments({ commentsData, setComments }) {
  const controllerRef = useRef(null);
  async function handleDeleteComment(postId, commentId) {
    console.log(postId, commentId);
    const jwt = localStorage.getItem('authToken');
    try {
      if(controllerRef.current) controllerRef.current.abort();
      const controller = new AbortController();
      controllerRef.current = controller;
      const signal = controller.signal;
      const response = await fetch(`http://localhost:8080/posts/${postId}/comments/admin/${commentId}`, {
        method: 'DELETE',
        signal,
        headers: {
          'Authorization': `Bearer ${jwt}`
        },
      });
    if (!response.ok) {
      throw new Error('Error deleting comment');
    }
    setComments(prev => prev.filter(c => c.id !== commentId));
    } catch(err) {
      console.error(err);
    }
  }

  const commentsResult = commentsData.map(comment => {
    return (
      <div className={`comment ${styles.comment}`} key={comment.id}>
        <p className={styles.commentTitle}>{comment.author.username} said on {new Date(comment.createdAt).toLocaleDateString(undefined, {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "numeric"
          })}: </p>
        <p className={styles.commentMessage}>{comment.message}</p>
        <div className="adminRow">
          <button className={styles.commentButton} type="button" onClick={() => handleDeleteComment(comment.postId, comment.id)}>Delete comment</button>
        </div>
      </div>
    )
  });
  return <>{commentsResult}</>;
}

export default function Post() {
  const { postId } = useParams();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
      const controller = new AbortController();
      const signal = controller.signal;
      const jwt = localStorage.getItem("authToken");
      const backendAddress = import.meta.env.VITE_backend_address || 'http://localhost:8080';
      const fetchPost = async () => {
        try {
          const response = await fetch(`${backendAddress}/posts/${postId}`, { signal, 
            headers: {
              Authorization: `Bearer ${jwt}`,
            }, });
          if (!response.ok) {
            throw new Error("Fetch error");
          }
          console.log(response);
          const postData = await response.json();
          console.log(postData);
          setPost(postData)
          setComments(postData.comments)
          setLoading(false);
        } catch (err) {
          if (err.name === "AbortError") {
            console.log("Request aborted");
          } else {
            console.log(err);
          }
        }
      };
      fetchPost();
      return () => controller.abort();
    }, [postId]);
    
 if (loading) {
    return <p>Loading...</p>;
  }

  if (!post) {
    return <p>Post not found.</p>;
  }

  return (
    <div className={`post ${styles.postContainer}`}>
      <div className={`blogPost ${styles.post}`}>
        <h1 className={styles.title}>{post.title}</h1>
        <div className={styles.content} dangerouslySetInnerHTML={{__html: post.message}} />
      </div>
      <div className={styles.comments}>
        {comments.length < 1 ? <p className={styles.comment}>No comments yet.</p> : <Comments commentsData={comments} setComments={setComments}/>}
      </div>      
    </div>    
  );
}
