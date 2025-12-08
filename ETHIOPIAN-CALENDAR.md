# Ethiopian Calendar Configuration

## Current Month Setting

The system filters reports to show only **upcoming months** based on the Ethiopian calendar.

### How to Update the Current Month

When a new Ethiopian month begins, update the `CURRENT_ETHIOPIAN_MONTH` constant in:

**File**: `frontend/src/utils/ethiopianCalendar.js`

```javascript
export const CURRENT_ETHIOPIAN_MONTH = 5; // Update this number (1-13)
```

### Ethiopian Calendar Months

| Number | Amharic | English | Gregorian Equivalent |
|--------|---------|---------|---------------------|
| 1 | መስከረም | Meskerem | Sep 11 - Oct 10 |
| 2 | ጥቅምት | Tikimt | Oct 11 - Nov 9 |
| 3 | ኅዳር | Hidar | Nov 10 - Dec 9 |
| 4 | ታኅሣሥ | Tahsas | Dec 10 - Jan 8 |
| 5 | ጥር | Tir | Jan 9 - Feb 7 |
| 6 | የካቲት | Yekatit | Feb 8 - Mar 9 |
| 7 | መጋቢት | Megabit | Mar 10 - Apr 8 |
| 8 | ሚያዝያ | Miazia | Apr 9 - May 8 |
| 9 | ግንቦት | Ginbot | May 9 - Jun 7 |
| 10 | ሰኔ | Sene | Jun 8 - Jul 7 |
| 11 | ሐምሌ | Hamle | Jul 8 - Aug 6 |
| 12 | ነሐሴ | Nehase | Aug 7 - Sep 5 |
| 13 | ጳጉሜን | Pagumen | Sep 6 - Sep 10 (5-6 days) |

### Current Status

**Current Month**: 5 (ጥር - Tir)  
**Visible Months**: 6-12 (የካቲት through ነሐሴ)  
**Hidden Months**: 1-5 (Past months)

### How It Works

1. When branch users view their dashboard, only reports for **future months** are displayed
2. Past months (1 through current month) are automatically hidden
3. This prevents clutter and focuses on upcoming work

### Monthly Update Process

At the beginning of each Ethiopian month:

1. Open `frontend/src/utils/ethiopianCalendar.js`
2. Update `CURRENT_ETHIOPIAN_MONTH` to the new month number
3. Commit and push changes
4. Vercel will auto-deploy the update

Example:
```bash
# When የካቲት (month 6) begins
cd work-progress-tracker
# Edit frontend/src/utils/ethiopianCalendar.js
# Change: export const CURRENT_ETHIOPIAN_MONTH = 6;
git add .
git commit -m "Update Ethiopian calendar to month 6 (የካቲት)"
git push origin main
```

### Deadline Configuration

Monthly deadlines are set to the **18th day** of each Ethiopian month (as configured in the backend).

This aligns with Ethiopian calendar where each month has 30 days (except Pagumen with 5-6 days).
