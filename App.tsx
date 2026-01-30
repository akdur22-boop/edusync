import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Solutions } from './components/Solutions';
import { Testimonials } from './components/Testimonials'; // New import
import { Contact } from './components/Contact'; // New import
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';
import { LoginModal } from './components/LoginModal';
import { DemoModal } from './components/DemoModal';
import { DashboardLayout } from './components/DashboardLayout';
import { StudentDashboard } from './components/dashboards/StudentDashboard';
import { CoachDashboard } from './components/dashboards/CoachDashboard';

const AppContent = () => {
  const { user } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  
  // Dashboard navigation state
  const [activeTab, setActiveTab] = useState('overview');

  // If user is logged in, show the appropriate dashboard
  if (user) {
    return (
      <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
        {user.role === 'student' && <StudentDashboard />}
        {user.role === 'admin' && <CoachDashboard activeTab={activeTab} />}
        {user.role === 'teacher' && <div className="text-center p-10 text-gray-500">Öğretmen paneli yapım aşamasında (Admin paneline bakınız)</div>}
        {user.role === 'parent' && <div className="text-center p-10 text-gray-500">Veli paneli yapım aşamasında (Öğrenci paneline bakınız)</div>}
      </DashboardLayout>
    );
  }

  // If not logged in, show Landing Page
  return (
    <div className="min-h-screen bg-white selection:bg-primary-100 selection:text-primary-900">
      <Navbar 
        onLoginClick={() => setIsLoginModalOpen(true)} 
        onDemoClick={() => setIsDemoModalOpen(true)}
      />
      
      <main>
        <Hero onDemoClick={() => setIsDemoModalOpen(true)} />
        <Features />
        <Solutions />
        <Testimonials />
        <CTA />
        <Contact />
      </main>

      <Footer />
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
      
      <DemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;