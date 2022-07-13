import api from "../../services/api";
import "../../styles/excluir.css";
import { getToken } from "../../utils/token";
export default function ExcluirRegistro({
  getRegistros,
  registroId,
  setExcluirRegistro,
}) {
  const token = getToken();
  const excluirTransacao = async () => {
    try {
      const response = await api.delete(`/transacao/${registroId}`);
      setExcluirRegistro(false);
      getRegistros();
    } catch (error) {
      return;
    }
  };
  return (
    <div className="excluir">
      <span>Apagar item?</span>
      <div className="botoes">
        <button className="botao-sim" onClick={excluirTransacao}>
          Sim
        </button>
        <button className="botao-nao" onClick={() => setExcluirRegistro(false)}>
          Não
        </button>
      </div>
    </div>
  );
}
