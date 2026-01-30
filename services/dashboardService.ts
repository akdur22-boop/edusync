import { api } from './mockApi';
import { DashboardData, ActionItem, Result, Student, WeeklyTrendData, StudentSpotlight, SubjectStatus, SubjectInsight, FinanceStats, Transaction, UpcomingPayment } from '../types';

export const getDashboardData = (): DashboardData => {
  const students = api.getStudents();
  const allResults: Result[] = [];
  
  // Collect all results
  students.forEach(s => {
    const sResults = api.getResults(s.id);
    allResults.push(...sResults);
  });

  // --- 1. Calculate Stats ---
  const now = new Date();
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(now.getDate() - 3);
  
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);

  // Active/Inactive Logic
  let activeCount = 0;
  let inactiveCount = 0;
  let riskyCount = 0;

  const actions: ActionItem[] = [];

  students.forEach(student => {
    const studentResults = api.getResults(student.id);
    const lastResult = studentResults.length > 0 ? studentResults[0] : null; // Assuming sorted by date desc in API
    
    // Check Activity
    let isActive7Days = false;
    let isInactive3Days = true;

    if (lastResult) {
      const lastDate = new Date(lastResult.date);
      if (lastDate >= sevenDaysAgo) isActive7Days = true;
      if (lastDate >= threeDaysAgo) isInactive3Days = false;
    } else {
        // No results ever
        isInactive3Days = true;
    }

    if (isActive7Days) activeCount++;
    if (isInactive3Days) {
        inactiveCount++;
        // Create Action Item
        actions.push({
            id: Math.random().toString(36).substr(2, 9),
            studentId: student.id,
            studentName: student.name,
            type: 'missing_data',
            message: '3+ gündür veri girişi yapmadı.',
            priority: 'high',
            date: new Date().toISOString().split('T')[0],
            messageStatus: 'send_message'
        });
    }

    // Check Risk (Avg Accuracy < 50% in last 5 tests)
    const recentResults = studentResults.slice(0, 5);
    if (recentResults.length > 0) {
        const totalCorrect = recentResults.reduce((acc, r) => acc + r.correct, 0);
        const totalQ = recentResults.reduce((acc, r) => acc + r.correct + r.incorrect + r.empty, 0);
        const accuracy = totalQ > 0 ? (totalCorrect / totalQ) : 0;
        
        if (accuracy < 0.50) {
            riskyCount++;
            actions.push({
                id: Math.random().toString(36).substr(2, 9),
                studentId: student.id,
                studentName: student.name,
                type: 'performance_drop',
                message: 'Son testlerde başarı oranı %50 altında.',
                priority: 'medium',
                date: new Date().toISOString().split('T')[0],
                messageStatus: 'awaiting_reply'
            });
        }
    }

    // Check Payment
    if (student.paymentInfo?.paymentStatus === 'pending') {
         // Check if due date passed or close
         const due = new Date(student.paymentInfo.nextPaymentDate);
         const diffTime = due.getTime() - now.getTime();
         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
         
         if (diffDays <= 3) {
            actions.push({
                id: Math.random().toString(36).substr(2, 9),
                studentId: student.id,
                studentName: student.name,
                type: 'payment_due',
                message: diffDays < 0 ? `Ödeme ${Math.abs(diffDays)} gün gecikti.` : `Ödemeye ${diffDays} gün kaldı.`,
                priority: diffDays < 0 ? 'high' : 'low',
                date: new Date().toISOString().split('T')[0],
                messageStatus: 'replied'
            });
         }
    }
  });

  // Calculate Academic Summary
  const recentWeekResults = allResults.filter(r => new Date(r.date) >= sevenDaysAgo);
  const totalWeeklyQuestions = recentWeekResults.reduce((acc, r) => acc + r.correct + r.incorrect + r.empty, 0);
  
  const totalCorrectAll = recentWeekResults.reduce((acc, r) => acc + r.correct, 0);
  const totalQAll = recentWeekResults.reduce((acc, r) => acc + r.correct + r.incorrect + r.empty, 0);
  const avgAccuracy = totalQAll > 0 ? Math.round((totalCorrectAll / totalQAll) * 100) : 0;

  // Find hardest/neglected lessons
  const lessonCounts: Record<string, number> = {};
  const lessonCorrects: Record<string, number> = {};
  
  recentWeekResults.forEach(r => {
    if (!lessonCounts[r.lesson]) { lessonCounts[r.lesson] = 0; lessonCorrects[r.lesson] = 0; }
    lessonCounts[r.lesson] += (r.correct + r.incorrect + r.empty);
    lessonCorrects[r.lesson] += r.correct;
  });

  let hardestLesson = '-';
  let minAcc = 100;
  let neglectedLesson = '-';
  let minCount = Infinity;

  Object.entries(lessonCounts).forEach(([lesson, count]) => {
      const acc = (lessonCorrects[lesson] / count) * 100;
      if (acc < minAcc) { minAcc = acc; hardestLesson = lesson; }
      if (count < minCount) { minCount = count; neglectedLesson = lesson; }
  });

  // --- Generate Charts ---
  // Weekly Trend (Last 7 days rich data)
  const trendData: WeeklyTrendData[] = [];
  for(let i=6; i>=0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayResults = allResults.filter(r => r.date === dateStr);
      
      const dayNet = dayResults.reduce((acc, r) => acc + (r.correct - r.incorrect * 0.25), 0);
      const dayCorrect = dayResults.reduce((acc, r) => acc + r.correct, 0);
      const dayIncorrect = dayResults.reduce((acc, r) => acc + r.incorrect, 0);
      const dayTotal = dayResults.reduce((acc, r) => acc + r.correct + r.incorrect + r.empty, 0);

      trendData.push({ 
        date: d.toLocaleDateString('tr-TR', {weekday: 'short'}), 
        value: dayNet > 0 ? dayNet : 0,
        totalQuestions: dayTotal,
        correct: dayCorrect,
        incorrect: dayIncorrect
      });
  }

  // --- Subject Statuses ---
  if (Object.keys(lessonCounts).length === 0) {
      lessonCounts['Matematik'] = 10; lessonCorrects['Matematik'] = 8;
      lessonCounts['Fizik'] = 10; lessonCorrects['Fizik'] = 4;
      lessonCounts['Kimya'] = 10; lessonCorrects['Kimya'] = 6;
      lessonCounts['Biyoloji'] = 10; lessonCorrects['Biyoloji'] = 7;
  }

  const subjectStatuses: SubjectStatus[] = Object.keys(lessonCounts).map(lesson => {
      const count = lessonCounts[lesson];
      const correct = lessonCorrects[lesson];
      const score = count > 0 ? Math.round((correct / count) * 100) : 0;
      
      let status: 'strong' | 'stable' | 'risky' = 'stable';
      if (score > 70) status = 'strong';
      else if (score < 50) status = 'risky';

      return { subject: lesson, score, status };
  }).sort((a,b) => a.score - b.score);

  const worstSubject = subjectStatuses[0];
  const insight: SubjectInsight = {
      lesson: worstSubject?.subject || 'Genel',
      reason: `${worstSubject?.subject || 'Dersler'} son 7 günde %${worstSubject?.score || 0} başarı ile riskli seviyede.`,
      actions: [
          `Bu hafta ${worstSubject?.subject || 'bu ders'} için ek etüt planla.`,
          `Konu tarama testi ile eksikleri belirle.`
      ]
  };
  
  subjectStatuses.sort((a,b) => b.score - a.score);

  // --- FINANCE DATA GENERATION ---
  
  // 1. Calculate Revenue from Students
  const monthlyRevenue = 45000; // Mock base
  const totalRevenueYear = 540000; // Mock base
  
  let pendingAmount = 0;
  let overdueAmount = 0;
  
  const upcomingPayments: UpcomingPayment[] = [];
  const next30Days = new Date();
  next30Days.setDate(now.getDate() + 30);

  students.forEach(s => {
      if (s.paymentInfo?.paymentStatus === 'pending') {
          pendingAmount += s.paymentInfo.totalAmount;
          
          const due = new Date(s.paymentInfo.nextPaymentDate);
          
          // Calculate overdue stats
          if (due < now) {
              overdueAmount += s.paymentInfo.totalAmount;
          }

          // Calculate upcoming payments list (Future date within 30 days)
          if (due >= now && due <= next30Days) {
              const diffTime = due.getTime() - now.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              upcomingPayments.push({
                  id: Math.random().toString(36).substr(2, 9),
                  studentId: s.id,
                  studentName: s.name,
                  amount: s.paymentInfo.totalAmount,
                  dueDate: s.paymentInfo.nextPaymentDate,
                  daysLeft: diffDays,
                  status: 'pending'
              });
          }
      }
  });

  // Sort by nearest date
  upcomingPayments.sort((a, b) => a.daysLeft - b.daysLeft);

  // 2. Mock Revenue History (6 Months)
  const revenueHistory = [
      { month: 'Oca', amount: 35000 },
      { month: 'Şub', amount: 38000 },
      { month: 'Mar', amount: 42000 },
      { month: 'Nis', amount: 41000 },
      { month: 'May', amount: 45000 },
      { month: 'Haz', amount: 48500 },
  ];

  // 3. Mock Recent Transactions
  const recentTransactions: Transaction[] = [
      { id: 't1', studentId: '5', studentName: 'Can Demir', amount: 12000, date: '2024-06-15', status: 'completed', type: 'subscription' },
      { id: 't2', studentId: '4', studentName: 'Ayşe Yılmaz', amount: 500, date: '2024-06-14', status: 'completed', type: 'book_fee' },
      { id: 't3', studentId: '7', studentName: 'Burak Yılmaz', amount: 2500, date: '2024-06-12', status: 'completed', type: 'subscription' },
      { id: 't4', studentId: '1', studentName: 'Mehmet Öz', amount: 15000, date: '2024-06-10', status: 'failed', type: 'subscription' },
      { id: 't5', studentId: '6', studentName: 'Zeynep Kaya', amount: 20000, date: '2024-06-05', status: 'pending', type: 'subscription' },
  ];

  const financeStats: FinanceStats = {
      monthlyRevenue,
      monthlyGrowth: 8.5,
      totalRevenueYear,
      pendingAmount: pendingAmount || 12500, // Fallback mock
      overdueAmount: overdueAmount || 4500,
      revenueHistory,
      recentTransactions,
      upcomingPayments
  };


  // --- Mocking Spotlights & Trends ---
  const risers: StudentSpotlight[] = [
    { id: '5', name: 'Can Demir', change: 12.5, type: 'riser', avatarColor: 'bg-emerald-100 text-emerald-600' },
    { id: '4', name: 'Ayşe Yılmaz', change: 8.2, type: 'riser', avatarColor: 'bg-blue-100 text-blue-600' },
    { id: '1', name: 'Mehmet Öz', change: 6.4, type: 'riser', avatarColor: 'bg-indigo-100 text-indigo-600' }
  ];

  const fallers: StudentSpotlight[] = [
    { id: '7', name: 'Burak Yılmaz', change: -5.2, type: 'faller', avatarColor: 'bg-red-100 text-red-600' },
    { id: '6', name: 'Zeynep Kaya', change: -3.8, type: 'faller', avatarColor: 'bg-orange-100 text-orange-600' },
    { id: '3', name: 'Elif Demir', change: -2.1, type: 'faller', avatarColor: 'bg-pink-100 text-pink-600' }
  ];

  return {
    stats: {
        totalStudents: students.length,
        activeStudents7Days: activeCount,
        activeTrend: 5,
        inactiveStudents: inactiveCount,
        inactiveTrend: -2,
        riskyStudents: riskyCount,
        riskyTrend: 12,
        pendingPayments: students.filter(s => s.paymentInfo?.paymentStatus === 'pending').length,
        paymentTrend: 0,
        weeklyQuestions: totalWeeklyQuestions,
        avgAccuracy: avgAccuracy,
        hardestLesson: hardestLesson !== '-' ? hardestLesson : 'Veri Yok',
        neglectedLesson: neglectedLesson !== '-' ? neglectedLesson : 'Veri Yok'
    },
    actions: actions.sort((a,b) => (a.priority === 'high' ? -1 : 1)),
    weeklyTrend: trendData,
    subjectStatuses: subjectStatuses,
    subjectInsight: insight,
    aiSummary: {
        title: "Haftalık Koçluk Özeti",
        insight: `Bu hafta genel öğrenci katılımı %${Math.round((activeCount/students.length)*100)} seviyesinde. ${hardestLesson} dersinde genel bir düşüş gözlemleniyor.`,
        checklist: [
            `${hardestLesson} dersi için ek etüt planla.`,
            `Riskli gruptaki ${riskyCount} öğrenci ile birebir görüş.`,
            `Veli bilgilendirme mesajlarını gönder.`
        ],
        mood: avgAccuracy > 60 ? 'positive' : 'neutral'
    },
    spotlights: {
        risers: risers,
        fallers: fallers,
        focusToday: students.slice(0, 3) 
    },
    finance: financeStats
  };
};