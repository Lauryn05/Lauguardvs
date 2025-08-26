const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all adversarial prompts
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.prompt_id AS id,
        p.prompt_text AS prompt,
        d.department_name AS department,
        p.severity,
        p.date + p.time AS timestamp
      FROM prompts_log p
      JOIN departments d ON p.department_id = d.department_id
      ORDER BY p.date DESC, p.time DESC
      LIMIT 50
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching prompts:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Get count by department with department names
router.get('/by-department', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.department_name AS name, COUNT(*)::int AS value
      FROM prompts_log p
      JOIN departments d ON p.department_id = d.department_id
      GROUP BY d.department_name
      ORDER BY value DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching by department:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Get monthly timeline of prompts
router.get('/timeline', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        TO_CHAR(date + time, 'Mon YYYY') AS name,
        COUNT(*)::int AS prompts,
        COUNT(*) FILTER (WHERE status = 'flagged')::int AS adversarial
      FROM prompts_log
      GROUP BY DATE_TRUNC('month', date + time), name
      ORDER BY DATE_TRUNC('month', date + time)
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching timeline:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});


// Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    // Total prompts
    const totalPromptsResult = await pool.query(`SELECT COUNT(*)::int AS value FROM prompts_log`);

    // Adversarial attempts (status = 'flagged')
    const adversarialResult = await pool.query(`
      SELECT COUNT(*)::int AS value 
      FROM prompts_log 
      WHERE status = 'flagged'
    `);

    // Active departments (distinct departments in prompts_log)
    const activeDepartmentsResult = await pool.query(`
      SELECT COUNT(DISTINCT department_id)::int AS value 
      FROM prompts_log
    `);

    // Security rules (total entries in security_rules table)
    const securityRulesResult = await pool.query(`
      SELECT COUNT(*)::int AS value 
      FROM security_rules
    `);

    res.json({
      totalPrompts: totalPromptsResult.rows[0].value,
      adversarialAttempts: adversarialResult.rows[0].value,
      activeDepartments: activeDepartmentsResult.rows[0].value,
      securityRules: securityRulesResult.rows[0].value
    });
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Get all prompt logs
router.get('/logs', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.prompt_id AS id,
        p.date + p.time AS timestamp,
        d.department_name AS department,
        u.username,
        p.prompt_text AS prompt,
        CASE WHEN p.status = 'flagged' THEN true ELSE false END AS flagged
      FROM prompts_log p
      LEFT JOIN departments d ON p.department_id = d.department_id
      LEFT JOIN users u ON p.user_id = u.user_id
      ORDER BY timestamp DESC
      LIMIT 100
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching prompt logs:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

router.get('/departments', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        d.department_id AS id,
        d.department_name AS name,
        COUNT(DISTINCT u.user_id) AS "membersCount",
        (SELECT COUNT(*) FROM security_rules) AS "rulesCount",
        CASE 
          WHEN COUNT(u.user_id) > 0 THEN 'active'
          ELSE 'inactive'
        END AS status
      FROM departments d
      LEFT JOIN users u ON u.department_id = d.department_id
      GROUP BY d.department_id
      ORDER BY d.department_name
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching departments:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// PATCH /api/prompts/departments/:id → toggle status
router.patch('/departments/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;

  if (!['active', 'inactive'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const result = await pool.query(
      `UPDATE departments SET status = $1 WHERE department_id = $2 RETURNING department_id, department_name, status`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating department status:', err);
    res.status(500).json({ error: 'Failed to update department status' });
  }
});


module.exports = router;
