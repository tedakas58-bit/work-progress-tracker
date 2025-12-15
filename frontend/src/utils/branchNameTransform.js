// Utility function to transform branch names to Ethiopian administrative terms

export const transformBranchName = (branchName, language = 'am') => {
  if (!branchName) return branchName;
  
  if (language === 'am') {
    // Transform to Amharic
    if (branchName === 'Main Branch') return 'ክፍለ ከተማ';
    if (branchName.startsWith('Branch ')) {
      const number = branchName.replace('Branch ', '');
      return `ወረዳ ${number}`;
    }
    if (branchName.toLowerCase().startsWith('branch')) {
      const number = branchName.replace(/branch/i, '').trim();
      return `ወረዳ ${number}`;
    }
    // Handle case where branch name is already in Amharic
    if (branchName.startsWith('ወረዳ ') || branchName === 'ክፍለ ከተማ') {
      return branchName;
    }
  } else {
    // Transform to English
    if (branchName === 'Main Branch') return 'Sub-city';
    if (branchName === 'ክፍለ ከተማ') return 'Sub-city';
    if (branchName.startsWith('Branch ')) {
      const number = branchName.replace('Branch ', '');
      return `Woreda ${number}`;
    }
    if (branchName.toLowerCase().startsWith('branch')) {
      const number = branchName.replace(/branch/i, '').trim();
      return `Woreda ${number}`;
    }
    if (branchName.startsWith('ወረዳ ')) {
      const number = branchName.replace('ወረዳ ', '');
      return `Woreda ${number}`;
    }
  }
  
  return branchName;
};

// Helper function to get the appropriate term for "Branch" based on language
export const getBranchTerm = (language = 'am') => {
  return language === 'am' ? 'ወረዳ' : 'Woreda';
};

// Helper function to get the appropriate term for "Main Branch" based on language
export const getMainBranchTerm = (language = 'am') => {
  return language === 'am' ? 'ክፍለ ከተማ' : 'Sub-city';
};