import "../../styles/resumo.css";
export default function Resumo({ transacoes }) {
  let somaEntradas = 0;
  let somaSaidas = 0;
  for (let item of transacoes) {
    if (item.tipo === "entrada") {
      somaEntradas += item.valor;
    } else {
      somaSaidas += item.valor;
    }
  }
  return (
    <div className="resumo">
      <h1>Resumo</h1>
      <div className="entradas">
        <span>Entradas</span>
        <strong>{`R$ ${(somaEntradas / 100).toFixed(2)}`}</strong>
      </div>
      <div className="saidas">
        <span>Saídas</span>
        <strong>{`R$ ${(somaSaidas / 100).toFixed(2)}`}</strong>
      </div>
      <div className="saldo">
        <span>Saldo</span>
        <strong>{`R$ ${((somaEntradas - somaSaidas) / 100).toFixed(
          2
        )}`}</strong>
      </div>
    </div>
  );
}
