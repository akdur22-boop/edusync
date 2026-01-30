import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './Button';
import { LogOut, LayoutDashboard, Settings, User, GraduationCap, Wallet, Maximize, Minimize, FileQuestion } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, activeTab, onTabChange }) => {
  const { user, logout } = useAuth();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleNavClick = (tab: string) => {
    if (onTabChange) onTabChange(tab);
  };

  return (
    <div className="h-screen overflow-hidden bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="bg-white w-full md:w-64 border-r border-gray-200 flex-shrink-0 flex flex-col h-full overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex items-center gap-2 flex-shrink-0">
           <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
              E
            </div>
            <span className="font-bold text-gray-900">EduSync<span className="text-primary-600">Pro</span></span>
        </div>
        
        <div className="p-4 flex flex-col gap-2 flex-1">
          <button 
            onClick={() => handleNavClick('overview')}
            className={`px-4 py-3 rounded-lg font-medium flex items-center gap-3 transition-colors ${
              activeTab === 'overview' 
                ? 'bg-primary-50 text-primary-700' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Genel Bakış
          </button>

          {user?.role === 'admin' && (
            <>
              <button 
                onClick={() => handleNavClick('students')}
                className={`px-4 py-3 rounded-lg font-medium flex items-center gap-3 transition-colors ${
                  activeTab === 'students' 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <GraduationCap className="w-5 h-5" />
                Öğrenciler
              </button>

              <button 
                onClick={() => handleNavClick('mock-exams')}
                className={`px-4 py-3 rounded-lg font-medium flex items-center gap-3 transition-colors ${
                  activeTab === 'mock-exams' 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FileQuestion className="w-5 h-5" />
                Deneme Oluştur
              </button>

              <button 
                onClick={() => handleNavClick('finance')}
                className={`px-4 py-3 rounded-lg font-medium flex items-center gap-3 transition-colors ${
                  activeTab === 'finance' 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Wallet className="w-5 h-5" />
                Finans
              </button>
            </>
          )}

          <button 
            onClick={() => handleNavClick('profile')}
            className={`px-4 py-3 rounded-lg font-medium flex items-center gap-3 transition-colors ${
              activeTab === 'profile' 
                ? 'bg-primary-50 text-primary-700' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <User className="w-5 h-5" />
            Profil
          </button>

          <button 
            onClick={() => handleNavClick('settings')}
            className={`px-4 py-3 rounded-lg font-medium flex items-center gap-3 transition-colors ${
              activeTab === 'settings' 
                ? 'bg-primary-50 text-primary-700' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Settings className="w-5 h-5" />
            Ayarlar
          </button>

          <div className="my-2 border-t border-gray-100"></div>

          <button 
            onClick={toggleFullscreen}
            className="px-4 py-3 rounded-lg font-medium flex items-center gap-3 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            {isFullscreen ? 'Küçült' : 'Tam Ekran'}
          </button>
        </div>

        <div className="p-6 border-t border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold">
              {user?.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <div className="font-bold text-gray-900 truncate text-sm">{user?.name}</div>
              <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={logout} className="w-full gap-2">
            <LogOut className="w-4 h-4" /> Çıkış Yap
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto h-full">
        {children}
      </main>
    </div>
  );
};