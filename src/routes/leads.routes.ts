import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  convertLead,
} from '../controllers/lead.controller';

const router = Router();

// authentication to all routes
router.use(authenticate);

router.get('/', getLeads);

router.get('/:id', getLeadById);

router.post('/', createLead);

router.put('/:id', updateLead);

router.delete('/:id', deleteLead);

router.post('/:id/convert', convertLead);

export default router;
