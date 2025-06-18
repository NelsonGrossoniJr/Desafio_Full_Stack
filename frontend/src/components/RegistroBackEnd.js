import React, { useState } from "react";

function RegistroBackEnd() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [msg, setMsg] = useState("");

  const handleRegistro = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });
      if (response.ok) {
        setMsg("Registro feito com sucesso! Você já pode fazer login.");
        setNome("");
        setEmail("");
        setSenha("");
      } else {
        const data = await response.json();
        setMsg(data.detail || "Erro ao registrar. Tente de novo.");
      }
    } catch {
      setMsg("Erro de conexão com o servidor.");
    }
  };

  return (
    <form
      onSubmit={handleRegistro}
      style={{
        display: "flex",
        flexDirection: "column",
        maxWidth: 300,
        gap: 10,
      }}
    >
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
      <button type="submit">Registrar</button>
      {msg && (
        <div
          style={{
            marginTop: 10,
            color: msg.includes("sucesso") ? "green" : "red",
          }}
        >
          {msg}
        </div>
      )}
    </form>
  );
}

export default RegistroBackEnd;
