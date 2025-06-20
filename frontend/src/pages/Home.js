import BuscarTopicos from "../components/BuscarTopicos";
import CriarTopico from "../components/CriarTopico";
import CriarMensagem from "../components/CriarMensagem";
import BuscarMensagens from "../components/BuscarMensagens";
import "./Home.css";
import ListarMensagens from "../components/ListarMensagens";
import ListarTopicos from "../components/ListarTopicos";

export default function Home({ onLogout }) {
  return (
    <div className="home-container">
      <h1 className="home-title">Bem-vindo à Home!</h1>

      {/* Barra de ações no topo direito */}
      <div className="home-actions-bar">
        <div className="home-actions-right">
          <BuscarTopicos selecionavel={false} />
          <BuscarMensagens selecionavel={false} />
          <CriarTopico />
          <CriarMensagem />
        </div>
      </div>

      <div className="home-actions-conteudo">
        <ListarMensagens />
        <ListarTopicos />
      </div>

      {/* Botão fixo de logout no canto inferior esquerdo */}
      <button className="home-btn home-btn-logout" onClick={onLogout}>
        Logout
      </button>

      {/* Conteúdo */}
      <div className="home-listas"></div>
    </div>
  );
}
