import React, { useState, useEffect } from "react";
import "../styles/ListarTopicos.css"; // Você pode reutilizar o mesmo CSS ou criar um específico

function ListarTopicos() {
  const [topicos, setTopicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [mostrarTopicos, setMostrarTopicos] = useState(false);

  // Função para buscar todos os tópicos
  const buscarTopicos = async () => {
    setLoading(true);
    setErro("");
    try {
      const token = localStorage.getItem("token");
      // Usando a URL completa da API
      const response = await fetch("http://localhost:8000/topicos/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar tópicos: ${response.status}`);
      }

      const data = await response.json();
      console.log("Tópicos recebidos:", data); // Para debug
      setTopicos(data);
    } catch (error) {
      console.error("Erro ao buscar tópicos:", error);
      setErro(
        "Não foi possível carregar os tópicos. Tente novamente mais tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  // Carregar tópicos quando o componente for exibido
  useEffect(() => {
    if (mostrarTopicos) {
      buscarTopicos();
    }
  }, [mostrarTopicos]);

  // Alternar a exibição dos tópicos
  const toggleTopicos = () => {
    setMostrarTopicos(!mostrarTopicos);
    if (!mostrarTopicos) {
      // Se estamos mostrando os tópicos agora, busque-os
      buscarTopicos();
    }
  };

  // Formatar data para exibição
  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="listar-topicos-container">
      <button className="listar-topicos-btn" onClick={toggleTopicos}>
        {mostrarTopicos ? "Ocultar Tópicos" : "Listar Tópicos"}
      </button>

      {mostrarTopicos && (
        <div className="topicos-content">
          <h2 className="listar-topicos-titulo">Tópicos</h2>

          {loading ? (
            <div className="topicos-loading">
              <div className="spinner"></div>
              <p>Carregando tópicos...</p>
            </div>
          ) : erro ? (
            <div className="topicos-erro">
              {erro}
              <button className="retry-button" onClick={buscarTopicos}>
                Tentar novamente
              </button>
            </div>
          ) : topicos.length === 0 ? (
            <div className="topicos-vazio">
              <p>Nenhum tópico encontrado.</p>
            </div>
          ) : (
            <ul className="topicos-lista">
              {topicos.map((topico) => (
                <li key={topico.id} className="topico-card">
                  <div className="topico-header">
                    <div className="topico-titulo">
                      <strong>Título:</strong> {topico.titulo}
                    </div>
                    <div className="topico-data">
                      {formatarData(topico.data_criacao)}
                    </div>
                  </div>
                  <div className="topico-conteudo">
                    <strong>Conteúdo:</strong> {topico.conteudo}
                  </div>
                  {topico.categoria && (
                    <div className="topico-categoria">
                      <strong>Categoria:</strong> {topico.categoria}
                    </div>
                  )}
                  <div className="topico-footer">
                    <div className="topico-id">ID: {topico.id}</div>
                    <div className="topico-autor">
                      Autor ID: {topico.autor_id}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default ListarTopicos;
