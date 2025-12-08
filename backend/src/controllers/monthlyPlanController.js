import pool from '../database/db.js';

// Automatically calculate current Ethiopian month from system date
// Ethiopian Government Fiscal Year: Hamle (July) = Month 1
const getCurrentEthiopianMonth = () => {
  const now = new Date();
  const gregorianMonth = now.getMonth() + 1; // 1-12
  
  // Ethiopian Government Fiscal Year mapping:
  // July (7) = Hamle (1), August (8) = Nehase (2), September (9) = Meskerem (3)
  // October (10) = Tikimt (4), November (11) = Hidar (5), December (12) = Tahsas (6)
  // January (1) = Tir (7), February (2) = Yekatit (8), March (3) = Megabit (9)
  // April (4) = Miazia (10), May (5) = Ginbot (11), June (6) = Sene (12)
  
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
  
  return monthMapping[gregorianMonth] || 1;
};

// Automatically calculate current Ethiopian year
const getCurrentEthiopianYear = () => {
  const now = new Date();
  const gregorianYear = now.getFullYear();
  const gregorianMonth = now.getMonth() + 1;
  
  // Ethiopian year is 7-8 years behind Gregorian
  // From September to December: Ethiopian year = Gregorian year - 7
  // From January to August: Ethiopian year = Gregorian year - 8
  
  if (gregorianMonth >= 9) {
    return gregorianYear - 7;
  } else {
    return gregorianYear - 8;
  }
};

// Calculate deadline (18th of the month)
const getDeadlineForMonth = (month, year) => {
  return new Date(year, month - 1, 18);
};

/**
 * Auto-create monthly plan for current month if it doesn't exist
 * This runs automatically when the system starts or when checking for plans
 */
