import { getCurrentEthiopianDate } from './frontend/src/utils/ethiopianCalendar.js';

console.log('🗓️ Current Date Test');
console.log('='.repeat(40));

const currentEC = getCurrentEthiopianDate();
console.log(`Ethiopian Date: ${currentEC.day}/${currentEC.month}/${currentEC.year}`);

// Ethiopian months mapping
const ethiopianMonths = [
  'Hamle', 'Nehase', 'Meskerem', 'Tikimt', 'Hidar', 'Tahsas',
  'Tir', 'Yekatit', 'Megabit', 'Miazia', 'Ginbot', 'Sene'
];

const monthName = ethiopianMonths[currentEC.month - 1];
console.log(`Ethiopian Date (formatted): ${monthName} ${currentEC.day}, ${currentEC.year}`);
console.log(`Gregorian Date: ${new Date().toLocaleDateString()}`);

// Verify this matches the expected: Tahsas 7, 2018
const expected = 'Tahsas 7, 2018';
const actual = `${monthName} ${currentEC.day}, ${currentEC.year}`;

console.log('\n✅ VERIFICATION:');
console.log(`Expected: ${expected}`);
console.log(`Actual:   ${actual}`);
console.log(`Match:    ${actual === expected ? '✅ CORRECT' : '❌ INCORRECT'}`);

if (actual === expected) {
  console.log('\n🎯 Ethiopian calendar calculation is now CORRECT!');
  console.log('Today is indeed Tahsas 7, 2018 in the Ethiopian calendar.');
} else {
  console.log('\n⚠️ Ethiopian calendar calculation needs further adjustment.');
}