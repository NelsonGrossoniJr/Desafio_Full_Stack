import React, { useState } from "react";
import { registrarUsuario } from "../requisicoes/RegistroBackEnd";
import "./Registro.css";

function Registro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [msg, setMsg] = useState("");

  const handleRegistro = async (e) => {
    e.preventDefault();
    const resultado = await registrarUsuario({ nome, email, senha });
    setMsg(resultado.mensagem);
    if (resultado.sucesso) {
      setNome("");
      setEmail("");
      setSenha("");
    }
  };

  return (
    <div className="registro-container">
      <h1 className="registro-title">Registro</h1>
      <form className="registro-form" onSubmit={handleRegistro}>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Senha"
          required
        />
        <button className="registro-btn" type="submit">
          Registrar
        </button>
        {msg && (
          <div
            className={`registro-msg ${
              msg.includes("sucesso") ? "sucesso" : "erro"
            }`}
          >
            {msg}
          </div>
        )}
      </form>
    </div>
  );
}

export default Registro;
