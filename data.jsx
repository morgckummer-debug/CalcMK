// Pregnancy data + calculation logic

const TODAY = new Date(2026, 4, 6); // May 6, 2026 (month 0-indexed)

// Calc IG from LMP (last menstrual period)
function igFromLMP(lmpStr) {
  const lmp = new Date(lmpStr);
  const days = Math.floor((TODAY - lmp) / 86400000);
  if (days < 0 || days > 320) return null;
  return { weeks: Math.floor(days / 7), days: days % 7, totalDays: days, lmp };
}
function dppFromLMP(lmpStr) {
  const lmp = new Date(lmpStr);
  const dpp = new Date(lmp); dpp.setDate(dpp.getDate() + 280);
  return dpp;
}
// USG: given date of exam + IG (weeks/days) at exam, derive an effective LMP
function igFromUSG(examDateStr, examWeeks, examDays) {
  const exam = new Date(examDateStr);
  const ageAtExam = examWeeks * 7 + examDays;
  const lmpEff = new Date(exam); lmpEff.setDate(lmpEff.getDate() - ageAtExam);
  return igFromLMP(lmpEff.toISOString().slice(0,10));
}
function dppFromUSG(examDateStr, examWeeks, examDays) {
  const exam = new Date(examDateStr);
  const ageAtExam = examWeeks * 7 + examDays;
  const lmpEff = new Date(exam); lmpEff.setDate(lmpEff.getDate() - ageAtExam);
  return dppFromLMP(lmpEff.toISOString().slice(0,10));
}
// From DPP, derive LMP (DPP - 280)
function igFromDPP(dppStr) {
  const dpp = new Date(dppStr);
  const lmp = new Date(dpp); lmp.setDate(lmp.getDate() - 280);
  return igFromLMP(lmp.toISOString().slice(0,10));
}

