-- Update branch names from English to Amharic administrative terms
-- Branch 1-11 → ወረዳ 1-11 (Woreda 1-11)
-- Main Branch → ክፍለ ከተማ (Sub-city)

-- Update branch names in users table
UPDATE users SET branch_name = 'ወረዳ 1' WHERE branch_name = 'Branch 1';
UPDATE users SET branch_name = 'ወረዳ 2' WHERE branch_name = 'Branch 2';
UPDATE users SET branch_name = 'ወረዳ 3' WHERE branch_name = 'Branch 3';
UPDATE users SET branch_name = 'ወረዳ 4' WHERE branch_name = 'Branch 4';
UPDATE users SET branch_name = 'ወረዳ 5' WHERE branch_name = 'Branch 5';
UPDATE users SET branch_name = 'ወረዳ 6' WHERE branch_name = 'Branch 6';
UPDATE users SET branch_name = 'ወረዳ 7' WHERE branch_name = 'Branch 7';
UPDATE users SET branch_name = 'ወረዳ 8' WHERE branch_name = 'Branch 8';
UPDATE users SET branch_name = 'ወረዳ 9' WHERE branch_name = 'Branch 9';
UPDATE users SET branch_name = 'ወረዳ 10' WHERE branch_name = 'Branch 10';
UPDATE users SET branch_name = 'ወረዳ 11' WHERE branch_name = 'branch11';
UPDATE users SET branch_name = 'ክፍለ ከተማ' WHERE branch_name = 'Main Branch';

-- Verify the changes
SELECT 
    'Updated Branch Names' as status,
    branch_name,
    COUNT(*) as user_count
FROM users 
GROUP BY branch_name
ORDER BY branch_name;