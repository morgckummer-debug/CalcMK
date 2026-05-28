// MKCalc dashboard components

function ResultCard({ result }) {
  const { fmtDate, trimester, milestoneFor } = window.PregData;
  if (!result) return null;
  if (result.kind === 'fertil' || result.kind === 'fertil-incomplete') return <FertilResult result={result} />;

  const { ig, dpp, method } = result;
  const tri = trimester(ig.weeks);
  const totalDays = 280;
  const pct = Math.min(100, (ig.totalDays / totalDays) * 100);
  const C = 2 * Math.PI * 88;

  return (
    <div className="card feature">
      <div className="card-head">
        <div>
          <p className="card-sub">Resultado · {method}</p>
          <h2 className="card-title">Você está em <span className="serif" style={{color: 'var(--peach-deep)', fontStyle: 'italic'}}>{ig.weeks}s {ig.days}d</span></h2>
        </div>
      </div>

      <div className="ig-display">
        <div className="ig-orb">
          <div className="ring-bg"></div>
          <svg width="200" height="200">
            <circle className="ring-fg" cx="100" cy="100" r="88" fill="none" strokeWidth="14"
              strokeDasharray={C}
              strokeDashoffset={C - (C * pct / 100)}
              strokeLinecap="round"/>
          </svg>
          <div className="ig-orb-center">
            <div>
              <div className="ig-num"><span className="accent">{ig.weeks}</span><span style={{fontSize: 28, color: 'var(--ink-2)'}}>+{ig.days}</span></div>
              <div className="ig-unit">Semanas · Dias</div>
            </div>
          </div>
        </div>
        <div className="ig-summary">
          <div className="row"><span className="lbl">Trimestre</span><span className="val">{tri}º</span></div>
          <div className="row"><span className="lbl">DPP</span><span className="val">{fmtDate(dpp)}</span></div>
          <div className="row"><span className="lbl">Faltam</span><span className="val">{Math.max(0, 280 - ig.totalDays)} dias</span></div>
          <div className="row"><span className="lbl">Progresso</span><span className="val">{Math.round(pct)}%</span></div>
        </div>
      </div>

      <div className="trimester-bar">
        <div className="tri-track">
          <div className="tri-fill" style={{width: `calc(${pct}% - 4px)`}}/>
          <div className="tri-marker" style={{left: `${pct}%`}}/>
        </div>
        <div className="tri-labels">
          <span className={tri === 1 ? 'active' : ''}>1º · até 13s</span>
          <span className={tri === 2 ? 'active' : ''}>2º · 14–27s</span>
          <span className={tri === 3 ? 'active' : ''}>3º · 28s ao parto</span>
        </div>
      </div>
    </div>
  );
}

function MilestonesCard({ result }) {
  const { milestoneFor } = window.PregData;
  if (!result || result.kind !== 'preg') return null;
  const m = milestoneFor(result.ig.weeks);
  return (
    <div className="card">
      <div className="card-head">
        <div>
          <p className="card-sub">Marcos · semana {m.week}</p>
          <h2 className="card-title">Pequenas conquistas</h2>
        </div>
      </div>
      <div className="milestones">
        <div className="milestone">
          <div className="lbl">Tamanho aprox.</div>
          <div className="val">{m.length}</div>
          <div className="sub">do tamanho de um(a) {m.fruit}</div>
        </div>
        <div className="milestone">
          <div className="lbl">Peso (Hadlock p40)</div>
          <div className="val">{m.weight}</div>
          <div className="sub">{m.dev}</div>
        </div>
      </div>
    </div>
  );
}

function BabyCard({ result }) {
  const { milestoneFor } = window.PregData;
  if (!result || result.kind !== 'preg') return null;
  const m = milestoneFor(result.ig.weeks);
  return (
    <div className="baby-card">
      <div className="card-head" style={{marginBottom: 0}}>
        <div>
          <p className="card-sub">Esta semana</p>
          <h2 className="card-title">{m.fruit}</h2>
        </div>
      </div>
      <div className="orb-stage">
        <div className="baby-orb-mini m1"></div>
        <div className="baby-orb"></div>
        <div className="baby-orb-mini m2"></div>
      </div>
      <div className="baby-meta-row">
        <div className="baby-fact"><div className="lbl">Comprimento</div><div className="val">{m.length}</div></div>
        <div className="baby-fact"><div className="lbl">Peso · p40</div><div className="val">{m.weight}</div></div>
      </div>
    </div>
  );
}

