import React, { useState } from "react";
import {
  buscarTopicosPorNome,
  buscarTopicosPorCategoria,
} from "../requisicoes/BuscarTopicosBackEnd";
import "../styles/BuscarTopicos.css";

function BuscarTopicos({ onSelecionar, selecionavel = true }) {
  const [query, setQuery] = useState("");
  const [tipo, setTipo] = useState("nome");
  const [topicos, setTopicos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  async function handleBuscar(e) {
    e.preventDefault();
    setErro("");
    setTopicos([]);

    if (!query.trim()) {
      setErro("O campo de busca não pode estar vazio.");
      return;
    }
    setLoading(true);
    try {
      let resultado;
      if (tipo === "nome") {
        resultado = await buscarTopicosPorNome(query);
      } else if (tipo === "categoria") {
        resultado = await buscarTopicosPorCategoria(query);
      }
      setTopicos(resultado);

      if (resultado.length === 0) {
        setErro(
          tipo === "nome" ? "Nome não encontrado." : "Categoria não encontrada."
        );
      }
    } catch (err) {
      setErro("Erro ao buscar tópicos. Tente novamente.");
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
    setTopicos([]);
    setErro("");
  };

  return (
    <>
      {/* Botão que será exibido inicialmente */}
      <button className="buscar-topicos-abrir-btn" onClick={abrirModal}>
        Buscar Tópicos
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
            <h2 className="buscar-topicos-titulo">Buscar Tópicos</h2>
            <form className="buscar-topicos-form" onSubmit={handleBuscar}>
              <select
                className="buscar-topicos-select"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              >
                <option value="nome">Por nome</option>
                <option value="categoria">Por categoria</option>
              </select>
              <input
                type="text"
                className="buscar-topicos-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  tipo === "nome"
                    ? "Digite o nome do tópico..."
                    : "Digite a categoria..."
                }
                required
              />
              <button
                className="buscar-topicos-btn"
                type="submit"
                disabled={loading}
              >
                {loading ? "Buscando..." : "Buscar"}
              </button>
              {erro && <div className="buscar-topicos-erro">{erro}</div>}
            </form>
            {!erro && topicos.length > 0 && (
              <ul className="buscar-topicos-lista">
                {topicos.map((t) => (
                  <li key={t.id} className="buscar-topicos-item">
                    {selecionavel ? (
                      <button
                        className="buscar-topicos-item-btn"
                        onClick={() => {
                          onSelecionar && onSelecionar(t);
                          fecharModal();
                        }}
                      >
                        <div className="topico-info">
                          <div className="topico-titulo">
                            <strong>Tópico:</strong> {t.titulo}
                          </div>
                          <div className="topico-categoria">
                            <strong>Categoria:</strong>{" "}
                            {t.categoria || "Não especificada"}
                          </div>
                        </div>
                      </button>
                    ) : (
                      <div className="topico-info">
                        <div className="topico-titulo">
                          <strong>Tópico:</strong> {t.titulo}
                        </div>
                        <div className="topico-categoria">
                          <strong>Categoria:</strong>{" "}
                          {t.categoria || "Não especificada"}
                        </div>
                      </div>
                    )}
                    <div className="topico-separador"></div>
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

export default BuscarTopicos;
