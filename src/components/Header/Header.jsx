import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router";
import styles from "./Header.module.css";

export default function Header() {
  const [user, setUser] = useState(undefined);
  let jwt = localStorage.getItem("authToken");

  function logout() {
    localStorage.removeItem("authToken");
    jwt = null;
    setUser(undefined);
  }

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    if (jwt) {
      async function authUser() {
        try {
          const response = await fetch("http://localhost:8080/auth", {
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
        <h2>Rely's blog admin</h2>
        <div className={styles.headerLinks}>
          {user ? (
            <>
              <span>User: {user.username}</span>
              <span onClick={logout}>Logout</span>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </header>
      <main>
        <Outlet context={{ user, setUser }} />
      </main>
    </>
  );
}
