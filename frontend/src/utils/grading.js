// Grading system for branch performance
export const calculateGrade = (progressPercentage) => {
  if (progressPercentage >= 90) return { grade: 'A+', color: 'text-green-400', bgColor: 'bg-green-500/20', borderColor: 'border-green-400/30' };
  if (progressPercentage >= 80) return { grade: 'A', color: 'text-green-300', bgColor: 'bg-green-500/20', borderColor: 'border-green-400/30' };
  if (progressPercentage >= 70) return { grade: 'B+', color: 'text-blue-400', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-400/30' };
  if (progressPercentage >= 60) return { grade: 'B', color: 'text-blue-300', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-400/30' };
  if (progressPercentage >= 50) return { grade: 'C+', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-400/30' };
  if (progressPercentage >= 40) return { grade: 'C', color: 'text-yellow-300', bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-400/30' };
  if (progressPercentage >= 30) return { grade: 'D', color: 'text-orange-400', bgColor: 'bg-orange-500/20', borderColor: 'border-orange-400/30' };
  return { grade: 'F', color: 'text-red-400', bgColor: 'bg-red-500/20', borderColor: 'border-red-400/30' };
};

export const getGradeDescription = (grade, language = 'en') => {
  const descriptions = {
    'A+': { en: 'Outstanding', am: 'እጅግ በጣም ጥሩ' },
    'A': { en: 'Excellent', am: 'በጣም ጥሩ' },
    'B+': { en: 'Very Good', am: 'በጣም ጥሩ' },
    'B': { en: 'Good', am: 'ጥሩ' },
    'C+': { en: 'Above Average', am: 'ከመካከለኛ በላይ' },
    'C': { en: 'Average', am: 'መካከለኛ' },
    'D': { en: 'Below Average', am: 'ከመካከለኛ በታች' },
    'F': { en: 'Needs Improvement', am: 'መሻሻል ያስፈልጋል' }
  };
  
  return descriptions[grade]?.[language] || descriptions[grade]?.en || '';
};
