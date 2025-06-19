import React, { useState } from "react";
import BuscarTopicos from "./BuscarTopicos";
import { criarMensagem } from "../requisicoes/CriarMensagemBackEnd";
import "../styles/CriarMensagem.css";

function CriarMensagem({ onNovaMensagem }) {
  const [topico, setTopico] = useState(null);
  const [conteudo, setConteudo] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleEnviar(e) {
    e.preventDefault();
    setCarregando(true);
    setMsg("");
    try {
      const token = localStorage.getItem("token");
      await criarMensagem({ conteudo, topico_id: topico.id, token });
      setMsg("Mensagem enviada!");
      setConteudo("");
      if (onNovaMensagem) onNovaMensagem();
    } catch (err) {
      if (err.status === 401) {
        setMsg("Login expirado, entre novamente.");
      } else {
        setMsg("Falha ao enviar mensagem.");
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="criar-mensagem-container">
      {!topico ? (
        <>
          <h4>Escolha o tópico para sua mensagem:</h4>
          <BuscarTopicos onSelecionar={setTopico} />
        </>
      ) : (
        <>
          <div className="topico-selecionado">
            <strong>Tópico selecionado:</strong> {topico.titulo}
            <button
              type="button"
              onClick={() => setTopico(null)}
              className="btn-trocar"
            >
              (trocar)
            </button>
          </div>
          <form onSubmit={handleEnviar} className="form-mensagem">
            <textarea
              placeholder="Digite sua mensagem"
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
              required
              className="textarea-mensagem"
            />
            <br />
            <button
              type="submit"
              disabled={carregando || !conteudo}
              className="btn-enviar"
            >
              Enviar
            </button>
          </form>
          <p className="mensagem-status">{msg}</p>
        </>
      )}
    </div>
  );
}

export default CriarMensagem;
