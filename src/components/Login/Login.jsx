import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router";

export default function Login() {
  const navigate = useNavigate();
  const [ err, setErr ] = useState();
  const {setUser} = useOutletContext();

async function handleLogIn(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get('username');
    const password = formData.get('password');
    try {
      const requestBody = {username, password};
      const response = await fetch("http://localhost:8080/login", {method: 'POST', body: JSON.stringify(requestBody), headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}});
      if (response.status === 401 || response.status === 400) {
         setErr('Incorrect username of password');
         throw new Error('Login failed');
      } else if (!response.ok) {
        throw new Error('Login Server Error');
      }
      const responseData = await response.json();
      console.log(responseData);
      setUser(responseData.userData);
      localStorage.setItem("authToken", responseData.token);
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  }
  
  return(
    <>
    <h2>This is a login form</h2>
    <form action="" method="post" onSubmit={handleLogIn}>
      <label htmlFor="username">Username: </label>
      <input type="text" name="username" id="username" />
      <label htmlFor="password">Password: </label>
      <input type="password" name="password" id="password" />
      <button type="submit">Submit</button>
    </form>
    <p>{err}</p>
  </>
  )
}