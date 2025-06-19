export async function criarTopico({ titulo, conteudo, categoria, token }) {
  const url = "http://localhost:8000/topicos/";
  const payload = { titulo, conteudo, categoria };

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    let erroMsg = "Erro ao criar tópico";
    let erroStatus = resp.status;
    try {
      const erro = await resp.json();
      erroMsg = erro.detail || erroMsg;
    } catch {
      // ignora, segue com a msg genérica
    }
    const err = new Error(erroMsg);
    err.status = erroStatus;
    throw err;
  }

  return resp.json();
}
