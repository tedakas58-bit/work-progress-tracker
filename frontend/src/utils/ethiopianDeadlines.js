// Ethiopian Calendar Deadline System
// All reports are due on the 18th day of each Ethiopian month

import { ETHIOPIAN_MONTHS, getCurrentEthiopianDate, getEthiopianMonthName } from './ethiopianCalendar';

/**
 * Calculate the Gregorian date for the 18th day of an Ethiopian month
 * @param {number} ethiopianMonth - Ethiopian month (1-12)
 * @param {number} ethiopianYear - Ethiopian year
 * @returns {Date} Gregorian date for the deadline
 */
export const calculateEthiopianDeadline = (ethiopianMonth, ethiopianYear) => {
  // Ethiopian to Gregorian conversion mapping
  // Each Ethiopian month roughly corresponds to parts of two Gregorian months
  const monthMappings = {
    1: { gregorianMonth: 7, gregorianDay: 18 },   // Hamle 18 ≈ July 18
    2: { gregorianMonth: 8, gregorianDay: 18 },   // Nehase 18 ≈ August 18
    3: { gregorianMonth: 9, gregorianDay: 18 },   // Meskerem 18 ≈ September 18
    4: { gregorianMonth: 10, gregorianDay: 18 },  // Tikimt 18 ≈ October 18
    5: { gregorianMonth: 11, gregorianDay: 18 },  // Hidar 18 ≈ November 18
    6: { gregorianMonth: 12, gregorianDay: 18 },  // Tahsas 18 ≈ December 18
    7: { gregorianMonth: 1, gregorianDay: 18 },   // Tir 18 ≈ January 18
    8: { gregorianMonth: 2, gregorianDay: 18 },   // Yekatit 18 ≈ February 18
    9: { gregorianMonth: 3, gregorianDay: 18 },   // Megabit 18 ≈ March 18
    10: { gregorianMonth: 4, gregorianDay: 18 },  // Miazia 18 ≈ April 18
    11: { gregorianMonth: 5, gregorianDay: 18 },  // Ginbot 18 ≈ May 18
    12: { gregorianMonth: 6, gregorianDay: 18 }   // Sene 18 ≈ June 18
  };

  const mapping = monthMappings[ethiopianMonth];
  if (!mapping) {
    throw new Error(`Invalid Ethiopian month: ${ethiopianMonth}`);
  }

  // Convert Ethiopian year to Gregorian year
  let gregorianYear = ethiopianYear + 7; // Ethiopian year is typically 7-8 years behind
  
  // Adjust for months that fall in the next Gregorian year
  if (ethiopianMonth >= 1 && ethiopianMonth <= 4) {
    // Hamle to Tikimt fall in the same Gregorian year
    gregorianYear = ethiopianYear + 7;
  } else if (ethiopianMonth >= 5 && ethiopianMonth <= 12) {
    // Hidar to Sene may fall in the next Gregorian year
    gregorianYear = ethiopianYear + 8;
  }

  return new Date(gregorianYear, mapping.gregorianMonth - 1, mapping.gregorianDay);
};

/**
 * Get the current Ethiopian month deadline
 * @returns {Object} Current month deadline info
 */
export const getCurrentMonthDeadline = () => {
  const currentEC = getCurrentEthiopianDate();
  const deadlineDate = calculateEthiopianDeadline(currentEC.month, currentEC.year);
  
  return {
    ethiopianMonth: currentEC.month,
    ethiopianYear: currentEC.year,
    ethiopianDay: 18,
    gregorianDate: deadlineDate,
    monthName: getEthiopianMonthName(currentEC.month, 'amharic'),
    monthNameEnglish: getEthiopianMonthName(currentEC.month, 'english')
  };
};

/**
 * Get the next month deadline
 * @returns {Object} Next month deadline info
 */
export const getNextMonthDeadline = () => {
  const currentEC = getCurrentEthiopianDate();
  let nextMonth = currentEC.month + 1;
  let nextYear = currentEC.year;
  
  if (nextMonth > 12) {
    nextMonth = 1;
    nextYear = currentEC.year + 1;
  }
  
  const deadlineDate = calculateEthiopianDeadline(nextMonth, nextYear);
  
  return {
    ethiopianMonth: nextMonth,
    ethiopianYear: nextYear,
    ethiopianDay: 18,
    gregorianDate: deadlineDate,
    monthName: getEthiopianMonthName(nextMonth, 'amharic'),
    monthNameEnglish: getEthiopianMonthName(nextMonth, 'english')
  };
};

