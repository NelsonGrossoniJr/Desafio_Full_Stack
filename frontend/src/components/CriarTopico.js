import React, { useState } from "react";
import { criarTopico } from "../requisicoes/CriarTopicoBackEnd";
import "../styles/CriarTopico.css";

const CriarTopico = ({ onSucesso }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");

  function abrir() {
    setIsOpen(true);
    setMensagemErro("");
    setTitulo("");
    setConteudo("");
    setCategoria("");
  }

  function fechar() {
    setIsOpen(false);
    setMensagemErro("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMensagemErro("");
    setCarregando(true);

    const token = localStorage.getItem("token");
    try {
      const novoTopico = await criarTopico({
        titulo,
        conteudo,
        categoria,
        token,
      });
      if (onSucesso) onSucesso(novoTopico);
      fechar();
    } catch (error) {
      if (error.status === 401) {
        setMensagemErro("Login expirado, entre novamente.");
      } else {
        setMensagemErro(error.message || "Falha ao criar tópico.");
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <>
      <button className="modal-btn-primary" onClick={abrir}>
        Criar tópico
      </button>
      {isOpen && (
        <div className="modal-overlay" onClick={fechar}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-fechar" onClick={fechar} title="Fechar">
              ×
            </button>
            <h2 className="modal-title">Criar Novo Tópico</h2>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="modal-form-group">
                <label>
                  Título:
                  <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    required
                    className="modal-input"
                    disabled={carregando}
                    maxLength={100}
                    placeholder="Digite o título do tópico"
                  />
                </label>
              </div>
              <div className="modal-form-group">
                <label>
                  Conteúdo:
                  <textarea
                    value={conteudo}
                    onChange={(e) => setConteudo(e.target.value)}
                    required
                    rows={5}
                    className="modal-input"
                    disabled={carregando}
                    placeholder="Descreva o conteúdo do tópico"
                    maxLength={1000}
                  />
                </label>
              </div>
              <div className="modal-form-group">
                <label>
                  Categoria:
                  <input
                    type="text"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="modal-input"
                    disabled={carregando}
                    maxLength={45}
                    placeholder="Ex: Dúvida, Sugestão, etc."
                  />
                </label>
              </div>
              <button
                type="submit"
                disabled={carregando || !titulo || !conteudo}
                className="modal-btn-submit"
              >
                {carregando ? "Enviando..." : "Criar Tópico"}
              </button>
              {mensagemErro && (
                <div className="modal-mensagem-erro">{mensagemErro}</div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CriarTopico;