function fmtDate(d) {
  const months = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
  return `${String(d.getDate()).padStart(2,'0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
}
function trimester(weeks) {
  if (weeks < 14) return 1;
  if (weeks < 28) return 2;
  return 3;
}

// Fetal milestones by week (size analogy + weight + length cm)
// Weight values: Hadlock growth curve, ~p40 (estimated fetal weight, EFW)
const MILESTONES = {
  4:  { fruit: 'semente de papoula', length: '0.4 cm', weight: '< 1 g', dev: 'Implantação no útero. Coração começa a se formar.' },
  6:  { fruit: 'lentilha', length: '0.6 cm', weight: '< 1 g', dev: 'Tubo neural se fecha. Batimentos detectáveis em USG.' },
  8:  { fruit: 'framboesa', length: '1.6 cm', weight: '1 g', dev: 'Bracinhos e perninhas surgem. Olhinhos se formam.' },
  10: { fruit: 'morango', length: '3.1 cm', weight: '5 g', dev: 'Já é chamado de feto. Órgãos vitais funcionando.' },
  12: { fruit: 'limão', length: '5.4 cm', weight: '50 g', dev: 'Fim do 1º trimestre. Reflexos começam a aparecer.' },
  14: { fruit: 'pêssego', length: '8.7 cm', weight: '92 g', dev: 'Pelinhos finos (lanugo) cobrem o corpo.' },
  16: { fruit: 'abacate', length: '11.6 cm', weight: '155 g', dev: 'Já consegue ouvir sons abafados.' },
  18: { fruit: 'pimentão', length: '14.2 cm', weight: '244 g', dev: 'Você pode começar a sentir os primeiros movimentos.' },
  20: { fruit: 'banana', length: '16.4 cm', weight: '362 g', dev: 'Metade do caminho! Já dá para ouvir batimentos com nitidez.' },
  22: { fruit: 'espiga de milho', length: '27.8 cm', weight: '514 g', dev: 'Sobrancelhas e cílios visíveis. USG morfológico nesta fase.' },
  24: { fruit: 'milho doce', length: '30 cm', weight: '702 g', dev: 'Pulmões em formação rápida. Responde à voz.' },
  26: { fruit: 'alface americana', length: '35.6 cm', weight: '927 g', dev: 'Abre os olhinhos. Padrão de sono se forma.' },
  28: { fruit: 'berinjela', length: '37.6 cm', weight: '1.190 g', dev: 'Início do 3º trimestre. Sonha em REM.' },
  30: { fruit: 'repolho', length: '39.9 cm', weight: '1.488 g', dev: 'Cérebro cresce rapidamente. Ganha peso.' },
  32: { fruit: 'jicama', length: '42.4 cm', weight: '1.815 g', dev: 'Unhas dos pés totalmente formadas.' },
  34: { fruit: 'melão cantalupe', length: '45 cm', weight: '2.165 g', dev: 'Sistema nervoso central amadurecendo.' },
  36: { fruit: 'mamão papaia', length: '47.4 cm', weight: '2.526 g', dev: 'Considerado quase a termo. Pode encaixar.' },
  38: { fruit: 'alho-poró', length: '49.8 cm', weight: '2.886 g', dev: 'Pulmões prontos. Posição de cabeça para baixo.' },
  40: { fruit: 'abóbora pequena', length: '51.2 cm', weight: '3.230 g', dev: 'A termo! Pode chegar a qualquer momento.' },
};
function milestoneFor(weeks) {
  // round down to nearest even week with data
  for (let w = Math.min(40, Math.max(4, weeks - (weeks % 2))); w >= 4; w -= 2) {
    if (MILESTONES[w]) return { week: w, ...MILESTONES[w] };
  }
  return { week: 4, ...MILESTONES[4] };
}

// Suggested exams by week
const EXAMS = [
  { week: 8,  name: 'Primeira consulta + Beta-hCG', cat: 'sangue' },
  { week: 11, name: 'Translucência Nucal (TN)', cat: 'usg' },
  { week: 16, name: 'Triagem do 2º trimestre', cat: 'sangue' },
  { week: 22, name: 'USG Morfológico (2º tri)', cat: 'usg' },
  { week: 24, name: 'Glicemia + Curva Glicêmica', cat: 'sangue' },
  { week: 28, name: 'Hemograma + Coombs Indireto', cat: 'sangue' },
  { week: 32, name: 'USG Obstétrico de crescimento', cat: 'usg' },
  { week: 36, name: 'Cultura Estrepto-B (GBS)', cat: 'sangue' },
  { week: 40, name: 'Avaliação de bem-estar fetal', cat: 'usg' },
];
function nextExams(weeks, n=4) {
  return EXAMS.filter(e => e.week >= weeks).slice(0, n);
}

// Fertility window from a list of period start dates (computes avg cycle automatically)
function fertileFromDates(periodDates) {
  // Filter and sort valid dates ascending
  const dates = periodDates.filter(Boolean).map(d => new Date(d)).sort((a,b) => a - b);
  if (dates.length < 2) return null;
  // Compute gaps between consecutive periods in days
  const gaps = [];
  for (let i = 1; i < dates.length; i++) {
    gaps.push(Math.round((dates[i] - dates[i-1]) / 86400000));
  }
  const validGaps = gaps.filter(g => g >= 18 && g <= 50);
  if (validGaps.length === 0) return null;
  const avg = validGaps.reduce((a,b) => a + b, 0) / validGaps.length;
  const cycleDays = Math.round(avg);
  const lastPeriod = dates[dates.length - 1];
  // Predict next period and ovulation
  const nextPeriod = new Date(lastPeriod); nextPeriod.setDate(nextPeriod.getDate() + cycleDays);
  const ovulation = new Date(nextPeriod); ovulation.setDate(ovulation.getDate() - 14);
  const start = new Date(ovulation); start.setDate(start.getDate() - 5);
  const end = new Date(ovulation); end.setDate(end.getDate() + 1);
  return { ovulation, start, end, cycleDays, lastPeriod, nextPeriod, gaps, avg };
}

// Fertility window from cycle length
function fertileWindow(lastPeriodStr, cycleDays) {
  const lp = new Date(lastPeriodStr);
  const ovulation = new Date(lp); ovulation.setDate(ovulation.getDate() + (cycleDays - 14));
  const start = new Date(ovulation); start.setDate(start.getDate() - 5);
  const end = new Date(ovulation); end.setDate(end.getDate() + 1);
  return { ovulation, start, end };
}

window.PregData = { TODAY, igFromLMP, dppFromLMP, igFromUSG, dppFromUSG, igFromDPP, fmtDate, trimester, milestoneFor, nextExams, fertileWindow, fertileFromDates, MILESTONES, EXAMS };