export const autoCreateMonthlyPlan = async (client = null) => {
  const shouldReleaseClient = !client;
  if (!client) {
    client = await pool.connect();
  }
  
  try {
    const currentMonth = getCurrentEthiopianMonth();
    const currentYear = getCurrentEthiopianYear();
    
    // Check if a plan already exists for current month
    const existingPlan = await client.query(
      `SELECT id FROM monthly_plans WHERE month = $1 AND year = $2`,
      [currentMonth, currentYear]
    );
    
    if (existingPlan.rows.length > 0) {
      console.log(`Monthly plan already exists for month ${currentMonth}`);
      return existingPlan.rows[0];
    }
    
    // Get the previous month's plan to copy target values
    let previousMonth = currentMonth - 1;
    let previousYear = currentYear;
    
    if (previousMonth < 1) {
      previousMonth = 12;
      previousYear = currentYear - 1;
    }
    
    const previousPlan = await client.query(
      `SELECT target_amount FROM monthly_plans 
       WHERE month = $1 AND year = $2 
       ORDER BY created_at DESC LIMIT 1`,
      [previousMonth, previousYear]
    );
    
    // Use previous month's target or default to 0
    const targetAmount = previousPlan.rows.length > 0 
      ? previousPlan.rows[0].target_amount 
      : 0;
    
    const deadline = getDeadlineForMonth(currentMonth, currentYear);
    
    // Create new monthly plan
    const newPlan = await client.query(
      `INSERT INTO monthly_plans (
        title, description, month, year, target_amount, deadline, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        `Monthly Plan - Month ${currentMonth}`,
        `Auto-generated monthly plan for Ethiopian month ${currentMonth}`,
        currentMonth,
        currentYear,
        targetAmount,
        deadline,
        'active'
      ]
    );
    
    const plan = newPlan.rows[0];
    
    // Create reports for all branch users
    const branchUsers = await client.query(
      `SELECT id FROM users WHERE role = 'branch_user'`
    );
    
    for (const user of branchUsers.rows) {
      await client.query(
        `INSERT INTO monthly_reports (monthly_plan_id, branch_user_id, status)
         VALUES ($1, $2, $3)`,
        [plan.id, user.id, 'pending']
      );
    }
    
    console.log(`✅ Auto-created monthly plan for month ${currentMonth}, year ${currentYear}`);
    return plan;
    
  } catch (error) {
    console.error('Auto-create monthly plan error:', error);
    throw error;
  } finally {
    if (shouldReleaseClient) {
      client.release();
    }
  }
};

/**
 * Check if it's time to start next month (on the 20th)
 * Deadline is 18th, but next month starts on 20th (2-day gap)
 */
export const checkAndRenewMonthlyPlan = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const currentMonth = getCurrentEthiopianMonth();
    const currentYear = getCurrentEthiopianYear();
    const today = new Date();
    const currentDay = today.getDate();
    
    // Get current active plan
    const activePlan = await client.query(
      `SELECT * FROM monthly_plans 
       WHERE month = $1 AND year = $2 AND status = 'active'`,
      [currentMonth, currentYear]
    );
    
    if (activePlan.rows.length === 0) {
      // No active plan, create one
      await autoCreateMonthlyPlan(client);
      await client.query('COMMIT');
      return;
    }
    
    const plan = activePlan.rows[0];
    
    // Check if it's the 20th or later (time to start next month)
    // Deadline is 18th, next month starts on 20th
    if (currentDay >= 20) {
      console.log(`It's day ${currentDay}. Time to start next month. Archiving month ${currentMonth}...`);
      
      // Archive current plan
      await client.query(
        `UPDATE monthly_plans SET status = 'archived' WHERE id = $1`,
        [plan.id]
      );
      
      // Calculate next month
      let nextMonth = currentMonth + 1;
      let nextYear = currentYear;
      
      if (nextMonth > 12) {
        nextMonth = 1;
        nextYear = currentYear + 1;
      }
      
      // Check if next month's plan already exists
      const existingNextPlan = await client.query(
        `SELECT id FROM monthly_plans WHERE month = $1 AND year = $2`,
        [nextMonth, nextYear]
      );
      
      if (existingNextPlan.rows.length > 0) {
        console.log(`Next month plan already exists for month ${nextMonth}`);
        await client.query('COMMIT');
        return;
      }
      
      // Create next month's plan with same target
      const nextDeadline = getDeadlineForMonth(nextMonth, nextYear);
      
      const newPlan = await client.query(
        `INSERT INTO monthly_plans (
          title, description, month, year, target_amount, deadline, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
          `Monthly Plan - Month ${nextMonth}`,
          `Auto-generated monthly plan for Ethiopian month ${nextMonth}`,
          nextMonth,
          nextYear,
          plan.target_amount, // Copy target from previous month
          nextDeadline,
          'active'
        ]
      );
      
      const nextPlan = newPlan.rows[0];
      
      // Create reports for all branch users
      const branchUsers = await client.query(
        `SELECT id FROM users WHERE role = 'branch_user'`
      );
      
      for (const user of branchUsers.rows) {
        await client.query(
          `INSERT INTO monthly_reports (monthly_plan_id, branch_user_id, status)
           VALUES ($1, $2, $3)`,
          [nextPlan.id, user.id, 'pending']
        );
      }
      
      console.log(`✅ Created new plan for month ${nextMonth}, year ${nextYear} (starts on 20th)`);
    }
    
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Check and renew monthly plan error:', error);
  } finally {
    client.release();
  }
};

/**
 * Get current active monthly plan
 */
export const getCurrentMonthlyPlan = async (req, res) => {
  try {
    // Ensure current month plan exists
    await autoCreateMonthlyPlan();
    
    const currentMonth = getCurrentEthiopianMonth();
    const currentYear = getCurrentEthiopianYear();
    
    const result = await pool.query(
      `SELECT * FROM monthly_plans 
       WHERE month = $1 AND year = $2 AND status = 'active'
       ORDER BY created_at DESC LIMIT 1`,
      [currentMonth, currentYear]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No active monthly plan found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get current monthly plan error:', error);
    res.status(500).json({ error: 'Failed to get current monthly plan' });
  }
};

/**
 * Update monthly plan target (main branch only)
 */
export const updateMonthlyPlanTarget = async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { targetAmount } = req.body;
    const currentMonth = getCurrentEthiopianMonth();
    const currentYear = getCurrentEthiopianYear();
    
    // Update current month's plan
    const result = await client.query(
      `UPDATE monthly_plans 
       SET target_amount = $1, updated_at = CURRENT_TIMESTAMP
       WHERE month = $2 AND year = $3 AND status = 'active'
       RETURNING *`,
      [targetAmount, currentMonth, currentYear]
    );
    
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'No active monthly plan found' });
    }
    
    await client.query('COMMIT');
    res.json({ message: 'Monthly plan updated successfully', plan: result.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Update monthly plan error:', error);
    res.status(500).json({ error: 'Failed to update monthly plan' });
  } finally {
    client.release();
  }
};

/**
 * Get all monthly plans (for history/reports)
 */
export const getAllMonthlyPlans = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM monthly_plans 
       ORDER BY year DESC, month DESC`
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get all monthly plans error:', error);
    res.status(500).json({ error: 'Failed to get monthly plans' });
  }
};

/**
 * Get monthly plan statistics
 */
export const getMonthlyPlanStats = async (req, res) => {
  try {
    const { planId } = req.params;
    
    const stats = await pool.query(
      `SELECT 
        mp.*,
        COUNT(mr.id) as total_reports,
        COUNT(CASE WHEN mr.status = 'submitted' THEN 1 END) as submitted_reports,
        COUNT(CASE WHEN mr.status = 'pending' THEN 1 END) as pending_reports,
        COUNT(CASE WHEN mr.status = 'late' THEN 1 END) as late_reports,
        SUM(mr.achieved_amount) as total_achieved,
        AVG(mr.progress_percentage) as avg_progress
       FROM monthly_plans mp
       LEFT JOIN monthly_reports mr ON mr.monthly_plan_id = mp.id
       WHERE mp.id = $1
       GROUP BY mp.id`,
      [planId]
    );
    
    if (stats.rows.length === 0) {
      return res.status(404).json({ error: 'Monthly plan not found' });
    }
    
    res.json(stats.rows[0]);
  } catch (error) {
    console.error('Get monthly plan stats error:', error);
    res.status(500).json({ error: 'Failed to get monthly plan statistics' });
  }
};
