import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router";

export default function Header() {
  const [user, setUser] = useState(undefined);
  let jwt = localStorage.getItem("authToken");
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
        } catch(err) {
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
  }, [jwt])

  return (
    <>
    <header>
      <h2>Rely's blog admin</h2>
      <div className="links">
      {user ? <span>User: {user.username}</span> : <Link to="/login">Login</Link>}
      </div>
    </header>
    <Outlet context={{user, setUser}} />
    </>
  )
}