import { useState, useEffect, useRef } from "react";
import { useParams, useOutletContext } from "react-router";
import styles from "./EditPost.module.css"
import { Editor } from '@tinymce/tinymce-react';

export default function EditPost() {
  const { postId } = useParams();
  const { user } = useOutletContext();
  const editorRef = useRef(null);
  const controllerRef = useRef(null);

  const [post, setPost] = useState(null);

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

  async function handleFormSubmit(e) {
    e.preventDefault();

    if(controllerRef.current) controllerRef.current.abort();

    const controller = new AbortController();
    controllerRef.current = controller;

    const jwt = localStorage.getItem("authToken");

    console.log(e.target)
    const formData = new FormData(e.target);
    const newTitle = formData.get('title');
    const newMesasge = editorRef.current.getContent();
    const requestBody = {
      'title': newTitle,
      'message': newMesasge, 
    };
    console.log(requestBody);

    try {
      console.log(postId)
      const response = await fetch(`http://localhost:8080/posts/${postId}`, {
        signal: controller.signal,
        method: 'PUT',
        body: JSON.stringify(requestBody),
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        }
      });
      if (!response.ok) {
        throw new Error('Error posting data to server');
      }
    } catch (error) {
      console.error(error);
    }
  }

  if (!user || user.role !== "ADMIN") {
    return <h2>You do not have permission to access this page</h2>
  }

  if (!post) {
    return <p>Post not found.</p>;
  }

  return (
    <div className={`post ${styles.post}`}>
      <form className={styles.form} onSubmit={handleFormSubmit}>
        <label htmlFor="title">Title: </label>
        <input type="text" name="title" id="title" defaultValue={post.title} />  
        <label htmlFor="message">Text: </label>
        <Editor
        id="message"
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
          toolbar: 'undo redo ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
      />

      <button type="submit">Submit</button>
      </form>
    </div>
  );
}
