import React from "react";
import LoginBE from "../components/LoginBackEnd";

function Login({ onLogin }) {
  return (
    <div>
      <h1>Login</h1>
      <LoginBE onLogin={onLogin} />
    </div>
  );
}

export default Login;
