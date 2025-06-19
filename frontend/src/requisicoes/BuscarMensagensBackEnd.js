export async function listarMensagens() {
  const resp = await fetch("http://localhost:8000/mensagens/");
  if (!resp.ok) throw new Error();
  return resp.json();
}

export async function buscarMensagensPorTopico(nomeTopico) {
  const resp = await fetch(
    `http://localhost:8000/mensagens-por-topico/?nome_topico=${encodeURIComponent(
      nomeTopico
    )}`
  );
  if (!resp.ok) throw new Error();
  return resp.json();
}
