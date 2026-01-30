import React, { useState, useEffect } from 'react';
import { X, GraduationCap, Users, User, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Button } from './Button';
import { UserRole } from '../types';
import { useAuth } from '../context/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Pre-fill demo credentials based on role
  useEffect(() => {
    if (selectedRole === 'student') setEmail('ogrenci@edusync.com');
    if (selectedRole === 'teacher') setEmail('ogretmen@edusync.com');
    if (selectedRole === 'admin' || selectedRole === 'teacher') setEmail('admin@edusync.com'); // Using admin as teacher/coach for demo
    if (selectedRole === 'parent') setEmail('veli@edusync.com');
    setPassword('123');
  }, [selectedRole]);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setSelectedRole(null);
        setEmail('');
        setPassword('');
        setShowPassword(false);
        setIsLoading(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (selectedRole) {
        // Map UI selection "teacher" to either admin or teacher for demo purposes if needed, 
        // but here we strictly pass the selected role to mock API
        await login(email, selectedRole === 'teacher' ? 'admin' : selectedRole); 
        onClose();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleTitle = (role: UserRole) => {
    switch(role) {
      case 'teacher': return 'Eğitmen / Koç Girişi';
      case 'student': return 'Öğrenci Girişi';
      case 'parent': return 'Veli Girişi';
      default: return 'Giriş Yap';
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch(role) {
      case 'teacher': return <Users className="w-8 h-8 text-primary-600" />;
      case 'student': return <GraduationCap className="w-8 h-8 text-emerald-600" />;
      case 'parent': return <User className="w-8 h-8 text-orange-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>
        
        {!selectedRole ? (
          <div className="p-8 text-center overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Giriş Yapın</h2>
            <p className="text-gray-600 mb-8">Lütfen devam etmek için rolünüzü seçin.</p>
            
            <div className="grid gap-4">
              <button
                onClick={() => setSelectedRole('teacher')}
                className="flex items-center p-4 border-2 border-gray-100 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all group text-left"
              >
                <div className="bg-primary-100 p-3 rounded-lg text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                  <Users className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">Eğitmen / Koç Girişi</h3>
                  <p className="text-sm text-gray-500">Öğrencilerinizi ve planlarınızı yönetin</p>
                </div>
              </button>

              <button
                onClick={() => setSelectedRole('student')}
                className="flex items-center p-4 border-2 border-gray-100 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all group text-left"
              >
                <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">Öğrenci Girişi</h3>
                  <p className="text-sm text-gray-500">Ders programı ve hedeflerinizi görüntüleyin</p>
                </div>
              </button>

              <button
                onClick={() => setSelectedRole('parent')}
                className="flex items-center p-4 border-2 border-gray-100 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all group text-left"
              >
                <div className="bg-orange-100 p-3 rounded-lg text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                  <User className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">Veli Girişi</h3>
                  <p className="text-sm text-gray-500">Çocuğunuzun gelişimini takip edin</p>
                </div>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8">
            <button 
              onClick={() => setSelectedRole(null)}
              className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Geri Dön
            </button>

            <div className="flex flex-col items-center mb-6">
              <div className={`p-4 rounded-full mb-4 ${
                selectedRole === 'teacher' ? 'bg-primary-100' : 
                selectedRole === 'student' ? 'bg-emerald-100' : 'bg-orange-100'
              }`}>
                {getRoleIcon(selectedRole)}
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{getRoleTitle(selectedRole)}</h2>
              <p className="text-gray-500 text-sm mt-1">Demo Şifre: 123</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-Posta Adresi</label>
                <input 
                  required
                  type="email" 
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
                <div className="relative">
                  <input 
                    required
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full mt-4" disabled={isLoading}>
                {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
