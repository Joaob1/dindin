import { getToken } from "../../utils/token";
import lapis from "../../assets/lapis.svg";
import lixeira from "../../assets/lixeira.svg";
import filter from "../../assets/filter.svg";
import seta from "../../assets/seta.svg";
import { format } from "date-fns";
import "../../styles/Registros.css";
import api from "../../services/api";
import { useEffect, useState } from "react";
import ModalRegistro from "../ModalRegistro/ModalRegistro";
import ExcluirRegistro from "../ExcluirRegistro/ExcluirRegistro";
import Resumo from "../Resumo/Resumo";
import Filtrar from "../Filtro/Filtro";
const diasDaSemana = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];
export default function Registros() {
  const token = getToken();
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [showModalAdicionar, setShowModalAdicionar] = useState(false);
  const [transacoes, setTransacoes] = useState([]);
  const [transacoesTotais, setTransacoesTotais] = useState([]);
  const [transacaoModal, setTransacaoModal] = useState({});
  const [dataCrescente, setDataCrescente] = useState(false);
  const [excluirRegistro, setExcluirRegistro] = useState(false);
  const [usuarioId, setUsuarioId] = useState(0);
  const [filtrar, setFiltrar] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const getCategorias = async () => {
    const response = await api.get('/categoria');
    setCategorias(response.data);
  }
  useEffect(() => {
    getCategorias();
  }, [])
  const getRegistros = async () => {
    try {
      const response = await api.get("/transacao");
      const registros = response.data;
      registros.sort(function (a, b) {
        if (dataCrescente) {
          return new Date(b.data).getTime() - new Date(a.data).getTime();
        } else {
          return new Date(a.data).getTime() - new Date(b.data).getTime();
        }
      });
      setTransacoes(registros);
      setTransacoesTotais(registros);
    } catch (error) {
      return;
    }
  };
  useEffect(() => {
    getRegistros();
  }, []);
  useEffect(() => {
    const localTransacoes = [...transacoes];
    localTransacoes.sort(function (a, b) {
      if (dataCrescente) {
        return new Date(b.data).getTime() - new Date(a.data).getTime();
      } else {
        return new Date(a.data).getTime() - new Date(b.data).getTime();
      }
    });
    setTransacoes(localTransacoes);
  }, [dataCrescente]);
  const abrirModal = (transacao) => {
    setTransacaoModal(transacao);
    setShowModalEditar(true);
  };
  const handleExcluirRegistro = (id) => {
    setExcluirRegistro(!excluirRegistro);
    setUsuarioId(id);
  };
  return (
    <>
      <section className="container-registros">
        <button className="filtrar" onClick={() => setFiltrar(!filtrar)}>
          <img src={filter} alt="Filtrar" />
          <span>Filtrar</span>
        </button>
        {filtrar && (
          <Filtrar
            transacoes={transacoes}
            setTransacoes={setTransacoes}
            getRegistros={getRegistros}
          />
        )}
        <div className="header-registros">
          <span
            className="header-data"
            onClick={() => setDataCrescente(!dataCrescente)}
          >
            <h1>Data</h1>
            <img
              src={seta}
              alt="Seta"
              className={dataCrescente ? "seta-baixo" : ""}
            />
          </span>
          <h2>Dia da semana</h2>
          <h2>Descrição</h2>
          <h2>Categoria</h2>
          <h2>Valor</h2>
        </div>
        {transacoes.map((item) => (
          <div className="transacao" key={item.id}>
            <span className="data">
              {format(new Date(item.data), "dd/MM/yyyy")}
            </span>
            <span className="dia-da-semana">
              {diasDaSemana[new Date(item.data).getDay()]}
            </span>
            <span className="descricao">{item.descricao}</span>
            <span className="categoria">{item.categoria_nome}</span>
            <span
              className={`valor ${
                item.tipo === "entrada" ? "entrada" : "saida"
              }`}
            >{`R$ ${(item.valor / 100).toFixed(2)}`}</span>
            <img
              src={lapis}
              alt="editar"
              className="editar"
              onClick={() => abrirModal(item)}
            />
            <img
              src={lixeira}
              alt="icon-excluir"
              className="icon-excluir"
              onClick={() => handleExcluirRegistro(item.id)}
            />
            {excluirRegistro && item.id === usuarioId && (
              <ExcluirRegistro
                getRegistros={getRegistros}
                registroId={item.id}
                setExcluirRegistro={setExcluirRegistro}
              />
            )}
          </div>
        ))}
        {showModalEditar && (
          <ModalRegistro
            editar
            setShowModalEditar={setShowModalEditar}
            getRegistros={getRegistros}
            transacao={transacaoModal}
          />
        )}
      </section>
      <aside>
        <Resumo transacoes={transacoesTotais} />
        <button
          className="adicionar-registro"
          onClick={() => setShowModalAdicionar(true)}
        >
          Adicionar Registro
        </button>
        {showModalAdicionar && (
          <ModalRegistro
            adicionar
            getRegistros={getRegistros}
            setShowModalAdicionar={setShowModalAdicionar}
          />
        )}
      </aside>
    </>
  );
}
