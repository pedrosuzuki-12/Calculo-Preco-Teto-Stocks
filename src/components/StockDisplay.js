import React, { useState, useEffect } from 'react';

const StockDisplay = ({ stock }) => {
  const [precoAtual, setPrecoAtual] = useState(null);
  const [lpa, setLpa] = useState('');
  const [vpa, setVpa] = useState('');
  const [dy5Anos, setDy5Anos] = useState('');
  const [dy12Meses, setDy12Meses] = useState('');
  const [taxaRetorno, setTaxaRetorno] = useState('');
  const [crescimento, setCrescimento] = useState('');
  const [precosCalculados, setPrecosCalculados] = useState({});

  useEffect(() => {
    if (!stock) return;

    const buscarPrecoAtual = async () => {
      try {
        const ticker = stock.toUpperCase();
        const resposta = await fetch(
          `https://brapi.dev/api/quote/${ticker}?token=wZW5RpNvaHDem9J9tWtVcY`
        );
        const dados = await resposta.json();
        const preco = parseFloat(dados.results?.[0]?.regularMarketPrice);
        if (!isNaN(preco)) setPrecoAtual(preco);
        else throw new Error("Preço não encontrado");
      } catch (erro) {
        console.error("Erro ao buscar preço:", erro);
        setPrecoAtual(null);
      }
    };

    buscarPrecoAtual();
  }, [stock]);

  // Recalcula preço de Graham automaticamente
  useEffect(() => {
    if (!lpa || !vpa) return;
    const resultado = Math.sqrt(22.5 * parseFloat(lpa) * parseFloat(vpa)).toFixed(2);
    setPrecosCalculados(prev => ({ ...prev, graham: resultado }));
  }, [lpa, vpa]);

  // Recalcula preço de Bazin automaticamente
  useEffect(() => {
    if (!dy5Anos || !taxaRetorno || taxaRetorno === 0 || !precoAtual) return;

    const dividendoPorAcao = (parseFloat(dy5Anos) / 100) * precoAtual;
    const taxa = parseFloat(taxaRetorno) / 100;
    const resultado = (dividendoPorAcao / taxa).toFixed(2);
    setPrecosCalculados(prev => ({ ...prev, bazin: resultado }));
  }, [dy5Anos, taxaRetorno, precoAtual]);

  // Recalcula preço de Lynch automaticamente
  useEffect(() => {
    if (!lpa || !crescimento || !dy12Meses) return;
    const resultado = (
      parseFloat(lpa) * (parseFloat(crescimento) + parseFloat(dy12Meses))
    ).toFixed(2);
    setPrecosCalculados(prev => ({ ...prev, lynch: resultado }));
  }, [lpa, crescimento, dy12Meses]);

  const calcularRazao = precoJusto => {
    if (!precoAtual || precoAtual <= 0 || !precoJusto) return null;
    return (precoJusto / precoAtual).toFixed(2);
  };

  const classificarAcao = precoJusto => {
    if (!precoAtual || precoAtual <= 0 || !precoJusto) return null;
    const razao = precoJusto / precoAtual;

    if (razao < 1) return { texto: "Cara!", cor: "#e74c3c" };
    if (razao < 1.5) return { texto: "Preço justo", cor: "#f1c40f" };
    if (razao < 2) return { texto: "Abaixo do preço", cor: "#3498db" };
    return { texto: "Muito barata!", cor: "#2ecc71" };
  };

  const calcularMargemSeguranca = precoAlvo => {
    if (precoAtual && precoAtual > 0 && precoAlvo) {
      return (((precoAlvo / precoAtual) - 1) * 100).toFixed(2);
    }
    return null;
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h2>
        <a 
          href={`https://investidor10.com.br/acoes/${stock.toLowerCase()}/`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none", color: "#2c3e50" }}
        >
          {stock.toUpperCase()}
        </a>
      </h2>

      {precoAtual ? (
        <p><strong>Preço Atual:</strong> R$ {precoAtual.toFixed(2)}</p>
      ) : (
        <p><strong>Preço Atual:</strong> Indisponível</p>
      )}

      {/* Graham */}
      <div style={{ margin: '20px 0' }}>
        <h3>Fórmula de Graham</h3>
        <label>LPA</label><br />
        <input
          placeholder="LPA"
          value={lpa}
          onChange={(e) => setLpa(e.target.value)}
        /><br />
        <label>VPA</label><br />
        <input
          placeholder="VPA"
          value={vpa}
          onChange={(e) => setVpa(e.target.value)}
        /><br />
        {precosCalculados.graham && (
          <div>
            <p><strong>Preço Justo:</strong> R$ {precosCalculados.graham}</p>
            <p><strong>Margem de Segurança:</strong> {calcularMargemSeguranca(parseFloat(precosCalculados.graham))}%</p>
          </div>
        )}
      </div>

      {/* Bazin */}
      <div style={{ margin: '20px 0' }}>
        <h3>Fórmula de Bazin</h3>
        <label>Dividend Yield médio 5 anos (%)</label><br />
        <input
          placeholder="DY"
          value={dy5Anos}
          onChange={(e) => setDy5Anos(e.target.value)}
        /><br />
        <label>Taxa de Retorno (%)</label><br />
        <input
          placeholder="Taxa de Retorno (%)"
          value={taxaRetorno}
          onChange={(e) => setTaxaRetorno(e.target.value)}
        /><br />
        {precosCalculados.bazin && (
          <div>
            <p><strong>Preço Justo:</strong> R$ {precosCalculados.bazin}</p>
            <p><strong>Margem de Segurança:</strong> {calcularMargemSeguranca(parseFloat(precosCalculados.bazin))}%</p>
          </div>
        )}
      </div>

      {/* Lynch */}
      <div style={{ margin: '20px 0' }}>
        <h3>Fórmula de Lynch</h3>
        <label>LPA</label><br />
        <input
          placeholder="LPA"
          value={lpa}
          onChange={(e) => setLpa(e.target.value)}
        /><br />
        <label>Dividend Yield 12 meses (%)</label><br />
        <input
          placeholder="DY"
          value={dy12Meses}
          onChange={(e) => setDy12Meses(e.target.value)}
        /><br />
        <label>Crescimento (%)</label><br />
        <input
          placeholder="Crescimento"
          value={crescimento}
          onChange={(e) => setCrescimento(e.target.value)}
        /><br />
        {precosCalculados.lynch && (
          <div>
            <p><strong>Razão de Preço:</strong> {calcularRazao(parseFloat(precosCalculados.lynch))}</p>
            {classificarAcao(parseFloat(precosCalculados.lynch)) && (
              <p style={{ color: classificarAcao(parseFloat(precosCalculados.lynch)).cor }}>
                <strong>{classificarAcao(parseFloat(precosCalculados.lynch)).texto}</strong>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StockDisplay;
