// Calculator card with 4 tabs

function Calculator({ result, setResult }) {
  const [tab, setTab] = React.useState('dum');
  const { igFromLMP, dppFromLMP, igFromUSG, dppFromUSG, igFromDPP, fertileWindow, fmtDate } = window.PregData;

  // DUM
  const [lmp, setLmp] = React.useState('2025-09-15');
  // USG
  const [usgDate, setUsgDate] = React.useState('2026-01-10');
  const [usgW, setUsgW] = React.useState(16);
  const [usgD, setUsgD] = React.useState(3);
  // DPP
  const [dpp, setDpp] = React.useState('2026-06-22');
  // Fertil — list of period dates (min 2)
  const [periodDates, setPeriodDates] = React.useState(['2026-02-15', '2026-03-14', '2026-04-11']);

  const calculate = () => {
    if (tab === 'dum' && lmp) {
      const ig = igFromLMP(lmp);
      if (ig) setResult({ kind: 'preg', ig, dpp: dppFromLMP(lmp), method: 'DUM' });
    } else if (tab === 'usg' && usgDate) {
      const ig = igFromUSG(usgDate, +usgW, +usgD);
      if (ig) setResult({ kind: 'preg', ig, dpp: dppFromUSG(usgDate, +usgW, +usgD), method: 'USG' });
    } else if (tab === 'dpp' && dpp) {
      const ig = igFromDPP(dpp);
      if (ig) setResult({ kind: 'preg', ig, dpp: new Date(dpp), method: 'DPP' });
    } else if (tab === 'fertil') {
      const win = window.PregData.fertileFromDates(periodDates);
      if (win) setResult({ kind: 'fertil', ...win });
      else setResult({ kind: 'fertil-incomplete' });
    }
  };

  React.useEffect(() => { calculate(); }, [tab, lmp, usgDate, usgW, usgD, dpp, periodDates]);

  const tabs = [
    { id: 'dum', label: 'DUM', icon: I.calendar, hint: 'Data da última menstruação' },
    { id: 'usg', label: 'Ultrassom', icon: I.ultrasound, hint: 'Idade gestacional informada no exame' },
    { id: 'dpp', label: 'DPP', icon: I.baby, hint: 'Data provável do parto já estimada' },
    { id: 'fertil', label: 'Período fértil', icon: I.spark, hint: 'Para quem está tentando engravidar' },
  ];
  const activeTab = tabs.find(t => t.id === tab);

  return (
    <div className="card">
      <div className="card-head">
        <div>
          <p className="card-sub">Calcular</p>
          <h2 className="card-title">Como você quer começar?</h2>
        </div>
      </div>

      <div className="tabs" role="tablist">
        {tabs.map(t => (
          <button key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            <t.icon /> {t.label}
          </button>
        ))}
      </div>

      <div className="helper">
        <I.info />
        <span><strong style={{color: 'var(--ink)'}}>{activeTab.label}.</strong> {activeTab.hint}. Preencha abaixo e o cálculo é atualizado automaticamente.</span>
      </div>

      {tab === 'dum' && (
        <div className="field-row single">
          <div className="field">
            <label>Primeiro dia da última menstruação</label>
            <input className="input" type="date" value={lmp} onChange={e => setLmp(e.target.value)} max="2026-05-06" />
          </div>
        </div>
      )}

      {tab === 'usg' && (
        <>
          <div className="field-row single">
            <div className="field">
              <label>Data do ultrassom</label>
              <input className="input" type="date" value={usgDate} onChange={e => setUsgDate(e.target.value)} max="2026-05-06" />
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>Semanas no exame</label>
              <input className="input" type="number" min="4" max="42" value={usgW} onChange={e => setUsgW(e.target.value)} />
            </div>
            <div className="field">
              <label>Dias no exame</label>
              <input className="input" type="number" min="0" max="6" value={usgD} onChange={e => setUsgD(e.target.value)} />
            </div>
          </div>
        </>
      )}

      {tab === 'dpp' && (
        <div className="field-row single">
          <div className="field">
            <label>Data provável do parto</label>
            <input className="input" type="date" value={dpp} onChange={e => setDpp(e.target.value)} />
          </div>
        </div>
      )}

      {tab === 'fertil' && (
        <FertilDates dates={periodDates} setDates={setPeriodDates} />
      )}

      <div className="btn-row" style={{marginTop: 16, justifyContent: 'space-between'}}>
        <button className="btn ghost">
          <I.calendar /> Salvar no histórico
        </button>
        <button className="btn primary" onClick={calculate}>
          Recalcular <I.arrow />
        </button>
      </div>
    </div>
  );
}

window.Calculator = Calculator;

function FertilDates({ dates, setDates }) {
  const validDates = dates.filter(Boolean).map(d => new Date(d)).sort((a,b) => a - b);
  const gaps = [];
  for (let i = 1; i < validDates.length; i++) {
    gaps.push(Math.round((validDates[i] - validDates[i-1]) / 86400000));
  }
  const validGaps = gaps.filter(g => g >= 18 && g <= 50);
  const avg = validGaps.length ? Math.round(validGaps.reduce((a,b) => a+b, 0) / validGaps.length) : null;

  const update = (idx, val) => {
    const next = [...dates]; next[idx] = val; setDates(next);
  };
  const add = () => setDates([...dates, '']);
  const remove = (idx) => {
    if (dates.length <= 2) return;
    setDates(dates.filter((_, i) => i !== idx));
  };

  return (
    <>
      <div className="field">
        <label style={{marginBottom: 8}}>Datas de início das suas menstruações (mínimo 2)</label>
      </div>
      <div className="date-list">
        {dates.map((d, i) => {
          const dt = d ? new Date(d) : null;
          const prevDt = i > 0 && dates[i-1] ? new Date(dates[i-1]) : null;
          const gap = dt && prevDt ? Math.round((dt - prevDt) / 86400000) : null;
          return (
            <div key={i} className="date-item">
              <span className="idx">{i + 1}</span>
              <input type="date" value={d || ''} onChange={e => update(i, e.target.value)} max="2026-05-06" />
              <span className="gap-tag">
                {gap === null ? '—' : `${gap} dias do anterior`}
              </span>
              <button className="remove" onClick={() => remove(i)} disabled={dates.length <= 2} title="Remover">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
          );
        })}
      </div>
      <button className="add-date" onClick={add}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
        Adicionar outra menstruação
      </button>

      {avg && (
        <div className="cycle-summary">
          <div className="col">
            <div className="lbl">Registros</div>
            <div className="val">{validDates.length}</div>
          </div>
          <div className="col">
            <div className="lbl">Ciclo médio</div>
            <div className="val">{avg} d</div>
          </div>
          <div className="col">
            <div className="lbl">Variação</div>
            <div className="val">{validGaps.length > 1 ? `±${Math.round((Math.max(...validGaps) - Math.min(...validGaps))/2)} d` : '—'}</div>
          </div>
        </div>
      )}

      <p className="tab-tip" style={{marginTop: 6}}>
        Quanto mais ciclos você registrar, mais precisa fica a previsão. Adicione novas datas a cada nova menstruação que acontecer. ✨
      </p>
    </>
  );
}
window.FertilDates = FertilDates;
