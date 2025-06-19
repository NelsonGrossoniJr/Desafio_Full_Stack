import React, { useState } from "react";

// Componente de busca (pode ser seu mesmo ou simplificado, colado aqui)
function BuscarTopicos({ onSelecionar }) {
  const [query, setQuery] = useState("");
  const [topicos, setTopicos] = useState([]);
  const [loading, setLoading] = useState(false);

  async function buscarTopicos(query) {
    const resp = await fetch(
      `http://localhost:8000/topicos/search?query=${encodeURIComponent(query)}`
    );
    if (!resp.ok) throw new Error();
    return resp.json();
  }

  async function handleBuscar(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const resultado = await buscarTopicos(query);
      setTopicos(resultado);
    } finally {
      setLoading(false);
    }
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
        <button type="submit">Buscar</button>
      </form>
      <ul>
        {topicos.map((t) => (
          <li key={t.id}>
            <button onClick={() => onSelecionar(t)}>
              <strong>{t.titulo}</strong>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BuscarTopicos;
