import { Link } from 'react-router-dom';
import { LogOut, BarChart3, User, Sparkles, Languages, FileText } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { transformBranchName } from '../utils/branchNameTransform';
import NavbarCountdown from './NavbarCountdown';

function Navbar({ user, onLogout }) {
  const { language, toggleLanguage, t } = useLanguage();
  
  return (
    <nav className="glass border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl">
      <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          {/* Logo and Title - Responsive */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group min-w-0 flex-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
              <img src="/logo.png" alt="Logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-xl" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-sm sm:text-lg lg:text-xl font-bold text-white block truncate leading-tight">
                {t('ዘመናዊ እቅድ እና ሪፖርት', 'Modern Plan and Report')}
              </span>
              <span className="text-xs text-purple-300 block truncate">
                {t('መላኪያ ስርዓት', 'Sender System')}
              </span>
            </div>
          </Link>
          
          {/* Right Side Controls - Responsive */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            {/* User Info - Hidden on mobile, visible on tablet+ */}
            <div className="hidden lg:flex items-center space-x-3 px-3 py-2 bg-white/5 rounded-xl border border-white/10">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <div className="text-sm">
                <div className="font-semibold text-white flex items-center gap-1 text-xs">
                  {user.role === 'admin' ? 'System Admin' : 
                   user.role === 'main_branch' ? t('ክፍለ ከተማ', 'Sub-city') :
                   transformBranchName(user.branchName, language) || user.branchName}
                  {user.role === 'main_branch' && <Sparkles size={12} className="text-yellow-400" />}
                  {user.role === 'admin' && <Sparkles size={12} className="text-red-400" />}
                </div>
                <div className="text-purple-300 text-xs truncate max-w-24">{user.username}</div>
              </div>
            </div>

            {/* Mobile User Info - Visible only on mobile */}
            <div className="lg:hidden flex items-center px-2 py-1 bg-white/5 rounded-lg border border-white/10">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-md flex items-center justify-center">
                <User size={12} className="text-white" />
              </div>
            </div>
            
            {/* Language Toggle - Responsive */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-2 sm:px-4 py-2 rounded-lg sm:rounded-xl transition transform hover:scale-105 shadow-lg"
              title={language === 'am' ? 'Switch to English' : 'ወደ አማርኛ ቀይር'}
            >
              <Languages size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden xs:inline text-xs sm:text-sm font-semibold">{language === 'am' ? 'EN' : 'አማ'}</span>
            </button>
            
            {/* Logout Button - Responsive */}
            <button
              onClick={onLogout}
              className="flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-2 sm:px-4 py-2 rounded-lg sm:rounded-xl transition transform hover:scale-105 shadow-lg"
              title={t('ውጣ', 'Logout')}
            >
              <LogOut size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden xs:inline text-xs sm:text-sm">{t('ውጣ', 'Logout')}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
