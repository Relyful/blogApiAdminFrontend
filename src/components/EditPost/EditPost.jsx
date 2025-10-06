import { useState, useEffect } from "react";
import { useParams, useOutletContext } from "react-router";

export default function EditPost() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const { user } = useOutletContext();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const jwt = localStorage.getItem("authToken");
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:8080/posts/${postId}`, {
          signal,
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        if (!response.ok) {
          throw new Error("Fetch error");
        }
        console.log(response);
        const postData = await response.json();
        console.log(postData);
        setPost(postData);
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

  if (user.role !== "ADMIN") {
    return <h2>You do not have permission to access this page</h2>
  }

  if (!post) {
    return <p>Post not found.</p>;
  }

  return (
    <div className="post">
      <div className="title">{post.title}</div>
      <div className="content">{post.message}</div>      
    </div>
  );
}
