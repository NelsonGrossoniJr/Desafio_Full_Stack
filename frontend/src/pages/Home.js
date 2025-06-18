import { useState } from "react";
import BuscarTopicos from "../components/BuscarTopicos";
import CriarTopico from "../components/CriarTopico";
import Modal from "../components/Modal";

function Home({ onLogout, usuarioLogado }) {
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <div>
      <h1>
        Bem-vindo{usuarioLogado?.nome ? `, ${usuarioLogado.nome}` : ""} à Home!
      </h1>

      <button onClick={() => setModalAberto(true)}>Criar tópico</button>

      <Modal isOpen={modalAberto} onClose={() => setModalAberto(false)}>
        <CriarTopico onNovoTopico={() => setModalAberto(false)} />
      </Modal>

      <BuscarTopicos />

      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

export default Home;
