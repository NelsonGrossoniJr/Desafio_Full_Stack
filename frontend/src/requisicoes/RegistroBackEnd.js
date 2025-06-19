export async function registrarUsuario({ nome, email, senha }) {
  try {
    const response = await fetch("http://localhost:8000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha }),
    });

    if (response.ok) {
      return {
        sucesso: true,
        mensagem: "Registro feito com sucesso! Você já pode fazer login.",
      };
    } else {
      const data = await response.json();
      return {
        sucesso: false,
        mensagem: data.detail || "Erro ao registrar. Tente de novo.",
      };
    }
  } catch {
    return { sucesso: false, mensagem: "Erro de conexão com o servidor." };
  }
}
