import { useState } from "react";
import BuscarTopicos from "../components/BuscarTopicos";
import CriarTopico from "../components/CriarTopico";
import Modal from "../components/Modal";
import CriarMensagem from "../components/CriarMensagem";

function Home({ onLogout, usuarioLogado }) {
  const [modalAbertoTopico, setModalAbertoTopico] = useState(false);
  const [modalAbertoMensagem, setModalAbertoMensagem] = useState(false);

  return (
    <div>
      <h1>
        Bem-vindo{usuarioLogado?.nome ? `, ${usuarioLogado.nome}` : ""} à Home!
      </h1>

      <button onClick={() => setModalAbertoTopico(true)}>Criar tópico</button>
      <Modal
        isOpen={modalAbertoTopico}
        onClose={() => setModalAbertoTopico(false)}
      >
        <CriarTopico
          onSucesso={() => {
            /* aqui você pode recarregar a lista, se precisar */
          }}
        />
      </Modal>

      <button onClick={() => setModalAbertoMensagem(true)}>
        Criar Mensagem
      </button>
      <Modal
        isOpen={modalAbertoMensagem}
        onClose={() => setModalAbertoMensagem(false)}
      >
        <CriarMensagem onNovoTopico={() => setModalAbertoMensagem(false)} />
      </Modal>

      <BuscarTopicos />

      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

export default Home;
