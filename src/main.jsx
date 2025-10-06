import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from "react-router"
import { RouterProvider } from "react-router/dom"
import './index.css'
import Header from './components/Header/Header.jsx'
import Login from './components/Login/Login.jsx'
import Home from './components/Home/Home.jsx'
import Posts from './components/Posts/Posts.jsx'
import Post from './components/Post/Post.jsx'
import EditPost from './components/EditPost/EditPost.jsx'

const router = createBrowserRouter([
  {
    path:"/",
    element: <Header />,
    children: [
      {index: true, element: <Home />},
      {path: "login", element: <Login />},
      {path: "posts", element: <Posts />},
      {path: "posts/:postId", element: <Post />},
      {path: "posts/edit/:postId", element: <EditPost />}
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
