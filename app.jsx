// App shell + Tweaks

const { TweaksPanel, TweakSection, TweakToggle, useTweaks } = window;

function App() {
  const [result, setResult] = React.useState(null);
  const [tweaks, setTweak] = useTweaks(/*EDITMODE-BEGIN*/{
    "dark": false
  }/*EDITMODE-END*/);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', tweaks.dark ? 'dark' : 'light');
  }, [tweaks.dark]);

  const greeting = result?.kind === 'fertil'
    ? { eyebrow: 'Sua jornada começa aqui', title: <>Vamos descobrir <em>seu período fértil</em></>, body: 'Calcule sua janela fértil com base na média do seu ciclo menstrual. Carinho e ciência juntos no caminho da maternidade.' }
    : result?.kind === 'preg'
    ? { eyebrow: 'Olá, futura mamãe', title: <>Cada semana, um <em>pequeno milagre</em></>, body: 'Aqui você acompanha sua idade gestacional, marcos do desenvolvimento do bebê e os próximos exames recomendados. Tudo em um só lugar.' }
    : { eyebrow: 'Olá, futura mamãe', title: <>Cada semana, um <em>pequeno milagre</em></>, body: 'Comece preenchendo a calculadora ao lado.' };

  return (
    <React.Fragment>
    <div className="ambient" aria-hidden="true">
      <div className="blob b1"></div>
      <div className="blob b2"></div>
      <div className="blob b3"></div>
      <svg className="arc" viewBox="0 0 540 720" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M 80 80 Q 80 240 200 360 Q 360 480 360 640" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" style={{color: 'var(--lav-ink)'}}/>
        <path d="M 120 60 Q 140 260 280 380 Q 440 500 420 700" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" fill="none" style={{color: 'var(--rose-deep)'}}/>
        <circle cx="280" cy="380" r="180" stroke="currentColor" strokeWidth="0.8" fill="none" style={{color: 'var(--lav-ink)'}}/>
        <circle cx="280" cy="380" r="120" stroke="currentColor" strokeWidth="0.6" fill="none" style={{color: 'var(--lav-ink)'}}/>
      </svg>

      {/* Themed transparent imagery — botanical / organic motifs */}
      <svg className="ambient-img flora-tl" viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g stroke="#4a3573" strokeWidth="1" fill="none" strokeLinecap="round">
          <path d="M100 230 Q 100 160 100 90"/>
          <path d="M100 200 Q 70 180 60 150" />
          <path d="M100 180 Q 130 160 145 130" />
          <path d="M100 150 Q 75 130 70 100" />
          <path d="M100 130 Q 125 110 130 80" />
          <ellipse cx="56" cy="148" rx="14" ry="6" transform="rotate(-30 56 148)" fill="#4a3573" fillOpacity="0.18"/>
          <ellipse cx="148" cy="128" rx="14" ry="6" transform="rotate(30 148 128)" fill="#4a3573" fillOpacity="0.18"/>
          <ellipse cx="68" cy="98" rx="12" ry="5" transform="rotate(-30 68 98)" fill="#4a3573" fillOpacity="0.18"/>
          <ellipse cx="132" cy="78" rx="12" ry="5" transform="rotate(30 132 78)" fill="#4a3573" fillOpacity="0.18"/>
          <circle cx="100" cy="60" r="22" fill="#4a3573" fillOpacity="0.15"/>
          <circle cx="100" cy="60" r="14" fill="#4a3573" fillOpacity="0.2"/>
        </g>
      </svg>

      <svg className="ambient-img flora-br" viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g stroke="#b88a96" strokeWidth="1" fill="none" strokeLinecap="round">
          <path d="M30 180 Q 80 140 130 100 Q 180 70 220 40"/>
          <path d="M60 180 Q 90 130 110 100"/>
          <ellipse cx="80" cy="150" rx="16" ry="7" transform="rotate(-25 80 150)" fill="#b88a96" fillOpacity="0.22"/>
          <ellipse cx="130" cy="100" rx="18" ry="8" transform="rotate(-30 130 100)" fill="#b88a96" fillOpacity="0.22"/>
          <ellipse cx="180" cy="70" rx="14" ry="6" transform="rotate(-30 180 70)" fill="#b88a96" fillOpacity="0.22"/>
          <circle cx="220" cy="40" r="10" fill="#b88a96" fillOpacity="0.25"/>
          <circle cx="220" cy="40" r="5" fill="#b88a96" fillOpacity="0.4"/>
        </g>
      </svg>

      <svg className="ambient-img dots" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g fill="#4a3573">
          <circle cx="20" cy="20" r="2"/><circle cx="60" cy="20" r="2"/><circle cx="100" cy="20" r="2"/><circle cx="140" cy="20" r="2"/><circle cx="180" cy="20" r="2"/>
          <circle cx="20" cy="60" r="2"/><circle cx="60" cy="60" r="2"/><circle cx="100" cy="60" r="2"/><circle cx="140" cy="60" r="2"/><circle cx="180" cy="60" r="2"/>
          <circle cx="20" cy="100" r="2"/><circle cx="60" cy="100" r="2"/><circle cx="100" cy="100" r="2"/><circle cx="140" cy="100" r="2"/><circle cx="180" cy="100" r="2"/>
          <circle cx="20" cy="140" r="2"/><circle cx="60" cy="140" r="2"/><circle cx="100" cy="140" r="2"/><circle cx="140" cy="140" r="2"/><circle cx="180" cy="140" r="2"/>
        </g>
      </svg>

      <svg className="ambient-img curves" viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g stroke="#4a3573" strokeWidth="1" fill="none" strokeLinecap="round">
          <path d="M20 100 Q 80 40 140 100 Q 200 160 220 100"/>
          <path d="M20 130 Q 80 70 140 130 Q 200 190 220 130" opacity="0.6"/>
          <path d="M20 70 Q 80 10 140 70 Q 200 130 220 70" opacity="0.6"/>
        </g>
      </svg>
    </div>
    <div className="noise" aria-hidden="true"></div>
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark"></div>
          <div>
            <div className="brand-name">calc<em>·mk</em></div>
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
          <button className="icon-btn" title="Modo" onClick={() => setTweak('dark', !tweaks.dark)}>
            {tweaks.dark ? <I.sun /> : <I.moon />}
          </button>
          <button className="icon-btn" title="Notificações"><I.bell /></button>
          <div className="avatar">M</div>
        </div>
      </header>

      <section className="hero">
        <div>
          <p className="card-sub" style={{marginBottom: 8, color: 'var(--lav-ink)'}}>{greeting.eyebrow}</p>
          <h1 className="serif">{greeting.title}</h1>
          <p>{greeting.body}</p>
        </div>
        <div className="hero-meta">
          <span>hoje</span>
          <strong>quarta-feira, 06 de maio</strong>
          <span>São Paulo · BR</span>
        </div>
      </section>

      <main className="main-grid">
        <div style={{display: 'flex', flexDirection: 'column', gap: 22}}>
          <Calculator result={result} setResult={setResult} />
          {result?.kind === 'preg' && <Timeline result={result} />}
          {result?.kind === 'preg' && <ExamsCard result={result} />}
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 22}}>
          <ResultCard result={result} />
          {result?.kind === 'preg' && <BabyCard result={result} />}
        </div>
      </main>

      <footer className="footer-note">
        calc·mk · resultados informativos · sempre confirme com seu obstetra
      </footer>

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
