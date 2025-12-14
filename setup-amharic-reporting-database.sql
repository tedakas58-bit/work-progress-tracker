-- Complete Database Setup for Amharic Plan Reporting System
-- Run this in Supabase SQL Editor to ensure all tables are properly configured

-- 1. First, ensure the base tables exist (from main schema)
-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'main_branch', 'branch_user')),
    branch_name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Annual Plans Table
CREATE TABLE IF NOT EXISTS annual_plans (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    year INTEGER NOT NULL,
    target_amount DECIMAL(15, 2),
    target_units INTEGER,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Monthly Periods Table (required for activity reports)
CREATE TABLE IF NOT EXISTS monthly_periods (
    id SERIAL PRIMARY KEY,
    annual_plan_id INTEGER REFERENCES annual_plans(id) ON DELETE CASCADE,
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INTEGER NOT NULL,
    target_amount DECIMAL(15, 2),
    target_units INTEGER,
    deadline DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Add Amharic Plan columns to annual_plans
ALTER TABLE annual_plans ADD COLUMN IF NOT EXISTS plan_title_amharic TEXT;
ALTER TABLE annual_plans ADD COLUMN IF NOT EXISTS plan_description_amharic TEXT;
ALTER TABLE annual_plans ADD COLUMN IF NOT EXISTS plan_type VARCHAR(50) DEFAULT 'standard';
ALTER TABLE annual_plans ADD COLUMN IF NOT EXISTS plan_month INTEGER DEFAULT 1;

-- 3. Create Plan Activities Table (hierarchical structure like 3.2.1, 3.2.2)
CREATE TABLE IF NOT EXISTS plan_activities (
    id SERIAL PRIMARY KEY,
    annual_plan_id INTEGER REFERENCES annual_plans(id) ON DELETE CASCADE,
    activity_number VARCHAR(20) NOT NULL, -- e.g., "3.2.1", "3.2.2"
    activity_title_amharic TEXT NOT NULL,
    activity_description_amharic TEXT,
    target_number INTEGER DEFAULT 0,
    target_unit_amharic VARCHAR(100), -- e.g., "ሰዎች", "ቤተሰቦች"
    parent_activity_id INTEGER REFERENCES plan_activities(id),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create Activity Reports Table (for branch reporting on specific activities)
CREATE TABLE IF NOT EXISTS activity_reports (
    id SERIAL PRIMARY KEY,
    plan_activity_id INTEGER REFERENCES plan_activities(id) ON DELETE CASCADE,
    monthly_period_id INTEGER REFERENCES monthly_periods(id) ON DELETE CASCADE,
    branch_user_id INTEGER REFERENCES users(id),
    achieved_number INTEGER DEFAULT 0,
    achievement_percentage DECIMAL(5, 2) DEFAULT 0,
    notes_amharic TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'late')),
    submitted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create Plan Templates Table (for common Amharic plan structures)
CREATE TABLE IF NOT EXISTS plan_templates (
    id SERIAL PRIMARY KEY,
    template_name VARCHAR(255) NOT NULL,
    template_name_amharic VARCHAR(255) NOT NULL,
    template_structure JSONB, -- Stores the hierarchical structure
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_plan_activities_plan ON plan_activities(annual_plan_id);
CREATE INDEX IF NOT EXISTS idx_plan_activities_parent ON plan_activities(parent_activity_id);
CREATE INDEX IF NOT EXISTS idx_plan_activities_number ON plan_activities(activity_number);
CREATE INDEX IF NOT EXISTS idx_activity_reports_activity ON activity_reports(plan_activity_id);
CREATE INDEX IF NOT EXISTS idx_activity_reports_period ON activity_reports(monthly_period_id);
CREATE INDEX IF NOT EXISTS idx_activity_reports_user ON activity_reports(branch_user_id);
CREATE INDEX IF NOT EXISTS idx_monthly_periods_plan ON monthly_periods(annual_plan_id);

-- 7. Insert Sample Plan Template (based on your image structure)
INSERT INTO plan_templates (template_name, template_name_amharic, template_structure) 
VALUES ('Social Development Plan', 'የማህበራዊ የምክር ወደሊት እቅድ', 
'{
  "main_title": "ዓላማ፡- የማህበራዊ የምክር ወደሊት በማስተዋወቅ የማህበራዊ ያለተሳተፈ አባላት ተግባራዊ በማድረግ",
  "activities": [
    {
      "number": "3.2.1",
      "title": "12 ህብረተሰቦችን የሚሳተፉበትን የአላማና ዕየታ ርዕሰ ጉዳይ ጽሁፍን መልዕክት በቀጥር",
      "target": 1,
      "unit": "ክንውን"
    },
    {
      "number": "3.2.2", 
      "title": "የማህበራዊ ተክኖ ምክር በማስተዋወቅ በወደሊትና በወጣታ 1,317,376 የህብረተሰብ ክፍሎች በምክር ወደሊት ላይ ማሳተፍ፡",
      "target": 329344,
      "unit": "ሰዎች"
    },
    {
      "number": "3.2.3",
      "title": "የህዝብ የአካባቢ ቅጥር ጥበቦ ስራዎችን ምላመላ፡ ግንባታና ስምረት በምርት በማስተዋወቅ",
      "target": 97,
      "unit": "ስራዎች"
    }
  ]
}'::jsonb)
ON CONFLICT DO NOTHING;

-- 8. Verify Tables Exist
SELECT 
    'annual_plans' as table_name,
    COUNT(*) as record_count,
    'Main plans table' as description
FROM annual_plans
UNION ALL
SELECT 
    'plan_activities' as table_name,
    COUNT(*) as record_count,
    'Amharic plan activities' as description
FROM plan_activities
UNION ALL
SELECT 
    'activity_reports' as table_name,
    COUNT(*) as record_count,
    'Branch activity reports' as description
FROM activity_reports
UNION ALL
SELECT 
    'monthly_periods' as table_name,
    COUNT(*) as record_count,
    'Monthly periods for reporting' as description
FROM monthly_periods
UNION ALL
SELECT 
    'plan_templates' as table_name,
    COUNT(*) as record_count,
    'Plan templates' as description
FROM plan_templates
ORDER BY table_name;

-- 9. Check if Amharic columns exist in annual_plans
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'annual_plans' 
    AND column_name IN ('plan_title_amharic', 'plan_description_amharic', 'plan_type', 'plan_month')
ORDER BY column_name;

-- 10. Sample query to test the relationship
SELECT 
    ap.title as plan_title,
    ap.plan_title_amharic,
    pa.activity_number,
    pa.activity_title_amharic,
    pa.target_number,
    pa.target_unit_amharic
FROM annual_plans ap
LEFT JOIN plan_activities pa ON ap.id = pa.annual_plan_id
WHERE ap.plan_type = 'amharic_structured'
ORDER BY ap.id, pa.sort_order, pa.activity_number;

-- Success message
SELECT 'Database setup complete! All tables for Amharic Plan Reporting System are ready.' as status;