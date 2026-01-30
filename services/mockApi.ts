import { User, Student, Result, UserRole } from '../types';

// --- MOCK DATABASE ---
let users: User[] = [
  { id: '1', name: 'Admin Koç', email: 'admin@edusync.com', role: 'admin', password: '123' },
  { id: '2', name: 'Ahmet Hoca', email: 'ogretmen@edusync.com', role: 'teacher', password: '123' },
  { id: '3', name: 'Mehmet Veli', email: 'veli@edusync.com', role: 'parent', password: '123' },
  { id: '4', name: 'Ayşe Yılmaz', email: 'ogrenci@edusync.com', role: 'student', password: '123' },
  { id: '5', name: 'Can Demir', email: 'can@edusync.com', role: 'student', password: '123' }
];

// Helper to create dates relative to today
const daysAgo = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
};

const daysFromNow = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

let students: Student[] = [
  { 
    id: '4', 
    studentNumber: '2024001',
    name: 'Ayşe Yılmaz', 
    email: 'ogrenci@edusync.com', 
    role: 'student', 
    classGrade: '12-A', 
    teacherId: '2', 
    parentId: '3',
    parentName: 'Mehmet Veli',
    parentEmail: 'veli@edusync.com',
    parentPhone: '0555 123 45 67',
    initialNet: 45,
    examGoal: 'TYT',
    status: 'active',
    lastDataEntry: daysAgo(1),
    paymentInfo: {
      registrationDate: daysAgo(200), // ~6 months ago
      totalAmount: 15000,
      currency: 'TL',
      nextPaymentDate: daysFromNow(5), // Due in 5 days
      lastPaymentDate: daysAgo(360), // Last year
      paymentStatus: 'pending',
      period: '12_months'
    }
  },
  { 
    id: '5', 
    studentNumber: '2024002',
    name: 'Can Demir', 
    email: 'can@edusync.com', 
    role: 'student', 
    classGrade: '11-B', 
    teacherId: '2',
    initialNet: 30,
    examGoal: 'LGS',
    status: 'active',
    lastDataEntry: daysAgo(5),
    paymentInfo: {
      registrationDate: daysAgo(15), // This month
      totalAmount: 12000,
      currency: 'TL',
      nextPaymentDate: daysFromNow(40),
      lastPaymentDate: daysAgo(15), // Paid recently
      paymentStatus: 'paid',
      period: '12_months'
    }
  },
  { 
    id: '6', 
    studentNumber: '2024003',
    name: 'Zeynep Kaya', 
    email: 'zeynep@student.com', 
    role: 'student', 
    classGrade: '12-A', 
    teacherId: '2',
    initialNet: 65,
    examGoal: 'AYT',
    status: 'risky',
    lastDataEntry: daysAgo(10),
    paymentInfo: {
      registrationDate: daysAgo(80), // ~3 months ago
      totalAmount: 20000,
      currency: 'TL',
      nextPaymentDate: daysFromNow(12), // Due in 12 days
      lastPaymentDate: daysAgo(80), // Paid 3 months ago
      paymentStatus: 'pending', // Pending next installment
      period: '12_months'
    }
  },
  { 
    id: '7', 
    studentNumber: '2024004',
    name: 'Burak Yılmaz', 
    email: 'burak@student.com', 
    role: 'student', 
    classGrade: '10-C', 
    teacherId: '2',
    initialNet: 20,
    examGoal: 'TYT',
    status: 'passive',
    paymentInfo: {
      registrationDate: daysAgo(5), // This week
      totalAmount: 2500,
      currency: 'TL',
      nextPaymentDate: daysFromNow(25), // Due in 25 days
      lastPaymentDate: daysAgo(2), // Paid very recently
      paymentStatus: 'paid',
      period: '1_month'
    }
  },
  { 
    id: '8', 
    studentNumber: '2024005',
    name: 'Elif Demir', 
    email: 'elif@student.com', 
    role: 'student', 
    classGrade: '9-A', 
    teacherId: '2',
    initialNet: 15,
    examGoal: 'LGS',
    status: 'active',
    lastDataEntry: daysAgo(1),
    paymentInfo: {
      registrationDate: daysAgo(150), 
      totalAmount: 5000,
      currency: 'TL',
      nextPaymentDate: daysFromNow(60),
      lastPaymentDate: daysAgo(150),
      paymentStatus: 'paid',
      period: '3_months'
    }
  }
];

