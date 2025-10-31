import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import styles from "./NewPost.module.css";
import { useNavigate, useOutletContext } from "react-router";

export default function NewPost() {
  const controllerRef = useRef(null);
  const editorRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useOutletContext();
  console.log(import.meta.env.VITE_TINYMCE_APIKEY)

  async function formSubmitHandler(e) {
    e.preventDefault();
    if (controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    const jwt = localStorage.getItem("authToken");
    const formData = new FormData(e.target);
    const title = formData.get("title");
    const post = editorRef.current.getContent();
    const backendAddress = import.meta.env.VITE_backend_address || 'http://localhost:8080';
    const fetchBody = {
      title,
      message: post,
      published: e.target.publish.checked,
    };

    try {
      const response = await fetch(`${backendAddress}/posts/`, {
        signal: controller.signal,
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(fetchBody),
      });
      if (!response.ok) {
        throw new Error('Couludnt post data');
      }
      navigate('/posts');
    } catch (err) {
      console.error(err);
    }
  }

  if (!user || user.role !== "ADMIN") {
    return <h2>You do not have permission to access this page</h2>
  }

  return (
    <>
      <h2 className={styles.title}>Create new post</h2>

      <form className={styles.mainForm} onSubmit={formSubmitHandler}>
        <label htmlFor="postTitle" className={styles.postTitle}>
          Title:{" "}
        </label>
        <input type="text" name="title" id="postTitle" />
        <Editor
          id="postMessage"
          apiKey={import.meta.env.VITE_TINYMCE_APIKEY}
          onInit={(_evt, editor) => (editorRef.current = editor)}
          initialValue="Start writing your post here"
          init={{
            height: 500,
            menubar: false,
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "charmap",
              "preview",
              "anchor",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "code",
              "help",
              "wordcount",
            ],
            toolbar:
              "undo redo | blocks | " +
              "bold italic forecolor | alignleft aligncenter " +
              "alignright alignjustify | bullist numlist outdent indent | " +
              "removeformat | help",
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          }}
        />
        <div className={styles.publishRow}>
          <p>Publish: </p>
          <div className={styles["checkbox-wrapper-6"]}>
            <input
              className={`${styles.tgl} ${styles["tgl-light"]}`}
              id="cb1-6"
              name="publish"
              type="checkbox"
            />
            <label className={styles["tgl-btn"]} htmlFor="cb1-6" />
          </div>
        </div>
        <button type="submit">Create post</button>
      </form>
    </>
  );
}
