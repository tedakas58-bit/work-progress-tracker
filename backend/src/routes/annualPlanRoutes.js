import express from 'express';
import { 
  createAnnualPlan, 
  getAnnualPlans, 
  getAnnualPlanById, 
  createAmharicPlan,
  getPlanActivities,
  updateAmharicPlan,
  deleteAmharicPlan,
  deleteAllAmharicPlans,
  submitAmharicActivityReports,
  getAmharicActivityReports
} from '../controllers/annualPlanController.js';
import { authenticate, authorizeMainBranch } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, authorizeMainBranch, createAnnualPlan);
router.post('/amharic', authenticate, authorizeMainBranch, createAmharicPlan);
router.get('/', authenticate, getAnnualPlans);
router.get('/:id', authenticate, getAnnualPlanById);
router.get('/:id/activities', authenticate, getPlanActivities);
router.put('/amharic/:id', authenticate, authorizeMainBranch, updateAmharicPlan);
router.delete('/amharic/:id', authenticate, authorizeMainBranch, deleteAmharicPlan);
router.delete('/amharic/all/delete', authenticate, authorizeMainBranch, deleteAllAmharicPlans);
router.post('/:planId/activity-reports', authenticate, submitAmharicActivityReports);
router.get('/:planId/activity-reports', authenticate, getAmharicActivityReports);

export default router;
