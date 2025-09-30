import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from "react-router"
import { RouterProvider } from "react-router/dom"
import './index.css'
import App from './App.jsx'
import Header from './components/Header/Header.jsx'

const router = createBrowserRouter([
  {
    path:"/",
    element: <Header />,
    children: [
      {index: true, element: <App />},
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
