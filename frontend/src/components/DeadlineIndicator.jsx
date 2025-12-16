import React from 'react';
import { Clock, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getDeadlineStatus, formatEthiopianDeadlineString } from '../utils/ethiopianDeadlines';

function DeadlineIndicator({ planMonth, planYear, deadlineDate, size = 'normal', showIcon = true }) {
  const { t, language } = useLanguage();
  
  if (!deadlineDate || !planMonth || !planYear) {
    return null;
  }

  const status = getDeadlineStatus(deadlineDate);
  
  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    normal: 'px-3 py-2 text-sm',
    large: 'px-4 py-3 text-base'
  };

  const iconSizes = {
    small: 12,
    normal: 16,
    large: 20
  };

  const getIcon = () => {
    switch (status.status) {
      case 'overdue':
        return <AlertTriangle size={iconSizes[size]} className="text-red-400" />;
      case 'today':
        return <Clock size={iconSizes[size]} className="text-orange-400" />;
      case 'urgent':
        return <AlertTriangle size={iconSizes[size]} className="text-yellow-400" />;
      case 'warning':
        return <Clock size={iconSizes[size]} className="text-blue-400" />;
      default:
        return <CheckCircle size={iconSizes[size]} className="text-green-400" />;
    }
  };

  const getStatusText = () => {
    const statusText = language === 'am' ? status.text : status.textEnglish;
    
    if (status.status === 'overdue') {
      return `${statusText} (${status.daysRemaining} ${t('ቀናት', 'days')})`;
    } else if (status.daysRemaining === 0) {
      return statusText;
    } else {
      return `${status.daysRemaining} ${t('ቀናት ቀርተዋል', 'days remaining')}`;
    }
  };

  const deadlineText = formatEthiopianDeadlineString(planMonth, planYear, language === 'am' ? 'amharic' : 'english');

  return (
    <div className={`inline-flex items-center gap-2 rounded-lg font-semibold backdrop-blur-sm border ${status.bgColor} ${status.borderColor} ${status.color} ${sizeClasses[size]}`}>
      {showIcon && getIcon()}
      <div className="flex flex-col">
        <div className="font-bold">
          {deadlineText}
        </div>
        <div className="text-xs opacity-80">
          {getStatusText()}
        </div>
      </div>
    </div>
  );
}

export default DeadlineIndicator;