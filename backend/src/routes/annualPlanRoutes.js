import express from 'express';
import { createAnnualPlan, getAnnualPlans, getAnnualPlanById, createAmharicPlan } from '../controllers/annualPlanController.js';
import { authenticate, authorizeMainBranch } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, authorizeMainBranch, createAnnualPlan);
router.post('/amharic', authenticate, authorizeMainBranch, createAmharicPlan);
router.get('/', authenticate, getAnnualPlans);
router.get('/:id', authenticate, getAnnualPlanById);

export default router;
