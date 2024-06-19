import { NextFunction, Request, Response } from 'express';
import { ActionInsert, ActionSelect } from '../models/schema';
import ActionService from '../services/ActionService';

export const readAll = async (
  req: Request,
  res: Response<{ actions: ActionSelect[] }>,
  next: NextFunction
) => {
  try {
    const actions = await ActionService.readAll();
    res.json({ actions });
  } catch (e) {
    console.error('Could not fetch all actions');
    next(e);
  }
};

export const createOne = async (
  req: Request<object, object, Pick<ActionInsert, 'name'>>,
  res: Response<{ action: ActionSelect }>,
  next: NextFunction
) => {
  try {
    const data = req.body;
    const action = await ActionService.createOne({
      ...data,
      name: data.name.toUpperCase() as ActionSelect['name']
    });
    res.json({ action });
  } catch (e) {
    console.error('Could not create an action');
    next(e);
  }
};