// Expanded results to cover more subjects
let results: Result[] = [
  // --- RECENT (This Week/Month) for Report Card ---
  // Matematik
  { id: '101', studentId: '4', sourceName: '345 Yayınları', lesson: 'Matematik', topic: 'Türev', testName: 'Test 1', correct: 15, incorrect: 3, empty: 2, date: daysAgo(2) },
  { id: '103', studentId: '4', sourceName: 'Orijinal', lesson: 'Matematik', topic: 'İntegral', testName: 'Tarama', correct: 18, incorrect: 4, empty: 3, date: daysAgo(5) },
  
  // Fizik
  { id: '102', studentId: '4', sourceName: 'Yayın Denizi', lesson: 'Fizik', topic: 'Kuvvet ve Hareket', testName: 'Test 2', correct: 9, incorrect: 5, empty: 1, date: daysAgo(3) },
  
  // Kimya
  { id: '104', studentId: '4', sourceName: 'Palme', lesson: 'Kimya', topic: 'Organik Kimya', testName: 'Test 5', correct: 11, incorrect: 2, empty: 0, date: daysAgo(4) },
  
  // Biyoloji
  { id: '201', studentId: '4', sourceName: 'Biyotik', lesson: 'Biyoloji', topic: 'Sistemler', testName: 'Sindirim', correct: 12, incorrect: 1, empty: 0, date: daysAgo(6) },
  { id: '202', studentId: '4', sourceName: 'Biyotik', lesson: 'Biyoloji', topic: 'Kalıtım', testName: 'Genetik', correct: 10, incorrect: 3, empty: 0, date: daysAgo(10) },

  // Türkçe
  { id: '203', studentId: '4', sourceName: 'Limit', lesson: 'Türkçe', topic: 'Paragraf', testName: 'Anlam', correct: 35, incorrect: 5, empty: 0, date: daysAgo(1) },
  { id: '204', studentId: '4', sourceName: 'Limit', lesson: 'Türkçe', topic: 'Dil Bilgisi', testName: 'Karma', correct: 18, incorrect: 2, empty: 0, date: daysAgo(8) },

  // Sosyal Dersler
  { id: '205', studentId: '4', sourceName: 'Hız ve Renk', lesson: 'Tarih', topic: 'Kurtuluş Savaşı', testName: 'Test A', correct: 10, incorrect: 2, empty: 0, date: daysAgo(12) },
  { id: '206', studentId: '4', sourceName: 'Hız ve Renk', lesson: 'Coğrafya', topic: 'Harita Bilgisi', testName: 'Test B', correct: 8, incorrect: 4, empty: 0, date: daysAgo(13) },
  { id: '207', studentId: '4', sourceName: 'Apotsmi', lesson: 'Felsefe', topic: 'Bilgi Felsefesi', testName: 'Test 1', correct: 5, incorrect: 0, empty: 0, date: daysAgo(14) },

  // --- OLDER DATA (Last 3-6 Months) ---
  { id: '105', studentId: '4', sourceName: 'Yayın B', lesson: 'Matematik', topic: 'Türev', testName: 'Giriş Testi', correct: 10, incorrect: 10, empty: 0, date: daysAgo(75) },
  { id: '106', studentId: '4', sourceName: 'Yayın A', lesson: 'Fizik', topic: 'Hareket', testName: 'Vektörler', correct: 25, incorrect: 5, empty: 0, date: daysAgo(150) },
];

// --- API ENDPOINTS ---

export const api = {
  // Auth
  login: async (email: string, role: UserRole) => {
    // Simulating network delay
    await new Promise(r => setTimeout(r, 500));
    const user = users.find(u => u.email === email && u.role === role);
    if (user) return user;
    throw new Error('Kullanıcı bulunamadı');
  },

  // Users
  getStudents: () => {
    return students;
  },
  
  getStudentById: (id: string) => {
    return students.find(s => s.id === id);
  },

  getMyStudents: (teacherId: string) => {
    return students.filter(s => s.teacherId === teacherId);
  },

  getChild: (parentId: string) => {
    return students.find(s => s.parentId === parentId);
  },

  // CRUD
  addStudent: (data: any) => {
    const studentNumber = Math.floor(2024000 + Math.random() * 999).toString();
    
    // Calculate next payment date based on period
    const today = new Date();
    const nextPayment = new Date(today);
    if (data.paymentPeriod === '1_month') nextPayment.setMonth(nextPayment.getMonth() + 1);
    if (data.paymentPeriod === '3_months') nextPayment.setMonth(nextPayment.getMonth() + 3);
    if (data.paymentPeriod === '12_months') nextPayment.setFullYear(nextPayment.getFullYear() + 1);

    const newStudent: Student = { 
      id: Math.random().toString(36).substr(2, 9),
      role: 'student',
      name: data.name,
      email: data.parentEmail || `${data.name.toLowerCase().replace(/\s/g, '')}@student.com`, // Fallback email
      classGrade: data.classGrade,
      studentNumber: studentNumber,
      parentName: data.parentName,
      parentEmail: data.parentEmail,
      parentPhone: data.parentPhone,
      initialNet: data.initialNet ? Number(data.initialNet) : 0,
      examGoal: data.examGoal || 'YKS',
      status: 'active',
      paymentInfo: {
        registrationDate: today.toISOString().split('T')[0],
        totalAmount: data.registrationFee ? Number(data.registrationFee) : 0,
        currency: 'TL',
        nextPaymentDate: nextPayment.toISOString().split('T')[0],
        paymentStatus: 'pending',
        period: data.paymentPeriod
      }
    };
    
    users.push(newStudent);
    students.push(newStudent);
    return newStudent;
  },

  // Results
  getResults: (studentId: string) => {
    return results.filter(r => r.studentId === studentId);
  },

  addResult: (result: Omit<Result, 'id'>) => {
    const newResult = { ...result, id: Math.random().toString(36).substr(2, 9) };
    results.unshift(newResult); // Add to top
    return newResult;
  }
};