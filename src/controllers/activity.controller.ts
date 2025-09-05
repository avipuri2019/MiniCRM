import { Request, Response } from 'express';
import { ActivityModel } from '../models/activity.model';
import { AccountModel } from '../models/account.model';
import { activitySchema } from '../utils/validation';

//getActivities
export const getActivities = (req: Request, res: Response): void => {
  try {
    // Verify account exists
    const account = AccountModel.findById(req.params.id);
    if (!account) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    const activities = ActivityModel.findByAccountId(req.params.id);
    res.json(activities);
  } catch (e) {
    res.status(500).json({ error: 'Internal server error: '+e });
  }
};

//getActivityById
export const getActivityById = (req: Request, res: Response): void => {
  try {
    const activity = ActivityModel.findById(req.params.activityId);
    if (!activity || activity.account_id !== req.params.id) {
      res.status(404).json({ error: 'Activity not found' });
      return;
    }
    res.json(activity);
  } catch (e) {
    res.status(500).json({ error: 'Internal server error: '+e });
  }
};

//createActivity
export const createActivity = (req: Request, res: Response): void => {
  try {
    // Verify account exists
    const account = AccountModel.findById(req.params.id);
    if (!account) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    const { type, notes, next_follow_up } = activitySchema.parse(req.body);
    const activity = ActivityModel.create(
      req.params.id,
      req.user!.userId,
      type,
      notes,
      next_follow_up
    );

    // Broadcast update via WebSocket
    req.app.locals.broadcast?.({
      type: 'activity_created',
      data: activity,
    });

    res.status(201).json(activity);
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

//updateActivity
export const updateActivity = (req: Request, res: Response): void => {
  try {
    const updates = activitySchema.partial().parse(req.body);
    const activity = ActivityModel.update(req.params.activityId, updates);

    if (!activity || activity.account_id !== req.params.id) {
      res.status(404).json({ error: 'Activity not found' });
      return;
    }

    // Broadcast update via WebSocket
    req.app.locals.broadcast?.({
      type: 'activity_updated',
      data: activity,
    });

    res.json(activity);
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

//deleteActivity
export const deleteActivity = (req: Request, res: Response): void => {
  try {
    const activity = ActivityModel.findById(req.params.activityId);
    if (!activity || activity.account_id !== req.params.id) {
      res.status(404).json({ error: 'Activity not found' });
      return;
    }

    const deleted = ActivityModel.delete(req.params.activityId);
    if (!deleted) {
      res.status(404).json({ error: 'Activity not found' });
      return;
    }

    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: 'Internal server error: '+e });
  }
};
