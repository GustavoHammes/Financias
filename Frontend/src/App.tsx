import React from 'react';
import EmprestimoForm from './components/EmprestimoForm';
import InvestimentoForm from './components/InvestimentoForm';
import Relatorio from './components/Relatorio';


function App() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Simulador Financeiro</h1>
      <EmprestimoForm />
      <hr />
      <InvestimentoForm />
      <hr />
      <Relatorio />
      
    </div>
  );
}

export default App;
