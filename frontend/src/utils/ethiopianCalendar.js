// Ethiopian Calendar Utility
// Update CURRENT_ETHIOPIAN_MONTH when the month changes

export const CURRENT_ETHIOPIAN_MONTH = 5; // Currently: ጥር (Tir) - 5th month

export const ETHIOPIAN_MONTHS = [
  { number: 1, amharic: 'መስከረም', english: 'Meskerem' },
  { number: 2, amharic: 'ጥቅምት', english: 'Tikimt' },
  { number: 3, amharic: 'ኅዳር', english: 'Hidar' },
  { number: 4, amharic: 'ታኅሣሥ', english: 'Tahsas' },
  { number: 5, amharic: 'ጥር', english: 'Tir' },
  { number: 6, amharic: 'የካቲት', english: 'Yekatit' },
  { number: 7, amharic: 'መጋቢት', english: 'Megabit' },
  { number: 8, amharic: 'ሚያዝያ', english: 'Miazia' },
  { number: 9, amharic: 'ግንቦት', english: 'Ginbot' },
  { number: 10, amharic: 'ሰኔ', english: 'Sene' },
  { number: 11, amharic: 'ሐምሌ', english: 'Hamle' },
  { number: 12, amharic: 'ነሐሴ', english: 'Nehase' },
  { number: 13, amharic: 'ጳጉሜን', english: 'Pagumen' }
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
