import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function NewPost() {
  const controllerRef = useRef(null);
  const editorRef = useRef(null);

    async function formSubmitHandler(e) {
    e.preventDefault();
    if (controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    const jwt = localStorage.getItem('authToken');
    const formData = new FormData(e.target);
    const title = formData.get('title');
    const post = editorRef.current.getContent();
    const fetchBody = {
      title,
      'message': post,
      'published': e.target.publish.checked, 
    }

    try {
      const response = await fetch('http://localhost:8080/posts/', {
        signal: controller.signal,
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${jwt}`,
        },
        body: JSON.stringify(fetchBody),
      });
      console.log(response);
    } catch(err) {
      console.error(err);
    }
  }

  return (
    <>
    <h2>Create new post </h2>

  <form onSubmit={formSubmitHandler}>
    <label htmlFor="postTitle">Title: </label>
    <br />
    <input type="text" name="title" id="postTitle" />
    <Editor
        id="postMessage"
        apiKey={import.meta.env.VITE_TINYMCE_APIKEY}
        onInit={ (_evt, editor) => editorRef.current = editor }
        initialValue="Start writing your post here"
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
      <label htmlFor="publish">Publish: </label>
      <input type="checkbox" name="publish" id="publish" />
      <br />
      <button type='submit'>Create post</button>
  </form>
    </>
  )
}