import express from 'express';
import { initiateLogin, verifyCode, resendCode } from '../controllers/twoFactorController.js';

const router = express.Router();

// Step 1: Initial login with username/password
router.post('/login', initiateLogin);

// Step 2: Verify email code
router.post('/verify', verifyCode);

// Resend verification code
router.post('/resend', resendCode);

export default router;