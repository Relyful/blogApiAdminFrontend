import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router";
import styles from "./Header.module.css";
import Footer from "../Footer/Footer";

export default function Header() {
  const [user, setUser] = useState(undefined);
  const navigate = useNavigate();
  let jwt = localStorage.getItem("authToken");

  function logout() {
    localStorage.removeItem("authToken");
    jwt = null;
    setUser(undefined);
    navigate('/');
  }

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const backendAddress = import.meta.env.VITE_backend_address || 'http://localhost:8080';
    if (jwt) {
      async function authUser() {
        try {
          const response = await fetch(`${backendAddress}/auth`, {
            signal,
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          });
          if (!response.ok) {
            localStorage.removeItem("authToken");
            setUser(undefined);
            throw new Error("Auth failed");
          }
          const data = await response.json();
          setUser(data.user);
        } catch (err) {
          if (err.name === "AbortError") {
            console.log("Request aborted");
          } else {
            console.log(err);
          }
        }
      }
      authUser();
    }
    return () => controller.abort();
  }, [jwt]);

  return (
    <>
      <header className={styles.header}>
        <Link to='/' className={`logo ${styles.logo}`}><h2>Rely's blog admin</h2></Link>
        <div className={styles.headerLinks}>
          {user ? (
            <>
              <Link to='/posts/create' className={styles.linkContent}>Create post</Link>
              <Link to='/posts' className={styles.linkContent}>Posts</Link>
              <span className={styles.linkContent}>User: {user.username}</span>
              <span className={styles.linkContent} onClick={logout}>Logout</span>
            </>
          ) : (
            <Link to="/login" className={styles.linkContent}>Login</Link>
          )}
        </div>
      </header>
      <main>
        <Outlet context={{ user, setUser }} />
      </main>
      <Footer />
    </>
  );
}
