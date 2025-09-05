import { Request, Response } from 'express';
import { LeadModel } from '../models/lead.model';
import { AccountModel } from '../models/account.model';
import { leadSchema, leadFilterSchema } from '../utils/validation';
import { sanitizeInput, hasSQLInjection } from '../utils/helpers';

// getleads
export const getLeads = (req: Request, res: Response): void => {
  try {
    const filters = leadFilterSchema.parse(req.query);
    const leads = LeadModel.findAll(filters);
    res.json(leads);
  } catch (error: any) {
    if (error.errors) {
      res
        .status(400)
        .json({ error: 'Validation failed', details: error.errors });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

//getLeadById
export const getLeadById = (req: Request, res: Response): void => {
  try {
    const lead = LeadModel.findById(req.params.id);
    if (!lead) {
      res.status(404).json({ error: 'Lead not found' });
      return;
    }
    res.json(lead);
  } catch (e) {
    res.status(500).json({ error: 'Internal server error:'+e });
  }
};

//createLead
export const createLead = (req: Request, res: Response): void => {
  try {
    const { name, company, status } = leadSchema.parse(req.body);

    // Security checks
    if (hasSQLInjection(name) || (company && hasSQLInjection(company))) {
      res.status(400).json({ error: 'Invalid input detected' });
      return;
    }

    const sanitizedName = sanitizeInput(name);
    const sanitizedCompany = company ? sanitizeInput(company) : company;
    const lead = LeadModel.create(
      req.user!.userId,
      sanitizedName,
      sanitizedCompany,
      status
    );

    res.status(201).json(lead);
  } catch (error: any) {
    if (error.errors) {
      res
        .status(400)
        .json({ error: 'Validation failed', details: error.errors });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

//updateLead
export const updateLead = (req: Request, res: Response): void => {
  try {
    const updates = leadSchema.partial().parse(req.body);
    const lead = LeadModel.update(req.params.id, updates);
    if (!lead) {
      res.status(404).json({ error: 'Lead not found' });
      return;
    }
    res.json(lead);
  } catch (error: any) {
    if (error.errors) {
      res
        .status(400)
        .json({ error: 'Validation failed', details: error.errors });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

//deleteLead
export const deleteLead = (req: Request, res: Response): void => {
  try {
    const deleted = LeadModel.delete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Lead not found' });
      return;
    }
    res.status(204).json({message:"Lead deleted successfully"});
  } catch (e) {
    res.status(500).json({ error: 'Internal server error: '+e });
  }
};

//convertLead
export const convertLead = (req: Request, res: Response): void => {
  try {
    const lead = LeadModel.findById(req.params.id);
    if (!lead) {
      res.status(404).json({ error: 'Lead not found' });
      return;
    }

    // Create account from lead
    const account = AccountModel.create(
      req.user!.userId,
      lead.name,
      lead.company
    );

    // Delete the lead
    LeadModel.delete(req.params.id);

    res.status(201).json({
      message: 'Lead converted to account successfully',
      account,
    });
  } catch (e) {
    res.status(500).json({ error: 'Internal server error:'+e });
  }
};
