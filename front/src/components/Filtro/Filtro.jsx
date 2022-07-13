import { useEffect, useState } from "react";
import api from "../../services/api";
import { getToken } from "../../utils/token";
import adicionar from "../../assets/adicionar.svg";
import "../../styles/Filtro.css";
const token = getToken();
export default function Filtrar({ transacoes, setTransacoes, getRegistros }) {
  const [categorias, setCategorias] = useState([]);
  const [transacoesOriginais, setTransacoesOriginais] = useState([]);
  useEffect(() => {
    setTransacoesOriginais(transacoes);
    getCategorias();
  }, []);
  const getCategorias = async () => {
    try {
      const response = await api.get("/categoria");
      const newResponse = [];
      response.data.forEach((element) => {
        newResponse.push({
          id: element.id,
          descricao: element.descricao,
          clicado: false
        });
      });
      setCategorias(newResponse);
    } catch (error) {
      return;
    }
  };
  const handleAddCategoria = (categoria) => {
    const localCategorias = [...categorias];
    const categoriaClicada = localCategorias.find((item) => {
      return item.id === categoria.id;
    });
    categoriaClicada.clicado = !categoriaClicada.clicado;
    setCategorias(localCategorias);
  };
  const limparFiltros = () => {
    getCategorias();
    getRegistros();
  };
  const aplicarFiltros = async () => {
    const semCategoriasClicadas = categorias.find((item) => {
      return item.clicado === true;
    })
    if(!semCategoriasClicadas){
      return;
    }
    const novasTransacoes = [];
    const categoriasClicadas = categorias.filter((item) => {
      return item.clicado === true;
    });
    categoriasClicadas.forEach((item) => {
      transacoesOriginais.forEach((transacao) => {
        if (transacao.categoria_id === item.id) {
          novasTransacoes.push(transacao);
        }
      });
    });
    setTransacoes(novasTransacoes);
  };
  return (
    <div className="filtro">
      {categorias.map((categoria) => (
        <div
          className={`
                    filtro-categoria ${
                      categoria.clicado && "categoria-selecionada"
                    }`}
          key={categoria.id}
          onClick={() => handleAddCategoria(categoria)}
        >
          {categoria.descricao}
          <img src={adicionar} alt="Adicionar" />
        </div>
      ))}
      <div className="botoes-filtro">
        <button className="limpar" onClick={() => limparFiltros()}>
          Limpar Filtros
        </button>
        <button className="aplicar" onClick={() => aplicarFiltros()}>
          Aplicar Filtros
        </button>
      </div>
    </div>
  );
}
