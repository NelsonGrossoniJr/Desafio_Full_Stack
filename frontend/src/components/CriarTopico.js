import React, { useState } from "react";
import { criarTopico } from "../requisicoes/CriarTopicoBackEnd";
import "../styles/CriarTopico.css";

const CriarTopico = ({ onSucesso }) => {
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setMensagemErro("");
    setMensagemSucesso("");
    setCarregando(true);

    const token = localStorage.getItem("token");
    try {
      const novoTopico = await criarTopico({
        titulo,
        conteudo,
        categoria,
        token,
      });
      setMensagemSucesso("Tópico criado com sucesso!");
      setTitulo("");
      setConteudo("");
      setCategoria("");
      if (onSucesso) onSucesso(novoTopico);
    } catch (error) {
      if (error.status === 401) {
        setMensagemErro("Login expirado, entre novamente.");
      } else {
        setMensagemErro(error.message);
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="criar-topico-form">
      <h2>Criar Novo Tópico</h2>
      <div className="form-group">
        <label>
          Título:
          <br />
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            className="input-full"
            disabled={carregando}
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Conteúdo:
          <br />
          <textarea
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            required
            rows={4}
            className="input-full"
            disabled={carregando}
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Categoria:
          <br />
          <input
            type="text"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="input-full"
            disabled={carregando}
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={carregando || !titulo || !conteudo}
        className="btn-submit"
      >
        {carregando ? "Enviando..." : "Criar Tópico"}
      </button>
      {mensagemErro && <div className="mensagem-erro">{mensagemErro}</div>}
      {mensagemSucesso && (
        <div className="mensagem-sucesso">{mensagemSucesso}</div>
      )}
    </form>
  );
};

export default CriarTopico;
