import React, { useState } from "react";
import { buscarMensagensPorTopico } from "../requisicoes/BuscarMensagensBackEnd";
import "../styles/BuscarMensagens.css";

function BuscarMensagens({ onSelecionar, selecionavel = true }) {
  const [query, setQuery] = useState("");
  const [mensagens, setMensagens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  async function handleBuscar(e) {
    e.preventDefault();
    setErro("");

    setMensagens([]);
    setLoading(true);

    try {
      if (!query.trim()) {
        setErro("O campo de busca não pode estar vazio.");
        setLoading(false);
        return;
      }

      const resultado = await buscarMensagensPorTopico(query);
      setMensagens(resultado);

      if (resultado.length === 0) {
        setErro("Nenhuma mensagem encontrada para o termo buscado.");
      }
    } catch (err) {
      setErro("Erro ao buscar mensagens. Tente novamente.");
      setMensagens([]);
    } finally {
      setLoading(false);
    }
  }

  const abrirModal = () => {
    setIsOpen(true);
  };

  const fecharModal = () => {
    setIsOpen(false);
    // Limpar estados quando o modal é fechado
    setQuery("");
    setMensagens([]);
    setErro("");
  };

  return (
    <>
      {/* Botão que será exibido inicialmente */}
      <button className="buscar-mensagens-abrir-btn" onClick={abrirModal}>
        Buscar Mensagens
      </button>

      {/* Modal que será exibido apenas quando isOpen for true */}
      {isOpen && (
        <div className="modal-msg-backdrop" onClick={fecharModal}>
          <div
            className="modal-msg-conteudo"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-msg-fechar" onClick={fecharModal}>
              ×
            </button>

            <h2 className="buscar-mensagens-h2">Buscar Mensagens</h2>

            <form
              onSubmit={(e) => handleBuscar(e)}
              className="buscar-mensagens-form"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="buscar-mensagens-input"
                placeholder="Buscar mensagens por tópico..."
              />

              <button
                type="submit"
                className="buscar-mensagens-btn"
                disabled={loading}
              >
                {loading ? "Buscando..." : "Buscar"}
              </button>
            </form>

            {erro && <div className="buscar-mensagens-erro">{erro}</div>}

            {!erro && mensagens.length > 0 && (
              <ul className="buscar-mensagens-lista">
                {mensagens.map((m) => (
                  <li key={m.id} className="buscar-mensagens-item">
                    {selecionavel ? (
                      <button
                        className="buscar-mensagens-item-btn"
                        onClick={() => {
                          onSelecionar && onSelecionar(m);
                          fecharModal();
                        }}
                      >
                        <div className="mensagem-info">
                          <div className="mensagem-conteudo">
                            <strong>Mensagem:</strong> {m.conteudo}
                          </div>
                        </div>
                      </button>
                    ) : (
                      <div className="mensagem-info">
                        <div className="mensagem-conteudo">
                          <strong>Mensagem:</strong> {m.conteudo}
                        </div>
                      </div>
                    )}
                    <div className="mensagem-separador"></div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default BuscarMensagens;
