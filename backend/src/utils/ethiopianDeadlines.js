// Ethiopian Calendar Deadline Utilities for Backend
// All reports are due on the 18th day of each Ethiopian month

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
 * Generate all monthly deadlines for an Ethiopian year
 * @param {number} ethiopianYear - Ethiopian year
 * @returns {Array} Array of deadline dates for all 12 months
 */
export const generateYearlyDeadlines = (ethiopianYear) => {
  const deadlines = [];
  
  for (let month = 1; month <= 12; month++) {
    const gregorianDate = calculateEthiopianDeadline(month, ethiopianYear);
    deadlines.push({
      ethiopianMonth: month,
      ethiopianYear,
      gregorianDate
    });
  }
  
  return deadlines;
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
 * Get current Ethiopian date (fixed calculation)
 * December 16, 2025 = Tahsas 7, 2018
 * @returns {Object} {day, month, year}
 */
export const getCurrentEthiopianDate = () => {
  const now = new Date();
  const gregorianMonth = now.getMonth() + 1; // 1-12
  const gregorianDay = now.getDate();
  const gregorianYear = now.getFullYear();
  
  // Fixed Ethiopian calendar conversion
  // December 16, 2025 should be Tahsas 7, 2018
  
  let ethiopianDay;
  let ethiopianMonth;
  let ethiopianYear;
  
  if (gregorianMonth === 12) { // December
    // December 10 = Tahsas 1, December 16 = Tahsas 7
    ethiopianDay = gregorianDay - 9;
    ethiopianMonth = 6; // Tahsas
    ethiopianYear = gregorianYear - 7; // 2025 - 7 = 2018
    
    // Handle early December (still Hidar)
    if (ethiopianDay <= 0) {
      ethiopianDay = 30 + ethiopianDay; // Add to previous month's 30 days
      ethiopianMonth = 5; // Hidar
    }
  } else {
    // Use existing mapping for other months, but adjust based on the December fix
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
    
    ethiopianMonth = monthMapping[gregorianMonth] || 1;
    
    // Approximate day calculation (needs refinement for each month)
    ethiopianDay = gregorianDay - 9;
    if (ethiopianDay <= 0) {
      ethiopianDay = 30 + ethiopianDay;
      ethiopianMonth = ethiopianMonth - 1;
      if (ethiopianMonth < 1) {
        ethiopianMonth = 12;
      }
    }
    
    // Calculate Ethiopian year
    if (gregorianMonth >= 9) {
      ethiopianYear = gregorianYear - 7;
    } else {
      ethiopianYear = gregorianYear - 8;
    }
  }
  
  return { day: ethiopianDay, month: ethiopianMonth, year: ethiopianYear };
};