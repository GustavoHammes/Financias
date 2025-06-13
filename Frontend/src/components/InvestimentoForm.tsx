import React, { useState } from 'react';

const InvestimentoForm = () => {
  const [usuarioId, setUsuarioId] = useState(1);
  const [investimentoId, setInvestimentoId] = useState(1);
  const [valor, setValor] = useState(0);
  const [meses, setMeses] = useState(0);
  const [resultado, setResultado] = useState<number | null>(null);

  const simular = async () => {
    const res = await fetch('http://localhost:3000/api/simular-investimento', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usuario_id: usuarioId,
        investimento_id: investimentoId,
        valor_investido: valor,
        meses,
      }),
    });
    const data = await res.json();
    setResultado(data.rendimento_final);
  };

  return (
    <div>
      <h2>Simular Investimento</h2>
      <input type="number" placeholder="ID do Usuário" onChange={e => setUsuarioId(+e.target.value)} />
      <input type="number" placeholder="ID do Investimento" onChange={e => setInvestimentoId(+e.target.value)} />
      <input type="number" placeholder="Valor Investido" onChange={e => setValor(+e.target.value)} />
      <input type="number" placeholder="Meses" onChange={e => setMeses(+e.target.value)} />
      <button onClick={simular}>Simular</button>
      {resultado && <p>Valor Final: R$ {resultado.toFixed(2)}</p>}
    </div>
  );
};

export default InvestimentoForm;
