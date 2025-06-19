import React, { useState } from "react";
import BuscarTopicos from "./BuscarTopicos";

function CriarMensagem({ onNovaMensagem }) {
  const [topico, setTopico] = useState(null);
  const [conteudo, setConteudo] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleEnviar(e) {
    e.preventDefault();
    setCarregando(true);
    setMsg("");
    try {
      const resp = await fetch("http://localhost:8000/mensagens/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          conteudo,
          topico_id: topico.id,
        }),
      });
      if (!resp.ok) throw new Error();
      setMsg("Mensagem enviada!");
      setConteudo("");
      if (onNovaMensagem) onNovaMensagem();
    } catch {
      setMsg("Falha ao enviar mensagem.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div>
      {!topico ? (
        <>
          <h4>Escolha o tópico para sua mensagem:</h4>
          <BuscarTopicos onSelecionar={setTopico} />
        </>
      ) : (
        <>
          <div>
            <strong>Tópico selecionado:</strong> {topico.titulo}
            <button onClick={() => setTopico(null)} style={{ marginLeft: 8 }}>
              (trocar)
            </button>
          </div>
          <form onSubmit={handleEnviar}>
            <textarea
              placeholder="Digite sua mensagem"
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
              required
            />
            <br />
            <button type="submit" disabled={carregando || !conteudo}>
              Enviar
            </button>
          </form>
          <p>{msg}</p>
        </>
      )}
    </div>
  );
}

export default CriarMensagem;
