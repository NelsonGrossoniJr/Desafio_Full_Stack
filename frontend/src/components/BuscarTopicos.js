import React, { useState } from "react";
import {
  buscarTopicosPorNome,
  buscarTopicosPorCategoria,
} from "../requisicoes/BuscarTopicosBackEnd";
import "../styles/BuscarTopicos.css";

function BuscarTopicos({ onSelecionar, selecionavel = true }) {
  const [query, setQuery] = useState("");
  const [topicos, setTopicos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [ultimoTipoBusca, setUltimoTipoBusca] = useState(null);

  async function handleBuscar(e, tipo) {
    e.preventDefault();
    setErro("");
    setUltimoTipoBusca(tipo);

    if (!query.trim()) {
      setErro("O campo de busca não pode estar vazio.");
      setTopicos([]);
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
        if (tipo === "nome") {
          setErro("Nome não encontrado.");
        } else if (tipo === "categoria") {
          setErro("Categoria não encontrada.");
        }
      }
    } catch (err) {
      setErro("Erro ao buscar tópicos. Tente novamente.");
      setTopicos([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="buscar-topicos-container">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="buscar-topicos-form"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar tópicos..."
          className="buscar-topicos-input"
        />
        <button
          type="button"
          onClick={(e) => handleBuscar(e, "nome")}
          className="buscar-topicos-btn"
        >
          {loading && ultimoTipoBusca === "nome" ? "Buscando..." : "Nome"}
        </button>
        <button
          type="button"
          onClick={(e) => handleBuscar(e, "categoria")}
          className="buscar-topicos-btn"
        >
          {loading && ultimoTipoBusca === "categoria"
            ? "Buscando..."
            : "Categoria"}
        </button>
      </form>
      {erro && <div className="buscar-topicos-erro">{erro}</div>}
      {!erro && topicos.length > 0 && (
        <ul className="buscar-topicos-lista">
          {topicos.map((t) => (
            <li key={t.id} className="buscar-topicos-item">
              {selecionavel ? (
                <button
                  className="buscar-topicos-item-btn"
                  onClick={() => onSelecionar && onSelecionar(t)}
                >
                  <strong>{t.titulo}</strong>
                </button>
              ) : (
                <strong>{t.titulo}</strong>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BuscarTopicos;
