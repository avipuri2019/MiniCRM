import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import {
  getAccounts,
  getAccountsWithRecentActivity,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
} from '../controllers/accounts.controller';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

router.get('/', getAccounts);

router.get('/recent-activity', getAccountsWithRecentActivity);

router.get('/:id', getAccountById);

router.post('/', createAccount);

router.put('/:id', updateAccount);

router.delete('/:id', deleteAccount);

export default router;
