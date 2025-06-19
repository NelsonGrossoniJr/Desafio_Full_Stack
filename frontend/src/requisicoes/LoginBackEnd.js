export async function fazerLogin(username, password) {
  const response = await fetch("http://localhost:8000/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      username,
      password,
    }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Usuário ou senha inválidos!");
    }
    throw new Error("Erro ao realizar login. Tente novamente.");
  }

  return await response.json();
}
