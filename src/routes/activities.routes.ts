import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import {
  getActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
} from '../controllers/activity.controller';

const router = Router({ mergeParams: true });

// authentication to all routes
router.use(authenticate);

router.get('/', getActivities);

router.get('/:activityId', getActivityById);

router.post('/', createActivity);

router.put('/:activityId', updateActivity);

router.delete('/:activityId', deleteActivity);

export default router;
