export async function criarMensagem({ conteudo, topico_id, token }) {
  const resp = await fetch("http://localhost:8000/mensagens/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ conteudo, topico_id }),
  });

  if (!resp.ok) {
    // Joga o status para quem chamou poder tratar
    const err = new Error("Erro ao criar mensagem");
    err.status = resp.status;
    throw err;
  }

  return resp.json();
}
