export async function buscarTopicosPorNome(query) {
  const resp = await fetch(
    `http://localhost:8000/topicos/search?query=${encodeURIComponent(query)}`
  );
  if (!resp.ok) throw new Error();
  return resp.json();
}

export async function buscarTopicosPorCategoria(query) {
  const resp = await fetch(
    `http://localhost:8000/topicos/search_categoria?query=${encodeURIComponent(
      query
    )}`
  );
  if (!resp.ok) throw new Error();
  return resp.json();
}
