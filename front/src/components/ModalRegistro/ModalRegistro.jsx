import { useEffect, useState } from "react";
import btnClose from "../../assets/fechar.svg";
import "../../styles/modal.css";
import { getToken } from "../../utils/token";
import { format, parse } from "date-fns";
import api from "../../services/api";

export default function ModalRegistro({
  transacao,
  adicionar,
  editar,
  setShowModalEditar,
  getRegistros,
  setShowModalAdicionar,
}) {
  const [form, setForm] = useState({
    valor: "",
    categoria: "0",
    data: "",
    descrição: "",
  });
  const [tipoTransacao, setTipoTransacao] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [errorForm, setErrorForm] = useState(false);
  const [errorValor, setErrorValor] = useState(false);
  const [errorData, setErrorData] = useState(false);
  const [errorDescricao, setErrorDescricao] = useState(false);
  const [errorTipo, setErrorTipo] = useState(false);
  const [errorCategoria, setErrorCategoria] = useState(false);
  const token = getToken();

  useEffect(() => {
    if (editar) {
      setForm({
        valor: (transacao.valor / 100).toFixed(2),
        categoria: transacao.categoria_id,
        data: format(new Date(transacao.data), "dd/MM/yyyy"),
        descrição: transacao.descricao,
      });
      setTipoTransacao(transacao.tipo);
    }
  }, []);
  useEffect(() => {
    setErrorTipo(false);
  }, [tipoTransacao]);

  useEffect(() => {
   async function getCategorias(){
    const response = await api.get('/categoria')
    setCategorias(response.data);
   }
   getCategorias();
  }, [])

  const fecharModal = () => {
    if (editar) {
      setShowModalEditar(false);
    } else {
      setShowModalAdicionar(false);
    }
  };

  const handleChangeForm = (e) => {
    if (e.target.name === "valor") {
      setErrorValor(false);
    }
    if (e.target.name === "data") {
      setErrorData(false);
    }
    if (e.target.name === "descrição") {
      setErrorDescricao(false);
    }
    if (e.target.name === "categoria") {
      setErrorCategoria(false);
    }
    const value = e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const date = parse(form.data, "dd/MM/yyyy", new Date());
    if (Number(form.valor) <= 0) {
      return setErrorValor(true);
    }
    if (form.categoria === "0") {
      return setErrorCategoria(true);
    }
    if (form.data === "") {
      return setErrorData(true);
    }
    if (form.descrição === "") {
      return setErrorDescricao(true);
    }
    if (editar) {
      try {
        const response = await api.put(`/transacao/${transacao.id}`, {
          descricao: form.descrição,
          valor: parseInt(form.valor * 100),
          data: date,
          categoria_id: form.categoria,
          tipo: tipoTransacao
        });
        getRegistros();
        setShowModalEditar(false);
      } catch (error) {
        setErrorForm(true);
        setTimeout(() => {
          setShowModalEditar(false);
        }, 1500);
      }
    } else {
      if (tipoTransacao === "") {
        return setErrorTipo(true);
      }
      try {
        const response = await api.post("/transacao", {
          descricao: form.descrição,
          valor: parseInt(form.valor * 100),
          data: date,
          categoria_id: form.categoria,
          tipo: tipoTransacao,
        });

        getRegistros();
        setShowModalAdicionar(false);
      } catch (error) {
        setErrorForm(true);
        setTimeout(() => {
          setShowModalAdicionar(false);
        }, 1500);
      }
    }
  };
  
  return (
    <div className="modal-background">
      <div className="modal">
        {errorForm ? (
          <h1 className="error">
            {editar
              ? "Não foi possível editar o registro"
              : "Não foi possível adicionar o registro"}
          </h1>
        ) : (
          <>
            <span>
              <h1>{adicionar ? "Adicionar Registro" : "Editar Registro"}</h1>
              <img
                src={btnClose}
                alt="Fechar"
                className="fechar"
                onClick={() => fecharModal()}
              />
            </span>
            <div className="tipos-de-registro">
              <button
                className={`tipo-entrada ${
                  tipoTransacao === "entrada"
                    ? "entrada-selecionado"
                    : "desselecionado"
                }`}
                onClick={() => setTipoTransacao("entrada")}
              >
                Entrada
              </button>
              <button
                className={`tipo-saida ${
                  tipoTransacao === "saida"
                    ? "saida-selecionado"
                    : "desselecionado"
                }`}
                onClick={() => setTipoTransacao("saida")}
              >
                Saída
              </button>
            </div>
            {errorTipo && (
              <span className="error">
                Indique qual o tipo de transação deve ser adicionada
              </span>
            )}
            <form onSubmit={handleSubmit}>
              <span className="rs">R$ </span>
              <label htmlFor="valor">Valor</label>
              <input
                type="number"
                id="valor"
                name="valor"
                value={form.valor}
                onChange={handleChangeForm}
              />
              {errorValor && (
                <span className="error">
                  O valor deve ser maior que 0
                </span>
              )}
              <label htmlFor="categoria">Categoria</label>
              <select
                id="categoria"
                name="categoria"
                value={form.categoria}
                onChange={handleChangeForm}
              >
                <option disabled value="0"></option>
                {
                  categorias.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.descricao}
                    </option>
                  ))
                }
              </select>
              {errorCategoria && (
                <span className="error">
                  Escolha uma categoria para adicionar o registro
                </span>
              )}
              <label htmlFor="data">Data</label>
              <input
                id="data"
                type="string"
                name="data"
                value={form.data}
                onChange={handleChangeForm}
              />
              {errorData && (
                <span className="error">
                  {editar
                    ? "Insira uma data para atualizar o registro"
                    : "Insira uma data para adicionar o registro"}
                </span>
              )}
              <label htmlFor="descrição">Descrição</label>
              <input
                id="descrição"
                type="text"
                name="descrição"
                value={form.descrição}
                onChange={handleChangeForm}
              />
              {errorDescricao && (
                <span className="error">
                  {editar
                    ? "Insira uma descrição para atualizar o registro"
                    : "Insira uma descrição para adicionar o registro"}
                </span>
              )}
              <button className="confirmar">Confirmar</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
