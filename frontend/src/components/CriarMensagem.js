import React, { useState } from "react";
import BuscarTopicos from "./BuscarTopicos";
import { criarMensagem } from "../requisicoes/CriarMensagemBackEnd";
import "../styles/CriarMensagem.css";
import CriarTopico from "./CriarTopico";

function CriarMensagem({ onNovaMensagem }) {
  const [modalAberto, setModalAberto] = useState(false);
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

  function fecharModal() {
    setModalAberto(false);
    // Limpa estados ao fechar, se quiser
    setTopico(null);
    setMsg("");
    setConteudo("");
  }

  // Função para lidar com cliques no backdrop
  function handleBackdropClick(e) {
    // Verifica se o clique foi diretamente no backdrop (não em seus filhos)
    if (e.target === e.currentTarget) {
      fecharModal();
    }
  }

  return (
    <>
      <button
        className="criar-mensagem-btn"
        onClick={() => setModalAberto(true)}
      >
        Criar Mensagem
      </button>
      {modalAberto && (
        <div className="modal-msg-backdrop" onClick={handleBackdropClick}>
          <div className="modal-msg-conteudo">
            <button className="modal-msg-fechar" onClick={fecharModal}>
              ×
            </button>
            <div className="criar-mensagem-container">
              {!topico ? (
                <>
                  <h3>Escolha o tópico para sua mensagem:</h3>
                  <BuscarTopicos onSelecionar={setTopico} />
                  <h3>OU, crie um novo tópico para sua mensagem</h3>
                  <CriarTopico
                    onSucesso={(novoTopico) => {
                      setTopico(novoTopico);
                    }}
                  />
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
          </div>
        </div>
      )}
    </>
  );
}

export default CriarMensagem;
