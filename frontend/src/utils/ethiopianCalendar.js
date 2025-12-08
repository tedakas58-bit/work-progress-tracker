// Ethiopian Government Fiscal Year Calendar
// Starts with ሐምሌ (Hamle) and ends with ሰኔ (Sene)
// Automatically calculates current month from system date

// Auto-calculate current Ethiopian month from Gregorian date
const calculateCurrentEthiopianMonth = () => {
  const now = new Date();
  const gregorianMonth = now.getMonth() + 1; // 1-12
  
  // Ethiopian Government Fiscal Year mapping:
  const monthMapping = {
    7: 1,   // July = Hamle
    8: 2,   // August = Nehase
    9: 3,   // September = Meskerem
    10: 4,  // October = Tikimt
    11: 5,  // November = Hidar
    12: 6,  // December = Tahsas
    1: 7,   // January = Tir
    2: 8,   // February = Yekatit
    3: 9,   // March = Megabit
    4: 10,  // April = Miazia
    5: 11,  // May = Ginbot
    6: 12   // June = Sene
  };
  
  return monthMapping[gregorianMonth] || 1;
};

export const CURRENT_ETHIOPIAN_MONTH = calculateCurrentEthiopianMonth();

// Ethiopian Government Fiscal Year - Month Order
export const ETHIOPIAN_MONTHS = [
  { number: 1, amharic: 'ሐምሌ', english: 'Hamle' },
  { number: 2, amharic: 'ነሐሴ', english: 'Nehase' },
  { number: 3, amharic: 'መስከረም', english: 'Meskerem' },
  { number: 4, amharic: 'ጥቅምት', english: 'Tikimt' },
  { number: 5, amharic: 'ኅዳር', english: 'Hidar' },
  { number: 6, amharic: 'ታኅሣሥ', english: 'Tahsas' },
  { number: 7, amharic: 'ጥር', english: 'Tir' },
  { number: 8, amharic: 'የካቲት', english: 'Yekatit' },
  { number: 9, amharic: 'መጋቢት', english: 'Megabit' },
  { number: 10, amharic: 'ሚያዝያ', english: 'Miazia' },
  { number: 11, amharic: 'ግንቦት', english: 'Ginbot' },
  { number: 12, amharic: 'ሰኔ', english: 'Sene' }
];

/**
 * Get the current Ethiopian month number
 * @returns {number} Current Ethiopian month (1-13)
 */
export const getCurrentEthiopianMonth = () => {
  return CURRENT_ETHIOPIAN_MONTH;
};

/**
 * Check if a month should be visible (not in the past)
 * @param {number} month - Month number to check
 * @returns {boolean} True if month should be visible
 */
export const isMonthVisible = (month) => {
  return month > CURRENT_ETHIOPIAN_MONTH;
};

/**
 * Get Ethiopian month name
 * @param {number} monthNumber - Month number (1-13)
 * @param {string} language - 'amharic' or 'english'
 * @returns {string} Month name
 */
export const getEthiopianMonthName = (monthNumber, language = 'amharic') => {
  const month = ETHIOPIAN_MONTHS.find(m => m.number === monthNumber);
  return month ? month[language] : '';
};

/**
 * Filter reports to show only future months
 * @param {Array} reports - Array of report objects
 * @returns {Array} Filtered reports
 */
export const filterFutureReports = (reports) => {
  return reports.filter(report => isMonthVisible(report.month));
};
