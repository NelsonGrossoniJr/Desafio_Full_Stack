import React from "react";
import { useNavigate } from "react-router-dom";
import "./InicialHome.css";

function InicialHome() {
  const navigate = useNavigate();
  return (
    <div className="inicial-home-container">
      <h1 className="inicial-home-title">Bem-vindo!</h1>
      <div className="inicial-home-actions">
        <button className="inicial-home-btn" onClick={() => navigate("/login")}>
          Login
        </button>
        <button
          className="inicial-home-btn"
          onClick={() => navigate("/registro")}
        >
          Registro
        </button>
      </div>
    </div>
  );
}

export default InicialHome;
