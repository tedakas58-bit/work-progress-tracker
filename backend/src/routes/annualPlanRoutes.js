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
  getAmharicActivityReports,
  getAllAmharicActivityReports
} from '../controllers/annualPlanController.js';
import { authenticate, authorizeMainBranch, authorizeMainBranchOrSector } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, authorizeMainBranchOrSector, createAnnualPlan);
router.post('/amharic', authenticate, authorizeMainBranchOrSector, createAmharicPlan);
router.get('/', authenticate, authorizeMainBranchOrSector, getAnnualPlans);
router.get('/:id', authenticate, getAnnualPlanById);
router.get('/:id/activities', authenticate, getPlanActivities);
router.get('/amharic/:id/activities', authenticate, getPlanActivities);
router.put('/amharic/:id', authenticate, authorizeMainBranchOrSector, updateAmharicPlan);
router.delete('/amharic/:id', authenticate, authorizeMainBranchOrSector, deleteAmharicPlan);
router.delete('/amharic/all/delete', authenticate, authorizeMainBranch, deleteAllAmharicPlans);
router.post('/:planId/activity-reports', authenticate, submitAmharicActivityReports);
router.get('/:planId/activity-reports', authenticate, getAmharicActivityReports);
router.get('/activity-reports/all', authenticate, authorizeMainBranchOrSector, getAllAmharicActivityReports);

export default router;
