import React, { useState } from "react";

const CriarTopico = ({ onNovoTopico }) => {
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  async function criarTopico(event) {
    event.preventDefault();
    setMensagemErro("");
    setMensagemSucesso("");
    setCarregando(true);

    const token = localStorage.getItem("token"); // Use a forma de armazenamento do seu app!
    const url = "http://localhost:8000/topicos/";
    const payload = { titulo, conteudo };

    try {
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const erro = await resp.json();
        throw new Error(erro.detail || "Erro ao criar tópico");
      }

      const novoTopico = await resp.json();
      setMensagemSucesso("Tópico criado com sucesso!");
      setTitulo("");
      setConteudo("");
      if (onNovoTopico) onNovoTopico(novoTopico);
    } catch (error) {
      setMensagemErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <form
      onSubmit={criarTopico}
      style={{
        maxWidth: 500,
        margin: "0 auto",
        padding: 16,
        border: "1px solid #ccc",
        borderRadius: 8,
      }}
    >
      <h2>Criar Novo Tópico</h2>

      <div>
        <label>
          Título:
          <br />
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            style={{ width: "100%" }}
            disabled={carregando}
          />
        </label>
      </div>

      <div style={{ marginTop: 8 }}>
        <label>
          Conteúdo:
          <br />
          <textarea
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            required
            rows={4}
            style={{ width: "100%" }}
            disabled={carregando}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={carregando || !titulo || !conteudo}
        style={{ marginTop: 12 }}
      >
        {carregando ? "Enviando..." : "Criar Tópico"}
      </button>

      {mensagemErro && (
        <div style={{ color: "red", marginTop: 10 }}>{mensagemErro}</div>
      )}
      {mensagemSucesso && (
        <div style={{ color: "green", marginTop: 10 }}>{mensagemSucesso}</div>
      )}
    </form>
  );
};

export default CriarTopico;
