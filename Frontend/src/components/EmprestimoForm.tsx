import React, { useState } from 'react';

const EmprestimoForm = () => {
  const [valor, setValor] = useState(0);
  const [parcelas, setParcelas] = useState(0);
  const [taxa, setTaxa] = useState(0);
  const [tipo, setTipo] = useState<'simples' | 'composto'>('simples');
  const [resultado, setResultado] = useState<number[]>([]);

  const simular = async () => {
    const res = await fetch('http://localhost:3000/api/simular-emprestimo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        valor_total: valor,
        parcelas,
        taxa_juros: taxa,
        tipo_juros: tipo,
      }),
    });
    const data = await res.json();
    setResultado(data.parcelas);
  };

  return (
    <div>
      <h2>Simular Empréstimo</h2>
      <input type="number" placeholder="Valor total" onChange={e => setValor(+e.target.value)} />
      <input type="number" placeholder="Parcelas" onChange={e => setParcelas(+e.target.value)} />
      <input type="number" placeholder="Taxa (%)" onChange={e => setTaxa(+e.target.value)} />
      <select onChange={e => setTipo(e.target.value as any)}>
        <option value="simples">Juros Simples</option>
        <option value="composto">Juros Compostos</option>
      </select>
      <button onClick={simular}>Simular</button>
      {resultado.length > 0 && (
        <ul>
          {resultado.map((p, i) => <li key={i}>Parcela {i + 1}: R$ {p.toFixed(2)}</li>)}
        </ul>
      )}
    </div>
  );
};

export default EmprestimoForm;
