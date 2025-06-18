import React, { useState } from "react";

function BuscarTopicos() {
  const [query, setQuery] = useState("");
  const [topicos, setTopicos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const handleBuscar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro("");
    try {
      const resultado = await buscarTopicos(query);
      setTopicos(resultado);
    } catch (err) {
      setErro("Erro ao buscar tópicos.");
    } finally {
      setLoading(false);
    }
  };

  async function buscarTopicos(query) {
    // Troque a URL se sua API estiver em outro endereço
    const response = await fetch(
      `http://localhost:8000/topicos/search?query=${encodeURIComponent(query)}`
    );
    if (!response.ok) throw new Error("Erro ao buscar tópicos");
    return response.json();
  }

  return (
    <div>
      <form onSubmit={handleBuscar}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar tópicos..."
        />
        <button type="submit" disabled={loading}>
          Buscar
        </button>
      </form>

      {erro && <p style={{ color: "red" }}>{erro}</p>}
      {loading && <p>Carregando...</p>}

      <ul>
        {topicos.map((t) => (
          <li key={t.id}>
            <strong>{t.titulo}</strong> - {t.conteudo}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BuscarTopicos;
