import { useState } from "react";
import BuscarTopicos from "../components/BuscarTopicos";
import CriarTopico from "../components/CriarTopico";
import Modal from "../components/Modal";
import CriarMensagem from "../components/CriarMensagem";
import BuscarMensagens from "../components/BuscarMensagens";
import "./Home.css";

function Home({ onLogout }) {
  const [modalAbertoTopico, setModalAbertoTopico] = useState(false);
  const [modalAbertoMensagem, setModalAbertoMensagem] = useState(false);

  return (
    <div className="home-container">
      <h1 className="home-title">Bem-vindo à Home!</h1>

      <div className="home-actions">
        <button className="home-btn" onClick={() => setModalAbertoTopico(true)}>
          Criar tópico
        </button>
        <button
          className="home-btn"
          onClick={() => setModalAbertoMensagem(true)}
        >
          Criar Mensagem
        </button>
        <button className="home-btn home-btn-logout" onClick={onLogout}>
          Logout
        </button>
      </div>

      <Modal
        isOpen={modalAbertoTopico}
        onClose={() => setModalAbertoTopico(false)}
      >
        <CriarTopico
          onSucesso={() => {
            /* recarregar lista se quiser */
          }}
        />
      </Modal>

      <Modal
        isOpen={modalAbertoMensagem}
        onClose={() => setModalAbertoMensagem(false)}
      >
        <CriarMensagem onNovoTopico={() => setModalAbertoMensagem(false)} />
      </Modal>

      <div className="home-listas">
        <BuscarTopicos selecionavel={false} />
        <BuscarMensagens selecionavel={false} />
      </div>
    </div>
  );
}

export default Home;
