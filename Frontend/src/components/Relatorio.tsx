import React, { useState } from 'react';

const Relatorio = () => {
  const [dados, setDados] = useState<any[]>([]);

  const carregar = async () => {
    const res = await fetch('http://localhost:3000/api/relatorio-investimentos');
    const data = await res.json();
    setDados(data);
  };

  return (
    <div>
      <h2>Relatório de Investimentos</h2>
      <button onClick={carregar}>Carregar Relatório</button>
      {dados.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Usuário</th>
              <th>Investimento</th>
              <th>Valor</th>
              <th>Meses</th>
              <th>Rendimento</th>
            </tr>
          </thead>
          <tbody>
            {dados.map((d, i) => (
              <tr key={i}>
                <td>{d.usuario}</td>
                <td>{d.investimento}</td>
                <td>R$ {d.valor_investido}</td>
                <td>{d.meses}</td>
                <td>R$ {d.rendimento_final}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Relatorio;
