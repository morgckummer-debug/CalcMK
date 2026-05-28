// Custom date picker matching the clay design
const MONTHS_PT = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
const MONTHS_PT_SHORT = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
const DOW_PT = ['D','S','T','Q','Q','S','S'];

function DatePicker({ value, onChange, placeholder = 'Selecionar data', max }) {
  const [open, setOpen] = React.useState(false);
  const [showMonths, setShowMonths] = React.useState(false);
  const TODAY = window.PregData.TODAY;
  const initial = value ? new Date(value + 'T00:00:00') : TODAY;
  const [viewYear, setViewYear] = React.useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = React.useState(initial.getMonth());
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  React.useEffect(() => {
    if (value) {
      const d = new Date(value + 'T00:00:00');
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
    }
  }, [value]);

  const selectedDate = value ? new Date(value + 'T00:00:00') : null;
  const maxDate = max ? new Date(max + 'T00:00:00') : null;

  const firstDay = new Date(viewYear, viewMonth, 1);
  const startDow = firstDay.getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrev = new Date(viewYear, viewMonth, 0).getDate();

  const cells = [];
  for (let i = startDow - 1; i >= 0; i--) {
    cells.push({ day: daysInPrev - i, muted: true, month: viewMonth - 1, year: viewYear });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, muted: false, month: viewMonth, year: viewYear });
  }
  while (cells.length < 42) {
    const d = cells.length - daysInMonth - startDow + 1;
    cells.push({ day: d, muted: true, month: viewMonth + 1, year: viewYear });
  }

  const isSelected = (c) => selectedDate &&
    selectedDate.getFullYear() === (c.month < 0 ? c.year - 1 : c.month > 11 ? c.year + 1 : c.year) &&
    selectedDate.getMonth() === ((c.month + 12) % 12) &&
    selectedDate.getDate() === c.day;
  const isToday = (c) => TODAY.getFullYear() === (c.month < 0 ? c.year - 1 : c.month > 11 ? c.year + 1 : c.year) &&
    TODAY.getMonth() === ((c.month + 12) % 12) &&
    TODAY.getDate() === c.day;

  const pickDay = (c) => {
    let y = c.year, m = c.month;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    const date = new Date(y, m, c.day);
    if (maxDate && date > maxDate) return;
    const iso = `${y}-${String(m+1).padStart(2,'0')}-${String(c.day).padStart(2,'0')}`;
    onChange(iso);
    setOpen(false);
  };

  const navMonth = (delta) => {
    let m = viewMonth + delta;
    let y = viewYear;
    while (m < 0) { m += 12; y -= 1; }
    while (m > 11) { m -= 12; y += 1; }
    setViewMonth(m); setViewYear(y);
  };

  const display = selectedDate
    ? `${String(selectedDate.getDate()).padStart(2,'0')} ${MONTHS_PT_SHORT[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`
    : null;

  return (
    <div className="date-picker" ref={ref}>
      <button type="button" className={`date-trigger ${open ? 'open' : ''}`} onClick={() => setOpen(!open)}>
        <span className={display ? '' : 'placeholder'}>{display || placeholder}</span>
        <svg className="chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      {open && (
        <div className="date-popover">
          {showMonths ? (
            <>
              <div className="dp-year-row">
                <button className="dp-nav-btn" onClick={() => setViewYear(viewYear - 1)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg></button>
                <div className="dp-year">{viewYear}</div>
                <button className="dp-nav-btn" onClick={() => setViewYear(viewYear + 1)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg></button>
              </div>
              <div className="dp-month-list">
                {MONTHS_PT_SHORT.map((m, i) => (
                  <button key={i} className={`dp-month-opt ${i === viewMonth ? 'active' : ''}`} onClick={() => { setViewMonth(i); setShowMonths(false); }}>{m}</button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="dp-head">
                <button className="dp-month-btn" onClick={() => setShowMonths(true)}>
                  {MONTHS_PT[viewMonth]} de {viewYear}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                <div className="dp-nav">
                  <button className="dp-nav-btn" onClick={() => navMonth(-1)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg></button>
                  <button className="dp-nav-btn" onClick={() => navMonth(1)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg></button>
                </div>
              </div>
              <div className="dp-grid">
                {DOW_PT.map((d, i) => <div key={i} className="dp-dow">{d}</div>)}
                {cells.map((c, i) => {
                  const selected = isSelected(c);
                  const today = isToday(c);
                  return (
                    <button key={i} className={`dp-day ${c.muted ? 'muted' : ''} ${today ? 'today' : ''} ${selected ? 'selected' : ''}`} onClick={() => pickDay(c)}>
                      {c.day}
                    </button>
                  );
                })}
              </div>
              <div className="dp-foot">
                <button onClick={() => { onChange(''); setOpen(false); }}>Limpar</button>
                <button onClick={() => {
                  const t = TODAY;
                  const iso = `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,'0')}-${String(t.getDate()).padStart(2,'0')}`;
                  onChange(iso); setOpen(false);
                }}>Hoje</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

window.DatePicker = DatePicker;