function Timeline({ result }) {
  if (!result || result.kind !== 'preg') return null;
  const current = result.ig.weeks;
  const weeks = Array.from({length: 41}, (_, i) => i);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current) {
      const el = ref.current.querySelector('.week-pill.current');
      if (el) ref.current.scrollLeft = el.offsetLeft - 200;
    }
  }, [current]);
  return (
    <div className="card">
      <div className="card-head">
        <div>
          <p className="card-sub">Timeline</p>
          <h2 className="card-title">Sua jornada, semana a semana</h2>
        </div>
        <div style={{fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 600}}>
          {current}/40
        </div>
      </div>
      <div className="timeline-wrap" ref={ref}>
        <div className="timeline">
          {weeks.map(w => (
            <div key={w} className={`week-pill ${w < current ? 'past' : ''} ${w === current ? 'current' : ''}`}>
              <div className="num">{w}</div>
              <div>sem</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ExamsCard({ result }) {
  const { nextExams } = window.PregData;
  if (!result || result.kind !== 'preg') return null;
  const exams = nextExams(result.ig.weeks, 4);
  if (exams.length === 0) return null;
  return (
    <div className="card">
      <div className="card-head">
        <div>
          <p className="card-sub">Próximos passos</p>
          <h2 className="card-title">Exames sugeridos</h2>
        </div>
        <button className="btn ghost" style={{padding: '8px 14px', fontSize: 12}}>Ver todos</button>
      </div>
      <div className="exams">
        {exams.map(e => {
          const Icon = e.cat === 'usg' ? I.ultrasound : I.test;
          const wksAway = e.week - result.ig.weeks;
          return (
            <div key={e.week} className="exam">
              <div className={`exam-icon ${e.cat}`}><Icon /></div>
              <div className="exam-info">
                <div className="exam-name">{e.name}</div>
                <div className="exam-when">A partir da semana {e.week} · {wksAway === 0 ? 'esta semana' : `em ~${wksAway} sem`}</div>
              </div>
              <div className="exam-week">{e.week}s</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FertilResult({ result }) {
  const { fmtDate } = window.PregData;
  if (result.kind === 'fertil-incomplete') {
    return (
      <div className="card feature">
        <div className="card-head">
          <div>
            <p className="card-sub">Período fértil</p>
            <h2 className="card-title">Adicione pelo menos <span className="serif" style={{color: 'var(--peach-deep)', fontStyle: 'italic'}}>2 menstruações</span></h2>
          </div>
        </div>
        <p style={{color: 'var(--ink-2)', fontSize: 14, lineHeight: 1.6, margin: '8px 0 16px'}}>
          O cálculo precisa do intervalo entre pelo menos duas menstruações para estimar a duração do seu ciclo.
        </p>
        <PhaseCards cycleDays={28} />
      </div>
    );
  }

  const { ovulation, start, end, cycleDays } = result;
  return (
    <div className="card feature">
      <div className="card-head">
        <div>
          <p className="card-sub">Período fértil · ciclo médio {cycleDays} dias</p>
          <h2 className="card-title">Sua janela de <span className="serif" style={{color: 'var(--peach-deep)', fontStyle: 'italic'}}>maior fertilidade</span></h2>
        </div>
      </div>

      <div className="day-one-banner">
        <div className="day-one-badge">1</div>
        <div>
          <strong style={{display:'block', marginBottom: 2}}>O dia 1 do ciclo é o primeiro dia da menstruação.</strong>
          <span>Toda contagem começa daí — não do fim da menstruação.</span>
        </div>
      </div>

      <div className="fertil-result">
        <div className="fertil-card peak">
          <div className="lbl">Próxima ovulação</div>
          <div className="val">{fmtDate(ovulation)}</div>
          <div className="sub">Dia {cycleDays - 14} · pico de fertilidade</div>
        </div>
        <div className="fertil-card">
          <div className="lbl">Janela fértil</div>
          <div className="val">{fmtDate(start)} → {fmtDate(end)}</div>
          <div className="sub">~6 dias com maior chance</div>
        </div>
      </div>

      <div style={{marginTop: 22}}>
        <p className="card-sub" style={{marginBottom: 12}}>As 4 fases do seu ciclo</p>
        <PhaseCards cycleDays={cycleDays} />
      </div>

      <div className="dev-notes">
        <p><em>Como funciona.</em> A ovulação acontece cerca de 14 dias antes da próxima menstruação. Espermatozoides podem viver até 5 dias no organismo, por isso a janela fértil começa antes da ovulação.</p>
        <p><em>Dica.</em> Acompanhe sinais como muco cervical e temperatura basal para identificar a ovulação com mais precisão.</p>
      </div>
    </div>
  );
}

function PhaseCards({ cycleDays }) {
  const ovDay = cycleDays - 14;
  const phases = [
    { id: 'menses', name: 'Menstruação', day: `Dia 1 – 5`, desc: 'O ciclo começa aqui. O endométrio descama. Energia mais baixa — descanse.' },
    { id: 'follicular', name: 'Folicular', day: `Dia 6 – ${ovDay - 1}`, desc: 'Folículos amadurecem. Energia e disposição aumentam gradualmente.' },
    { id: 'ovulation', name: 'Ovulação', day: `Dia ${ovDay} (≈)`, desc: 'O óvulo é liberado. Pico de fertilidade — janela de ~24h.' },
    { id: 'luteal', name: 'Lútea', day: `Dia ${ovDay + 1} – ${cycleDays}`, desc: 'O corpo se prepara para uma possível gravidez.' }
  ];
  return (
    <div className="phases">
      {phases.map(p => (
        <div key={p.id} className={`phase-card ${p.id}`}>
          <div className="phase-orb"></div>
          <div className="phase-day">{p.day}</div>
          <div className="phase-name">{p.name}</div>
          <div className="phase-desc">{p.desc}</div>
        </div>
      ))}
    </div>
  );
}

window.ResultCard = ResultCard;
window.MilestonesCard = MilestonesCard;
window.BabyCard = BabyCard;
window.Timeline = Timeline;
window.ExamsCard = ExamsCard;
window.FertilResult = FertilResult;
window.PhaseCards = PhaseCards;
