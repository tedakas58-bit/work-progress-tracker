# 📋 Action-Based Reporting System

## Overview

The system now supports **action-based reporting** where:
1. **Main branch** creates actions with plan numbers and target activities
2. **Branch users** report actual activities completed
3. **System automatically calculates** implementation percentage: (Actual / Plan) × 100%

## 🎯 Example Actions

### Action 1
- **Title**: Involve 1,317,376 community groups in consultation forums by coordinating, supporting and monitoring community-based consultations
- **Plan Number**: 120000
- **Plan Activity**: 1317376
- **Implementation**: Branch inputs actual activities → System calculates percentage

### Action 2
- **Title**: Raise awareness among community groups and organizations on peace, security and various topics; Involve them in dialogue and mobilization in discussion forums
- **Plan Number**: 144018
- **Plan Activity**: (Branch inputs target)
- **Implementation**: Branch inputs actual activities → System calculates percentage

## 📝 Workflow

### For Main Branch Admin

1. **Login** as admin
2. **Create Annual Plan** (if not already created)
3. **View Plan Details** → Click "Create Actions"
4. **Add Actions**:
   - Action Number (auto-numbered)
   - Action Title (description)
   - Plan Number (e.g., 120000)
   - Plan Activity (target, e.g., 1317376)
5. **Submit** → System creates action reports for all 10 branches for all 12 months

### For Branch Users

1. **Login** as branch user (branch1-10)
2. **Click "Action Reports"** button on dashboard
3. **View all assigned actions** for each month
4. **Click "Submit"** on any action
5. **Fill the form**:
   - **Actual Activity**: Enter number of activities completed
   - **Implementation %**: Auto-calculated (Actual / Plan × 100)
   - **Notes**: Optional comments
6. **Submit Report** → Sent to main branch

### For Main Branch (Viewing Reports)

1. **View Plan Details**
2. **See all action submissions** from all branches
3. **Compare branch performance**
4. **Track implementation percentages**

## 🔢 Calculation Example

**Action**: Involve community groups in consultation forums
- **Plan Number**: 120000
- **Plan Activity (Target)**: 1,317,376
- **Actual Activity (Branch Input)**: 1,200,000
- **Implementation %**: (1,200,000 / 1,317,376) × 100 = **91.09%**

## 📊 Features

### ✅ Automatic Calculations
- System calculates implementation percentage automatically
- No manual calculation needed
- Real-time percentage display

### ✅ Monthly Tracking
- Each action tracked monthly
- 12 months × Number of actions
- Deadline tracking per month

### ✅ Multi-Branch Support
- 10 branches report independently
- Each branch has own action reports
- Main branch sees all submissions

### ✅ Progress Visualization
- Progress bars for each action
- Color-coded status (pending/submitted/late)
- Implementation percentage display

### ✅ Flexible Reporting
- Edit submitted reports
- Add notes and comments
- Track submission timestamps

## 🎨 UI Components

### Main Branch Views
- **Create Actions Page**: Add multiple actions at once
- **Plan Details**: View all actions for a plan
- **Action Reports**: See all branch submissions
- **Branch Comparison**: Compare implementation across branches

### Branch User Views
- **Action Reports Dashboard**: See all assigned actions
- **Submit Action Report**: Fill actual activities
- **Auto-calculation Display**: See percentage in real-time
- **Status Tracking**: Pending/Submitted/Late indicators

## 📱 Navigation

### Main Branch
```
Dashboard → View Plan → Create Actions
Dashboard → View Plan → View Action Reports
Dashboard → Branch Comparison
```

### Branch Users
```
Dashboard → Action Reports → Submit Action
Dashboard → Action Reports → View/Edit Submitted
```

## 🔐 Access Control

- **Main Branch**: Can create actions, view all reports
- **Branch Users**: Can only submit their own action reports
- **Automatic**: System creates reports for all branches automatically

## 💡 Tips

1. **Create actions early** in the year so branches can start reporting
2. **Use clear action titles** so branches understand what to report
3. **Set realistic plan activities** as targets
4. **Review submissions regularly** to track progress
5. **Compare branches** to identify top performers

## 🚀 Getting Started

### Step 1: Create Actions (Main Branch)
```
1. Login as admin
2. Go to any annual plan
3. Click "Create Actions"
4. Add Action 1:
   - Title: "Involve community groups..."
   - Plan Number: 120000
   - Plan Activity: 1317376
5. Add Action 2:
   - Title: "Raise awareness..."
   - Plan Number: 144018
   - Plan Activity: (your target)
6. Click "Create Actions"
```

### Step 2: Submit Reports (Branch Users)
```
1. Login as branch1
2. Click "Action Reports"
3. Find Action 1 for January
4. Click "Submit"
5. Enter Actual Activity: 110000
6. See Implementation: 8.35%
7. Add notes (optional)
8. Submit
```

### Step 3: View Progress (Main Branch)
```
1. Login as admin
2. View plan details
3. See all action submissions
4. Compare branch performance
5. Track monthly progress
```

## 📈 Reporting Format

### Branch Submission Format
```
Action Number: 1
Action Title: Involve community groups...
Plan Number: 120000
Plan Activity (Target): 1,317,376
Actual Activity: [Branch inputs]
Implementation %: [Auto-calculated]
Notes: [Optional comments]
Status: Pending/Submitted/Late
```

### Main Branch View Format
```
Branch Name | Action | Plan # | Target | Actual | % | Status
Branch 1    | Act 1  | 120000 | 1.3M   | 1.2M   | 91% | Submitted
Branch 2    | Act 1  | 120000 | 1.3M   | 1.1M   | 83% | Submitted
...
```

## 🎯 Benefits

1. **Standardized Reporting**: All branches use same format
2. **Automatic Calculations**: No manual percentage calculations
3. **Real-time Tracking**: See progress as it happens
4. **Easy Comparison**: Compare branches side-by-side
5. **Historical Data**: Track progress over 12 months
6. **Deadline Management**: Know which reports are late
7. **Flexible Updates**: Edit reports after submission

## 🔄 System Flow

```
Main Branch Creates Actions
         ↓
System Creates Reports (10 branches × 12 months × N actions)
         ↓
Branch Users Submit Actual Activities
         ↓
System Calculates Implementation %
         ↓
Main Branch Views All Submissions
         ↓
Compare & Analyze Performance
```

---

**Your action-based reporting system is ready!** 🎉

Access at: http://localhost:3000
