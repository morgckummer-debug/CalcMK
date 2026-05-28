// MKCalc app shell

const { TweaksPanel, TweakSection, TweakToggle, useTweaks } = window;

function App() {
  const [result, setResult] = React.useState(null);
  const [tweaks, setTweak] = useTweaks(/*EDITMODE-BEGIN*/{
    "dark": false
  }/*EDITMODE-END*/);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', tweaks.dark ? 'dark' : 'light');
  }, [tweaks.dark]);

  const greeting = result?.kind === 'fertil' || result?.kind === 'fertil-incomplete'
    ? { eyebrow: 'Sua jornada começa aqui', title: <>Vamos descobrir <span className="accent">seu período fértil</span></>, body: 'Calcule sua janela fértil com base nos seus ciclos. Quanto mais menstruações você registrar, mais precisa fica a previsão.' }
    : { eyebrow: 'Olá, futura mamãe', title: <>Cada semana, um <span className="accent">pequeno milagre</span></>, body: 'Acompanhe sua idade gestacional, marcos do desenvolvimento e os próximos exames recomendados — tudo em um só lugar.' };

  return (
    <React.Fragment>
      <div className="ambient" aria-hidden="true">
        <div className="blob3d b1"></div>
        <div className="blob3d b2"></div>
        <div className="blob3d b3"></div>
        <div className="blob3d b4"></div>
        <div className="blob3d b5"></div>
        <div className="blob3d b6"></div>
      </div>
      <svg width="0" height="0" style={{position:'absolute'}} aria-hidden="true">
        <defs>
          <linearGradient id="peachGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f4c8a8"/>
            <stop offset="100%" stopColor="#d99570"/>
          </linearGradient>
        </defs>
      </svg>

      <div className="app">
        <header className="topbar">
          <div className="brand">
            <div className="brand-icon"><img src="mkcalc/icon-mk.png" alt="MK" /></div>
            <div>
              <div className="brand-name">MK<span>Calc</span></div>
              <div className="brand-tag">calculadora gestacional</div>
            </div>
          </div>
          <nav className="nav">
            <a href="#" className="active">Início</a>
            <a href="#">Calculadora</a>
            <a href="#">Diário</a>
            <a href="#">Exames</a>
            <a href="#">Aprender</a>
          </nav>
          <div className="topbar-right">
            <button className="icon-btn" onClick={() => setTweak('dark', !tweaks.dark)}>
              {tweaks.dark ? <I.sun /> : <I.moon />}
            </button>
            <button className="icon-btn"><I.bell /></button>
            <div className="avatar">M</div>
          </div>
        </header>

        <section className="hero">
          <div>
            <span className="eyebrow"><span className="dot"></span>{greeting.eyebrow}</span>
            <h1 className="serif">{greeting.title}</h1>
            <p>{greeting.body}</p>
          </div>
          <div className="hero-meta">
            <strong>06 maio · 2026</strong>
            <span>quarta-feira</span>
          </div>
        </section>

        <main className="main-grid">
          <div style={{display: 'flex', flexDirection: 'column', gap: 24}}>
            <Calculator result={result} setResult={setResult} />
            {result?.kind === 'preg' && <Timeline result={result} />}
            {result?.kind === 'preg' && <ExamsCard result={result} />}
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 24}}>
            <ResultCard result={result} />
            {result?.kind === 'preg' && <BabyCard result={result} />}
            {result?.kind === 'preg' && <MilestonesCard result={result} />}
          </div>
        </main>

        <footer className="footer-note">mkcalc · resultados informativos · sempre confirme com seu obstetra</footer>

        <TweaksPanel title="Tweaks" defaultOpen={false}>
          <TweakSection title="Aparência">
            <TweakToggle label="Modo escuro" value={tweaks.dark} onChange={v => setTweak('dark', v)} />
          </TweakSection>
        </TweaksPanel>
      </div>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
