import React, { useState, useEffect } from 'react';
import { Clock, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getCurrentEthiopianDate, getEthiopianMonthName } from '../utils/ethiopianCalendar';
import { calculateEthiopianDeadline, getDaysUntilDeadline } from '../utils/ethiopianDeadlines';

function CountdownTimer({ size = 'normal', showIcon = true, animated = true }) {
  const { t, language } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentEC, setCurrentEC] = useState(getCurrentEthiopianDate());

  // Update time every minute for real-time countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setCurrentEC(getCurrentEthiopianDate());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Calculate current month deadline
  const currentDeadline = calculateEthiopianDeadline(currentEC.month, currentEC.year);
  const daysRemaining = 18 - currentEC.day;
  const hoursRemaining = Math.floor((currentDeadline - currentTime) / (1000 * 60 * 60)) % 24;
  const minutesRemaining = Math.floor((currentDeadline - currentTime) / (1000 * 60)) % 60;

  // Get status and styling
  const getStatus = () => {
    if (daysRemaining < 0) {
      return {
        status: 'overdue',
        text: 'ዘግይቷል',
        textEnglish: 'OVERDUE',
        color: 'text-red-400',
        bgColor: 'bg-red-500/20',
        borderColor: 'border-red-400/50',
        icon: <AlertTriangle className="text-red-400" />,
        pulse: true
      };
    } else if (daysRemaining === 0) {
      return {
        status: 'today',
        text: 'ዛሬ',
        textEnglish: 'DUE TODAY',
        color: 'text-orange-400',
        bgColor: 'bg-orange-500/20',
        borderColor: 'border-orange-400/50',
        icon: <Clock className="text-orange-400" />,
        pulse: true
      };
    } else if (daysRemaining <= 3) {
      return {
        status: 'urgent',
        text: 'አስቸኳይ',
        textEnglish: 'URGENT',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/20',
        borderColor: 'border-yellow-400/50',
        icon: <AlertTriangle className="text-yellow-400" />,
        pulse: true
      };
    } else if (daysRemaining <= 7) {
      return {
        status: 'warning',
        text: 'ማስጠንቀቂያ',
        textEnglish: 'WARNING',
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/20',
        borderColor: 'border-blue-400/50',
        icon: <Clock className="text-blue-400" />,
        pulse: false
      };
    } else {
      return {
        status: 'normal',
        text: 'መደበኛ',
        textEnglish: 'NORMAL',
        color: 'text-green-400',
        bgColor: 'bg-green-500/20',
        borderColor: 'border-green-400/50',
        icon: <CheckCircle className="text-green-400" />,
        pulse: false
      };
    }
  };

  const status = getStatus();
  const monthName = getEthiopianMonthName(currentEC.month, language === 'am' ? 'amharic' : 'english');

  const sizeClasses = {
    small: 'p-3 text-sm',
    normal: 'p-4 text-base',
    large: 'p-6 text-lg'
  };

  const iconSizes = {
    small: 16,
    normal: 20,
    large: 24
  };

  const numberSizes = {
    small: 'text-2xl',
    normal: 'text-4xl',
    large: 'text-6xl'
  };

  return (
    <div className={`glass rounded-2xl shadow-xl backdrop-blur-xl border ${status.borderColor} ${status.bgColor} ${sizeClasses[size]} ${animated && status.pulse ? 'animate-pulse' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {showIcon && React.cloneElement(status.icon, { size: iconSizes[size] })}
          <div>
            <div className={`font-bold ${status.color}`}>
              {language === 'am' ? status.text : status.textEnglish}
            </div>
            <div className="text-xs text-purple-300">
              {t('የሪፖርት የመጨረሻ ቀን', 'Report Deadline')}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-purple-300">{t('የአሁኑ ወር', 'Current Month')}</div>
          <div className="text-sm font-semibold text-white">{monthName} {currentEC.year}</div>
        </div>
      </div>

      {/* Countdown Display */}
      <div className="text-center">
        <div className={`${numberSizes[size]} font-bold ${status.color} mb-2`}>
          {Math.abs(daysRemaining)}
        </div>
        <div className="text-sm text-white font-semibold mb-3">
          {daysRemaining < 0 
            ? t('ቀናት ዘግይቷል', 'Days Overdue')
            : daysRemaining === 0 
            ? t('ዛሬ የመጨረሻ ቀን ነው', 'Today is the Deadline')
            : t('ቀናት ቀርተዋል', 'Days Remaining')
          }
        </div>

        {/* Detailed Time (for urgent cases) */}
        {(daysRemaining <= 1 && daysRemaining >= 0) && (
          <div className="text-xs text-purple-200 mb-3">
            <div className="flex justify-center gap-4">
              <div>
                <span className="font-bold">{Math.abs(hoursRemaining)}</span>
                <div>{t('ሰዓት', 'Hours')}</div>
              </div>
              <div>
                <span className="font-bold">{Math.abs(minutesRemaining)}</span>
                <div>{t('ደቂቃ', 'Minutes')}</div>
              </div>
            </div>
          </div>
        )}

        {/* Deadline Date */}
        <div className="border-t border-white/20 pt-3">
          <div className="text-xs text-purple-300 mb-1">
            {t('የመጨረሻ ቀን', 'Deadline Date')}
          </div>
          <div className="text-sm font-semibold text-white">
            {monthName} 18, {currentEC.year}
          </div>
          <div className="text-xs text-purple-200">
            ({currentDeadline.toLocaleDateString()})
          </div>
        </div>
      </div>

      {/* Action Message */}
      <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
        <div className="text-xs text-center">
          {daysRemaining < 0 ? (
            <span className="text-red-300">
              {t('ሪፖርት ዘግይቷል! በተቻለ ፍጥነት ያስገቡ', 'Report is overdue! Submit as soon as possible')}
            </span>
          ) : daysRemaining === 0 ? (
            <span className="text-orange-300">
              {t('ዛሬ የመጨረሻ ቀን ነው! አሁኑኑ ያስገቡ', 'Today is the deadline! Submit now')}
            </span>
          ) : daysRemaining <= 3 ? (
            <span className="text-yellow-300">
              {t('አስቸኳይ! በቅርቡ ያስገቡ', 'Urgent! Submit soon')}
            </span>
          ) : (
            <span className="text-green-300">
              {t('በ18ኛው ቀን ሪፖርት ያስገቡ', 'Submit report by the 18th')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default CountdownTimer;