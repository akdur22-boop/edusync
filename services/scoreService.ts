
// --- CONSTANTS FOR 2025 ESTIMATIONS ---

export interface ScoreInput {
  correct: number;
  incorrect: number;
}

export interface ExamResult {
  score: number;
  ranking: number;
  percentile: number;
  totalNet: number;
}

// Coefficients based on mock 2025 data (Simplified for estimation)
const COEFF_TYT = {
  turkce: 3.3,
  sosyal: 3.4,
  matematik: 3.3,
  fen: 3.4,
  base: 100
};

const COEFF_AYT = {
  matematik: 3.0,
  fizik: 2.85,
  kimya: 3.07,
  biyoloji: 3.07,
  edebiyat: 3.0,
  tarih1: 2.8,
  cografya1: 3.33,
  tarih2: 2.91,
  cografya2: 2.91,
  felsefe: 3.0,
  din: 3.33,
  base: 100
};

const COEFF_LGS = {
  turkce: 4.3, // x4 weight factor roughly
  matematik: 4.3,
  fen: 4.3,
  inkilap: 1.6,
  din: 1.6,
  ingilizce: 1.6,
  base: 195 // Approximate base to align with 500 max
};

// --- CALCULATORS ---

export const calculateNet = (correct: number, incorrect: number): number => {
  return Math.max(0, correct - (incorrect * 0.25));
};

export const calculateLGS = (inputs: Record<string, ScoreInput>): ExamResult => {
  let weightedScore = 0;
  let totalNet = 0;

  Object.entries(inputs).forEach(([lesson, val]) => {
    const net = calculateNet(val.correct, val.incorrect);
    totalNet += net;
    
    // @ts-ignore
    const coeff = COEFF_LGS[lesson] || 0;
    weightedScore += net * coeff;
  });

  const score = Math.min(500, Math.max(100, weightedScore + COEFF_LGS.base));
  
  // Mock Ranking Logic for LGS 2025 (Approx 1M students)
  // Higher score -> Lower ranking (better)
  // 500 -> 1
  // 400 -> ~100,000 (10%)
  const maxStudents = 1000000;
  const normalizedScore = (500 - score) / 400; // 0 (best) to 1 (worst)
  
  // Non-linear distribution simulation
  const ranking = Math.max(1, Math.round(Math.pow(normalizedScore, 3) * maxStudents));
  const percentile = Number(((ranking / maxStudents) * 100).toFixed(2));

  return { score: Number(score.toFixed(3)), ranking, percentile, totalNet };
};

export const calculateYKS = (inputs: Record<string, ScoreInput>, type: 'SAY' | 'EA' | 'SOZ'): ExamResult => {
  let tytScoreRaw = 0;
  let tytNet = 0;

  // TYT Calculation
  ['tyt_turkce', 'tyt_sosyal', 'tyt_mat', 'tyt_fen'].forEach(key => {
    const val = inputs[key] || { correct: 0, incorrect: 0 };
    const net = calculateNet(val.correct, val.incorrect);
    tytNet += net;
    // @ts-ignore
    const lessonKey = key.replace('tyt_', ''); 
    // @ts-ignore
    tytScoreRaw += net * COEFF_TYT[lessonKey];
  });
  
  const tytScore = tytScoreRaw + COEFF_TYT.base;

  // AYT Calculation
  let aytScoreRaw = 0;
  let aytNet = 0;
  
  const aytLessons = type === 'SAY' 
    ? ['ayt_mat', 'ayt_fiz', 'ayt_kim', 'ayt_biyo']
    : type === 'EA'
      ? ['ayt_mat', 'ayt_edeb', 'ayt_tar1', 'ayt_cog1']
      : ['ayt_edeb', 'ayt_tar1', 'ayt_cog1', 'ayt_tar2', 'ayt_cog2', 'ayt_fel', 'ayt_din'];

  aytLessons.forEach(key => {
    const val = inputs[key] || { correct: 0, incorrect: 0 };
    const net = calculateNet(val.correct, val.incorrect);
    aytNet += net;
    const lessonKey = key.replace('ayt_', '').replace('edeb', 'edebiyat').replace('fiz', 'fizik').replace('kim', 'kimya').replace('biyo', 'biyoloji').replace('tar', 'tarih').replace('cog', 'cografya').replace('fel', 'felsefe');
    // @ts-ignore
    const coeff = COEFF_AYT[lessonKey] || 3.0;
    aytScoreRaw += net * coeff;
  });

  // Final YKS Score (Approx: 40% TYT + 60% AYT)
  // This is a simplified formula. Real formula involves standard deviations.
  const rawTotal = (tytScore * 0.4) + ((aytScoreRaw + 100) * 0.6); // +100 base for AYT part
  const score = Math.min(500, Math.max(100, rawTotal + 30)); // +30 diploma notu approx adjustment for raw

  // Mock Ranking Logic for YKS 2025 (Approx 3M students)
  const maxStudents = 3000000;
  const normalizedScore = (550 - score) / 450;
  const ranking = Math.max(1, Math.round(Math.pow(normalizedScore, 4.5) * maxStudents));
  const percentile = Number(((ranking / maxStudents) * 100).toFixed(2));

  return { 
    score: Number(score.toFixed(3)), 
    ranking, 
    percentile, 
    totalNet: Number((tytNet + aytNet).toFixed(2)) 
  };
};
