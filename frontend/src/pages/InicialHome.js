import React from "react";
import { useNavigate } from "react-router-dom";

function InicialHome() {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>Bem-vindo!</h1>
      <button onClick={() => navigate("/login")}>Login</button>
      <button
        onClick={() => navigate("/registro")}
        style={{ marginLeft: "10px" }}
      >
        Registro
      </button>
    </div>
  );
}

export default InicialHome;
