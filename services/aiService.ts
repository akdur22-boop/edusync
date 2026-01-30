import { Result, AIAnalysis, TopicProgress, ReportCard, LessonReport, TopicPerformance } from '../types';

export const analyzePerformance = (results: Result[]): AIAnalysis => {
  if (results.length === 0) {
    return {
      weakTopics: [],
      recommendation: "Henüz veri girişi yapılmamış. Analiz için en az 3 test sonucu giriniz.",
      score: 0
    };
  }

  // Calculate generic score
  let totalQuestions = 0;
  let totalCorrect = 0;
  
  const topicStats: Record<string, { correct: number, total: number }> = {};

  results.forEach(r => {
    const total = r.correct + r.incorrect + r.empty;
    totalQuestions += total;
    totalCorrect += r.correct;

    if (!topicStats[r.topic]) {
      topicStats[r.topic] = { correct: 0, total: 0 };
    }
    topicStats[r.topic].correct += r.correct;
    topicStats[r.topic].total += total;
  });

  const overallScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  // Identify weak topics (Accuracy < 55%)
  const weakTopics = Object.entries(topicStats)
    .filter(([_, stats]) => (stats.correct / stats.total) < 0.55)
    .map(([topic]) => topic);

  let recommendation = "";
  if (weakTopics.length > 0) {
    recommendation = `Dikkat! ${weakTopics.join(', ')} konularında eksikleriniz var. Bu hafta bu konulardan konu anlatımı çalışıp, her biri için en az 2 test çözmelisiniz.`;
  } else if (overallScore > 80) {
    recommendation = "Harika gidiyorsunuz! Başarı oranınız çok yüksek. Artık süre tutarak deneme çözmeye başlayabilirsiniz.";
  } else {
    recommendation = "İstikrarlı bir ilerleyiş var. Yanlış yaptığınız soruların video çözümlerini izleyerek eksiklerinizi kapatabilirsiniz.";
  }

  return {
    weakTopics,
    recommendation,
    score: overallScore
  };
};

export const getStudentProgress = (results: Result[], days: number): TopicProgress[] => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const filteredResults = results.filter(r => new Date(r.date) >= cutoffDate);
  const topicMap: Record<string, { lesson: string, correct: number, total: number, count: number }> = {};

  filteredResults.forEach(r => {
    const total = r.correct + r.incorrect + r.empty;
    if (!topicMap[r.topic]) {
      topicMap[r.topic] = { lesson: r.lesson, correct: 0, total: 0, count: 0 };
    }
    topicMap[r.topic].correct += r.correct;
    topicMap[r.topic].total += total;
    topicMap[r.topic].count += 1;
  });

  return Object.entries(topicMap).map(([topic, stats]) => {
    const accuracy = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
    
    // Simple trend logic
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (accuracy > 70) trend = 'up';
    if (accuracy < 50) trend = 'down';

    return {
      lesson: stats.lesson,
      topic: topic,
      totalQuestions: stats.total,
      accuracy: Math.round(accuracy),
      solvedCount: stats.count,
      trend
    };
  }).sort((a, b) => a.accuracy - b.accuracy); 
};

