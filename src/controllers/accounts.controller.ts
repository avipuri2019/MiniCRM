import { Request, Response } from 'express';
import { AccountModel } from '../models/account.model';
import { accountSchema } from '../utils/validation';

export const getAccounts = (req: Request, res: Response): void => {
  try {
    const accounts = AccountModel.findAll();
    res.json(accounts);
  } catch (e) {
    res.status(500).json({ error: 'Internal server error: '+e });
  }
};

export const getAccountsWithRecentActivity = (
  req: Request,
  res: Response
): void => {
  try {
    const accounts = AccountModel.getAccountsWithRecentActivity();
    res.json(accounts);
  } catch (e) {
    res.status(500).json({ error: 'Internal server error: '+e });
  }
};

export const getAccountById = (req: Request, res: Response): void => {
  try {
    const account = AccountModel.findById(req.params.id);
    if (!account) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }
    res.json(account);
  } catch (e) {
    res.status(500).json({ error: 'Internal server error: '+e });
  }
};

export const createAccount = (req: Request, res: Response): void => {
  try {
    const { name, industry } = accountSchema.parse(req.body);
    const account = AccountModel.create(req.user!.userId, name, industry);
    res.status(201).json(account);
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

export const updateAccount = (req: Request, res: Response): void => {
  try {
    const updates = accountSchema.partial().parse(req.body);
    const account = AccountModel.update(req.params.id, updates);
    if (!account) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }
    res.json(account);
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

export const deleteAccount = (req: Request, res: Response): void => {
  try {
    const deleted = AccountModel.delete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: 'Internal server error: '+e });
  }
};
