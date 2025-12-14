import pool from '../database/db.js';

export const createAnnualPlan = async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { title, description, year, targetAmount } = req.body;
    
    // Create annual plan (targetUnits set to 0 for backward compatibility)
    const planResult = await client.query(
      `INSERT INTO annual_plans (title, description, year, target_amount, target_units, created_by)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, description, year, targetAmount, 0, req.user.id]
    );
    
    const plan = planResult.rows[0];
    
    // Auto-generate 12 monthly periods
    const monthlyTarget = targetAmount / 12;
    const monthlyUnits = 0;
    
    for (let month = 1; month <= 12; month++) {
      // Ethiopian calendar: deadline is 18th of each month
      // Ethiopian months have 30 days each (except the 13th month)
      const deadline = new Date(year, month - 1, 18); // 18th day of each month
      
      await client.query(
        `INSERT INTO monthly_periods (annual_plan_id, month, year, target_amount, target_units, deadline)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [plan.id, month, year, monthlyTarget, monthlyUnits, deadline]
      );
    }
    
    // Create quarterly aggregations
    for (let quarter = 1; quarter <= 4; quarter++) {
      await client.query(
        `INSERT INTO quarterly_aggregations (annual_plan_id, quarter, year)
         VALUES ($1, $2, $3)`,
        [plan.id, quarter, year]
      );
    }
    
    // Create annual aggregation
    await client.query(
      `INSERT INTO annual_aggregations (annual_plan_id)
       VALUES ($1)`,
      [plan.id]
    );
    
    // Create monthly reports for all branch users
    const branchUsers = await client.query(
      `SELECT id FROM users WHERE role = 'branch_user'`
    );
    
    const monthlyPeriods = await client.query(
      `SELECT id FROM monthly_periods WHERE annual_plan_id = $1`,
      [plan.id]
    );
    
    for (const period of monthlyPeriods.rows) {
      for (const user of branchUsers.rows) {
        await client.query(
          `INSERT INTO monthly_reports (monthly_period_id, branch_user_id)
           VALUES ($1, $2)`,
          [period.id, user.id]
        );
      }
    }
    
    await client.query('COMMIT');
    
    res.status(201).json({ message: 'Annual plan created successfully', plan });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create annual plan error:', error);
    res.status(500).json({ error: 'Failed to create annual plan' });
  } finally {
    client.release();
  }
};

export const getAnnualPlans = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ap.*, u.username as creator_name 
       FROM annual_plans ap
       LEFT JOIN users u ON ap.created_by = u.id
       ORDER BY ap.year DESC, ap.created_at DESC`
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get annual plans error:', error);
    res.status(500).json({ error: 'Failed to get annual plans' });
  }
};

export const getAnnualPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const planResult = await pool.query(
      `SELECT ap.*, u.username as creator_name,
              aa.total_achieved_amount, aa.total_achieved_units, aa.progress_percentage
       FROM annual_plans ap
       LEFT JOIN users u ON ap.created_by = u.id
       LEFT JOIN annual_aggregations aa ON aa.annual_plan_id = ap.id
       WHERE ap.id = $1`,
      [id]
    );
    
    if (planResult.rows.length === 0) {
      return res.status(404).json({ error: 'Annual plan not found' });
    }
    
    const monthlyPeriods = await pool.query(
      `SELECT * FROM monthly_periods WHERE annual_plan_id = $1 ORDER BY month`,
      [id]
    );
    
    const quarterlyData = await pool.query(
      `SELECT * FROM quarterly_aggregations WHERE annual_plan_id = $1 ORDER BY quarter`,
      [id]
    );
    
    res.json({
      plan: planResult.rows[0],
      monthlyPeriods: monthlyPeriods.rows,
      quarterlyData: quarterlyData.rows
    });
  } catch (error) {
    console.error('Get annual plan error:', error);
    res.status(500).json({ error: 'Failed to get annual plan' });
  }
};

// Get plan activities for a specific plan
export const getPlanActivities = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `SELECT * FROM plan_activities WHERE annual_plan_id = $1 ORDER BY sort_order, activity_number`,
      [id]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get plan activities error:', error);
    res.status(500).json({ error: 'Failed to get plan activities' });
  }
};

// Update Amharic structured plan
export const updateAmharicPlan = async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    const { title, title_amharic, description_amharic, year, month, plan_type, activities } = req.body;
    
    // Update the annual plan
    await client.query(
      `UPDATE annual_plans 
       SET title = $1, plan_title_amharic = $2, plan_description_amharic = $3, 
           year = $4, plan_month = $5, plan_type = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7`,
      [title, title_amharic, description_amharic, year, month || 1, plan_type || 'amharic_structured', id]
    );

    // Delete existing activities
    await client.query('DELETE FROM plan_activities WHERE annual_plan_id = $1', [id]);

    // Insert updated activities
    for (let i = 0; i < activities.length; i++) {
      const activity = activities[i];
      await client.query(
        `INSERT INTO plan_activities (annual_plan_id, activity_number, activity_title_amharic, target_number, target_unit_amharic, sort_order) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [id, activity.activity_number, activity.activity_title_amharic, activity.target_number, activity.target_unit_amharic, i]
      );
    }

    await client.query('COMMIT');

    res.json({ message: 'Amharic plan updated successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Update Amharic plan error:', error);
    res.status(500).json({ error: 'Failed to update Amharic plan' });
  } finally {
    client.release();
  }
};

