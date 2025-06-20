import React, { useState, useEffect } from "react";
import "../styles/ListarMensagens.css";

function ListarMensagens() {
  const [mensagens, setMensagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [mostrarMensagens, setMostrarMensagens] = useState(false);

  // Função para buscar todas as mensagens
  const buscarMensagens = async () => {
    setLoading(true);
    setErro("");
    try {
      const token = localStorage.getItem("token");
      // Usando a URL completa da API
      const response = await fetch("http://localhost:8000/mensagens/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar mensagens: ${response.status}`);
      }

      const data = await response.json();
      console.log("Dados recebidos:", data); // Para debug
      setMensagens(data);
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
      setErro(
        "Não foi possível carregar as mensagens. Tente novamente mais tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  // Carregar mensagens quando o componente for exibido
  useEffect(() => {
    if (mostrarMensagens) {
      buscarMensagens();
    }
  }, [mostrarMensagens]);

  // Alternar a exibição das mensagens
  const toggleMensagens = () => {
    setMostrarMensagens(!mostrarMensagens);
    if (!mostrarMensagens) {
      // Se estamos mostrando as mensagens agora, busque-as
      buscarMensagens();
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
    <div className="listar-mensagens-container">
      <button className="listar-mensagens-btn" onClick={toggleMensagens}>
        {mostrarMensagens ? "Ocultar Mensagens" : "Mensagens Recentes"}
      </button>

      {mostrarMensagens && (
        <div className="mensagens-content">
          <h2 className="listar-mensagens-titulo">Mensagens</h2>

          {loading ? (
            <div className="mensagens-loading">
              <div className="spinner"></div>
              <p>Carregando mensagens...</p>
            </div>
          ) : erro ? (
            <div className="mensagens-erro">
              {erro}
              <button className="retry-button" onClick={buscarMensagens}>
                Tentar novamente
              </button>
            </div>
          ) : mensagens.length === 0 ? (
            <div className="mensagens-vazio">
              <p>Nenhuma mensagem encontrada.</p>
            </div>
          ) : (
            <ul className="mensagens-lista">
              {mensagens.map((mensagem) => (
                <li key={mensagem.id} className="mensagem-card">
                  <div className="mensagem-header">
                    <div className="mensagem-topico">
                      <strong>Tópico:</strong>{" "}
                      {mensagem.topico?.titulo || "Não especificado"}
                    </div>
                    <div className="mensagem-data">
                      {formatarData(mensagem.data_criacao)}
                    </div>
                  </div>
                  <div className="mensagem-conteudo">
                    <strong>Mensagem:</strong> {mensagem.conteudo}
                  </div>
                  <div className="mensagem-footer">
                    <div className="mensagem-id">ID: {mensagem.id}</div>
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

export default ListarMensagens;
