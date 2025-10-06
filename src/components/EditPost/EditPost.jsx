import { useState, useEffect, useRef } from "react";
import { useParams, useOutletContext } from "react-router";
import styles from "./EditPost.module.css"
import { Editor } from '@tinymce/tinymce-react';

export default function EditPost() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const { user } = useOutletContext();
  const editorRef = useRef(null);

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
      <form className={styles.form}>
        <label htmlFor="title">Title: </label>
        <input type="text" name="title" id="title" defaultValue={post.title} />  
        <label htmlFor="message">Text: </label>
        <input type="text" name="message" id="message" defaultValue={post.message} />


        <Editor
        apiKey={import.meta.env.VITE_TINYMCE_APIKEY}
        onInit={ (_evt, editor) => editorRef.current = editor }
        initialValue={post.message}
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
      />

      </form>      
    </div>
  );
}
