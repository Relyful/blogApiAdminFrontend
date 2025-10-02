// import styles from "./Post.module.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router";

function Comments({ commentsData }) {
  const commentsResult = commentsData.map(comment => {
    return (
      <div className="comment" key={comment.id}>
        <p className="commentMessage">{comment.message}</p>
        <p className="commentAuthor">{comment.author.username}</p>
        <p className="commentCreatedAt">{comment.createdAt}</p>
      </div>
    )
  });
  return <>{commentsResult}</>;
}

function NewCommentForm({ postId }) {

  async function handleNewComment(e) {
    console.log({'works': e});
    const jwt = localStorage.getItem("authToken");
    e.preventDefault();
    const formData = new FormData(e.target);
    const newComment = formData.get('newComment');
    try {
      const requestBody = {'message': newComment};
      const response = await fetch(`http://localhost:8080/posts/${postId}/comments`, {
        method: 'POST', 
        body: JSON.stringify(requestBody), 
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        }
      });
      if (!response.ok) {
        throw new Error('Error posting data to server');
      }
    } catch(err) {
      console.error(err);
    }
  }
  return (
    <form onSubmit={handleNewComment}>
      <label htmlFor="newComment">New comment: </label>
      <input type="text" name="newComment" id="newComment" />
      <button type="submit">Comment</button>
    </form>
  )
}

export default function Post() {
  const { postId } = useParams();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);

  useEffect(() => {
      const controller = new AbortController();
      const signal = controller.signal;
      const jwt = localStorage.getItem("authToken");
      const fetchPost = async () => {
        try {
          const response = await fetch(`http://localhost:8080/posts/${postId}`, { signal, 
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
    <div className="post">
      <div className="title">{post.title}</div>
      <div className="content">{post.message}</div>
      <div className="comments">
        {post.comments.length < 1 ? <p>No comments yet.</p> : <Comments commentsData={post.comments}/>}
      </div>
      
    </div>
  );
}