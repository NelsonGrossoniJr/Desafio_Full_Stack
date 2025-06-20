import React, { useState } from "react";
import { fazerLogin } from "../requisicoes/LoginBackEnd";
import "./Login.css";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await fazerLogin(username, password);
      localStorage.setItem("token", data.access_token);
      if (onLogin) onLogin(data.access_token);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h1 className="login-title">Login</h1>
      <div className="login-field">
        <label>Email:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="login-field">
        <label>Senha:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button className="login-btn" type="submit">
        Entrar
      </button>
      {error && <p className="login-error">{error}</p>}
    </form>
  );
}

export default Login;
