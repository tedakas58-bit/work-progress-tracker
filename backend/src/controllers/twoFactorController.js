import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../database/db.js';
import { generateVerificationCode, sendVerificationEmail } from '../services/resendService.js';

// Step 1: Initial login (username/password)
export const initiateLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const clientIP = req.ip || req.connection.remoteAddress;
    
    console.log('🔍 2FA Login attempt:', { username, ip: clientIP });
    
    // Check if user exists
    const userResult = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = userResult.rows[0];
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check if user has 2FA enabled (disabled by user request)
    const twoFactorEnabled = false; // 2FA disabled - login with username/password only
    
    if (!twoFactorEnabled) {
      // If 2FA is disabled, proceed with normal login
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role, branchName: user.branch_name },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      
      return res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          branchName: user.branch_name,
          email: user.email
        }
      });
    }
    
    // Generate and send verification code
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    // Store verification code in database
    await pool.query(
      `UPDATE users 
       SET verification_code = $1, verification_code_expires = $2 
       WHERE id = $3`,
      [verificationCode, expiresAt, user.id]
    );
    
    // Send email
    const emailResult = await sendVerificationEmail(user.email, verificationCode, user.username);
    
    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error);
      return res.status(500).json({ error: 'Failed to send verification code' });
    }
    
    // Return temporary token for verification step
    const tempToken = jwt.sign(
      { userId: user.id, step: 'verification' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    
    res.json({
      requiresVerification: true,
      tempToken,
      message: 'Verification code sent to your email'
    });
    
  } catch (error) {
    console.error('Initiate login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Step 2: Verify code and complete login
export const verifyCode = async (req, res) => {
  try {
    const { code, tempToken } = req.body;
    const clientIP = req.ip || req.connection.remoteAddress;
    
    if (!tempToken) {
      return res.status(400).json({ error: 'Temporary token required' });
    }
    
    // Verify temporary token
    let decoded;
    try {
      decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired temporary token' });
    }
    
    if (decoded.step !== 'verification') {
      return res.status(401).json({ error: 'Invalid token type' });
    }
    
    // Check verification attempts (prevent brute force)
    const attemptsResult = await pool.query(
      `SELECT * FROM verification_attempts 
       WHERE user_id = $1 AND ip_address = $2 AND blocked_until > NOW()`,
      [decoded.userId, clientIP]
    );
    
    if (attemptsResult.rows.length > 0) {
      return res.status(429).json({ 
        error: 'Too many failed attempts. Please try again later.' 
      });
    }
    
    // Get user and verify code
    const userResult = await pool.query(
      `SELECT * FROM users 
       WHERE id = $1 AND verification_code = $2 AND verification_code_expires > NOW()`,
      [decoded.userId, code]
    );
    
    if (userResult.rows.length === 0) {
      // Record failed attempt
      await pool.query(
        `INSERT INTO verification_attempts (user_id, ip_address, attempts, blocked_until)
         VALUES ($1, $2, 1, NOW() + INTERVAL '5 minutes')
         ON CONFLICT (user_id, ip_address) 
         DO UPDATE SET 
           attempts = verification_attempts.attempts + 1,
           last_attempt = NOW(),
           blocked_until = CASE 
             WHEN verification_attempts.attempts >= 3 THEN NOW() + INTERVAL '15 minutes'
             ELSE NOW() + INTERVAL '5 minutes'
           END`,
        [decoded.userId, clientIP]
      );
      
      return res.status(401).json({ error: 'Invalid or expired verification code' });
    }
    
    const user = userResult.rows[0];
    
    // Clear verification code and attempts
    await pool.query(
      `UPDATE users 
       SET verification_code = NULL, verification_code_expires = NULL, last_login = NOW()
       WHERE id = $1`,
      [user.id]
    );
    
    await pool.query(
      'DELETE FROM verification_attempts WHERE user_id = $1',
      [user.id]
    );
    
    // Generate final JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role, branchName: user.branch_name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    console.log('✅ 2FA login successful:', { username: user.username, ip: clientIP });
    
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        branchName: user.branch_name,
        email: user.email
      }
    });
    
  } catch (error) {
    console.error('Verify code error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
};

// Resend verification code
export const resendCode = async (req, res) => {
  try {
    const { tempToken } = req.body;
    
    if (!tempToken) {
      return res.status(400).json({ error: 'Temporary token required' });
    }
    
    // Verify temporary token
    let decoded;
    try {
      decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired temporary token' });
    }
    
    // Get user
    const userResult = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [decoded.userId]
    );
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = userResult.rows[0];
    
    // Generate new code
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    // Update database
    await pool.query(
      `UPDATE users 
       SET verification_code = $1, verification_code_expires = $2 
       WHERE id = $3`,
      [verificationCode, expiresAt, user.id]
    );
    
    // Send email
    const emailResult = await sendVerificationEmail(user.email, verificationCode, user.username);
    
    if (!emailResult.success) {
      return res.status(500).json({ error: 'Failed to send verification code' });
    }
    
    res.json({ message: 'New verification code sent to your email' });
    
  } catch (error) {
    console.error('Resend code error:', error);
    res.status(500).json({ error: 'Failed to resend code' });
  }
};