// Delete Amharic structured plan
export const deleteAmharicPlan = async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    
    // Delete activity reports first (foreign key constraint)
    await client.query(
      `DELETE FROM activity_reports 
       WHERE plan_activity_id IN (
         SELECT id FROM plan_activities WHERE annual_plan_id = $1
       )`,
      [id]
    );
    
    // Delete plan activities
    await client.query('DELETE FROM plan_activities WHERE annual_plan_id = $1', [id]);
    
    // Delete the plan itself
    await client.query('DELETE FROM annual_plans WHERE id = $1 AND plan_type = $2', [id, 'amharic_structured']);

    await client.query('COMMIT');

    res.json({ message: 'Amharic plan deleted successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Delete Amharic plan error:', error);
    res.status(500).json({ error: 'Failed to delete Amharic plan' });
  } finally {
    client.release();
  }
};

// Delete all Amharic structured plans and reports
export const deleteAllAmharicPlans = async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Delete all activity reports for Amharic plans
    await client.query(
      `DELETE FROM activity_reports 
       WHERE plan_activity_id IN (
         SELECT pa.id FROM plan_activities pa
         JOIN annual_plans ap ON pa.annual_plan_id = ap.id
         WHERE ap.plan_type = 'amharic_structured'
       )`
    );
    
    // Delete all plan activities for Amharic plans
    await client.query(
      `DELETE FROM plan_activities 
       WHERE annual_plan_id IN (
         SELECT id FROM annual_plans WHERE plan_type = 'amharic_structured'
       )`
    );
    
    // Delete all Amharic plans
    await client.query(`DELETE FROM annual_plans WHERE plan_type = 'amharic_structured'`);

    await client.query('COMMIT');

    res.json({ message: 'All Amharic plans and reports deleted successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Delete all Amharic plans error:', error);
    res.status(500).json({ error: 'Failed to delete all Amharic plans' });
  } finally {
    client.release();
  }
};

// Create new Amharic structured plan
export const createAmharicPlan = async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { title, title_amharic, description_amharic, year, month, plan_type, activities } = req.body;
    
    // Create the annual plan with Amharic fields
    const planResult = await client.query(
      `INSERT INTO annual_plans (title, plan_title_amharic, plan_description_amharic, year, plan_month, plan_type, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [title, title_amharic, description_amharic, year, month || 1, plan_type || 'amharic_structured', req.user.id]
    );

    const plan = planResult.rows[0];

    // Create plan activities
    const createdActivities = [];
    for (let i = 0; i < activities.length; i++) {
      const activity = activities[i];
      const activityResult = await client.query(
        `INSERT INTO plan_activities (annual_plan_id, activity_number, activity_title_amharic, target_number, target_unit_amharic, sort_order) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [plan.id, activity.activity_number, activity.activity_title_amharic, activity.target_number, activity.target_unit_amharic, i]
      );
      createdActivities.push(activityResult.rows[0]);
    }

    // Auto-generate 12 monthly periods
    for (let month = 1; month <= 12; month++) {
      const deadline = new Date(year, month - 1, 18);
      
      await client.query(
        `INSERT INTO monthly_periods (annual_plan_id, month, year, deadline) 
         VALUES ($1, $2, $3, $4)`,
        [plan.id, month, year, deadline]
      );
    }

    // Create activity reports for all branch users for each activity and period
    const branchUsers = await client.query(
      "SELECT id FROM users WHERE role = 'branch_user'"
    );

    const monthlyPeriods = await client.query(
      `SELECT id FROM monthly_periods WHERE annual_plan_id = $1`,
      [plan.id]
    );

    for (const period of monthlyPeriods.rows) {
      for (const activity of createdActivities) {
        for (const user of branchUsers.rows) {
          await client.query(
            `INSERT INTO activity_reports (plan_activity_id, monthly_period_id, branch_user_id, achieved_number, achievement_percentage) 
             VALUES ($1, $2, $3, $4, $5)`,
            [activity.id, period.id, user.id, 0, 0]
          );
        }
      }
    }

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Amharic structured plan created successfully',
      plan,
      activities: createdActivities
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create Amharic plan error:', error);
    res.status(500).json({ error: 'Failed to create Amharic plan' });
  } finally {
    client.release();
  }
};