/**
 * Check if current date is past the deadline
 * @param {Date} deadlineDate - Gregorian deadline date
 * @returns {boolean} True if past deadline
 */
export const isPastDeadline = (deadlineDate) => {
  return new Date() > new Date(deadlineDate);
};

/**
 * Get days remaining until deadline
 * @param {Date} deadlineDate - Gregorian deadline date
 * @returns {number} Days remaining (negative if past deadline)
 */
export const getDaysUntilDeadline = (deadlineDate) => {
  const now = new Date();
  const deadline = new Date(deadlineDate);
  const diffTime = deadline - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Format Ethiopian deadline for display
 * @param {number} ethiopianMonth - Ethiopian month
 * @param {number} ethiopianYear - Ethiopian year
 * @param {string} language - 'amharic' or 'english'
 * @returns {string} Formatted deadline string
 */
export const formatEthiopianDeadlineString = (ethiopianMonth, ethiopianYear, language = 'amharic') => {
  const monthName = getEthiopianMonthName(ethiopianMonth, language);
  
  if (language === 'amharic') {
    return `${monthName} 18, ${ethiopianYear}`;
  } else {
    return `${monthName} 18, ${ethiopianYear}`;
  }
};

/**
 * Get deadline status with color coding
 * @param {Date} deadlineDate - Gregorian deadline date
 * @returns {Object} Status object with color and text
 */
export const getDeadlineStatus = (deadlineDate) => {
  const daysRemaining = getDaysUntilDeadline(deadlineDate);
  
  if (daysRemaining < 0) {
    return {
      status: 'overdue',
      text: 'ዘግይቷል',
      textEnglish: 'Overdue',
      color: 'text-red-500',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-400/30',
      daysRemaining: Math.abs(daysRemaining)
    };
  } else if (daysRemaining === 0) {
    return {
      status: 'today',
      text: 'ዛሬ',
      textEnglish: 'Today',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/20',
      borderColor: 'border-orange-400/30',
      daysRemaining: 0
    };
  } else if (daysRemaining <= 3) {
    return {
      status: 'urgent',
      text: 'አስቸኳይ',
      textEnglish: 'Urgent',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-400/30',
      daysRemaining
    };
  } else if (daysRemaining <= 7) {
    return {
      status: 'warning',
      text: 'ማስጠንቀቂያ',
      textEnglish: 'Warning',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-400/30',
      daysRemaining
    };
  } else {
    return {
      status: 'normal',
      text: 'መደበኛ',
      textEnglish: 'Normal',
      color: 'text-green-500',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-400/30',
      daysRemaining
    };
  }
};

/**
 * Generate all deadlines for a given Ethiopian year
 * @param {number} ethiopianYear - Ethiopian year
 * @returns {Array} Array of deadline objects for all 12 months
 */
export const generateYearlyDeadlines = (ethiopianYear) => {
  const deadlines = [];
  
  for (let month = 1; month <= 12; month++) {
    const gregorianDate = calculateEthiopianDeadline(month, ethiopianYear);
    deadlines.push({
      ethiopianMonth: month,
      ethiopianYear,
      ethiopianDay: 18,
      gregorianDate,
      monthName: getEthiopianMonthName(month, 'amharic'),
      monthNameEnglish: getEthiopianMonthName(month, 'english'),
      formatted: formatEthiopianDeadlineString(month, ethiopianYear, 'amharic'),
      formattedEnglish: formatEthiopianDeadlineString(month, ethiopianYear, 'english')
    });
  }
  
  return deadlines;
};

/**
 * Get deadline info for a specific plan month
 * @param {number} planMonth - Plan month (1-12)
 * @param {number} planYear - Plan year
 * @returns {Object} Deadline information
 */
export const getPlanDeadlineInfo = (planMonth, planYear) => {
  const gregorianDate = calculateEthiopianDeadline(planMonth, planYear);
  const status = getDeadlineStatus(gregorianDate);
  
  return {
    ethiopianMonth: planMonth,
    ethiopianYear: planYear,
    ethiopianDay: 18,
    gregorianDate,
    monthName: getEthiopianMonthName(planMonth, 'amharic'),
    monthNameEnglish: getEthiopianMonthName(planMonth, 'english'),
    formatted: formatEthiopianDeadlineString(planMonth, planYear, 'amharic'),
    formattedEnglish: formatEthiopianDeadlineString(planMonth, planYear, 'english'),
    status,
    isPastDeadline: isPastDeadline(gregorianDate),
    daysRemaining: getDaysUntilDeadline(gregorianDate)
  };
};