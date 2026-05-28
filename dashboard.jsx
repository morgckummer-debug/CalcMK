// Right column: result, timeline, baby card, exams + fertil result

function ResultCard({ result }) {
  const { fmtDate, trimester, milestoneFor } = window.PregData;
  if (!result) return null;

  if (result.kind === 'fertil' || result.kind === 'fertil-incomplete') return <FertilResult result={result} />;

  const { ig, dpp, method } = result;
  const tri = trimester(ig.weeks);
  const totalDays = 280;
  const pct = Math.min(100, (ig.totalDays / totalDays) * 100);
  const ringPct = pct;
  const C = 2 * Math.PI * 78;
  const milestone = milestoneFor(ig.weeks);

  return (
    <div className="card feature">
      <div className="card-head">
        <div>
          <p className="card-sub">Resultado · {method}</p>
          <h2 className="card-title">Você está em <em style={{color: 'var(--lav-ink)', fontStyle: 'italic'}}>{ig.weeks} semanas e {ig.days} dia{ig.days !== 1 ? 's' : ''}</em></h2>
        </div>
      </div>

      <div className="ig-display">
        <div className="ig-ring">
          <svg width="180" height="180">
            <circle className="ring-bg" cx="90" cy="90" r="78" fill="none" strokeWidth="10"/>
            <circle className="ring-fg" cx="90" cy="90" r="78" fill="none" strokeWidth="10"
              strokeDasharray={C}
              strokeDashoffset={C - (C * ringPct / 100)}
              strokeLinecap="round"/>
          </svg>
          <div className="ig-ring-center">
            <div>
              <div className="ig-num"><em>{ig.weeks}</em><span style={{fontSize: 28, color: 'var(--ink-2)'}}>+{ig.days}</span></div>
              <div className="ig-unit">Semanas · Dias</div>
            </div>
          </div>
        </div>
        <div className="ig-summary">
          <div className="row">
            <span className="lbl">Trimestre</span>
            <span className="val">{tri}º trimestre</span>
          </div>
          <div className="row">
            <span className="lbl">DPP estimada</span>
            <span className="val">{fmtDate(dpp)}</span>
          </div>
          <div className="row">
            <span className="lbl">Faltam</span>
            <span className="val">{Math.max(0, 280 - ig.totalDays)} dias</span>
          </div>
          <div className="row">
            <span className="lbl">Progresso</span>
            <span className="val">{Math.round(pct)}%</span>
          </div>
        </div>
      </div>

      <div className="trimester-bar">
        <div className="tri-track">
          <div className="tri-fill" style={{width: `${pct}%`}}/>
          <div className="tri-marker" style={{left: `${pct}%`}}/>
        </div>
        <div className="tri-labels">
          <span className={tri === 1 ? 'active' : ''}>1º · até 13s</span>
          <span className={tri === 2 ? 'active' : ''}>2º · 14–27s</span>
          <span className={tri === 3 ? 'active' : ''}>3º · 28–40s</span>
        </div>
      </div>

      <div style={{marginTop: 22}}>
        <p className="card-sub" style={{marginBottom: 10}}>Marcos da semana {milestone.week}</p>
        <div className="milestones">
          <div className="milestone">
            <div className="lbl">Tamanho aprox.</div>
            <div className="val">{milestone.length}</div>
            <div className="sub">do tamanho de um(a) {milestone.fruit}</div>
          </div>
          <div className="milestone">
            <div className="lbl">Peso aprox.</div>
            <div className="val">{milestone.weight}</div>
            <div className="sub">{milestone.dev}</div>
          </div>
        </div>
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
        <div style={{fontSize: 12, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em'}}>
          {current}/40 semanas
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

function BabyCard({ result }) {
  const { milestoneFor } = window.PregData;
  if (!result || result.kind !== 'preg') return null;
  const m = milestoneFor(result.ig.weeks);

  return (
    <div className="card baby-hero">
      <div className="corner"></div>
      <div className="card-head" style={{marginBottom: 0, position: 'relative', zIndex: 1}}>
        <div>
          <p className="card-sub">Esta semana</p>
          <h2 className="card-title">Pequenas conquistas</h2>
        </div>
      </div>
      <div className="baby-stage">
        <div className="baby-placeholder">
          ilustração<br/>do bebê<br/>semana {m.week}
        </div>
      </div>
      <div className="baby-meta">
        <div className="baby-week">
          <em>{m.fruit}</em>
          <span className="small">comparação de tamanho</span>
        </div>
        <div className="baby-week" style={{textAlign: 'right'}}>
          {m.length}
          <span className="small">comprimento aprox.</span>
        </div>
      </div>
    </div>
  );
}

function ExamsCard({ result }) {
  const { nextExams } = window.PregData;
  if (!result || result.kind !== 'preg') return null;
  const exams = nextExams(result.ig.weeks, 4);
  if (exams.length === 0) {
    return (
      <div className="card">
        <div className="card-head">
          <div>
            <p className="card-sub">Exames</p>
            <h2 className="card-title">Tudo em dia</h2>
          </div>
        </div>
        <p style={{color: 'var(--ink-2)', margin: 0}}>Você já passou pelos principais marcos de exames. Continue acompanhando com seu obstetra.</p>
      </div>
    );
  }
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
              <div className="exam-icon"><Icon /></div>
              <div className="exam-info">
                <div className="exam-name">{e.name}</div>
                <div className="exam-when">Indicado a partir da semana {e.week} · {wksAway === 0 ? 'esta semana' : `em ~${wksAway} semana${wksAway !== 1 ? 's' : ''}`}</div>
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
            <h2 className="card-title">Adicione pelo menos <em style={{color: 'var(--lav-ink)', fontStyle: 'italic'}}>2 menstruações</em></h2>
          </div>
        </div>
        <p style={{color: 'var(--ink-2)', fontSize: 14, lineHeight: 1.6, margin: '8px 0 16px'}}>
          O cálculo do período fértil precisa do intervalo entre pelo menos duas menstruações para estimar a duração média do seu ciclo. Quanto mais datas, melhor a precisão. ✨
        </p>
        <PhaseCards cycleDays={28} highlight={null} />
      </div>
    );
  }

  const { ovulation, start, end, cycleDays, lastPeriod, nextPeriod } = result;

  return (
    <div className="card feature">
      <div className="card-head">
        <div>
          <p className="card-sub">Período fértil · ciclo médio {cycleDays} dias</p>
          <h2 className="card-title">Sua janela de <em style={{color: 'var(--lav-ink)', fontStyle: 'italic'}}>maior fertilidade</em></h2>
        </div>
      </div>

      <div className="day-one-banner">
        <div className="day-one-badge">1</div>
        <div>
          <strong style={{display:'block', marginBottom: 2}}>O dia 1 do ciclo é o primeiro dia da menstruação.</strong>
          <span style={{color: 'var(--ink-2)'}}>Toda contagem começa daí — não do fim da menstruação.</span>
        </div>
      </div>

      <div className="fertil-result">
        <div className="fertil-card peak">
          <div className="lbl">Próxima ovulação</div>
          <div className="val">{fmtDate(ovulation)}</div>
          <div className="sub">Dia {cycleDays - 14} do próximo ciclo · pico de fertilidade</div>
        </div>
        <div className="fertil-card">
          <div className="lbl">Janela fértil</div>
          <div className="val">{fmtDate(start)} → {fmtDate(end)}</div>
          <div className="sub">~6 dias com maior chance</div>
        </div>
      </div>

      <div style={{marginTop: 22}}>
        <p className="card-sub" style={{marginBottom: 12}}>As 4 fases do seu ciclo</p>
        <PhaseCards cycleDays={cycleDays} highlight={null} />
      </div>

      <div className="dev-notes" style={{marginTop: 16}}>
        <p><em>Como funciona.</em> A ovulação acontece cerca de 14 dias antes da próxima menstruação. Espermatozoides podem viver até 5 dias no organismo, por isso a janela fértil começa antes da ovulação.</p>
        <p><em>Dica carinhosa.</em> Acompanhe sinais como muco cervical (transparente e elástico) e temperatura basal para identificar a ovulação com mais precisão. Continue registrando suas menstruações para refinar a previsão.</p>
      </div>
    </div>
  );
}

function PhaseCards({ cycleDays, highlight }) {
  const ovDay = cycleDays - 14;
  const phases = [
    {
      id: 'menses', name: 'Menstruação', day: `Dia 1 – 5`,
      desc: 'O ciclo começa aqui. O endométrio descama e o corpo se prepara para um novo ciclo. Energia mais baixa — descanse.',
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <path d="M24 8 C 16 18, 14 26, 24 36 C 34 26, 32 18, 24 8 Z" fill="#b88a96" opacity="0.85"/>
          <path d="M24 14 C 19 22, 19 28, 24 32" stroke="white" strokeWidth="1.2" fill="none" opacity="0.7"/>
        </svg>
      )
    },
    {
      id: 'follicular', name: 'Folicular', day: `Dia 6 – ${ovDay - 1}`,
      desc: 'Folículos amadurecem nos ovários. Energia e disposição aumentam gradualmente. Pele e cabelo respondem bem.',
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="14" stroke="#a08660" strokeWidth="1.3" fill="none" opacity="0.6"/>
          <circle cx="24" cy="24" r="3" fill="#c9a878"/>
          <circle cx="16" cy="20" r="2" fill="#c9a878" opacity="0.7"/>
          <circle cx="32" cy="22" r="2.4" fill="#c9a878" opacity="0.85"/>
          <circle cx="20" cy="32" r="1.6" fill="#c9a878" opacity="0.5"/>
          <circle cx="30" cy="32" r="2" fill="#c9a878" opacity="0.7"/>
        </svg>
      )
    },
    {
      id: 'ovulation', name: 'Ovulação', day: `Dia ${ovDay} (≈)`,
      desc: 'O óvulo é liberado. Pico de fertilidade — janela de ~24h, mas a fertilidade já começa 5 dias antes.',
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="18" fill="white" opacity="0.4"/>
          <circle cx="24" cy="24" r="12" fill="white" opacity="0.55"/>
          <circle cx="24" cy="24" r="6" fill="white"/>
          <circle cx="24" cy="24" r="2.5" fill="#4a3573"/>
        </svg>
      )
    },
    {
      id: 'luteal', name: 'Lútea', day: `Dia ${ovDay + 1} – ${cycleDays}`,
      desc: 'O corpo se prepara para uma possível gravidez. Se não houver, a menstruação chega e o ciclo recomeça.',
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <path d="M 24 10 C 14 14, 12 26, 16 34 C 22 38, 30 38, 36 34 C 38 26, 34 14, 24 10 Z" fill="#b89dff" opacity="0.55"/>
          <circle cx="24" cy="26" r="5" fill="#4a3573" opacity="0.5"/>
        </svg>
      )
    }
  ];

  return (
    <div className="phases">
      {phases.map(p => (
        <div key={p.id} className={`phase-card ${p.id}`}>
          <div className="phase-vis">{p.icon}</div>
          <div className="phase-day">{p.day}</div>
          <div className="phase-name">{p.name}</div>
          <div className="phase-desc">{p.desc}</div>
        </div>
      ))}
    </div>
  );
}
window.PhaseCards = PhaseCards;

window.ResultCard = ResultCard;
window.Timeline = Timeline;
window.BabyCard = BabyCard;
window.ExamsCard = ExamsCard;
