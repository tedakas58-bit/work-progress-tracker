import express from 'express';
import { submitMonthlyReport, getMyReports, getAllReports, getBranchComparison } from '../controllers/reportController.js';
import { authenticate, authorizeBranchUser, authorizeMainBranch } from '../middleware/auth.js';

const router = express.Router();

router.post('/submit', authenticate, authorizeBranchUser, submitMonthlyReport);
router.get('/my-reports', authenticate, authorizeBranchUser, getMyReports);
router.get('/plan/:planId', authenticate, authorizeMainBranch, getAllReports);
router.get('/comparison/:planId', authenticate, authorizeMainBranch, getBranchComparison);

export default router;