export const generateMonthlyReport = (results: Result[], targetDate: string = new Date().toISOString().slice(0, 7)): ReportCard | null => {
  // targetDate format: "YYYY-MM"
  const [yearStr, monthStr] = targetDate.split('-');
  const targetYear = parseInt(yearStr);
  const targetMonth = parseInt(monthStr);

  // Filter results for the specific month
  const monthlyResults = results.filter(r => {
    const d = new Date(r.date);
    return d.getFullYear() === targetYear && (d.getMonth() + 1) === targetMonth;
  });

  if (monthlyResults.length === 0) return null;

  let totalQ = 0;
  let totalC = 0;
  let totalNet = 0;

  const lessons: Record<string, LessonReport> = {};
  const topicStats: Record<string, { lesson: string, correct: number, total: number }> = {};

  // Active days calculation
  const uniqueDays = new Set(monthlyResults.map(r => r.date));
  const activeDays = uniqueDays.size;

  monthlyResults.forEach(r => {
    const total = r.correct + r.incorrect + r.empty;
    const net = r.correct - (r.incorrect * 0.25);
    
    totalQ += total;
    totalC += r.correct;
    totalNet += net;

    // Lesson Stats
    if (!lessons[r.lesson]) {
      lessons[r.lesson] = {
        lesson: r.lesson,
        totalQuestions: 0,
        totalCorrect: 0,
        totalIncorrect: 0,
        totalEmpty: 0,
        accuracy: 0,
        net: 0
      };
    }
    lessons[r.lesson].totalQuestions += total;
    lessons[r.lesson].totalCorrect += r.correct;
    lessons[r.lesson].totalIncorrect += r.incorrect;
    lessons[r.lesson].totalEmpty += r.empty;
    lessons[r.lesson].net += net;

    // Topic Stats
    if (!topicStats[r.topic]) {
        topicStats[r.topic] = { lesson: r.lesson, correct: 0, total: 0 };
    }
    topicStats[r.topic].correct += r.correct;
    topicStats[r.topic].total += total;
  });

  // Calculate Lesson Breakdown
  const lessonBreakdown: LessonReport[] = Object.values(lessons).map(l => ({
    ...l,
    accuracy: l.totalQuestions > 0 ? Math.round((l.totalCorrect / l.totalQuestions) * 100) : 0,
    net: Number(l.net.toFixed(2))
  })).sort((a, b) => b.accuracy - a.accuracy);

  // Calculate Topic Breakdown
  const allTopics: TopicPerformance[] = Object.entries(topicStats).map(([topic, stats]) => {
      const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
      let status: 'strong' | 'weak' | 'average' = 'average';
      if (accuracy >= 80) status = 'strong';
      else if (accuracy <= 55) status = 'weak';
      return { topic, lesson: stats.lesson, accuracy, status };
  });

  const sortedTopics = [...allTopics].sort((a,b) => b.accuracy - a.accuracy);
  const strongestTopics = sortedTopics.filter(t => t.accuracy >= 70).slice(0, 3);
  const weakestTopics = sortedTopics.filter(t => t.accuracy <= 60).sort((a,b) => a.accuracy - b.accuracy).slice(0, 3);

  const averageAccuracy = totalQ > 0 ? Math.round((totalC / totalQ) * 100) : 0;

  // Score Calculation logic
  const efficiency = totalNet / Math.max(1, totalQ);
  const consistency = Math.min(activeDays, 20) / 20; // 20 days study/month is good
  const rawScore = (Math.max(0, efficiency) * 70) + (consistency * 30);
  const totalScore = Math.min(100, Math.max(0, Math.round(rawScore * 100)));

  // Badge Assignment
  let badge: 'gold' | 'silver' | 'bronze' | 'none' = 'none';
  if (totalScore >= 80) badge = 'gold';
  else if (totalScore >= 60) badge = 'silver';
  else if (totalScore >= 40) badge = 'bronze';

  // Recommendations
  const recommendations: string[] = [];
  const weakest = lessonBreakdown[lessonBreakdown.length - 1];
  
  if (totalQ < 100) {
    recommendations.push("Soru çözme hacmi bu ay düşük kaldı. Önümüzdeki ay günlük soru hedefini artırmalıyız.");
  }
  
  if (weakest && weakest.accuracy < 50) {
    recommendations.push(`${weakest.lesson} dersinde başarı oranınız %${weakest.accuracy} seviyesinde. Bu derse özel konu tekrarı planlayalım.`);
  }

  const totalEmpty = monthlyResults.reduce((acc, r) => acc + r.empty, 0);
  if ((totalEmpty / totalQ) > 0.15) {
    recommendations.push("Boş bırakma oranı dikkat çekici. Konu eksikliklerini tespit etmek için tarama testlerine ağırlık verelim.");
  }

  if (recommendations.length === 0) {
    recommendations.push("Genel performansınız istikrarlı ve başarılı. Deneme sınavı sıklığını artırarak hız kazanmaya odaklanabiliriz.");
  }

  const dateObj = new Date(targetYear, targetMonth - 1);

  // Mock comparison data (In a real app, query previous month)
  const previousNet = totalNet * 0.9; // Mock: 10% growth
  const institutionAvgNet = totalNet * 0.85; // Mock: User is above average

  return {
    month: dateObj.toLocaleString('tr-TR', { month: 'long' }),
    year: targetYear,
    totalScore,
    totalQuestions: totalQ,
    averageAccuracy,
    totalNet: Number(totalNet.toFixed(2)),
    previousNet: Number(previousNet.toFixed(2)),
    institutionAvgNet: Number(institutionAvgNet.toFixed(2)),
    lessonBreakdown,
    topicBreakdown: {
        strongest: strongestTopics,
        weakest: weakestTopics
    },
    recommendations,
    badge,
    coachComment: '' // Empty by default, filled in UI
  };
};