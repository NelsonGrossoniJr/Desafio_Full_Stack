import React, { useState } from "react";
import {
  listarMensagens,
  buscarMensagensPorTopico,
} from "../requisicoes/BuscarMensagensBackEnd";
import "../styles/BuscarMensagens.css";

function BuscarMensagens({ onSelecionar, selecionavel = true }) {
  const [query, setQuery] = useState("");
  const [tipoBusca, setTipoBusca] = useState("topico");
  const [mensagens, setMensagens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [ultimoTipoBusca, setUltimoTipoBusca] = useState(null);

  async function handleBuscar(e, tipo) {
    e.preventDefault();
    setErro("");
    setUltimoTipoBusca(tipo);

    setMensagens([]);
    setLoading(true);

    try {
      let resultado = [];
      if (tipo === "todas") {
        resultado = await listarMensagens();
      } else if (tipo === "topico") {
        if (!query.trim()) {
          setErro("O campo de busca não pode estar vazio.");
          setLoading(false);
          return;
        }
        resultado = await buscarMensagensPorTopico(query);
      }
      setMensagens(resultado);

      if (resultado.length === 0) {
        setErro(
          tipo === "todas"
            ? "Nenhuma mensagem encontrada."
            : "Nenhuma mensagem encontrada para o termo buscado."
        );
      }
    } catch (err) {
      setErro("Erro ao buscar mensagens. Tente novamente.");
      setMensagens([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="buscar-mensagens-container">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="buscar-mensagens-form"
      >
        <select
          value={tipoBusca}
          onChange={(e) => setTipoBusca(e.target.value)}
          className="buscar-mensagens-select"
        >
          <option value="topico">Por Tópico</option>
        </select>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="buscar-mensagens-input"
          placeholder="Buscar mensagens por tópico..."
        />

        <button
          type="button"
          onClick={(e) => handleBuscar(e, tipoBusca)}
          className="buscar-mensagens-btn"
          disabled={loading && ultimoTipoBusca === tipoBusca}
        >
          {loading && ultimoTipoBusca === tipoBusca ? "Buscando..." : "Buscar"}
        </button>
        <button
          type="button"
          onClick={(e) => handleBuscar(e, "todas")}
          className="buscar-mensagens-btn"
          disabled={loading && ultimoTipoBusca === "todas"}
        >
          {loading && ultimoTipoBusca === "todas"
            ? "Carregando..."
            : "Listar todas"}
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
                  onClick={() => onSelecionar && onSelecionar(m)}
                >
                  <strong>{m.conteudo}</strong>
                </button>
              ) : (
                <strong>{m.conteudo}</strong>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BuscarMensagens;
