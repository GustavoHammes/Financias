import React, { useEffect, useState } from 'react';

interface Investimento {
  id: number | string;
  nome: string;
}

interface ResultadoSimulacao {
  nome_usuario: string;
  investimento: string;
  valor_investido: number;
  meses: number;
  rendimento_final: number;
}

const InvestimentoForm = () => {
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [investimentoId, setInvestimentoId] = useState<string | null>(null);
  const [valor, setValor] = useState(0);
  const [meses, setMeses] = useState(0);
  const [resultados, setResultados] = useState<ResultadoSimulacao[]>([]);
  const [investimentos, setInvestimentos] = useState<Investimento[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/investimentos')
      .then(res => res.json())
      .then(data => setInvestimentos(data))
      .catch(() => setInvestimentos([]));
  }, []);

  const simular = async () => {
    if (!investimentoId || !nomeUsuario || valor <= 0 || meses <= 0) {
      alert("Preencha nome, investimento, valor e meses com valores positivos.");
      return;
    }

    // Salva o usuário sempre que clicar em simular
    localStorage.setItem('usuario', nomeUsuario);

    const res = await fetch('http://localhost:3000/api/simular-investimento', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome_usuario: nomeUsuario,
        investimento_id: investimentoId,
        valor_investido: valor,
        meses,
      }),
    });

    const data = await res.json();
    if (Array.isArray(data)) {
      setResultados(data);
    } else {
      setResultados([data]);
    }
  };

  return (
    <div>
      <h2>Simular Investimento</h2>
      <input
        type="text"
        placeholder="Insira seu nome"
        value={nomeUsuario}
        onChange={e => setNomeUsuario(e.target.value)}
      />
      <select onChange={e => setInvestimentoId(e.target.value)} defaultValue="">
        <option value="" disabled>Tipo de investimento</option>
        {investimentos.map(inv => (
          <option key={inv.id} value={inv.id}>{inv.nome}</option>
        ))}
      </select>
      <input type="number" placeholder="Valor Investido" min={1} onChange={e => setValor(+e.target.value)} />
      <input type="number" placeholder="Meses" min={1} onChange={e => setMeses(+e.target.value)} />
      <button onClick={simular}>Simular</button>

      {resultados.length > 0 && (
        <table style={{ marginTop: '1rem', width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '8px' }}>Usuário</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Investimento</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Valor Investido (R$)</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Meses</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Rendimento Final (R$)</th>
            </tr>
          </thead>
          <tbody>
            {resultados.map((res, idx) => (
              <tr key={idx}>
                <td style={{ border: '1px solid black', padding: '8px' }}>{res.nome_usuario}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{res.investimento}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{res.valor_investido.toFixed(2)}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{res.meses}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{res.rendimento_final.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default InvestimentoForm;
