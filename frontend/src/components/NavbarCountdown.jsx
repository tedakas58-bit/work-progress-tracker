import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getCurrentEthiopianDate, getEthiopianMonthName } from '../utils/ethiopianCalendar';

function NavbarCountdown() {
  const { t, language } = useLanguage();
  const [currentEC, setCurrentEC] = useState(getCurrentEthiopianDate());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentEC(getCurrentEthiopianDate());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const daysRemaining = 18 - currentEC.day;
  const monthName = getEthiopianMonthName(currentEC.month, language === 'am' ? 'amharic' : 'english');

  // Get status styling
  const getStatusStyle = () => {
    if (daysRemaining < 0) {
      return {
        bgColor: 'bg-red-500/90',
        textColor: 'text-white',
        icon: <AlertTriangle size={14} />,
        pulse: true
      };
    } else if (daysRemaining === 0) {
      return {
        bgColor: 'bg-orange-500/90',
        textColor: 'text-white',
        icon: <Clock size={14} />,
        pulse: true
      };
    } else if (daysRemaining <= 3) {
      return {
        bgColor: 'bg-yellow-500/90',
        textColor: 'text-white',
        icon: <AlertTriangle size={14} />,
        pulse: true
      };
    } else if (daysRemaining <= 7) {
      return {
        bgColor: 'bg-blue-500/90',
        textColor: 'text-white',
        icon: <Clock size={14} />,
        pulse: false
      };
    } else {
      return {
        bgColor: 'bg-green-500/90',
        textColor: 'text-white',
        icon: <Clock size={14} />,
        pulse: false
      };
    }
  };

  const status = getStatusStyle();

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/20 ${status.bgColor} ${status.textColor} ${status.pulse ? 'animate-pulse' : ''}`}>
      {status.icon}
      <div className="flex flex-col">
        <div className="text-xs font-bold">
          {Math.abs(daysRemaining)} {t('ቀናት', 'days')}
        </div>
        <div className="text-xs opacity-80">
          {daysRemaining < 0 
            ? t('ዘግይቷል', 'overdue')
            : daysRemaining === 0 
            ? t('ዛሬ', 'today')
            : t('ቀርተዋል', 'left')
          }
        </div>
      </div>
    </div>
  );
}

export default NavbarCountdown;