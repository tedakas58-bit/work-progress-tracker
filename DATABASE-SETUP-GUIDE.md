# የመረጃ ቋት ማዋቀሪያ መመሪያ
# Database Setup Guide for Amharic Plan Reporting System

## 🔍 የመረጃ ቋት ማረጋገጫ (Database Verification)

### 1️⃣ የመረጃ ቋት መዋቅር ማረጋገጫ (Verify Database Structure)

በ Supabase SQL Editor ውስጥ ይህንን ይሂዱ:
```sql
-- Copy and paste from: verify-database-structure.sql
```

### 2️⃣ የሚፈለጉ ሰንጠረዦች (Required Tables)

የአማርኛ እቅድ ሪፖርት ሲስተም የሚከተሉትን ሰንጠረዦች ይፈልጋል:

✅ **annual_plans** - የዓመታዊ እቅዶች
- ✅ plan_title_amharic (TEXT)
- ✅ plan_description_amharic (TEXT) 
- ✅ plan_type (VARCHAR) - 'amharic_structured'
- ✅ plan_month (INTEGER)

✅ **plan_activities** - የእቅድ እንቅስቃሴዎች
- ✅ activity_number (VARCHAR) - "3.2.1", "3.2.2"
- ✅ activity_title_amharic (TEXT)
- ✅ target_number (INTEGER) - ዒላማ ቁጥር
- ✅ target_unit_amharic (VARCHAR) - ሰዎች, ቤተሰቦች

✅ **activity_reports** - የእንቅስቃሴ ሪፖርቶች
- ✅ achieved_number (INTEGER) - የተሳካ ቁጥር
- ✅ achievement_percentage (DECIMAL)
- ✅ notes_amharic (TEXT)
- ✅ status (VARCHAR) - pending/submitted/late

✅ **monthly_periods** - የወር ጊዜዎች
✅ **users** - ተጠቃሚዎች
✅ **plan_templates** - የእቅድ አብነቶች

## 🛠️ የመረጃ ቋት ማዋቀሪያ (Database Setup)

### አማራጭ 1: ራስ-ሰር ማዋቀሪያ (Automatic Setup)

በ Supabase SQL Editor ውስጥ ይህንን ይሂዱ:
```sql
-- Copy and paste from: setup-amharic-reporting-database.sql
```

### አማራጭ 2: ተጨማሪ ሰንጠረዦች ብቻ (Additional Tables Only)

ዋና ሰንጠረዦች ካሉ፣ ይህንን ይሂዱ:
```sql
-- Copy and paste from: backend/src/database/amharic-plan-schema.sql
```

## 🔧 የመረጃ ቋት ማረጋገጫ ደረጃዎች (Database Verification Steps)

### ደረጃ 1: ሰንጠረዦች ማረጋገጫ (Verify Tables)
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name IN ('annual_plans', 'plan_activities', 'activity_reports', 'monthly_periods');
```

**የሚጠበቅ ውጤት (Expected Result):**
```
annual_plans
plan_activities  
activity_reports
monthly_periods
```

### ደረጃ 2: የአማርኛ አምዶች ማረጋገጫ (Verify Amharic Columns)
```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'annual_plans' 
    AND column_name LIKE '%amharic%' OR column_name = 'plan_type';
```

**የሚጠበቅ ውጤት (Expected Result):**
```
plan_title_amharic
plan_description_amharic
plan_type
plan_month
```

### ደረጃ 3: የግንኙነት ማረጋገጫ (Verify Relationships)
```sql
SELECT 
    ap.title,
    COUNT(pa.id) as activity_count
FROM annual_plans ap
LEFT JOIN plan_activities pa ON ap.id = pa.annual_plan_id
GROUP BY ap.id, ap.title;
```

## 🚨 የተለመዱ ችግሮች እና መፍትሄዎች (Common Issues & Solutions)

### ችግር 1: ሰንጠረዦች የሉም (Tables Don't Exist)
**መፍትሄ:** `setup-amharic-reporting-database.sql` ይሂዱ

### ችግር 2: የአማርኛ አምዶች የሉም (Amharic Columns Missing)
**መፍትሄ:**
```sql
ALTER TABLE annual_plans ADD COLUMN IF NOT EXISTS plan_title_amharic TEXT;
ALTER TABLE annual_plans ADD COLUMN IF NOT EXISTS plan_description_amharic TEXT;
ALTER TABLE annual_plans ADD COLUMN IF NOT EXISTS plan_type VARCHAR(50) DEFAULT 'standard';
ALTER TABLE annual_plans ADD COLUMN IF NOT EXISTS plan_month INTEGER DEFAULT 1;
```

### ችግር 3: የግንኙነት ስህተቶች (Foreign Key Errors)
**መፍትሄ:** ሰንጠረዦች በትክክለኛ ቅደም ተከተል መፈጠራቸውን ያረጋግጡ:
1. users
2. annual_plans  
3. monthly_periods
4. plan_activities
5. activity_reports

## ✅ የስኬት ማረጋገጫ (Success Verification)

የመረጃ ቋት ትክክል ከሆነ፣ ይህ ጥያቄ ውጤት ይሰጣል:
```sql
SELECT 
    'Database Ready!' as status,
    COUNT(DISTINCT table_name) as table_count
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name IN ('annual_plans', 'plan_activities', 'activity_reports', 'monthly_periods', 'plan_templates');
```

**የሚጠበቅ ውጤት:** `table_count = 5`

## 📊 የናሙና መረጃ (Sample Data)

የሲስተሙን ሙከራ ለማድረግ፣ የናሙና የአማርኛ እቅድ ይፍጠሩ:

1. **ዋና ቅርንጫፍ (Main Branch):**
   - "የአማርኛ እቅድ ፍጠር" ይጫኑ
   - የእቅድ መረጃዎችን ያስገቡ
   - እንቅስቃሴዎችን ይጨምሩ (3.2.1, 3.2.2, ወዘተ)
   - ዒላማ ቁጥሮችን ያስቀምጡ

2. **የቅርንጫፍ ተጠቃሚ (Branch User):**
   - "የአማርኛ እቅድ ሪፖርቶች" ይጫኑ
   - የተመደቡ እቅዶችን ይመልከቱ
   - "ሪፖርት አድርግ" ይጫኑ
   - የተሳካ ቁጥሮችን ያስገቡ

## 🎯 የመጨረሻ ማረጋገጫ (Final Verification)

ሁሉም ነገር ትክክል ከሆነ:
- ✅ ዋና ቅርንጫፍ የአማርኛ እቅዶችን መፍጠር ይችላል
- ✅ ቅርንጫፍ ተጠቃሚዎች ዒላማ ቁጥሮችን ማየት ይችላሉ
- ✅ ቅርንጫፍ ተጠቃሚዎች የእንቅስቃሴ ሪፖርቶችን ማስገባት ይችላሉ
- ✅ የእድገት መቶኛ ራስ-ሰር ይሰላል

---

## 📞 ድጋፍ (Support)

የመረጃ ቋት ችግሮች ካሉ:
1. `verify-database-structure.sql` ይሂዱ
2. ስህተቶችን ይመልከቱ
3. `setup-amharic-reporting-database.sql` ይሂዱ
4. እንደገና ይሞክሩ

የመረጃ ቋት ትክክል ከሆነ፣ የአማርኛ እቅድ ሪፖርት ሲስተም ሙሉ በሙሉ ይሰራል! 🚀