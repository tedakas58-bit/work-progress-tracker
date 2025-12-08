# Deadline System - Ethiopian Calendar

## Current System (CORRECTED)

### Timeline for Each Month:

```
Day 1-18:  📝 Active reporting period
Day 18:    ⏰ DEADLINE - Last day to submit reports
Day 19:    📊 Review period (late submissions still accepted but marked "Late")
Day 20:    🔄 NEW MONTH STARTS - Previous month archived, next month activated
```

### Example: Month 6 (ታህሳስ/Tahsas)

**Today**: ህዳር 29, 2018 (Hidar 29, 2018)

**Month 6 Timeline**:
- **ታህሳስ 1-18**: Active period for Month 6 reports
- **ታህሳስ 18**: DEADLINE - Submit by end of day
- **ታህሳስ 19**: Grace period (submissions marked "Late")
- **ታህሳስ 20**: Month 7 (ጥር/Tir) starts automatically

### Days Remaining:
From ህዳር 29 to ታህሳስ 18:
- 1 day left in ህዳር (day 30)
- 18 days in ታህሳስ
- **Total: 19 days until deadline**

## Report Status Logic

### Submission Status:
1. **Pending** (በመጠባበቅ ላይ)
   - Report not yet submitted
   - Before deadline

2. **Submitted** (ገብቷል)
   - Submitted on or before day 18
   - On-time submission ✅

3. **Late** (ዘግይቷል)
   - Submitted after day 18
   - Late submission ⚠️

## Auto-Renewal Process

### What Happens on Day 20:

1. **Archive Current Month**
   - Month 6 status changes to "archived"
   - All reports preserved in history
   - Statistics frozen

2. **Create Next Month**
   - Month 7 plan created automatically
   - Target numbers copied from Month 6
   - New deadline set (ጥር 18)
   - 10 new reports created (1 per branch)

3. **System Updates**
   - Dashboard shows Month 7
   - Branches see new reporting period
   - Previous month accessible in history

## Monthly Cycle

```
Month 1 (ሐምሌ/Hamle):     Deadline: ሐምሌ 18    → Next starts: ሐምሌ 20
Month 2 (ነሐሴ/Nehase):     Deadline: ነሐሴ 18    → Next starts: ነሐሴ 20
Month 3 (መስከረም/Meskerem): Deadline: መስከረም 18  → Next starts: መስከረም 20
Month 4 (ጥቅምት/Tikimt):    Deadline: ጥቅምት 18   → Next starts: ጥቅምት 20
Month 5 (ኅዳር/Hidar):      Deadline: ኅዳር 18    → Next starts: ኅዳር 20
Month 6 (ታኅሣሥ/Tahsas):    Deadline: ታኅሣሥ 18   → Next starts: ታኅሣሥ 20
Month 7 (ጥር/Tir):         Deadline: ጥር 18     → Next starts: ጥር 20
Month 8 (የካቲት/Yekatit):   Deadline: የካቲት 18   → Next starts: የካቲት 20
Month 9 (መጋቢት/Megabit):   Deadline: መጋቢት 18   → Next starts: መጋቢት 20
Month 10 (ሚያዝያ/Miazia):   Deadline: ሚያዝያ 18   → Next starts: ሚያዝያ 20
Month 11 (ግንቦት/Ginbot):   Deadline: ግንቦት 18   → Next starts: ግንቦት 20
Month 12 (ሰኔ/Sene):       Deadline: ሰኔ 18     → Next starts: ሰኔ 20
```

## Benefits of 2-Day Gap

### Day 18 (Deadline):
- Branches submit final reports
- Last chance for on-time submission

### Day 19 (Review Day):
- Main branch reviews submissions
- Late submissions still accepted
- Time to follow up with pending branches

### Day 20 (New Month):
- Clean start for next month
- Previous month fully closed
- New reporting period begins

## Technical Implementation

### Backend Logic:
```javascript
// Check current day
if (currentDay >= 20) {
  // Archive current month
  // Create next month
  // Copy target numbers
  // Create new reports
}
```

### Automatic Checks:
- System checks every hour
- Runs on server startup
- No manual intervention needed

## Zero Maintenance

The system is fully automatic:
- ✅ Detects current Ethiopian month from system date
- ✅ Calculates deadlines automatically
- ✅ Archives old months on day 20
- ✅ Creates new months on day 20
- ✅ Copies target numbers
- ✅ Creates reports for all branches

No code changes needed each month!

## Current Status

**Today**: ህዳር 29, 2018
**Active Month**: Month 5 (ኅዳር/Hidar)
**Next Month**: Month 6 (ታኅሣሥ/Tahsas)
**Next Deadline**: ታኅሣሥ 18, 2018
**Next Month Starts**: ታኅሣሥ 20, 2018

**Days until Month 6 deadline**: 19 days
